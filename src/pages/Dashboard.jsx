import React from 'react';
import { Link } from 'react-router-dom';
import ProjectName from '../components/ProjectName';
import { useProject } from '../hooks/useProject';

export default function App() {
  const { projectName } = useProject();
  return (
    <div className="font-display bg-[#f6f7f9] text-[#111418] min-h-screen">
      <div className="flex h-screen flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="text-primary">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48">
                <path d="M4.4 29.24L18.76 43.59C19.88 44.71 21.4 44.92 22.72 44.79C24.06 44.66 25.51 44.16 26.97 43.46C29.91 42.04 33.26 39.57 36.41 36.41C39.57 33.26 42.04 29.91 43.46 26.97C44.16 25.51 44.66 24.06 44.79 22.72C44.92 21.4 44.71 19.88 43.59 18.76L29.24 4.41C27.85 3.02 25.88 3.02 24.29 3.37C22.61 3.73 20.73 4.58 18.84 5.75C16.5 7.19 13.99 9.18 11.59 11.59C9.18 13.99 7.19 16.5 5.75 18.84C4.58 20.73 3.73 22.61 3.37 24.29C3.02 25.88 3.02 27.85 4.4 29.24Z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">TaskEasy</h2>

              <div className="flex gap-2 text-sm items-center text-gray-500">
                <span>/</span>
                <Link to="/start" className="hover:text-primary">sanexsolution</Link>
                <span>/</span>
                <ProjectName />
                <span>/</span>
                <Link to={window.location.pathname.startsWith('/Dashboard') ? "/Dashboard" : "/Dashboard"} className="hover:text-primary">Overview</Link>
                <span>/</span>
                <span className="text-[#111418] font-medium">Dashboards</span>
              </div>
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex flex-1 justify-end gap-6 items-center">
            {/* Search */}
            <label className="flex flex-col min-w-40 max-w-64 h-10">
              <div className="flex w-full rounded-lg h-full">
                <div className="text-[#617289] flex bg-gray-100 items-center justify-center pl-3 rounded-l-lg">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="w-full flex-1 rounded-r-lg bg-gray-100 text-[#111418] px-4 text-base border-none outline-none"
                  placeholder="Search"
                />
              </div>
            </label>

            {/* Icons */}
            <div className="flex gap-2">
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>

            {/* Avatar */}
            <div
              className="bg-center bg-cover rounded-full h-10 w-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD94AtckDdcf7FWXw-FiXx90tg4ok0I2wtlcsV_n-1Bp_f_Z46EYFlplFViIpmw8rJ2N1q4-NUcB22h90MsWW114tSX06qOlADzBwyNWLwmJ0KKy9tvJZ9vZzweyqUg7sky5kKEeSAY3FtuH6u919z-0MCpkfSB3Hi8nye0zjxVPvxyC6y7dds4IXtNgy34gTYxV_BCjkNnwQCrsMaj3jzSdbHR9wxNKQ1TUSrRPkjeuvX1rBQ6Lupke-vmOUhCqPDb35CEcGyBVBY")',
              }}
            ></div>
          </div>
        </header>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* SIDEBAR */}
          <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
            <div className="flex flex-col gap-6">

              <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-3">
                  <div className="bg-purple-600 rounded-lg h-10 w-10 flex items-center justify-center text-white font-bold text-xl">P</div>
                  <h1 className="text-base font-bold text-[#111418]"><ProjectName className="text-base font-bold text-[#111418]" /></h1>
                </div>

                <button className="h-8 w-8 hover:bg-gray-100 text-gray-500 rounded-md">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                <Link to="/Dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">home</span>
                  <p className="text-sm font-medium">Overview</p>
                </Link>

                <Link to="/summary" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">bar_chart</span>
                  <p className="text-sm font-medium">Summary</p>
                </Link>

                <Link to="/Dashboard" className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    dashboard
                  </span>
                  <p className="text-[#111418] text-sm font-bold">Dashboards</p>
                </Link>

                <Link to="/Wiki" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">book</span>
                  <p className="text-sm font-medium">Wiki</p>
                </Link>

                <Link to="/Board" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">view_kanban</span>
                  <p className="text-sm font-medium">Boards</p>
                </Link>

                <Link to="/pipelines" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">account_tree</span>
                  <p className="text-sm font-medium">Pipelines</p>
                </Link>

                <Link to="/wiki" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <span className="material-symbols-outlined">inventory_2</span>
                  <p className="text-sm font-medium">Artifacts</p>
                </Link>
              </nav>
            </div>

            <div>
              <Link to="/project" className="flex items-center gap-3 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium">Project settings</p>
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col bg-[#f6f7f9] overflow-y-auto">
            <div className="p-8 space-y-6">
              
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{projectName} Team - Overview</h1>

                <div className="flex items-center gap-2">
                  <button className="h-10 px-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                    <span className="material-symbols-outlined">star</span>
                  </button>
                  <button className="h-10 px-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                  <button className="h-10 px-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-6 text-center">
                  <img
                    className="w-full max-w-sm"
                    alt="Illustration"
                    src="C:\Users\Lenovo\Downloads\sanexsolution-taskeasy_frontend-438bd656c5b0\src\pages\dashboardpic.png"
                  />

                  <div>
                    <p className="text-xl font-bold">This dashboard doesn't have widgets just yet!</p>
                    <p className="text-gray-600 text-sm">Add one or more widgets to gain visibility into your team's progress.</p>
                  </div>
                </div>
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
