import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import decodeJWT from "../utils/decodeJWT";
import {
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Table as TableIcon,
  Columns,
  PlusSquare,
  MinusSquare,
  XSquare,
  CheckSquare,
  Undo,
  Redo,
} from "lucide-react";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";

lowlight.registerLanguage("javascript", javascript);

export default function Wiki({ onExit }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  //  Extract projectId or project object from navigation state or URL
  const incomingProject = location.state?.project;
  const passedProjectId = location.state?.projectId;
  const searchParams = new URLSearchParams(location.search);
  const searchProjectId = searchParams.get('projectId');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    passedProjectId || searchProjectId || incomingProject?._id || incomingProject?.id || null
  );

  //  Decode JWT for userId
  const token = localStorage.getItem("token");
  let userId = null;
  useEffect(() => {
    if (!token) {
      toast.error("User not authenticated. Please log in again.");
      navigate("/login");
    } else {
      try {
        const decoded = decodeJWT(token);
        userId = decoded?.id || decoded?.sub || null;
      } catch {
        toast.error("Invalid authentication token. Please log in again.");
        navigate("/login");
      }
    }
  }, [token, navigate]);

  //  TipTap Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({
        placeholder: "Start writing your wiki page here...",
      }),
      Link,
      Image,
      TaskList,
      TaskItem,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: "",
  });

  //  Insert Link
  const addLink = () => {
    const url = prompt("Enter link URL");
    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  //  Insert Image
  const addImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
    reader.readAsDataURL(file);
  };

  //  Insert Table
  const insertTable = () =>
    editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();

  // Fetch projects so user can select which project to attach the wiki to
  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data?.projects || res.data || [];
        setProjects(list);
        if (!selectedProjectId && list && list.length) {
          const firstId = list[0]._id || list[0].id;
          setSelectedProjectId(firstId);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err?.response?.data || err.message || err);
      }
    };

    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save Wiki File
  const saveWiki = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title for the wiki page.");
      return;
    }

    if (!editor) {
      toast.error("Editor not initialized.");
      return;
    }

    const projectToUse = selectedProjectId || passedProjectId || incomingProject?._id || incomingProject?.id;
    if (!projectToUse) {
      toast.error("Project ID missing. Please select a project.");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    const content = editor.getHTML();
    const url = `http://localhost:5000/api/projects/${encodeURIComponent(projectToUse)}/wiki`;

    try {
      setLoading(true);

      const res = await axios.post(
        url,
        {
          filename: `${title}.html`,
          filepath: content,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Wiki saved successfully!");

      setTitle("");
      editor.commands.clearContent();

      setTimeout(() => {
        onExit ? onExit() : navigate(-1);
      }, 1200);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to save wiki. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getBtnClass = (format, shrink = false) => {
    const active = editor?.isActive(format);
    return `p-2 rounded-md cursor-pointer transition-all hover:text-blue-700 ${
      active ? "text-blue-600" : "text-gray-600"
    } ${shrink && active ? "scale-75" : ""}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Create Wiki for Project
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={saveWiki}
            disabled={loading}
            className={`px-4 py-1.5 rounded-md text-white transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            onClick={onExit || (() => navigate(-1))}
            className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600"
          >
            Exit
          </button>
        </div>
      </div>

        {/* Project selector (if multiple or not preselected) */}
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm font-medium text-gray-700">Project:</label>
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="form-select border border-gray-300 rounded-md px-3 py-1 bg-white"
          >
            <option value="">-- Select project --</option>
            {projects.map((p) => (
              <option key={p._id || p.id} value={p._id || p.id}>
                {p.title || p.name || (p._id || p.id)}
              </option>
            ))}
          </select>
          {selectedProjectId && (
            <div className="text-sm text-gray-500">Selected: {projects.find(x => (x._id||x.id) === selectedProjectId)?.title || selectedProjectId}</div>
          )}
        </div>

        {/* Title Input */}
      <input
        type="text"
        placeholder="Page title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-semibold border-b border-gray-300 outline-none focus:border-blue-500 pb-2 mb-4 bg-transparent"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4 border border-gray-200 rounded-md p-2 bg-white shadow-sm w-fit">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={getBtnClass("bold")} title="Bold"><Bold size={16} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getBtnClass("italic")} title="Italic"><Italic size={16} /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={getBtnClass("bulletList")} title="Bullet List"><List size={16} /></button>

        <label className={getBtnClass("image")} title="Insert Image">
          <ImageIcon size={16} />
          <input type="file" accept="image/*" onChange={addImage} className="hidden" />
        </label>

        <button onClick={addLink} className={getBtnClass("link")} title="Insert Link"><LinkIcon size={16} /></button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={getBtnClass("codeBlock")} title="Code Block"><Code size={16} /></button>

        <button onClick={insertTable} className={getBtnClass("table")} title="Insert Table"><TableIcon size={16} /></button>
        <button onClick={() => editor.chain().focus().addColumnAfter().run()} className={getBtnClass("table")} title="Add Column"><Columns size={16} /></button>
        <button onClick={() => editor.chain().focus().addRowAfter().run()} className={getBtnClass("table")} title="Add Row"><PlusSquare size={16} /></button>
        <button onClick={() => editor.chain().focus().deleteRow().run()} className={getBtnClass("table")} title="Delete Row"><MinusSquare size={16} /></button>
        <button onClick={() => editor.chain().focus().deleteTable().run()} className={getBtnClass("table")} title="Delete Table"><XSquare size={16} /></button>

        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={getBtnClass("taskList")} title="Task List"><CheckSquare size={16} /></button>
        <button onClick={() => editor.chain().focus().undo().run()} className={getBtnClass("history")} title="Undo"><Undo size={16} /></button>
        <button onClick={() => editor.chain().focus().redo().run()} className={getBtnClass("history")} title="Redo"><Redo size={16} /></button>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded-md p-6 min-h-[60vh] bg-white focus-within:border-blue-500">
        <EditorContent editor={editor} />
      </div>

      {/* Styles */}
      <style>{`
        .ProseMirror {
          outline: none !important;
          line-height: 1.5rem;
          padding: 1rem;
        }
        .ProseMirror p, .ProseMirror ul, .ProseMirror ol {
          margin-bottom: 0.75rem;
        }
        .ProseMirror table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .ProseMirror th, .ProseMirror td {
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          text-align: left;
        }
        .ProseMirror th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .ProseMirror td {
          background-color: white;
        }
      `}</style>
    </div>
  );
}
