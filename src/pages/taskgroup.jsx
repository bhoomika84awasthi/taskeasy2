import React from "react";
import TaskboardSidebar from "../components/TaskboardSidebar";
import ProjectName from '../components/ProjectName';

export default function TaskGroupsPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light group/design-root overflow-x-hidden font-display">

      {/* HEADER */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbe0e6] px-6 py-3 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4 text-[#111418] flex-1 min-w-0">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="size-6 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 ..."
                />
              </svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
              TaskEasy
            </h2>
          </div>

          <div className="flex items-center gap-2 border-l border-[#dbe0e6] ml-4 pl-4 min-w-0">
            <a className="text-[#617289] text-sm font-medium truncate hover:text-primary">
              sanexsolution
            </a>
            <span className="text-[#617289] text-sm">/</span>
            <ProjectName className="text-[#617289] text-sm font-medium truncate hover:text-primary" />
            <span className="text-[#617289] text-sm">/</span>
            <a className="text-[#617289] text-sm font-medium truncate hover:text-primary">
              Pipelines
            </a>
            <span className="text-[#617289] text-sm">/</span>
            <span className="text-[#111418] text-sm font-medium truncate">
              Task groups
            </span>
          </div>
        </div>

        {/* RIGHT HEADER ACTIONS */}
        <div className="flex flex-shrink-0 justify-end gap-4 items-center">
          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#617289] flex bg-background-light items-center justify-center pl-3 rounded-l-lg">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                placeholder="Search"
                className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#111418] bg-background-light border-none focus:outline-none px-4 h-full placeholder:text-[#617289]"
              />
            </div>
          </label>

          <button className="flex items-center justify-center rounded-lg h-10 px-2.5 bg-background-light text-[#111418]">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>

          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCB2QIGvW8EOCZRDFnZPovyPkLMtK1PmatlHRzPhQGCfxwM-6K9e-uEuHaHzmbVQdvsZ7UY2rL780gAcLYcbpkNbTbyDdXD-_vIpP_Kf_dK8__ZUEq_BOiIoNe2bnr_w6w0-ChHYJ4zQ1hdDcBu-5Fg9eG6o5h3h1UhxlWyoBNz18Qv6MqLnLndp1jh6Cj7SUrBtOYGYIucLZJa6WgsB-ThwfnFTuHMrlS2dAyBtBhtntCiDfIQ-KXZbJdjFZJkmvFlPsYsb00VLYE')",
            }}
          ></div>
        </div>
      </header>

      <div className="flex flex-1">

        <TaskboardSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-[#f5f7fa] ml-64">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex flex-col gap-6">

            {/* TOP BAR */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                <h1 className="text-[#111418] text-4xl font-extrabold tracking-tight">
                  Task groups
                </h1>
                <button className="flex items-center h-10 px-4 border border-gray-300 rounded-md gap-2 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-lg">file_upload</span>
                  Import
                </button>
                <button className="flex items-center h-10 px-4 border border-gray-300 rounded-md gap-2 hover:bg-gray-100">
                  <span className="material-symbols-outlined text-lg">security</span>
                  Security
                </button>
              </div>

              <div className="flex items-center gap-4 justify-end">
                <label className="flex flex-col">
                  <div className="flex w-full">
                    <input
                      placeholder="Filter by name"
                      className="form-input w-60 rounded-lg border border-[#e6e9ee] bg-white h-11 px-4 text-sm placeholder:text-[#9aa4b2]"
                    />
                  </div>
                </label>

                <button className="flex items-center h-11 px-5 bg-blue-600 text-white rounded-lg shadow-md gap-3 hover:bg-blue-700">
                  <span className="material-symbols-outlined text-lg">add</span>
                  New Task Group
                </button>
              </div>
            </div>

            {/* EMPTY STATE */}
            <div className="grow flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 py-32 mt-6">
              <div className="text-center max-w-2xl px-8">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full">
                    <span className="material-symbols-outlined text-blue-600 text-4xl">layers</span>
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold text-[#111418] mb-3">Import a task group</h2>

                <p className="mt-2 text-lg text-[#617289] leading-relaxed max-w-xl mx-auto">
                  Standardize and centrally manage common build and deployment
                  steps for your applications.
                </p>

                <div className="mt-10">
                  <button className="w-80 h-12 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-bold mx-auto">
                    Import a task group
                  </button>

                  <a className="mt-4 block text-sm font-medium text-blue-600 hover:underline">
                    Learn more about task groups.
                  </a>
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
