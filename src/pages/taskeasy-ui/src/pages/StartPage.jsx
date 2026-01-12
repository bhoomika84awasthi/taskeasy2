import React from "react";

export default function StartPage() {
  return (
    <div className="flex min-h-screen w-full font-display bg-background-light dark:bg-background-dark">

      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-border-light dark:border-border-dark bg-foreground-light dark:bg-foreground-dark p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white text-xl font-bold">T</div>
          <div className="flex flex-col">
            <h1 className="text-text-light dark:text-text-dark text-base font-bold leading-normal">TaskEasy</h1>
          </div>
        </div>

        <nav className="flex flex-col justify-between h-full mt-8">
          <div className="flex flex-col gap-2">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20" href="#">
              <span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
              <p className="text-primary text-sm font-bold leading-normal">sanexsolution</p>
            </a>

            <a className="flex items-center gap-3 px-3 py-2" href="#">
              <span className="material-symbols-outlined text-primary text-2xl">add</span>
              <p className="text-primary text-sm font-medium leading-normal">New organization</p>
            </a>
          </div>

          <div className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2" href="#">
              <span className="material-symbols-outlined text-primary text-2xl">settings</span>
              <p className="text-primary text-sm font-medium leading-normal">Organization settings</p>
            </a>
          </div>
        </nav>
      </aside>

      {/* RIGHT AREA */}
      <div className="flex flex-1 flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-end whitespace-nowrap border-b border-border-light dark:border-border-dark px-6 py-3 bg-foreground-light dark:bg-foreground-dark">
          <div className="flex flex-1 justify-end items-center gap-4">

            {/* SEARCH */}
            <label className="relative flex min-w-40 !h-10 w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary focus:ring-opacity-50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark pl-10 pr-4 text-sm font-normal leading-normal"
                placeholder="Search"
              />
            </label>

            {/* AVATAR */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDc6LMmcVJFPoWd2NqfcRM8G5QUHoMfGo7wm2sWnsiL1INbfzGyh9CDFjkGvOhFtA5Q_YuINMfpzqu2XPU677ZojEz2r5cZsM7Exj--kQRSk7UfVWMMBClaQl9wpV3MUMw5P3PzUOennatB0cryX0xZXFS_YYDvL4i3qRVszUYL9Ne4bejp_TF7Ct5_Junl1cJ5c75bRhGj19OqpbylpPyrnezqUQ8i2S7jfHwRYm69TEOF7Z7TMIsqoO_6fpNypMEt2ZiRnBY3C70")',
              }}
            ></div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="w-full max-w-6xl mx-auto">

            {/* PAGE TITLE */}
            <div className="flex flex-wrap justify-between gap-3 mb-6">
              <h1 className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                sanexsolution
              </h1>
            </div>

            {/* TABS */}
            <div className="flex justify-between items-center border-b border-border-light dark:border-border-dark">
              <div className="flex gap-8">
                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-text-light dark:text-text-dark pb-3 pt-2" href="#">
                  <p className="text-sm font-bold leading-normal">Projects</p>
                </a>

                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark pb-3 pt-2" href="#">
                  <p className="text-sm font-bold leading-normal">My work items</p>
                </a>

                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark pb-3 pt-2" href="#">
                  <p className="text-sm font-bold leading-normal">My pull requests</p>
                </a>
              </div>

              <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-foreground-light dark:bg-foreground-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark text-text-light dark:text-text-dark gap-2 text-sm font-bold leading-normal">
                <span className="material-symbols-outlined text-base">filter_list</span>
                <span className="truncate">Filter projects</span>
              </button>
            </div>

            {/* PROJECT CARD */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col rounded-xl border border-border-light dark:border-border-dark bg-foreground-light dark:bg-foreground-dark p-6 transition-shadow hover:shadow-lg">
                <div className="flex items-start gap-4 mb-4">

                  {/* LOGO */}
                  <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">P</span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">ProdigiSign</h2>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      ProdigiSign Projects Management
                    </p>
                  </div>
                </div>

                {/* ICONS */}
                <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex items-center gap-4">
                  <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                    <span className="material-symbols-outlined text-base">description</span>
                  </a>

                  <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                    <span className="material-symbols-outlined text-base">dashboard</span>
                  </a>

                  <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                    <span className="material-symbols-outlined text-base">folder</span>
                  </a>

                  <a className="flex items-center gap-1.5 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary text-sm font-medium" href="#">
                    <span className="material-symbols-outlined text-base">change_history</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
