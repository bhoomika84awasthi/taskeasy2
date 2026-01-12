import React from "react";
import { useProject } from '../hooks/useProject';

/**
 * PURE LIGHT THEME VERSION — NO dark: classes anywhere
 */

const environments = [
  { id: "env-001", name: "Development", status: "Active", type: "dev" },
  { id: "env-002", name: "Staging", status: "Active", type: "staging" },
  { id: "env-003", name: "Production", status: "Active", type: "prod" },
  { id: "env-004", name: "UAT", status: "Inactive", type: "uat" },
];

function StatusBadge({ status }) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";
  if (status === "Active") return <span className={`${base} bg-green-100 text-green-800`}>{status}</span>;
  return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
}

export default function Environment() {
  const { projectName, projectInitial } = useProject();

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">task_alt</span>
            <div className="text-lg font-semibold text-gray-900">TaskEasy</div>
          </div>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <a className="hover:underline cursor-pointer">sanexsolution</a>
            <span>/</span>
            <a className="hover:underline cursor-pointer">{projectName}</a>
            <span>/</span>
            <a className="hover:underline cursor-pointer">Pipelines</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Environments</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center bg-gray-100 rounded-lg h-10 px-3">
              <span className="material-symbols-outlined text-gray-500">search</span>
              <input className="bg-transparent ml-3 outline-none placeholder:text-gray-500" placeholder="Search" />
            </div>
          </div>

          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-100 text-gray-900">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <div className="w-10 h-10 rounded-full bg-cover" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=12')" }} />
        </div>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md bg-purple-600 text-white flex items-center justify-center font-semibold text-lg">{projectInitial}</div>
              <div>
                <div className="font-medium text-gray-900">{projectName}</div>
                <div className="text-xs text-gray-600">sanexsolution</div>
              </div>
            </div>

            <nav className="flex flex-col gap-1 text-gray-700">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Overview</span>
              </a>

              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <span className="material-symbols-outlined">view_kanban</span>
                <span>Boards</span>
              </a>

              <div className="mt-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-gray-900 font-semibold">
                  <span className="material-symbols-outlined">account_tree</span>
                  <span>Pipelines</span>
                </div>

                <div className="mt-2 ml-4 border-l-2 border-primary pl-4 flex flex-col gap-1">
                  <a className="flex items-center gap-2 px-2 py-2 text-sm bg-blue-50 text-primary rounded-md cursor-pointer">
                    <span className="material-symbols-outlined">dns</span>
                    <span>Environments</span>
                  </a>

                  <a className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                    <span className="material-symbols-outlined">rocket_launch</span>
                    <span>Releases</span>
                  </a>
                </div>
              </div>

              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer mt-3">
                <span className="material-symbols-outlined">folder_managed</span>
                <span>Library</span>
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-primary/10 cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
            <span>Project settings</span>
          </div>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">Environments</h1>

              <button className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700">
                <span className="material-symbols-outlined text-base">add</span>
                <span>New environment</span>
              </button>
            </div>

            {/* TABLE */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {environments.map(env => (
                    <tr key={env.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{env.name}</td>
                      <td className="px-6 py-4 text-gray-600 uppercase text-xs">{env.type}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={env.status} />
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                        <button className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}