import React from "react";
import CdicCard from "./CdicCard";
import CdicTerminal from "./CdicTerminal";

export default function CdicCenter() {
  return (
    <div className="flex flex-col w-full">

  <div className="overflow-x-auto scrollbar-hide">
    <div className="flex gap-4 p-4 min-w-max">
      <CdicCard />
    </div>
  </div>

  <div className="p-4">
    <CdicTerminal />
  </div>
</div>

  );
}
