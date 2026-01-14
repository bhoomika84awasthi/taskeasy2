import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react'
import RegisterForm from '../components/RegisterForm';

export default function Taskbar() {
  const [open, isOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("User Story");
  const [workItems, setWorkItems] = useState([]);
  const projectId = "ProdigiSign"; // Actual project ID

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !projectId) return;
    (async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}/workitems`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkItems(res.data?.items || []);
      } catch (err) {
        // Optionally handle error
      }
    })();
  }, [projectId]);

  const handleCreateWorkItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Not authenticated");
      if (!projectId) return alert("Project ID missing");
      const payload = { title, description, type, state: "New" };
      const res = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/workitems`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.item) {
        setWorkItems((prev) => [...prev, res.data.item]);
      }
      setShowModal(false);
      setTitle("");
      setDescription("");
      setType("User Story");
    } catch (err) {
      alert("Failed to create work item");
    }
  };

  return (
    <div className=''>
      <nav className="flex items-center gap-2 p-4 border-b border-gray-300 justify-between w-full">
        <div className="flex items-center gap-3 p-2 px-4">
          <LayoutGrid color="#0078D4" />
          <span className="font-semibold text-lg">TaskEasy.in</span>
        </div>
        {/* Visible on Desktop */}
        <div className="hidden sm:flex gap-6 p-2 px-4 text-gray-700 font-medium">
          <div className="cursor-pointer hover:text-black">Features</div>
          <div className="cursor-pointer hover:text-black">Pricing</div>
          <div className="cursor-pointer hover:text-black">Contact</div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded ml-4" type="button" onClick={() => setShowModal(true)}>+ New Work Item</button>

        <div className="flex sm:hidden">
          {open ? (
            <>
              <ChevronUp onClick={() => isOpen(false)} />
            </>
          ) : (
            <>
              {" "}
              <ChevronDown onClick={() => isOpen(true)} />
            </>
          )}
        </div>
        {/* Visible only on Mobile */}
        {open && (
          <div className="absolute top-[76px] right-0 left-auto w-60 bg-white border border-gray-300 flex flex-col gap-4 p-4 text-gray-700 font-medium sm:hidden shadow-md">
            <div className="cursor-pointer hover:text-black">Features</div>
            <div className="cursor-pointer hover:text-black">Pricing</div>
            <div className="cursor-pointer hover:text-black">Contact</div>
          </div>
        )}
      </nav>
      <RegisterForm />

      {/* Modal for creating new work item */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowModal(false)} />
          <div className="bg-white rounded-lg shadow-lg z-60 w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Create Sprint</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-500">Close</button>
            </div>
            <form className="p-4" onSubmit={handleCreateWorkItem}>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" required autoFocus />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="User Story">User Story</option>
                    <option value="Bug">Bug</option>
                    <option value="Task">Task</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render work items in a table like Board.jsx */}
      <div className="mt-8 w-full flex flex-col items-center">
        <table className="min-w-full text-sm border rounded-lg bg-white shadow">
          <thead className="text-xs text-gray-500 bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">State</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {workItems.length > 0 ? workItems.map(item => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2 font-bold">{item.title}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.state}</td>
                <td className="px-4 py-2 text-gray-600">{item.description}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">No work items yet. Create one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
