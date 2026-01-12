import React from "react";
import { Link } from 'react-router-dom';
import ProjectName from '../components/ProjectName';
import { useProject } from '../hooks/useProject';

export default function LibraryPage() {
  const { projectName } = useProject();
  return (
    <div className="flex h-screen w-full flex-col font-display bg-[#f6f7f8] text-[#1F2937]">

      {/* HEADER */}
      <header className="flex w-full items-center justify-between whitespace-nowrap border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48">
                <path
                  clipRule="evenodd"
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                />
              </svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold tracking-[-0.015em]">TaskEasy</h2>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <a className="text-[#617289] text-sm hover:underline">sanexsolution</a>
            <span className="text-[#617289]">/</span>
            <ProjectName className="text-[#617289] text-sm hover:underline" />
            <span className="text-[#617289]">/</span>
            <a className="text-[#617289] text-sm hover:underline">Pipelines</a>
            <span className="text-[#617289]">/</span>
            <span className="text-[#111418] text-sm">Library</span>
          </div>
        </div>

        {/* Right Header */}
        <div className="flex flex-1 justify-end items-center gap-4">
          <label className="flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex items-stretch rounded-lg h-full">
              <div className="text-[#617289] flex bg-gray-100 items-center justify-center pl-3 rounded-l-lg">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="form-input w-full flex-1 rounded-lg text-[#111418] border-none bg-gray-100 placeholder:text-[#617289] px-4 focus:ring-0"
                placeholder="Search..."
              />
            </div>
          </label>

          <button className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 text-[#111418]">
            <span className="material-symbols-outlined text-xl">help</span>
          </button>

          <div
            className="bg-center bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXpXUm-2cPXjpJxiSJjIV5yq-U71wF9pay_HwD9Tr6W-0kbWqmHDL_9qxTAEy_noPCJUL9Hjkkrp-cVkq4qOkGURmfkVqwZ34iuwXW4TaL5trg9PvIUFaVRZH-JYGff_7hJ0Fj7oc8xnXf-RPDi4MIhKJlUwswkjYELcjo8PA8RW5VErH0FIRT0Q9KFgkToeEUbQ6ka1jeVl9koHWptujSbNQKB2g0KsaBbTAk2OCUIFn3N6ak1xcbodmi00JT2GDU4YsEZFcJQjI")'
            }}
          ></div>
        </div>
      </header>

      {/* BODY START */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="flex h-full w-64 flex-col justify-between bg-white p-4 border-r border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div
                className="bg-center bg-cover rounded-lg size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDS9hYzBpNz0_bEBuyQeTFN75B5ZllQo1QT0Ds1pqZsb1M8vDu9TqUh2iLzFOW_bShgm19MXBgHBjPtNzSSTmPrlXCIh_SQ5iki2x_AbGhZLZH5ydtH3uCs8oVoA_U849Ro3VF_9lMj35uD68YNDn9ZkYdjTA1WsUt4dLIlr29x87CTFh7cA94J66NFFdypawjP-yKPXd6Ifd85U-G0pICAJlDZZURc3PCTWNDpOZ4uyJRkTsEa0LoeQjVunirRwxcI1Fy3HL9Qd-w")'
                }}
              ></div>

              <div>
                <h1 className="text-[#111418] font-bold">{projectName}</h1>
                <p className="text-[#617289] text-sm">sanexsolution</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mt-4">
              <Link to="/pro" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">grid_view</span>
                <p className="text-sm">Overview</p>
              </Link>

              <Link to="/Taskboard" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">view_kanban</span>
                <p className="text-sm">Boards</p>
              </Link>

              <div>
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <span className="material-symbols-outlined">share</span>
                  <p className="text-sm">Pipelines</p>
                </div>

                <div className="flex flex-col pl-6 border-l-2 border-primary ml-5">
                  <Link to="/pipelines" className="py-2 px-3 hover:bg-gray-100 rounded-lg text-sm">Pipelines</Link>
                  <Link to="/environment" className="py-2 px-3 hover:bg-gray-100 rounded-lg text-sm">Environments</Link>
                  <Link to="/release" className="py-2 px-3 hover:bg-gray-100 rounded-lg text-sm">Releases</Link>
                  <Link to="/library" className="py-2 px-3 bg-primary/10 text-primary rounded-lg font-bold text-sm">
                    Library
                  </Link>
                  <Link to="/taskgroup" className="py-2 px-3 hover:bg-gray-100 rounded-lg text-sm">Task groups</Link>
                  <Link to="/deploymentpage" className="py-2 px-3 hover:bg-gray-100 rounded-lg text-sm">Deployment groups</Link>
                </div>
              </div>

              <Link to="/library" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <span className="material-symbols-outlined">inventory_2</span>
                <p className="text-sm">Artifacts</p>
              </Link>
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f5f7fa]">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex justify-between items-end mb-6">
              <div className="flex border-b border-[#dbe0e6] gap-12">
                <a className="flex flex-col items-center border-b-2 border-b-primary text-primary pb-[13px] pt-4 hover:text-primary">
                  <p className="text-sm font-bold leading-tight">Variable groups</p>
                </a>

                <a className="flex flex-col items-center border-b-2 border-b-transparent text-[#8b92a9] hover:text-primary pb-[13px] pt-4">
                  <p className="text-sm font-semibold leading-tight">Secure files</p>
                </a>
              </div>

              <button className="flex items-center h-10 bg-blue-600 text-white rounded-lg px-5 gap-2 text-sm font-bold hover:bg-blue-700 shadow-sm">
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Variable group</span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <label className="flex flex-col min-w-40 h-10 w-full max-w-xs">
                  <div className="flex items-stretch rounded-lg h-full border border-gray-200">
                    <div className="text-[#8b92a9] flex bg-[#f5f7fa] items-center justify-center pl-3 rounded-l-md border-r border-gray-200">
                      <span className="material-symbols-outlined text-lg">search</span>
                    </div>

                    <input
                      className="form-input w-full rounded-lg border-none bg-[#f5f7fa] placeholder:text-[#8b92a9] px-3 text-sm focus:ring-0 focus:outline-none"
                      placeholder="Search variable groups"
                    />
                  </div>
                </label>

                <div className="flex items-center gap-3">
                  <button className="flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-lg text-[#8b92a9] text-lg">
                    <span className="material-symbols-outlined">security</span>
                  </button>
                  <button className="flex items-center justify-center h-10 w-10 hover:bg-gray-100 rounded-lg text-[#8b92a9] text-lg">
                    <span className="material-symbols-outlined">help</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center py-24 min-h-96">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-8">
                  <span className="material-symbols-outlined text-blue-600 text-5xl">code</span>
                </div>

                <h3 className="text-2xl font-bold text-[#111418] mb-3">New variable group</h3>

                <p className="text-[#8b92a9] max-w-xl mb-8 leading-relaxed text-base font-normal">
                  Create groups of variables that you can share across
                  <br />
                  multiple pipelines to streamline your workflow and improve
                  <br />
                  consistency.
                </p>

                <button className="flex items-center h-11 bg-blue-600 text-white px-6 rounded-lg gap-2 text-sm font-bold hover:bg-blue-700 shadow-sm">
                  <span className="material-symbols-outlined text-lg">add</span>
                  <span>Variable group</span>
                </button>

                <a className="text-blue-600 text-sm font-medium mt-8 hover:underline">
                  Learn more about variable groups
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
