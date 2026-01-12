import React from "react";
import { Link } from "react-router-dom";
import ProjectName from "../components/ProjectName";
import TaskboardSidebar from "../components/TaskboardSidebar";

export default function App() {
  return (
    <div className="flex h-screen w-full flex-col bg-[#f7f9fc] text-[#111418]">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#111418]">
            <span className="material-symbols-outlined text-primary text-3xl">task_alt</span>
            <h2 className="text-[#111418] text-lg font-bold">TaskEasy</h2>
          </div>

          <div className="flex items-center border-l border-gray-200 pl-6">
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <Link className="hover:underline" to="/">sanexsolution</Link>
              <span>/</span>
              <ProjectName />
              <span>/</span>
              <Link className="hover:underline" to="/boards">Boards</Link>
              <span>/</span>
              <span className="text-[#111418] font-medium">Queries</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <label className="relative flex items-center h-10 w-64">
            <span className="material-symbols-outlined absolute left-3 text-gray-500">search</span>
            <input
              className="flex w-full rounded-lg border border-gray-200 bg-white pl-10 text-sm placeholder:text-gray-500 h-full focus:ring-2 focus:ring-primary/50 focus:outline-none"
              placeholder="Search"
              readOnly
            />
          </label>

          {/* Avatar */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 w-10 h-10"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYTA3lLTOLHrWxB1uL6b0R-1t8vEIold2VMUgU7QfzyQCEZDk8un7lqx_U5TLm-CHKKXihB6tQpwDDuQKUs9mH7BU7muo4T79yj6em-gixsR4idScfUVy3aHuAYrNX6C6fGhhwqknwVOICAxtYftZ-Cxw1ldUtdLXroFGx322ojH96X7EHvka-X4FFfVCU9bzIrscBj7ul5tj-181l6hXYi7-xzg_EYsPLWNV7S_r-sP_TWJHC3fxf-QMtE6V7ZPIi9pzmEzy7hcY')",
            }}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <TaskboardSidebar />

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-[#f7f9fc] ml-64">
          <div className="flex-1 p-8">
            {/* Title */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <h1 className="text-3xl font-bold tracking-tight">Queries</h1>
                <p className="text-gray-600 text-lg">My Queries</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                  <span className="material-symbols-outlined text-base">save</span>Save
                </button>

                <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 pl-4 pr-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                  New <span className="material-symbols-outlined text-base">arrow_drop_down</span>
                </button>

                <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                  <span className="material-symbols-outlined text-base">view_column</span>Column options
                </button>

                <button
                  className="flex items-center gap-3 whitespace-nowrap rounded-lg bg-[#1476FF] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0f6bee]"
                  type="button"
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </span>
                  <span>Run query</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="-mb-px flex gap-6">
                <Link className="whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-gray-600 hover:text-gray-900" to="/queries/results">
                    Results
                  </Link>
                  <Link className="whitespace-nowrap border-b-2 border-primary px-1 py-3 text-sm font-medium text-primary" to="/queries/editor">
                    Editor
                  </Link>
              </nav>
            </div>

            {/* Query type */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Query type:</label>
                <span className="text-sm">Flat list of work items</span>
              </div>

              <div className="flex items-center gap-2">
                <input className="h-4 w-4 rounded border-gray-300 bg-white text-primary focus:ring-primary/50" type="checkbox"/>
                <label className="text-sm text-gray-700">Query across projects</label>
              </div>
            </div>

            {/* Query Editor */}
            <div className="mt-4 rounded-lg border border-gray-200 bg-white">
              <div className="grid grid-cols-[auto_6rem_1fr_1fr_1fr] items-center gap-4 border-b border-gray-200 p-3 text-xs font-medium text-gray-500 uppercase">
                <div className="w-8"></div>
                <div>And/Or</div>
                <div>Field</div>
                <div>Operator</div>
                <div>Value</div>
              </div>

              <div className="p-2 space-y-2">
                {/* Row 1 */}
                <div className="grid grid-cols-[auto_6rem_1fr_1fr_1fr] items-center gap-4 rounded-md p-1 hover:bg-gray-100">
                  <button className="flex items-center justify-center w-8 h-8 rounded-md text-red-500 hover:bg-red-500/10">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>And</option>
                    <option>Or</option>
                  </select>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>Changed Date</option>
                  </select>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>{">"}</option>
                  </select>

                  <input className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50" type="text" defaultValue="@today - 180"/>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-[auto_6rem_1fr_1fr_1fr] items-center gap-4 rounded-md p-1 hover:bg-gray-100">
                  <button className="flex items-center justify-center w-8 h-8 rounded-md text-red-500 hover:bg-red-500/10">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>And</option>
                  </select>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>Work Item Type</option>
                  </select>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>In</option>
                  </select>

                  <input className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50" type="text" defaultValue="[Any]"/>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-[auto_6rem_1fr_1fr_1fr] items-center gap-4 rounded-md p-1 hover:bg-gray-100">
                  <button className="flex items-center justify-center w-8 h-8 rounded-md text-red-500 hover:bg-red-500/10">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>And</option>
                  </select>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>State</option>
                  </select>

                  <select className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50">
                    <option>In</option>
                  </select>

                  <input className="w-full rounded-md border-gray-300 bg-white text-sm focus:border-primary focus:ring-primary/50" type="text" defaultValue="[Any]"/>
                </div>
              </div>

              {/* Add New Clause */}
              <div className="border-t border-gray-200 p-3">
                <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-base">add</span>
                  </span>
                  Add new clause
                </button>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex flex-col items-center justify-center text-center mt-16 py-12 text-gray-400">
              <svg className="w-64 h-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0-4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM17 12h-2v2.58a3 3 0 0 0 3-3V10h-1v2Zm-5 2v-1.58a3 3 0 0 0-3 3V17h1.5v-1.5h1a.5.5 0 0 1 .5.5V17H12v-1.5a1.5 1.5 0 0 0-1.5-1.5H9v-1.58a3 3 0 0 0-3 3V17h1.5v-1.5h1a.5.5 0 0 1 .5.5V17H9a2 2 0 0 0-2 2v1h15"/>
              </svg>
              <p className="mt-4 text-gray-600">Build your own custom query using clauses above</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
