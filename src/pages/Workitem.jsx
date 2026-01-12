/*
Updated: TaskEasy Work Items - React component
- Adds styled scrollbars (vertical + horizontal)
- Ensures table horizontal scrollbar is visible like the screenshot
- Small layout fixes for spacing and consistent backgrounds

Usage:
1) Add Tailwind CDN + Google fonts + Material Symbols to public/index.html as before.
2) Place this file at src/App.jsx
3) Start your React app (Vite/CRA). No extra packages required.
*/

import React from 'react';
import { Link } from 'react-router-dom';
import TaskboardSidebar from "../components/TaskboardSidebar";
import ProjectName from "../components/ProjectName";

// small helper for Material Symbols (font-variation settings applied via style below)
const Material = ({ children, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: `"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24` }}
  >
    {children}
  </span>
);

export default function TaskEasy() {
  return (
    <div
      className="font-display bg-background-light text-gray-800"
      style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="relative flex h-screen w-full flex-col group/design-root">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-6 py-3 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Material className="text-primary text-3xl">task_alt</Material>
              <h2 className="text-xl font-bold tracking-tight">TaskEasy</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <a className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:underline" href="#">
                sanexsolution
              </a>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
              <ProjectName className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal" />
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
              <a className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:underline" href="#">
                Boards
              </a>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
              <span className="text-gray-800 dark:text-gray-100 text-sm font-medium leading-normal">Work items</span>
            </div>
          </div>

          <div className="flex flex-1 justify-end gap-4 items-center">
            <label className="flex flex-col min-w-40 !h-10 w-full max-w-sm">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-gray-500 flex bg-gray-100 items-center justify-center pl-3 rounded-l-lg border-r-0">
                  <Material>search</Material>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-0 border-none bg-gray-100 h-full placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                  placeholder="Search..."
                  defaultValue=""
                />
              </div>
            </label>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                width: 40,
                height: 40,
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBUVx5_g-yeDnqMLMXYnEjbDP3QQMEN_VG2yLwDcEeESnHbuFsK2BpPq_VMKqMnkIPa24Sgq7-NQrRE_-GRavmVvyCN-PtHfdrD7YGOmYwkUg-Wg_B23SZRSv8ZKu9Acmals93rr6oWauv0iMQ5qJWQgLWld4B5z5BnqR85HIjepaRX5jzYORW4s9lJbVvgCgdwwaNXeybzNwc4djkN0bKlsFoHBgTuZKlW72_q9EjaWLW-nWt8-zQrHPX_FO9DgsYJZVuVgDVarFU")`,
              }}
              aria-hidden="true"
            />
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">

          <TaskboardSidebar />

          {/* Main */}
          {/* Make main vertically scrollable so a right scrollbar is visible (like screenshot) */}
          <main className="flex-1 flex flex-col bg-background-light overflow-auto ml-64">
            <div className="flex flex-col gap-4 px-8 py-8 min-h-[600px]">
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2 items-center">
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    My activity
                  </button>
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 flex items-center gap-2">
                    <Material className="text-base">add</Material> New Work Item
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    Open in Queries
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    Column Options
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    Import Work Items
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    Recycle Bin
                  </button>
                </div>

                <div className="flex gap-1">
                  <button className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
                    <Material className="text-xl">refresh</Material>
                  </button>
                  <button className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
                    <Material className="text-xl">settings</Material>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2">
                <label className="flex flex-col min-w-40 h-10 w-full max-w-xs">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div className="text-gray-500 flex bg-white items-center justify-center pl-3 rounded-l-lg border border-r-0 border-gray-300">
                      <Material>search</Material>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 focus:outline-0 focus:ring-0 border border-l-0 border-gray-300 bg-white h-full placeholder:text-gray-500 px-4 rounded-l-none pl-2 text-sm font-normal leading-normal"
                      placeholder="Filter by keyword"
                      defaultValue=""
                    />
                  </div>
                </label>
                <div className="flex gap-2">
                  {['Types', 'Assigned to', 'State', 'Area Path', 'Tags'].map((b) => (
                    <button
                      key={b}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      {b} <Material className="text-base">expand_more</Material>
                    </button>
                  ))}
                </div>
              </div>

              {/* Table wrapper with horizontal scrollbar visible */}
              <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg table-wrapper">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 font-medium" scope="col">
                        ID
                      </th>
                      <th className="px-6 py-3 font-medium" scope="col">
                        Title
                      </th>
                      <th className="px-6 py-3 font-medium" scope="col">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 font-medium" scope="col">
                        State
                      </th>
                      <th className="px-6 py-3 font-medium" scope="col">
                        Area Path
                      </th>
                      <th className="px-6 py-3 font-medium" scope="col">
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                      {[
                      {
                        id: '14450',
                        title: 'IEC Code & IEC Branch displayed for Org-based Employees',
                        avatar:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuBMMM6Z3a9cjoIfDZ-CLsgeJy79Sbasw8wDnxmW4DHiOUdGtP91Zjxcbe6NDaEawQn7ll2HkInRH9cHvRs_5-5bFWbiUzmPz-LfEVcMG3Wckk_ROJOTtPJBcBrNi7_JLHvQHsRHc0dpHkctRIZBV0_SYOhBJk-LLjgAyUwrK7-PVSl3sloVtXOahRO-fO2QbV9CHJTo0PHQlhg55nHNWNqYNwk_IUrDtjt2poyRJFqVE7SZsgRNgWYkGRqTkKFMscBkLbOrlz0FsY4',
                        person: 'Bhoomika Awasthi',
                        state: { label: 'Resolved', classes: 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' },
                        area: 'ProdigiSign',
                        tags: [],
                      },
                      {
                        id: '1234',
                        title: 'Update user authentication flow',
                        avatar:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuAOUtZhonP8Ac671ZU0Lp6GQs5xIR5X6Uw3EQm4jlYnsDf47xEdl0VJcdDAxcrQ4tx2Z-1vPHOKOh6JsM-oxAiVzUUwuGXZTadZT35-Zq1RwzTr5MrALmLwO51sm9vSaUforGQaDvDuUoXaSTtEPnoVljtHH6ogN10p8yrDdim8GhtyyzQpP1mj2wafaMmezWEiPpHXXTV_LVYnS2E0itic80QP2euDjcNAkINK2M7ZSYU5npnSdn6J-IV1JSNE1s0IA-wWwOGVpq8',
                        person: 'Raj Patel',
                        state: { label: 'Done', classes: 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300' },
                        area: 'ProdigiSign\\Auth',
                        tags: [{ label: 'UI', classes: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' }],
                      },
                      {
                        id: '14448',
                        title: 'API endpoint for document signing',
                        avatar:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuB0zISLZuCu1d8Gpepx9t-jFbWR8EB9krrJNejJrzezi5oGBIHoTpLUl4NwbZQ7OU_tzrMWe830Bdc0p3PdF3KjstXoyTKHnUyUfTH2v-bP4DUNIqCABYZ-BDuXxEhdhMpiTkC1M8G-XuwklKI0kCdGiNPNPlNCEg3hfAVkfgTYShZM21eezW5dR7cMY8BZpIkF9Ad8tgYg3NK7-x8akP-1GGUiOyn4Qfsn1w7a_Gz8_hq9aa4IGelGxt8SLPhd331gRDP1b-dnYJY',
                        person: 'Priya Sharma',
                        state: { label: 'Active', classes: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' },
                        area: 'ProdigiSign\\API',
                        tags: [{ label: 'Backend', classes: 'text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300' }],
                      },
                      {
                        id: '14447',
                        title: 'Fix dashboard rendering bug on Safari',
                        avatar:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuA20I5ZKL-wRlvrwsuklDaPMCj3glwg72AxpBrHY5vCv9gH8Ka4AcHdv5gpdeLxO_3NzypgXyD2HUG9OvxS3dVUl5JzaAdkVieaYpou7cbDz-lo7VMORvqeTGVSNsFnd0uuuFir6HmoTrnGqnuGU7IEFeqFcyD9Q7DszIhsoJKl6hYQpoU7rK5sAo8s_gzgCj5VsOlnoBx5MQSZ5yg_GE3YwM6CSw6ySbKWPxCOygCxDWGCuC7pP6N7kqOz6IT-inVOoZ96lUuPtJI',
                        person: 'Anil Kapoor',
                        state: { label: 'Active', classes: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' },
                        area: 'ProdigiSign\\Web',
                        tags: [
                          { label: 'Bug', classes: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-300' },
                          { label: 'UI', classes: 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300' },
                        ],
                      },
                      {
                        id: '14446',
                        title: 'Research new e-signature compliance standards',
                        avatar:
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuCGiwGy9rLU-Z3hrKJLAK9oHPxsxeJncP4mVlYvvy4f7yGD5Q7qVBHT9waq66O3swaWlAq_65i9UD2ZpQYuBQE0xnvCQQYixizKXRVrkUNxtrbz-GR5w3qBkjDGdA1YJUCwlfQ5UlF6JM6D8DKppb2nKrG46zQEz6bFAVFP79_jNvtpBHHc0zOc8VqIXljm0Fmh8W4LzKjmG8I9E2jjEKs1xmYv5yXgyEgxH8uZoCGjlkQVPqaDaEbJ_PY1Id9TVuLyCA_23zSXRR8',
                        person: 'Sunita Rai',
                        state: { label: 'New', classes: 'text-gray-800 bg-gray-100 dark:bg-gray-600 dark:text-gray-300' },
                        area: 'ProdigiSign',
                        tags: [],
                      },
                      ].map((row) => (
                      <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-500">{row.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          <Link to={`/workitemdetail?id=${encodeURIComponent(row.id)}&user=${encodeURIComponent(row.person)}`} className="text-primary hover:underline">
                            {row.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <img className="w-6 h-6 rounded-full" alt={`Avatar of ${row.person}`} src={row.avatar} />
                            <span>{row.person}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium ${row.state.classes} rounded-full`}>{row.state.label}</span>
                        </td>
                        <td className="px-6 py-4">{row.area}</td>
                        <td className="px-6 py-4">
                          {row.tags.length === 0 ? '-' : row.tags.map((t, i) => (
                            <span key={i} className={`px-2 py-0.5 text-xs font-medium ${t.classes} rounded-md mr-1`}>{t.label}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* tiny style overrides to match original tailwind config in the HTML file + scrollbar styles */}
      <style>{`
        :root{ --primary: #136dec; }
        .text-primary{ color: var(--primary); }
        .bg-primary\\/10{ background-color: rgba(19,108,236,0.08); }
        .bg-primary\\/20{ background-color: rgba(19,108,236,0.12); }
        .bg-background-light{ background-color: #f6f7f8; }
        .bg-background-dark{ background-color: #101822; }

        /* global scrollbar styling for Chromium-based browsers */
        /* show both vertical and horizontal thumb/track with rounded look */
        *::-webkit-scrollbar {
          height: 12px;
          width: 12px;
        }
        *::-webkit-scrollbar-track {
          background: #f1f3f5;
          border-radius: 8px;
          margin: 4px;
        }
        *::-webkit-scrollbar-thumb {
          background: #bfc3c6;
          border-radius: 8px;
          border: 3px solid #f1f3f5;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: #9ea3a6;
        }

        /* Table wrapper: add a small bottom padding so horizontal track sits nicely and matches screenshot */
        .table-wrapper {
          padding: 8px 8px 12px 8px; /* bottom padding ensures visible horizontal track area */
        }

        /* keep table header sticky while scrolling horizontally (optional to match screenshot feel) */
        .table-wrapper thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: inherit;
        }

        /* Make sure main area uses native scrollbars (vertical) */
        main { -webkit-overflow-scrolling: touch; }

        /* For Firefox (thin scrollbar) */
        * {
          scrollbar-width: thin;
          scrollbar-color: #bfc3c6 #f1f3f5;
        }
      `}</style>
    </div>
  );
}
