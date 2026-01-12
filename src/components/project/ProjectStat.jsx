import React from "react";
import {
  Clipboard,
  GitBranch,
  GitCommit,
  CheckCircle,
  Package,
} from "lucide-react";

export default function ProjectStat() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Project stats</h2>
        <div className="text-sm text-gray-500 cursor-pointer bg-gray-100 outline-none p-2">
          <select className="outline-none">
            <option>Last 7 days</option>
            <option>Last 1 Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </div>

      {/* Boards */}
      <div className="mb-4">
        <h3 className="text-gray-700 font-medium mb-2">Boards</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clipboard className="text-gray-500" />
            <div>
              <div className="font-semibold">19</div>
              <div className="text-gray-400 text-sm">Work items created</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clipboard className="text-gray-500" />
            <div>
              <div className="font-semibold">2</div>
              <div className="text-gray-400 text-sm">Work items completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Repos */}
      <div className="mb-4">
        <h3 className="text-gray-700 font-medium mb-2">Repos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="text-gray-500" />
            <div>
              <div className="font-semibold">25</div>
              <div className="text-gray-400 text-sm">Pull requests opened</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GitCommit className="text-gray-500" />
            <div>
              <div className="font-semibold">109</div>
              <div className="text-gray-400 text-sm">Commits by 3 authors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipelines */}
      <div>
        <h3 className="text-gray-700 font-medium mb-2">Pipelines</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#d1fae5"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={(2 * Math.PI * 30 * (100 - 94)) / 100}
                  fill="transparent"
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                94%
              </span>
            </div>
            <div className="text-gray-400 text-sm">Builds succeeded</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#d1fae5"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={(2 * Math.PI * 30 * (100 - 100)) / 100}
                  fill="transparent"
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                100%
              </span>
            </div>
            <div className="text-gray-400 text-sm">Deployments succeeded</div>
          </div>
        </div>
      </div>
    </div>
  );
}
