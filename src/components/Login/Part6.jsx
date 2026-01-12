import React from "react";
import a from "../../assets/5a.webp";
import b from "../../assets/5b.webp";
import c from "../../assets/c.webp";
import d from "../../assets/d.webp";

export default function Part6() {
  return (
    <div className="hidden sm:flex flex-col mt-20 gap-6 justify-center">
      <div className="flex flex-col w-full text-center gap-6 p-4">
        <div className="text-4xl font-semibold">Bring every team together under one roof</div>
        <div className="text-gray-500 text-lg">
          Spend less time trying to get aligned and more time driving projects
          forward with confidence.
        </div>
      </div>

      <div className="w-full flex gap-6 p-4">
        <div className="w-[50%] p-8 rounded-2xl flex flex-col gap-4">
          <img src={a}></img>
        </div>
        <div className="w-[50%]  p-8 rounded-2xl flex flex-col gap-4 justify-center">
          <span className="text-lg font-semibold">Everything in one place</span>
          <span className="text-gray-500">
            The context of work, where you need it. See software team release
            dates, marketing launch plans, design tasks, and more, all in one
            view.
          </span>
          <span className="cursor-pointer text-[#007ed3]">Explore features</span>
        </div>
      </div>

      <div className="w-full flex gap-6 p-4">
        <div className="w-[50%]  p-8 rounded-2xl flex flex-col gap-4 justify-center">
          <span className="text-lg font-semibold">Tailor it for your team</span>
          <span className="text-gray-500">
            Configure Jira to match your team’s processes, workflows, languages, and needs. Integrate with every tool you use to get work done.
          </span>
          <span className="cursor-pointer text-[#007ed3]">Learn more</span>
        </div>
        <div className="w-[50%]  p-8 rounded-2xl flex flex-col gap-4">
          <img src={b}></img>
        </div>
      </div>
      <div className="w-full flex items-center justify-center text-3xl font-semibold">Never lose sight of the big picture</div>
      <div className="w-full flex gap-6 p-8">
        <div className="w-[50%]  flex flex-col gap-4 justify-center">
          <img className="rounded-xl" src={c}></img>
        </div>
        <div className="w-[50%] flex flex-col gap-4">
          <img className="rounded-xl" src={d}></img>
        </div>
      </div>
    </div>
  );
}
