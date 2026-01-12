import { Book, BookOpen, Circle, Search ,Clipboard} from "lucide-react";
import React from "react";

export default function BoardSection() {
  return (
    <div className="flex justify-between gap-2">
      <div className="flex flex-col gap-4 w-[25%] bg-white shadow-md p-4 rounded-lg">
        <div className="flex border-b">New</div>
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="bg-gray-200 text-xs p-1">+ New Item</div>
                <div><Search size={16} color="gray"/></div>
            </div>
            {/* //Card */}
            <div className="flex flex-col p-2 rounded-lg text-sm gap-2 bg-gray-100">
                <div className="flex items-center gap-2">
                    <BookOpen size={16} color="#0078D4"/>
                    <span className="text-sm">ID001</span>
                    <span className="text-sm">Project name</span>
                 </div>
                 <div className="flex items-center gap-1"><Circle size={12}/> New</div>
                 <div className="flex items-center gap-1"><Circle size={18}/> Name</div>
                 <div className="flex items-center gap-1"><Clipboard size={12}/> 0/10</div>
            </div>

            <div className="flex flex-col p-2 rounded-lg text-sm gap-2 bg-gray-100">
                <div className="flex items-center gap-2">
                    <BookOpen size={16} color="#0078D4"/>
                    <span className="text-sm">ID001</span>
                    <span className="text-sm">Project name</span>
                 </div>
                 <div className="flex items-center gap-1"><Circle size={12}/> New</div>
                 <div className="flex items-center gap-1"><Circle size={18}/> Name</div>
                 <div className="flex items-center gap-1"><Clipboard size={12}/> 0/10</div>
            </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[25%] bg-white shadow-md p-4 rounded-lg">
        <div className="flex border-b">Active</div>
        <div className="flex flex-col">
            
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[25%] bg-white shadow-md p-4 rounded-lg">
        <div className="flex border-b">Resolved</div>
        <div className="flex flex-col">
            
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[25%] bg-white shadow-md p-4 rounded-lg">
        <div className="flex border-b">Closed</div>
        <div className="flex flex-col">
            
        </div>
      </div>
    </div>
  );
}
