import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// lightweight JWT payload decoder (avoids external import issues in the browser)
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, Code, Table as TableIcon, Undo, Redo } from 'lucide-react';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { useProject } from '../hooks/useProject';

lowlight.registerLanguage('javascript', javascript);

export default function WikiPage({ project: propProject }) {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingProject = propProject || location.state?.project;
  const params = new URLSearchParams(location.search);
  const projectId = incomingProject?._1d || incomingProject?._id || incomingProject?.id || params.get('projectId');
  const { projectId: activeProjectId } = useProject();

  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [token, setToken] = useState(null);
  const [projects, setProjects] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: 'Start writing your wiki page here...' }),
      LinkExtension,
      Image,
      TaskList,
      TaskItem,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: '',
  });

  const addLink = () => {
    const url = prompt('Enter link URL');
    if (url) editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      editor?.chain().focus().setImage({ src: event.target.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!storedToken || !user) {
      navigate('/login');
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = decodeJWT(storedToken);
      setUserId(decoded?.id || decoded?.userId || decoded?.sub || null);
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Invalid token:', err);
      toast.error('Invalid authentication token. Please log in again.');
      navigate('/login');
      setIsAuthenticated(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } });
        setProjects(res.data?.projects || res.data || []);
      } catch (err) {
        console.error('Failed to fetch projects', err?.response?.data || err.message);
      }
    };
    fetchProjects();
  }, [token]);

  // determine the project object from incoming prop or fetched projects
  const _projectObj = incomingProject || projects.find(p => (p._id === projectId || p.id === projectId));

  // derive an effective project id from active project, props, url or fetched projects
  const effectiveProjectId = activeProjectId || projectId || (_projectObj && (_projectObj._id || _projectObj.id)) || (projects[0]?._id || projects[0]?.id) || null;

  useEffect(() => {
    if (!isAuthenticated || !effectiveProjectId) return;
    const fetchPages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/projects/${encodeURIComponent(effectiveProjectId)}/wiki`, { headers: { Authorization: `Bearer ${token}` } });
        const list = res.data?.pages || [];
        setPages(list);
        if (list.length) setSelectedPage(list[0]);
      } catch (err) {
        console.error('Failed to fetch wiki pages', err?.response?.data || err.message);
        toast.error('Failed to fetch wiki pages');
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [effectiveProjectId, isAuthenticated]);

  const handleSaveNewPage = async () => {
    if (!newPageTitle.trim()) {
      toast.error('Please enter a page title');
      return;
    }
    if (!editor?.getHTML()) {
      toast.error('Please add some content');
      return;
    }
    setIsSaving(true);
    try {
      const htmlContent = editor.getHTML();
      // determine a project id to attach the wiki to
      const targetProjectId = activeProjectId || projectId || (_projectObj && (_projectObj._id || _projectObj.id)) || (projects[0]?._id || projects[0]?.id) || null;
      if (!targetProjectId) {
        throw new Error('Project ID missing');
      }

      await axios.post(`http://localhost:5000/api/projects/${encodeURIComponent(targetProjectId)}/wiki`, {
        // backend expects filename (used to name file) and filepath (holds HTML content)
        filename: `${newPageTitle.replace(/\s+/g, '-')}.html`,
        filepath: htmlContent,
        title: newPageTitle,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Wiki page created successfully!');
      editor?.chain().clearContent().run();
      setNewPageTitle('');
      setIsCreatingNew(false);

      const res = await axios.get(`http://localhost:5000/api/projects/${encodeURIComponent(effectiveProjectId)}/wiki`, { headers: { Authorization: `Bearer ${token}` } });
      const list = res.data?.pages || [];
      setPages(list);
      if (list.length) setSelectedPage(list[list.length - 1]);
    } catch (err) {
      toast.error('Failed to save wiki page: ' + (err?.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePageClick = (page) => {
    setSelectedPage(page);
    setIsCreatingNew(false);
  };

  const handleNewPage = () => {
    setIsCreatingNew(true);
    setSelectedPage(null);
    editor?.chain().clearContent().run();
    setNewPageTitle('');
  };

  const projectName = (_projectObj && (_projectObj.name || _projectObj.title)) || 'ProdigiSign';
  const projectInitial = projectName ? projectName.charAt(0).toUpperCase() : 'P';

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f8] text-[#111418]">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-neutral-200 px-6 py-3 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 24, fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
              <h2 className="text-lg font-bold tracking-tight">{projectName}</h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-neutral-600">/ Wiki / {projectName + '.wiki'}</span>
            </div>
          </div>

          <div className="flex flex-1 justify-end gap-4 items-center">
            <label className="flex flex-col w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
                <div className="flex bg-neutral-50 items-center justify-center pl-3 rounded-l-lg">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
                </div>
                <input className="flex w-full px-2 text-sm rounded-r-lg bg-neutral-50 h-full" placeholder="Search..." />
              </div>
            </label>

            <button className="flex items-center justify-center h-10 w-10 bg-neutral-50 rounded-lg">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </button>

            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD94AtckDdcf7FWXw-FiXx90tg4ok0I2wtlcsV_n-1Bp_f_Z46EYFlplFViIpmw8rJ2N1q4-NUcB22h90MsWW114tSX06qOlADzBwyNWLwmJ0KKy9tvJZ9vZzweyqUg7sky5kKEeSAY3FtuH6u919z-0MCpkfSB3Hi8nye0zjxVPvxyC6y7dds4IXtNgy34gTYxV_BCjkNnwQCrsMaj3jzSdbHR9wxNKQ1TUSrRPkjeuvX1rBQ6Lupke-vmOUhCqPDb35CEcGyBVBY")'}}></div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <aside className="flex flex-col justify-between p-4 w-64 bg-white border-r border-neutral-200">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#6A35F1] flex items-center justify-center text-white font-bold text-lg">{projectInitial}</div>
                  <h1 className="text-base font-medium">{projectName}</h1>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="px-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">Overview</span>
                <Link to="/summary" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e0e0e0]">
                  <span className="material-symbols-outlined">bar_chart</span>
                  <span>Summary</span>
                </Link>
                <Link to="/DashBoard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e0e0e0]">
                  <span className="material-symbols-outlined">dashboard</span>
                  <span>Dashboards</span>
                </Link>
                <a className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-md bg-[#e0e0e0] border-l-2 border-primary">
                  <span className="material-symbols-outlined">book</span>
                  <span>Wiki</span>
                </a>
              </div>

              <div className="flex flex-col gap-1">
                
                <Link to="/Board" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e0e0e0]">
                  <span className="material-symbols-outlined">view_kanban</span>
                  <span>Boards</span>
                </Link>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e0e0e0]">
                  <span className="material-symbols-outlined">account_tree</span>
                  <span>Pipelines</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#e0e0e0]">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <span>Artifacts</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Wiki Pages List */}
          <nav className="w-72 p-4 bg-white border-r border-neutral-200 flex flex-col shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">{projectName + '.wiki'}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {loading ? (
                <p className="text-sm px-3 text-neutral-500">Loading...</p>
              ) : pages && pages.length ? (
                pages.map((pg) => (
                  <div key={pg._id} onClick={() => handlePageClick(pg)} className={`flex items-center gap-2 px-3 py-2 rounded-md justify-between hover:bg-[#e0e0e0] cursor-pointer ${selectedPage && selectedPage._id === pg._id ? 'bg-primary/10' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>article</span>
                      <p className="text-sm flex-1 truncate">{pg.title}</p>
                    </div>
                    <div className="text-xs text-neutral-500">{pg.createdAt ? new Date(pg.createdAt).toLocaleDateString() : ''}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm px-3 text-neutral-500">No wiki pages for this project.</div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <button onClick={handleNewPage} className="flex items-center gap-2 w-full text-left px-3 py-2 text-primary text-sm font-medium hover:bg-primary/10 rounded-md">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                <span>New page</span>
              </button>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              {isCreatingNew ? (
                <div className="bg-white rounded-lg p-6 border border-neutral-200">
                  <h2 className="text-2xl font-bold mb-4">Create New Wiki Page</h2>
                  <input type="text" placeholder="Enter page title..." value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)} className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

                  <div className="flex flex-wrap gap-2 p-3 bg-[#f0f0f0] rounded-t-lg border-b border-neutral-200">
                    <button onClick={() => editor?.chain().focus().toggleBold().run()} disabled={!editor?.can().chain().focus().toggleBold().run()} className="p-2 bg-white rounded hover:bg-neutral-100"><Bold size={18} /></button>
                    <button onClick={() => editor?.chain().focus().toggleItalic().run()} disabled={!editor?.can().chain().focus().toggleItalic().run()} className="p-2 bg-white rounded hover:bg-neutral-100"><Italic size={18} /></button>
                    <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="p-2 bg-white rounded hover:bg-neutral-100"><List size={18} /></button>
                    <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className="p-2 bg-white rounded hover:bg-neutral-100"><Code size={18} /></button>
                    <button onClick={addLink} className="p-2 bg-white rounded hover:bg-neutral-100"><LinkIcon size={18} /></button>
                    <label className="p-2 bg-white rounded hover:bg-neutral-100 cursor-pointer"><ImageIcon size={18} /><input type="file" accept="image/*" onChange={addImage} className="hidden" /></label>
                    <button onClick={addTable} className="p-2 bg-white rounded hover:bg-neutral-100"><TableIcon size={18} /></button>
                    <button onClick={() => editor?.chain().focus().undo().run()} className="p-2 bg-white rounded hover:bg-neutral-100"><Undo size={18} /></button>
                    <button onClick={() => editor?.chain().focus().redo().run()} className="p-2 bg-white rounded hover:bg-neutral-100"><Redo size={18} /></button>
                  </div>

                  <div className="border border-neutral-200 rounded-b-lg p-4 bg-white min-h-64 mb-4">
                    <EditorContent editor={editor} />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setIsCreatingNew(false); editor?.chain().clearContent().run(); setNewPageTitle(''); }} className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300">Cancel</button>
                    <button onClick={handleSaveNewPage} disabled={isSaving} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">{isSaving ? 'Saving...' : 'Save Page'}</button>
                  </div>
                </div>
              ) : (
                <article className="prose max-w-none">
                  {selectedPage ? (
                    <div>
                      <h1 className="text-4xl font-extrabold mb-2">{selectedPage.title}</h1>
                      <p className="text-sm text-neutral-600">{selectedPage.createdBy ? `By ${selectedPage.createdBy}` : ''} {selectedPage.createdAt ? ` · ${new Date(selectedPage.createdAt).toLocaleString()}` : ''}</p>
                      <div className="mt-8" dangerouslySetInnerHTML={{ __html: selectedPage.content }} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center min-h-96">
                      <p className="text-neutral-500 text-lg">No wiki pages for this project.</p>
                    </div>
                  )}
                </article>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
