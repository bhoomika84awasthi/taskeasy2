import React from "react";

export default function Summary() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-white">

      {/* HEADER */}
      <header className="flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-b-[#2c343d] px-6 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
        <div className="flex items-center gap-4 text-[#111418] dark:text-white">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>

          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">TaskEasy</h2>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#617289] dark:text-[#a6b3c4]">/</span>
            <a className="text-[#617289] dark:text-[#a6b3c4] hover:text-primary" href="#">sanexsolution</a>
            <span className="text-[#617289] dark:text-[#a6b3c4]">/</span>
            <a className="text-[#617289] dark:text-[#a6b3c4] hover:text-primary" href="#">ProdigiSign</a>
            <span className="text-[#617289] dark:text-[#a6b3c4]">/</span>
            <a className="text-[#617289] dark:text-[#a6b3c4] hover:text-primary" href="#">Overview</a>
            <span className="text-[#617289] dark:text-[#a6b3c4]">/</span>
            <span className="font-medium">Summary</span>
          </div>
        </div>

        {/* Right Side Header Actions */}
        <div className="flex flex-1 justify-end items-center gap-4">

          {/* Search */}
          <label className="flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full items-stretch rounded-lg h-full">
              <div className="text-[#617289] flex bg-[#f0f2f4] dark:bg-[#2c343d] items-center justify-center pl-3 rounded-l-lg">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>

              <input
                className="form-input flex w-full min-w-0 flex-1 overflow-hidden rounded-lg text-[#111418] dark:text-white border-none bg-[#f0f2f4] dark:bg-[#2c343d] h-full placeholder:text-[#617289] px-4 rounded-l-none pl-2 text-base"
                placeholder="Search"
              />
            </div>
          </label>

          {/* Notification + Help */}
          <div className="flex gap-2">
            <button className="rounded-lg h-10 px-2.5 bg-[#f0f2f4] dark:bg-[#2c343d]">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>

            <button className="rounded-lg h-10 px-2.5 bg-[#f0f2f4] dark:bg-[#2c343d]">
              <span className="material-symbols-outlined text-xl">help</span>
            </button>
          </div>

          {/* Avatar */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD94AtckDdcf7FWXw-FiXx90tg4ok0I2wtlcsV_n-1Bp_f_Z46EYFlplFViIpmw8rJ2N1q4-NUcB22h90MsWW114tSX06qOlADzBwyNWLwmJ0KKy9tvJZ9vZzweyqUg7sky5kKEeSAY3FtuH6u919z-0MCpkfSB3Hi8nye0zjxVPvxyC6y7dds4IXtNgy34gTYxV_BCjkNnwQCrsMaj3jzSdbHR9wxNKQ1TUSrRPkjeuvX1rBQ6Lupke-vmOUhCqPDb35CEcGyBVBY")',
            }}
          ></div>
        </div>
      </header>

      {/* LAYOUT BODY */}
      <div className="flex flex-1">

        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-background-dark border-r border-solid border-r-[#f0f2f4] dark:border-r-[#2c343d]">
          <div className="flex h-full flex-col justify-between p-4">

            {/* Project Header */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center gap-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg flex items-center justify-center bg-[#8B5CF6]">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <h1 className="font-medium text-base">ProdigiSign</h1>
                </div>

                <button className="h-8 w-8 rounded-lg hover:bg-[#f0f2f4] dark:hover:bg-[#2c343d]">
                  <span className="material-symbols-outlined text-xl">add</span>
                </button>
              </div>

              {/* Side Navigation */}
              <div className="flex flex-col gap-1 mt-4">
                <p className="text-xs font-semibold uppercase px-3 py-2 text-[#617289] dark:text-[#a6b3c4]">
                  Overview
                </p>

                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f2f4]" href="#">
                  <span className="material-symbols-outlined text-xl">space_dashboard</span>
                  <p className="text-sm font-medium">Overview</p>
                </a>

                {/* Selected */}
                <a className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg bg-[#f0f2f4] dark:bg-[#2c343d] border-l-2 border-primary">
                  <span className="material-symbols-outlined text-xl">summarize</span>
                  <p className="text-sm font-medium">Summary</p>
                </a>

                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f2f4]" href="#">
                  <span className="material-symbols-outlined text-xl">monitoring</span>
                  <p className="text-sm font-medium leading-normal">Dashboards</p>
                </a>

                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f2f4]" href="#">
                  <span className="material-symbols-outlined text-xl">article</span>
                  <p className="text-sm font-medium leading-normal">Wiki</p>
                </a>
              </div>

              {/* More */}
              <div className="flex flex-col gap-1 mt-2">
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f2f4]" href="#">
                  <span className="material-symbols-outlined text-xl">view_kanban</span>
                  <p className="text-sm font-medium">Boards</p>
                </a>

                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f2f4]" href="#">
                  <span className="material-symbols-outlined text-xl">account_tree</span>
                  <p className="text-sm font-medium">Pipelines</p>
                </a>

                <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f0f2f4]" href="#">
                  <span className="material-symbols-outlined text-xl">inventory_2</span>
                  <p className="text-sm font-medium">Artifacts</p>
                </a>
              </div>
            </div>

            {/* Project Settings Bottom */}
            <div className="flex flex-col gap-1">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-primary/10">
                <span className="material-symbols-outlined text-xl">settings</span>
                <p className="text-sm font-medium">Project settings</p>
              </a>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {/* Title Row */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <h1 className="text-4xl font-black tracking-[-0.033em] min-w-72">
                ProdigiSign
              </h1>

              <button className="flex items-center gap-2 cursor-default rounded-lg h-10 px-4 bg-[#f0f2f4] dark:bg-[#2c343d] text-sm font-bold">
                <span className="material-symbols-outlined text-base">lock</span>
                <span className="truncate">Private</span>
              </button>
            </div>

            {/* GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ABOUT CARD */}
              <div className="lg:col-span-2">
                <div className="p-6 bg-white dark:bg-[#1a232e] rounded-xl border border-[#f0f2f4] dark:border-[#2c343d]">
                  <p className="text-lg font-bold">About this project</p>
                  <p className="text-[#617289] dark:text-[#a6b3c4] text-base mt-2 leading-normal">
                    ProdigiSign Projects Management is a comprehensive solution designed to
                    streamline project workflows, enhance collaboration, and provide real-time insights
                    into project progress. This dashboard offers a high-level summary of key metrics
                    and activities.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-6">

                {/* STATS CARD */}
                <div className="p-6 bg-white dark:bg-[#1a232e] rounded-xl border border-[#f0f2f4] dark:border-[#2c343d]">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-bold">Project stats</h3>
                    <button className="flex items-center gap-1 text-sm text-[#617289] hover:text-[#111418]">
                      Last 7 days
                      <span className="material-symbols-outlined text-base">expand_more</span>
                    </button>
                  </div>

                  {/* Stats Items */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background-light dark:bg-[#2c343d] rounded-lg">
                      <p className="text-3xl font-bold">10</p>
                      <p className="text-xs text-[#617289]">Work items created</p>
                    </div>

                    <div className="p-4 bg-background-light dark:bg-[#2c343d] rounded-lg">
                      <p className="text-3xl font-bold">4</p>
                      <p className="text-xs text-[#617289]">Work items completed</p>
                    </div>

                    <div className="p-4 bg-background-light dark:bg-[#2c343d] rounded-lg">
                      <p className="text-3xl font-bold">28</p>
                      <p className="text-xs text-[#617289]">Pull requests opened</p>
                    </div>

                    <div className="p-4 bg-background-light dark:bg-[#2c343d] rounded-lg">
                      <p className="text-3xl font-bold">125</p>
                      <p className="text-xs text-[#617289]">Commits by 3 authors</p>
                    </div>
                  </div>

                  {/* Circle Chart */}
                  <div className="mt-6 flex flex-col items-center">
                    <div className="relative size-32">
                      <svg className="size-full" viewBox="0 0 36 36">
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          cx="18"
                          cy="18"
                          r="16"
                          strokeWidth="3"
                          fill="none"
                          stroke="currentColor"
                        ></circle>

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
                        ></circle>
                      </svg>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">94%</span>
                      </div>
                    </div>

                    <p className="text-sm text-[#617289] mt-2">success rate - Builds succeeded</p>
                  </div>
                </div>

                {/* Members */}
                <div className="p-6 bg-white dark:bg-[#1a232e] rounded-xl border border-[#f0f2f4] dark:border-[#2c343d]">
                  <h3 className="text-lg font-bold mb-4">Members</h3>

                  <div className="flex items-center -space-x-2">
                    {[
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_2k70CemIqMtTV6K94xGwOkXvGlfJ9YK9H6oF_YgkwjeaUKKksZpE-gZDIPmfp3wA5mAbWi5u-kwYS9etCV6WeAapiAPMxOksxz27KiCZhTAfYI09CsnagC5LNjAo66NW4E84uh9hv-dhI0mCEKTpVpW4mkkCwuSVC2HMi_kraJrNe8aImuWfhJtuGXnEwmbX4gSbZjsgm2uK_8ksph8hyj0bik3kQt3aCI4a_smvuyRdhIVcUotw4DMOyLcQ21CtjLS_85xPkds",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOX0LnRxVP0q1f0H0PPGA56WhjH15e56BSrbprdM9U4tUg9JNC4-wPmSj8jSXfowpdnWTU80u5XXYpRqEKzN_h72wEiFDyUL-rYPiD7yvxEei_n1MSo45zT4u3julkSdIvYv-1vTErG1DyCSmqtk3wRA7cEhyfvBMF4zYHVOz0mcjpBGL3XWexEVeJSIxJo_zh2ZDag3mwMctGgKTysIsmi3tDn7F40PRwQ0bsXgBGVoZJWnvYWVSteGE6YK98ZIVpN4fmcImXE3M",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9JQwalOcMyaMepsdZgPU6W4GpxvwBCoYtVukqen5tcBN7cQkDvMFUEU9D8ljJqVt058aksi7jN6danik5IzkgrFCfaxlJ4Pivf8fr_hFvia8LVt28_I6vMg0DUO7ZVIVaKeYJUaM1fesFrCdLpDPEa9H5Cwl0CV8NaMWxyRptO61vOkFSL31BwO8k8vfe8XOAKUdo-rIt2rtQlOT8UgiT-nYgqrY2qUtG9GINnXVporYFzAwHjQDffl-NFsBrHEaa0n89M5y0ehM",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCT9HQVVPMZMOg0FGouvFw7rs8LsgATL9EeDSw6aMjPyqOFOySHjQ-atAXdK2IEmoI08yyrlXsHDN5H0u3HlmnK042h5nmP14rv96ztueML_SrIKuFiC7e_4yoHNLiQiWZmMNMs4DvEJqzzZexrZgHVwYBW-xMG_2R_AoxfZnI0_MuuhdK33WjVlizySExkPYWJb_mcGm6uLWxBnEVM8ceKcRjPkncJ5ud1iy4I5ai-hWQTz8F-Ff1rGCOMCsEWoT3PJ8ExtLaSspQ",
                    ].map((src, i) => (
                      <div
                        key={i}
                        className="size-10 rounded-full border-2 border-white dark:border-[#1a232e] bg-cover bg-center"
                        style={{ backgroundImage: `url('${src}')` }}
                      ></div>
                    ))}

                    <div className="size-10 rounded-full border-2 border-white dark:border-[#1a232e] bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-[#617289]">
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
