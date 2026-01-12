import React from "react";
import { Link } from "react-router-dom";
import TaskboardSidebar from "../components/TaskboardSidebar";
import ProjectName from "../components/ProjectName";

export default function App() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* HEADER */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4 text-gray-900">
          <div className="size-6 text-primary">
            {/* logo svg */}
            <svg fill="currentColor" viewBox="0 0 48 48">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold tracking-[-0.015em]">TaskEasy</h2>

          <div className="hidden items-center gap-2 md:flex">
              <div className="h-6 w-px bg-gray-200" />
            <nav className="flex items-center gap-2 text-gray-500">
              <Link to="/start" className="text-sm hover:text-primary">sanexsolution</Link>
              <span>/</span>
              <ProjectName className="text-sm" />
              <span>/</span>
              <Link to="/Board" className="text-sm hover:text-primary">Boards</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Queries</span>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <label className="relative hidden w-full max-w-sm lg:flex">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input w-full rounded-lg border-none bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-primary/50"
              placeholder="Search..."
              readOnly
            />
          </label>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <div
            className="bg-center bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXu...')",
            }}
          />
        </div>
      </header>

      {/* LAYOUT */}
      <div className="flex h-[calc(100vh-4rem)]">
        <TaskboardSidebar />

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto bg-gray-50 ml-64">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-black tracking-[-0.03em] text-gray-900">
                  Queries
                </h1>

                <div className="flex gap-3">
                  <button className="h-10 min-w-[140px] rounded-lg bg-gray-100 px-4 text-sm text-gray-800 hover:bg-gray-200">
                    Import work items
                  </button>

                  <button className="flex h-10 items-center gap-3 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow hover:bg-blue-700">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white">+</span>
                    New query
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex gap-6 -mb-px">
                  <a className="border-b-2 border-primary px-1 py-3 text-sm font-medium text-primary">Favorites</a>
                  <a className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    All
                  </a>
                </nav>
              </div>

              {/* Table */}
              <div className="w-full rounded-xl border border-gray-200 bg-white">
                <div className="flex justify-end border-b border-gray-200 p-4">
                  <label className="relative flex items-center">
                    <input
                      className="form-input w-64 rounded-lg border-gray-300 pr-8 text-sm placeholder:text-gray-500 focus:border-primary focus:ring-primary"
                      placeholder="Filter by keywords"
                      type="text"
                    />
                    <div className="pointer-events-none absolute right-0 inset-y-0 flex items-center pr-2 text-gray-500">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folder</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last modified by</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-gray-900">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
                            <span>My favorites</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">--</td>
                        <td className="px-6 py-4 text-gray-500">--</td>
                      </tr>

                      <tr>
                        <td className="px-6 py-4 text-gray-900">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined invisible" />
                            Assigned to me
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">My favorites</td>
                        <td className="px-6 py-4 text-gray-500">Alex Johnson</td>
                      </tr>

                      <tr>
                        <td className="px-6 py-4 text-gray-900">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined invisible" />
                            Bugs in current sprint
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">My favorites</td>
                        <td className="px-6 py-4 text-gray-500">Sam Wilson</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
