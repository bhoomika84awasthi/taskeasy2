import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import DisplayProject from "../components/project/DisplayProject";
import { CirclePlus } from "lucide-react";
import DisplayWork from "../components/project/DisplayWork";
import DisplayPull from "../components/project/DisplayPull";
import LeftSidebar from "../components/LeftSidebar";

export default function StartPage() {
  const location = useLocation();
  const incomingProject = location.state?.project;
  const navigate = useNavigate();

  const baseURL = "http://localhost:5000/api/projects";
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("Projects");
  const [menuOpenId, setMenuOpenId] = useState(null); // which card's "three-dots" menu is open

  const project = incomingProject || (projects && projects.length ? projects[0] : null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(baseURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error("Failed to fetch projects 😞");
      }
    };

    fetchProjects();
  }, [baseURL, token]);

  // close menu when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      // if click happens outside any open menu, close it
      if (menuOpenId !== null) setMenuOpenId(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpenId]);

  const toggleMenu = (e, id) => {
    // prevent the document click handler from immediately closing it
    e.stopPropagation();
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (proj) => {
    // navigate to your edit page (adjust route to your app)
    navigate(`/project/edit/${proj._id || proj.id}`, { state: { project: proj } });
  };

  const handleDelete = async (proj) => {
    const id = proj._id || proj.id;
    const ok = window.confirm(`Delete project \"${proj.title}\"? This cannot be undone.`);
    if (!ok) return;

    try {
      await axios.delete(`${baseURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.success("Project deleted");

      // if deleted project was the currently selected `project`, clear selection
      if (project && (project._id || project.id) === id) {
        // select next available or null
        const remaining = projects.filter((p) => (p._id || p.id) !== id);
        // intentionally not using setProject since project is derived — you may want to navigate or update state
        if (remaining.length) navigate(`/summary?projectId=${remaining[0]._id || remaining[0].id}`, { state: { project: remaining[0] } });
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="flex min-h-screen w-full font-display bg-background-light dark:bg-background-dark">
      <ToastContainer />

      <LeftSidebar />

      {/* RIGHT AREA */}
      <div className="flex flex-1 flex-col ml-64">

        {/* HEADER */}
        <header className="flex items-center justify-end whitespace-nowrap border-b border-border-light dark:border-border-dark px-6 py-3 bg-foreground-light dark:bg-foreground-dark">
          <div className="flex flex-1 justify-end items-center gap-4">

            {/* SEARCH */}
            <label className="relative flex min-w-40 h-10! w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-opacity-50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark pl-10 pr-4 text-sm font-normal leading-normal"
                placeholder="Search"
              />
            </label>

            {/* AVATAR */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDc6LMmcVJFPoWd2NqfcRM8G5QUHoMfGo7wm2sWnsiL1INbfzGyh9CDFjkGvOhFtA5Q_YuINMfpzqu2XPU677ZojEz2r5cZsM7Exj--kQRSk7UfVWMMBClaQl9wpV3MUMw5P3PzUOennatB0cryX0xZXFS_YYDvL4i3qRVszUYL9Ne4bejp_TF7Ct5_Junl1cJ5c75bRhGj19OqpbylpPyrnezqUQ8i2S7jfHwRYm69TEOF7Z7TMIsqoO_6fpNypMEt2ZiRnBY3C70")',
              }}
            ></div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="w-full max-w-6xl mx-auto">

            {/* PAGE TITLE */}
            <div className="flex flex-wrap justify-between gap-3 mb-6">
              <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                {incomingProject?.title || 'sanexsolution'}
              </h1>
            </div>

            {/* TABS */}
            <div className="flex justify-between items-center border-b border-border-light dark:border-border-dark">
              <div className="flex gap-8">
                <button
                  onClick={() => setCategory('Projects')}
                  className={`flex flex-col items-center justify-center pb-3 pt-2 ${category === 'Projects' ? 'border-b-[3px] border-b-primary text-text-light dark:text-text-dark' : 'border-b-[3px] border-b-transparent text-text-secondary-light dark:text-text-secondary-dark'}`}>
                  <p className="text-sm font-bold leading-normal">Projects</p>
                </button>

                <button
                  onClick={() => setCategory('Work')}
                  className={`flex flex-col items-center justify-center pb-3 pt-2 ${category === 'Work' ? 'border-b-[3px] border-b-primary text-text-light dark:text-text-dark' : 'border-b-[3px] border-b-transparent text-text-secondary-light dark:text-text-secondary-dark'}`}>
                  <p className="text-sm font-bold leading-normal">My work items</p>
                </button>

                <button
                  onClick={() => setCategory('Pull')}
                  className={`flex flex-col items-center justify-center pb-3 pt-2 ${category === 'Pull' ? 'border-b-[3px] border-b-primary text-text-light dark:text-text-dark' : 'border-b-[3px] border-b-transparent text-text-secondary-light dark:text-text-secondary-dark'}`}>
                  <p className="text-sm font-bold leading-normal">My pull requests</p>
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <div className=" bg-blue-500 text-white p-2 rounded-lg cursor-pointer flex gap-2 items-center"
                  onClick={() => { navigate('/project/create') }}
                >
                  <CirclePlus size={16}/> Add new Project
                </div>

                <button
                  onClick={() => navigate(`/summary?projectId=${project?._id || project?.id}`, { state: { project } })}
                  disabled={!project}
                  className={`flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-foreground-light dark:bg-foreground-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark text-text-light dark:text-text-dark gap-2 text-sm font-bold leading-normal ${!project ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="material-symbols-outlined text-base">summarize</span>
                  <span className="truncate">Summary</span>
                </button>

                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-foreground-light dark:bg-foreground-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark text-text-light dark:text-text-dark gap-2 text-sm font-bold leading-normal">
                  <span className="material-symbols-outlined text-base">filter_list</span>
                  <span className="truncate">Filter projects</span>
                </button>
              </div>
            </div>

            {/* PROJECT CARDS (dynamic) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects && projects.length ? (
                projects.map((proj) => (
                  <div key={proj._id || proj.title} className="relative flex flex-col rounded-xl border border-border-light dark:border-border-dark bg-foreground-light dark:bg-foreground-dark p-6 transition-shadow hover:shadow-lg">

                    {/* three-dots menu */}
                    <div className="absolute right-3 top-3">
                      <button
                        onClick={(e) => toggleMenu(e, proj._id || proj.id)}
                        className="p-1 rounded-md hover:bg-background-light dark:hover:bg-background-dark"
                        aria-haspopup="true"
                        aria-expanded={menuOpenId === (proj._id || proj.id)}
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {menuOpenId === (proj._id || proj.id) && (
                        <div
                          onClick={(e) => e.stopPropagation()} // don't let clicks bubble to document
                          className="mt-2 w-40 rounded-lg border border-border-light dark:border-border-dark bg-foreground-light dark:bg-foreground-dark shadow-lg"
                        >
                          <button
                            onClick={() => handleEdit(proj)}
                            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-background-light dark:hover:bg-background-dark"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(proj)}
                            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-background-light dark:hover:bg-background-dark"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-4 mb-4">

                      {/* LOGO (clickable -> Summary) */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => proj && navigate(`/summary?projectId=${proj._id || proj.id}`, { state: { project: proj } })}
                        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && proj) navigate(`/summary?projectId=${proj._id || proj.id}`, { state: { project: proj } }); }}
                        className={`flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50 ${proj ? 'cursor-pointer hover:opacity-90' : 'opacity-60'}`}
                        aria-label={proj ? `Open ${proj.title} summary` : 'Summary (no project)'}
                      >
                        {proj.logo ? (
                          <img src={`http://localhost:5000${proj.logo}`} alt={proj.title} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">{(proj.title && proj.title[0]) || 'P'}</span>
                        )}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-text-light dark:text-text-dark">{proj.title}</h2>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {proj.description || `${proj.title} Project`}
                        </p>
                      </div>
                    </div>

                    {/* ICONS */}
                    <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex items-center gap-4">
                      <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                        <span className="material-symbols-outlined text-base">description</span>
                      </a>

                      <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                        <span className="material-symbols-outlined text-base">dashboard</span>
                      </a>

                      <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                        <span className="material-symbols-outlined text-base">folder</span>
                      </a>

                      <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                        <span className="material-symbols-outlined text-base">change_history</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8 text-text-secondary-light dark:text-text-secondary-dark">
                  No projects found.
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
