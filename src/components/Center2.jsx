import React from "react";
import { Globe,Link,MessageSquareText } from "lucide-react";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import AllInboxOutlinedIcon from "@mui/icons-material/AllInboxOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import files1 from "../assets/files.png";
import files0 from "../assets/files0.png";

export default function Center2() {
  return (
    <div className="p-4 mx-4 mt-12 flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <div className="text-[28px] font-bold">Create</div>
        <span className="text-gray-400 text-lg">
          Explore popular TaskEasy services and start your first project. Create
          a popular service like Linux virtual machine or try an interactive
          deployment for comprehensive solutions using TaskEasy Developer CLI.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-12">
        <div className="rounded-lg border border-gray-300 bg-gray-200/30 p-7">
          <h2 className="font-semibold mb-4">Popular services</h2>
          <div className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <LanguageOutlinedIcon className="w-4 h-4 text-[#0078D4]" />
              <span>Create a web app</span>
            </li>
            <div className="flex  items-center gap-3">
              <AllInboxOutlinedIcon className="w-4 h-4 text-[#0078D4] flex justify-" />
              <span>Deploy and run a container-based app</span>
            </div>
            <li className="flex items-center gap-3">
              <DnsOutlinedIcon className="w-4 h-4 text-[#0078D4]" />
              <span>Deploy a virtual machine</span>
            </li>
          </div>
          <p className="mt-4 text-[#0078D4] text-sm cursor-pointer">
            View more
          </p>
        </div>

        <div className="rounded-lg border border-gray-300 bg-gray-200/30 p-6">
          <h2 className="font-semibold mb-4">Popular solutions</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <TerminalOutlinedIcon className="w-4 h-4 text-[#0078D4]" />
              <span>Deploy a Linux virtual machine</span>
            </li>
            <li className="flex items-center gap-3">
              <PsychologyOutlinedIcon className="w-4 h-4 text-[#0078D4]" />
              <span>Deploy an AI model on AKS</span>
            </li>
            <li className="flex items-center gap-3">
              <CloudOutlinedIcon className="w-4 h-4 text-[#0078D4]" />
              <span>Deploy a TaskEasy Service (AKS) cluster</span>
            </li>
          </ul>
          <p className="mt-4 text-[#0078D4] text-sm cursor-pointer">
            View more
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">Learn and optimize</h1>
          <p className="text-gray-500 mb-8 text-sm max-w-3xl">
            Plan for success and enhance your cloud skills using guides from the
            Cloud Adoption Framework or learning paths on AI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            <div className=" rounded-lg border border-gray-300 bg-gray-200/30 p-6 flex flex-col">
              <img
                src={files0}
                alt="Guides"
                className="w-12 h-12 mb-4"
              />
              <h2 className="font-semibold mb-2">Guides</h2>
              <p className="text-gray-500 text-sm flex-1">
                Plan for your organization’s success with Cloud Adoption
                Framework guides.
              </p>
              <button className="mt-4 bg-white  px-4 py-1.5 w-fit rounded-md cursor-pointer">
                Start
              </button>
            </div>

            <div className="rounded-lg border border-gray-300 bg-gray-200/30 p-6 flex flex-col">
              <img
                src={files1}
                alt="Training"
                className="w-12 h-12 mb-4"
              />
              <h2 className="font-semibold mb-2">Training</h2>
              <p className="text-gray-500 text-sm flex-1">
                Learn new skills and explore popular courses, learning paths,
                and modules.
              </p>
              <button className="mt-4 bg-white  px-4 py-1.5 w-fit rounded-md cursor-pointer">
                Start
              </button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-semibold text-md mb-2">Give feedback</h2>
            <div className="flex items-center gap-2 text-sm">
              <MessageSquareText size={18} color="gray" />
              <span className="text-blue-500 cursor-pointer">Help us improve this page</span>
            </div>
          </div>
    </div>

    
  );
}
