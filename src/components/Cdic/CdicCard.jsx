import React from "react";
import {
  Box,
  RotateCcw,
  FileText,
  FlaskConical,
  CloudUpload,
  CircleCheckBig,
  Rocket,
  MoveRight,
} from "lucide-react";

export default function CdicCard() {
  return (
    <div className="flex gap-4 overflow-y-auto p-4">
      <div className="border border-gray-300 m-12 p-4 rounded-lg w-[300px] flex flex-col">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Build</span>
          <span className="text-white bg-green-600 text-sm flex items-center p-2 rounded-lg">
            Success
          </span>
        </div>

        {/* Inner card 1 */}
        <div className="bg-gray-100 mt-4 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Box size={16} color="#007ED3" />
            <span className="font-medium text-sm">Compile code</span>
          </div>
          <div className="flex justify-end mt-2 p-2">
            <span className="text-xs text-gray-500">2 mins</span>
          </div>
          <div className="flex gap-4 items-center">
            <FileText size={16} color="gray" />
            <RotateCcw size={16} color="gray" />
          </div>
        </div>

        {/* Inner card 2 */}
        <div className="bg-gray-100 mt-4 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <FlaskConical size={16} color="#007ED3" />
            <span className="font-medium text-sm">Run Unit Tests</span>
          </div>
          <div className="flex justify-end mt-2 p-2">
            <span className="text-xs text-gray-500">2 mins</span>
          </div>
          <div className="flex gap-4 items-center">
            <FileText size={16} color="gray" />
            <RotateCcw size={16} color="gray" />
          </div>
        </div>
      </div>
      <MoveRight size={32} color="gray" className="self-center" />

      <div className="border border-gray-300 m-12 p-4 rounded-lg w-[300px] flex flex-col">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Deploy</span>
          <span className="text-white bg-[#007ED3] text-sm flex items-center p-2 rounded-lg">
            Running
          </span>
        </div>

        {/* Inner card 1 */}
        <div className="bg-gray-100 mt-4 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <CloudUpload size={16} color="#007ED3" />
            <span className="font-medium text-sm">Deploy to Staging</span>
          </div>
          <div className="flex justify-end mt-2 p-2">
            <span className="text-xs text-gray-500">2 mins</span>
          </div>
          <div className="flex gap-4 items-center">
            <FileText size={16} color="gray" />
            <RotateCcw size={16} color="gray" />
          </div>
        </div>

        {/* Inner card 2 */}
        <div className="bg-gray-100 mt-4 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <CircleCheckBig size={16} color="#007ED3" />
            <span className="font-medium text-sm">
              Run integration test Tests
            </span>
          </div>
          <div className="flex justify-end mt-2 p-2">
            <span className="text-xs text-gray-500">2 mins</span>
          </div>
          <div className="flex gap-4 items-center">
            <FileText size={16} color="gray" />
            <RotateCcw size={16} color="gray" />
          </div>
        </div>
      </div>

      <MoveRight size={32} color="gray" className="self-center" />

      <div className="border border-gray-300 m-12 p-4 rounded-lg w-[300px] flex flex-col">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Release</span>
          <span className="text-gray bg-gray-200 text-sm flex items-center p-2 rounded-lg">
            Queued
          </span>
        </div>

        {/* Inner card 1 */}
        <div className="bg-gray-100 mt-4 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Rocket size={16} color="#007ED3" />
            <span className="font-medium text-sm">Deploy to production</span>
          </div>
          <div className="flex justify-end mt-2 p-2">
            <span className="text-xs text-gray-500">2 mins</span>
          </div>
          <div className="flex gap-4 items-center">
            <FileText size={16} color="gray" />
            <RotateCcw size={16} color="gray" />
          </div>
        </div>
      </div>
    </div>
  );
}
