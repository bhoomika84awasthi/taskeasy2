import React from "react";
import { useProject } from '../hooks/useProject';

/**
 * Pixel-intent single-page React UI for "TaskEasy - Releases"
 * Uses Tailwind utility classes (CDN loaded via public/index.html)
 *
 * Paste src/index.jsx + src/index.css + this file into a fresh React app.
 */

const pipelines = [
  { title: "UAT Core API Release", id: "release-def-001", selected: true },
  { title: "PROD OLD Apply Portal Release", id: "release-def-002" },
  { title: "UAT OLD API Release", id: "release-def-003" },
  { title: "DEV Payments Service", id: "release-def-004" },
  { title: "QA Frontend Deployment", id: "release-def-005" },
];

const releases = [
  { id: "Release-446", date: "11/17/2025, 12:29:53 AM", stage: "UAT Release Succeeded", type: "success" },
  { id: "Release-445", date: "11/16/2025, 11:58:10 PM", stage: "UAT Release Failed", type: "danger" },
  { id: "Release-444", date: "11/16/2025, 10:45:02 PM", stage: "UAT Release Succeeded", type: "success" },
  { id: "Release-443", date: "11/15/2025, 09:30:15 AM", stage: "UAT Release In Progress", type: "warning" },
  { id: "Release-442", date: "11/14/2025, 08:22:45 PM", stage: "UAT Release Succeeded", type: "success" },
  { id: "Release-441", date: "11/14/2025, 05:10:00 PM", stage: "UAT Release Succeeded", type: "success" },
];

function StageBadge({ type, children }) {
  const base = "badge";
  if (type === "success") return <span className={`${base}`} style={{ background: "rgba(16,185,129,0.12)", color: "#065f46" }}>{children}</span>;
  if (type === "danger") return <span className={`${base}`} style={{ background: "rgba(239,68,68,0.12)", color: "#7f1d1d" }}>{children}</span>;
  if (type === "warning") return <span className={`${base}`} style={{ background: "rgba(245,158,11,0.12)", color: "#92400e" }}>{children}</span>;
  return <span className={`${base}`} style={{ background: "#eee", color: "#333" }}>{children}</span>;
}

export default function Release() {
  const { projectName, projectInitial } = useProject();

  return (
    <div className="h-screen flex flex-col text-[#0f1724]">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1967f3] flex items-center justify-center text-white font-bold">✶</div>
            <div className="text-lg font-semibold">TaskEasy</div>
          </div>

          <div className="text-sm text-[#617289] flex items-center gap-1">
            <a className="hover:underline">sanexsolution</a>
            <span>/</span>
            <a className="hover:underline">{projectName}</a>
            <span>/</span>
            <a className="hover:underline">Pipelines</a>
            <span>/</span>
            <span className="text-[#111827] font-medium">Releases</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex items-center bg-[#f0f2f4] rounded-lg h-10 px-3">
              <span className="material-symbols-outlined text-gray-600">search</span>
              <input className="bg-transparent ml-3 outline-none placeholder:text-[#617289]" placeholder="Search" />
            </div>
          </div>

         

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
                <div className="font-medium">{projectName}</div>
                <div className="text-xs text-[#617289]">sanexsolution</div>
              </div>
            </div>

            <nav className="flex flex-col gap-1 text-[#475569]">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"><span className="material-symbols-outlined">dashboard</span><span>Overview</span></a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3f4f6]"><span className="material-symbols-outlined">view_kanban</span><span>Boards</span></a>

              <div className="mt-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#f3f6fb] text-[#0f1724] font-semibold">
                  <span className="material-symbols-outlined">account_tree</span><span>Pipelines</span>
                </div>

                <div className="mt-2 ml-4 border-l-2 border-[#136dec] pl-4 flex flex-col gap-1">
                  <a className="flex items-center gap-2 px-2 py-2 text-sm"><span className="material-symbols-outlined text-sm">dns</span><span>Environments</span></a>
                  <a className="flex items-center gap-2 px-2 py-2 text-sm bg-[#e9f2ff] text-[#136dec] rounded-md">
                    <span className="material-symbols-outlined">rocket_launch</span><span>Releases</span>
                  </a>
                </div>
              </div>

              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3f4f6] mt-3"><span className="material-symbols-outlined">folder_managed</span><span>Library</span></a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3f4f6]">Task groups</a>

              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f3f4f6]">Artifacts</a>

            </nav>
          </div>

          <button className="w-full h-12 bg-[#0b63ff] text-white rounded-lg flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">add</span>
            New Project
          </button>
        </aside>

        {/* MIDDLE: Pipeline list */}
        <section className="w-[360px] bg-white border-r border-gray-200 p-5 overflow-auto app-scroll">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <input className="w-full h-10 rounded-xl bg-[#f3f5f7] px-3 outline-none" placeholder="Search all pipelines" />
            </div>
            <button className="h-10 px-3 rounded-lg bg-white border border-gray-200">+ New</button>
          </div>

          <div className="space-y-3">
            {pipelines.map((p) => (
              <div key={p.id} className={`rounded-md p-4 ${p.selected ? "bg-[#eaf4ff] border-l-4 border-[#136dec]" : "hover:bg-gray-50"}`}>
                <div className={`font-semibold ${p.selected ? "text-[#0f1724]" : "text-[#0f1724]"}`}>{p.title}</div>
                <div className="text-xs text-[#64748b]">ID: {p.id}</div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: releases table */}
        <section className="flex-1 p-6 bg-white overflow-auto app-scroll">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">UAT Core API Release</h2>
            <div className="flex items-center gap-3">
              <button className="h-10 px-4 rounded-lg bg-white border border-gray-200">Edit</button>
              <button className="h-10 px-4 rounded-lg bg-[#136dec] text-white">Create release</button>
            </div>
          </div>

          <div className="rounded-md border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-3 gap-0 bg-[#f8fafc] text-[#64748b] text-xs font-medium px-6 py-3">
              <div>RELEASE ID</div>
              <div>CREATED DATE/TIME</div>
              <div>STAGES</div>
            </div>

            <div>
              {releases.map((r, idx) => (
                <div key={r.id} className="grid grid-cols-3 gap-0 items-center px-6 py-5 border-b border-gray-100">
                  <div><a className="text-[#136dec] font-medium hover:underline">{r.id}</a></div>
                  <div className="text-sm text-[#475569]">{r.date}</div>
                  <div>
                    <StageBadge type={r.type}>
                      <span style={{width:8,height:8,display:"inline-block",borderRadius:99,background: r.type==="success" ? "#10b981" : r.type==="danger" ? "#ef4444" : "#f59e0b"}} />
                      <span style={{marginLeft:6}}>{r.stage}</span>
                    </StageBadge>
                  </div>
                </div>
              ))}

              {/* blank space to mimic screenshot */}
              <div style={{height:120, background:"#fbfdff"}} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
