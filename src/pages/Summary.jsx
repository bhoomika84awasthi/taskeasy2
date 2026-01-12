import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import LeftSidebar from "../components/LeftSidebar";
import axios from 'axios';

export default function Summary() {
  const location = useLocation();
  const initialProject = location.state?.project;
  const [project, setProject] = useState(initialProject || null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (project) return;
    const params = new URLSearchParams(location.search);
    const projectId = params.get('projectId');
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`, 
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };
    fetchProject();
  }, [location.search, project, token]);

  const projectTitle = project?.title || "ProdigiSign";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f6f7f8] text-[#111418]">

      {/* HEADER (fixed) */}
      <header className="fixed left-0 right-0 top-0 flex w-full items-center justify-between border-b border-[#e2e8f0] px-6 py-3 bg-white z-40">
        <div className="flex items-center gap-4 text-[#111418]">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48">
              <path
                clipRule="evenodd"
                d="M39.475 21.626..."
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold">TaskEasy</h2>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#617289]">
            <span>/</span>
            <Link to="/start" className="hover:text-primary">sanexsolution</Link>
            <span>/</span>
            <Link to={project ? `/summary?projectId=${project._id || project.id}` : '/summary'} state={{ project }} className="hover:text-primary">{projectTitle}</Link>
            <span>/</span>
            <Link to={project ? `/Dashboard?projectId=${project._id || project.id}` : '/Dashboard'} state={{ project }} className="hover:text-primary">Overview</Link>
            <span>/</span>
            <span className="font-medium text-[#111418]">Summary</span>
          </div>
        </div>

        {/* Search + Icons */}
        <div className="flex items-center gap-4">
          <label className="flex h-10 max-w-64 rounded-lg overflow-hidden bg-[#f0f2f4]">
            <div className="flex items-center px-3 text-[#617289]">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="flex-1 bg-[#f0f2f4] outline-none text-sm px-2"
              placeholder="Search"
            />
          </label>

          <button className="rounded-lg h-10 px-3 bg-[#f0f2f4]">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>

          <button className="rounded-lg h-10 px-3 bg-[#f0f2f4]">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>

          <div
            className="size-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: "url(https://lh3.googleusercontent.com/aida-public/...)" }}
          ></div>
        </div>
      </header>

        {/* MAIN BODY */}
      <div className="flex flex-1">

        <LeftSidebar />

        {/* CONTENT */}
        <main className="flex-1 p-8 ml-64 mt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {/* TOP ROW */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-black">{projectTitle}</h1>
              <button className="flex items-center gap-2 rounded-lg h-10 px-4 bg-[#f0f2f4] font-bold">
                <span className="material-symbols-outlined text-base">lock</span>
                Private
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ABOUT CARD */}
              <div className="lg:col-span-2 p-6 bg-white rounded-xl border border-[#e2e8f0]">
                <p className="text-lg font-bold">About this project</p>
                <p className="text-[#617289] mt-2 leading-normal">
                  {projectTitle} Projects Management is a comprehensive solution designed to streamline project workflows.
                </p>
              </div>

              {/* STATS CARD */}
              <div className="p-6 bg-white rounded-xl border border-[#e2e8f0] flex flex-col">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-bold">Project stats</h3>
                  <button className="flex items-center gap-1 text-sm text-[#617289] hover:text-[#111418]">
                    Last 7 days <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>

                {/* ITEMS */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { n: 10, label: "Work items created" },
                    { n: 4, label: "Work items completed" },
                    { n: 28, label: "Pull requests opened" },
                    { n: 125, label: "Commits by 3 authors" },
                  ].map((item) => (
                    <div className="p-4 bg-[#f6f7f8] rounded-lg" key={item.label}>
                      <p className="text-3xl font-bold">{item.n}</p>
                      <p className="text-xs text-[#617289]">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* CHART */}
                <div className="mt-6 flex flex-col items-center">
                  <div className="relative size-32">
                    <svg className="size-full" viewBox="0 0 36 36">
                      <circle
                        className="text-gray-200"
                        cx="18"
                        cy="18"
                        r="16"
                        strokeWidth="3"
                        fill="none"
                        stroke="currentColor"
                      />
                      <circle
                        className="text-primary"
                        cx="18"
                        cy="18"
                        r="16"
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset="6"
                        strokeLinecap="round"
                        fill="none"
                        stroke="currentColor"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">94%</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#617289] mt-2">
                    success rate - Builds succeeded
                  </p>
                </div>

                {/* MEMBERS CARD – FIXED */}
                <div className="p-6 bg-white rounded-xl border border-[#e2e8f0] mt-6">
                  <h3 className="text-lg font-bold mb-4">Members</h3>

                  <div className="flex items-center -space-x-2">
                    {[
                      "https://lh3.googleusercontent.com/aida-public/AB6AXu_2k70CemIqMtTV6K94xGwOkXvGlfJ9YK9H6oF_YgkwjeaUKKksZpE-gZDIPmfp3wA5mAbWi5u-kwYS9etCV6WeAapiAPMxOksxz27KiCZhTAfYI09CsnagC5LNjAo66NW4E84uh9hv-dhI0mCEKTpVpW4mkkCwuSVC2HMi_kraJrNe8aImuWfhJtuGXnEwmbX4gSbZjsgm2uK_8ksph8hyj0bik3kQt3aCI4a_smvuyRdhIVcUotw4DMOyLcQ21CtjLS_85xPkds",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOX0LnRxVP0q1f0H0PPGA56WhjH15e56BSrbprdM9U4tUg9JNC4-wPmSj8jSXfowpdnWTU80u5XXYpRqEKzN_h72wEiFDyUL-rYPiD7yvxEei_n1MSo45zT4u3julkSdIvYv-1vTErG1DyCSmqtk3wRA7cEhyfvBMF4zYHVOz0mcjpBGL3XWexEVeJSIxJo_zh2ZDag3mwMctGgKTysIsmi3tDn7F40PRwQ0bsXgBGVoZJWnvYWVSteGE6YK98ZIVpN4fmcImXE3M",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9JQwalOcMyaMepsdZgPU6W4GpxvwBCoYtVukqen5tcBN7cQkDvMFUEU9D8ljJqVt058aksi7jN6danik5IzkgrFCfaxlJ4Pivf8fr_hFvia8LVt28_I6vMg0DUO7ZVIVaKeYJUaM1fesFrCdLpDPEa9H5Cwl0CV8NaMWxyRptO61vOkFSL31BwO8k8vfe8XOAKUdo-rIt2rtQlOT8UgiT-nYgqrY2qUtG9GINnXVporYFzAwHjQDffl-NFsBrHEaa0n89M5y0ehM",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCT9HQVVPMZMOg0FGouvFw7rs8LsgATL9EeDSw6aMjPyqOFOySHjQ-atAXdK2IEmoI08yyrlXsHDN5H0u3HlmnK042h5nmP14rv96ztueML_SrIKuFiC7e_4yoHNLiQiWZmMNMs4DvEJqzzZexrZgHVwYBW-xMG_2R_AoxfZnI0_MuuhdK33WjVlizySExkPYWJb_mcGm6uLWxBnEVM8ceKcRjPkncJ5ud1iy4I5ai-hWQTz8F-Ff1rGCOMCsEWoT3PJ8ExtLaSspQ"
                    ].map((src, i) => (
                      <div
                        key={i}
                        className="size-10 rounded-full border-2 border-white bg-cover bg-center"
                        style={{ backgroundImage: `url(${src})` }}
                      ></div>
                    ))}

                    {/* +5 bubble */}
                    <div className="size-10 rounded-full border-2 border-white bg-[#e2e8f0] flex items-center justify-center text-sm font-semibold text-[#617289]">
                      +5
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
