import React from "react";
import TaskboardSidebar from "../components/TaskboardSidebar";
import ProjectName from "../components/ProjectName";
import { Link } from 'react-router-dom';

export default function DeploymentGroups() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden font-display bg-[#f6f7f8] text-[#111827]">

      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-3 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">task_alt</span>
            <h2 className="text-xl font-bold tracking-tight">TaskEasy</h2>
          </div>

          <div className="hidden md:flex items-center text-sm text-gray-500">
            <Link className="hover:text-primary" to="/start">sanexsolution</Link>
            <span className="mx-2">/</span>
            <ProjectName className="hover:text-primary" />
            <span className="mx-2">/</span>
            <span className="text-[#111827] font-medium">Deployment groups</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input
              type="text"
              placeholder="Search"
              className="form-input w-full rounded-lg border border-[#e5e7eb] bg-[#f6f7f8] pl-10 text-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-[#f6f7f8] border border-[#e5e7eb]">
            <span className="material-symbols-outlined text-gray-500">person</span>
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        <TaskboardSidebar />

        {/* Main content adjusted for sidebar */}
        <main className="flex-1 overflow-y-auto p-8 ml-64">
          
          {/* Heading */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Deployment groups</h1>

            <div className="flex items-center gap-2">
              <a className="px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-black/5 rounded-lg flex items-center gap-1.5" href="#">
                <span className="material-symbols-outlined">security</span> Security
              </a>
              <a className="px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-black/5 rounded-lg flex items-center gap-1.5" href="#">
                <span className="material-symbols-outlined">help</span> Help
              </a>
              <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined">add</span> New
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-between border-b border-[#e5e7eb] pb-3">
            <div className="flex gap-6">
              <a className="border-b-2 border-primary text-primary pb-3 font-semibold text-sm">Groups</a>
              <a className="text-gray-500 pb-3 font-semibold text-sm hover:text-black">Available pools</a>
            </div>

            <div className="relative max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input
                type="text"
                placeholder="Search deployment groups..."
                className="w-full rounded-lg border border-[#e5e7eb] bg-white pl-10 text-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="mt-6 border rounded-lg border-[#e5e7eb] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#f6f7f8]">
                <tr>
                  <th className="p-4 text-left text-gray-500 font-semibold">Name</th>
                  <th className="p-4 text-left text-gray-500 font-semibold">Target status</th>
                  <th className="p-4 text-left text-gray-500 font-semibold">Deployment status</th>
                </tr>
              </thead>

              <tbody>

                {/* Row 1 */}
                <tr className="border-t border-[#e5e7eb] hover:bg-black/5">
                  <td className="p-4">
                    <a className="text-primary font-medium hover:underline" href="#">ProdigiSign UAT Server Deployment</a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                      <span>1 Online</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                      <span>1 Passing</span>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-t border-[#e5e7eb] bg-[#f6f7f8] hover:bg-black/5">
                  <td className="p-4">
                    <a className="text-primary font-medium hover:underline" href="#">Production Web Servers</a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                      <span>4 Online</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                      <span>4 Succeeded</span>
                    </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-t border-[#e5e7eb] hover:bg-black/5">
                  <td className="p-4">
                    <a className="text-primary font-medium hover:underline" href="#">Staging API Cluster</a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                        <span>1 Online</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 bg-orange-500 rounded-full"></span>
                        <span>1 Offline</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                        <span>1 Succeeded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-600">cancel</span>
                        <span>1 Failed</span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="border-t border-[#e5e7eb] bg-[#f6f7f8] hover:bg-black/5">
                  <td className="p-4">
                    <a className="text-primary font-medium hover:underline" href="#">Dev Environment - New</a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-gray-400 rounded-full"></span>
                      <span>1 Offline</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">remove</span>
                      <span>1 Never deployed</span>
                    </div>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="border-t border-[#e5e7eb] hover:bg-black/5">
                  <td className="p-4">
                    <a className="text-primary font-medium hover:underline" href="#">QA Test Fleet</a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                      <span>2 Online</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                      <span>2 Succeeded</span>
                    </div>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr className="border-t border-[#e5e7eb] bg-[#f6f7f8] hover:bg-black/5">
                  <td className="p-4">
                    <a className="text-primary font-medium hover:underline" href="#">Archival Storage Servers</a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 bg-gray-400 rounded-full"></span>
                      <span>3 Offline</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">remove</span>
                      <span>3 Never deployed</span>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
