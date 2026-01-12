import React from "react";
import {
  Plus,
  Rocket,
  Cpu,
  Grid3x3,
  Monitor,
  Globe,
  Server,
  Database,
  Cloud,
  ArrowRight
} from "lucide-react";

export default function End() {
  return (
    <div className="hidden md:flex items-center justify-center text-[12px] gap-4 p-6 flex-wrap">
      <Service icon={<Plus size={30} className="text-[#0078D4]" />} text="Create a resource" active />
      <Service icon={<Rocket size={30} />} text="Quickstart Center" />
      <Service icon={<Cpu size={30} />} text="TaskEasy AI Foundry" />
      <Service icon={<Grid3x3 size={30} />} text="Kubernetes services" />
      <Service icon={<Monitor size={30} />} text="Virtual machines" />
      <Service icon={<Globe size={30} />} text="App Services" />
      <Service icon={<Server size={30} />} text="Storage accounts" />
      <Service icon={<Database size={30} />} text="SQL databases" />
      <Service icon={<Cloud size={30} />} text="TaskEasy Cosmos DB" />
      <Service icon={<ArrowRight size={30} className="text-[#0078D4]" />} text="More Services" active />
    </div>
  );
}

function Service({ icon, text, active }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 cursor-pointer ${
        active ? "text-[#0078D4]" : "text-black"
      }`}
    >
      {icon}
      <span className={active ? "text-[#0078D4]" : ""}>{text}</span>
    </div>
  );
}
