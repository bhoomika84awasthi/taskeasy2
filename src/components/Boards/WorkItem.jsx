import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Filter,
  Columns,
  UploadCloud,
  Trash2,
  MoreHorizontal,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";

const workItemsData = [
  {
    id: 1,
    title: "Work items dummy data",
    assignedTo: "Devansh Tyagi",
    state: "New",
    areaPath: "Sanex",
    activityDate: "19/9/2025 9:42 PM",
    icon: "alert",
  },
  {
    id: 2,
    title: "Another task",
    assignedTo: "John Doe",
    state: "Active",
    areaPath: "Beta",
    activityDate: "17/10/2025 11:00 AM",
    icon: "check",
  },
  {
    id: 3,
    title: "Another task",
    assignedTo: "John Doe",
    state: "Active",
    areaPath: "Beta",
    activityDate: "17/10/2025 11:00 AM",
    icon: "check",
  },
  {
    id: 4,
    title: "Another task",
    assignedTo: "John Doe",
    state: "Active",
    areaPath: "Beta",
    activityDate: "17/10/2025 11:00 AM",
    icon: "check",
  },
  {
    id: 5,
    title: "Another task",
    assignedTo: "John Doe",
    state: "Active",
    areaPath: "Beta",
    activityDate: "17/10/2025 11:00 AM",
    icon: "check",
  },
];

export default function WorkItem() {
  const [items, setItems] = useState(workItemsData);
  const [activePopup, setActivePopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);

  const togglePopup = (id) => {
    setActivePopup(activePopup === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter items based on searching
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.areaPath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      {/* Header buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Work items</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={16} /> New Work Item
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            <Columns size={16} /> Column Options
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            <UploadCloud size={16} /> Import
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
            <Trash2 size={16} /> Recycle Bin
          </button>
        </div>
      </div>

      {/* Search field below header */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2  rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto bg-white shadow rounded-lg flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Area Path
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                More
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 relative">
                  <td className="px-4 py-2 text-sm text-gray-700">{item.id}</td>
                  <td className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700">
                    {item.icon === "alert" && <AlertTriangle size={16} className="text-red-500" />}
                    {item.icon === "check" && <CheckSquare size={16} className="text-green-500" />}
                    {item.title}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.assignedTo}</td>
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        item.state === "Active" ? "bg-blue-600" : "bg-gray-400"
                      }`}
                    >
                      {item.state}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.areaPath}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">{item.activityDate}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 relative">
                    <MoreHorizontal
                      size={20}
                      className="cursor-pointer hover:text-gray-700"
                      onClick={() => togglePopup(item.id)}
                    />
                    {activePopup === item.id && (
                      <div
                        ref={popupRef}
                        className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10"
                      >
                        <ul className="py-1">
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 1</li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 2</li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 3</li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
