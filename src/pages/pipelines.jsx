import React, { useState, useEffect } from "react";
import { useProject } from '../hooks/useProject';
import {Link} from "react-router-dom";
import ProjectName from '../components/ProjectName';
import axios from 'axios';
import pipelineService from '../services/pipelineService';

/**
 * Pipelines page component.
 * Displays CI/CD pipelines with dynamic project selection.
 */

export default function App() {
  const { projectName, projectInitial } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [pipelines, setPipelines] = useState([]);
  const [pipelinesLoading, setPipelinesLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.projects && res.data.projects.length > 0) {
          setProjects(res.data.projects);
          setSelectedProjectId(res.data.projects[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch pipelines when selected project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchPipelines(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchPipelines = async (projectId) => {
    setPipelinesLoading(true);
    try {
      const pipelines = await pipelineService.getPipelinesByProject(projectId);
      setPipelines(pipelines || []);
    } catch (err) {
      console.error('Failed to fetch pipelines:', err);
      setPipelines([]);
    } finally {
      setPipelinesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePipeline = async () => {
    if (!formData.name.trim()) {
      alert('Pipeline name is required');
      return;
    }

    if (!selectedProjectId) {
      alert('Please select a project');
      return;
    }

    setLoading(true);
    try {
      await pipelineService.createPipeline(selectedProjectId, {
        name: formData.name,
        description: formData.description,
        stages: [],
      });
      
      alert('Pipeline created successfully!');
      setFormData({ name: '', description: '' });
      setShowModal(false);
      
      // Refresh pipelines list
      if (selectedProjectId) {
        fetchPipelines(selectedProjectId);
      }
    } catch (error) {
      alert('Failed to create pipeline: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="font-display bg-white text-gray-800 min-h-screen">
      <div className="flex h-screen w-full flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white px-6 py-3 shrink-0">
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-4 text-gray-900">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>task_alt</span>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">TaskEasy</h2>
            </div>

              <div className="flex flex-wrap gap-2 items-center flex-1 ml-4">
              <Link className="text-gray-500 text-sm font-medium leading-normal hover:underline" to="/start">sanexsolution</Link>
              <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
              <ProjectName className="text-gray-500 text-sm font-medium leading-normal" />
              <span className="text-gray-500 text-sm font-medium leading-normal">/</span>
              <span className="text-gray-900 text-sm font-medium leading-normal">Pipelines</span>
            </div>
          </div>

          <div className="flex flex-1 justify-end gap-4 items-center">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-500 flex bg-gray-100 items-center justify-center pl-3 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input className="form-input flex w-full min-w-0 flex-1 rounded-lg text-gray-900 focus:outline-0 focus:ring-0 border-none bg-gray-100 h-full placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search"/>
              </div>
            </label>

            <button className="flex max-w-[480px] items-center justify-center rounded-lg h-10 w-10 bg-gray-100 text-gray-900">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <button className="flex max-w-[480px] items-center justify-center rounded-lg h-10 w-10 bg-gray-100 text-gray-900">
              <span className="material-symbols-outlined">help</span>
            </button>

            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVDClzqmAw02nTSBzqunuorvBzdeMQdlx8m9ys5MfPnxxn795PTqhbRImUlMOn5wk51LB0bAzZ8aW5uhm0mWJ5hFddoezlECTnALd-vixLOSUTSsgGj9AXHe7S1NVK90dtRqkILKN4JrdDQUGMMDl2XbZhok7y6z0KGL94l8ShUKwzazMQPbkUU5jnCVYEss2ArrKUhQo0XPFey8FuF4f3rknjWXMz6_QTnBwzPsZf0KBHKcs4Jp6jllfIeNZPb6Iqm5UW26Ri-ao")' }} />
          </div>
        </header>

        {/* LAYOUT */}
        <div className="flex flex-1 overflow-hidden bg-white">
          {/* SIDEBAR */}
          <aside className="flex w-64 flex-col justify-between border-r border-gray-200 bg-white p-4 shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-600 text-white font-bold text-xl">{projectInitial}</div>
                <div className="flex flex-col flex-1">
                  <h1 className="text-base font-medium leading-normal text-gray-900">{projectName}</h1>
                  <p className="text-sm font-normal leading-normal text-gray-500">Add icon</p>
                </div>
                <button className="text-gray-500 hover:text-gray-900">
                  <span className="material-symbols-outlined">add_circle_outline</span>
                </button>
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <p className="px-3 text-xs font-bold uppercase text-gray-400 tracking-wider">Overview</p>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-gray-600">dashboard</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Overview</p>
                </a>
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <a className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 group" href="#">
                  <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Boards</p>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-800">expand_more</span>
                </a>
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <p className="px-3 text-xs font-bold uppercase text-gray-400 tracking-wider">Pipelines</p>

                <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 relative" href="#">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  <span className="material-symbols-outlined text-gray-800" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
                  <p className="text-sm font-medium leading-normal text-gray-900">Pipelines</p>
                </a>

                <Link to="/environment" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-gray-600">dns</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Environments</p>
                </Link>

                <Link to="/release" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-gray-600">rocket_launch</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Releases</p>
                </Link>

                <Link to="/library" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-gray-600">folder_managed</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Library</p>
                </Link>

                <Link to="/taskgroup" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <span className="material-symbols-outlined text-gray-600">checklist</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Task groups</p>
                </Link>

                <Link to="/deploymentpage" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <span className="material-symbols-outlined text-gray-600">group_work</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Deployment groups</p>
                </Link>
              </div>

              <div className="flex flex-col gap-1 mt-4">
                <p className="px-3 text-xs font-bold uppercase text-gray-400 tracking-wider">Artifacts</p>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100" href="#">
                  <span className="material-symbols-outlined text-gray-600">inventory_2</span>
                  <p className="text-sm font-medium leading-normal text-gray-800">Artifacts</p>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-gray-200 pt-4">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-primary/10" href="#">
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Project settings</p>
              </a>
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex flex-1 flex-col overflow-y-auto bg-white p-8">
            <div className="flex flex-col max-w-6xl mx-auto w-full">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h1 className="text-gray-900 text-3xl font-bold leading-tight tracking-[-0.03em] min-w-72">Pipelines</h1>

                <button
                  onClick={() => setShowModal(true)}
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 text-white text-sm font-bold tracking-[0.015em] gap-2 shadow"
                  style={{ backgroundColor: '#136CEC' }}
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span className="truncate">New pipeline</span>
                </button>
              </div>

              <div className="mt-6">
                <div className="flex border-b border-gray-200 gap-8">
                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Recent</p>
                  </a>

                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 hover:text-gray-900 pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">All</p>
                  </a>

                  <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 hover:text-gray-900 pb-[13px] pt-4" href="#">
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Runs</p>
                  </a>
                </div>
              </div>

              <div className="mt-6 flex">
                <label className="flex w-full max-w-sm">
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-1 focus:ring-primary border-gray-300 bg-white h-10 placeholder:text-gray-500 pl-10 text-sm font-normal" placeholder="Filter pipelines..." />
                  </div>
                </label>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">Pipelines</h2>

                <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="flex justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Pipeline</p>
                    <p className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</p>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {pipelinesLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading pipelines...
                      </div>
                    ) : pipelines && pipelines.length > 0 ? (
                      pipelines.map((pipeline) => (
                        <div key={pipeline._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="material-symbols-outlined text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>account_tree</span>
                            <div>
                              <p className="font-semibold text-gray-900">{pipeline.name}</p>
                              <p className="text-sm text-gray-500">{pipeline.description || 'No description'}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{pipeline.status || 'draft'}</p>
                            <p className="text-xs text-gray-500">Created: {new Date(pipeline.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No pipelines found. Create one to get started!
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>

        {/* Modal for creating new pipeline */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Pipeline</h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Project *
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title || project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Pipeline Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Production Pipeline"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your pipeline (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ name: '', description: '' });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePipeline}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Pipeline'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
