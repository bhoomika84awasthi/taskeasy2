import React, { useState } from "react";
import {
  Pencil,
  Calendar,
  Clock,
  User,
  ListChecks,
  X,
  Paperclip,
  Trash2,
  Tag,
  Send,
  FileText,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

export default function AddTaskModal({ show, onClose }) {
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState(["Dev", "UI", "Bug"]);
  const [newTag, setNewTag] = useState("");
  const [files, setFiles] = useState(["document.pdf", "screenshot.png"]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      user: "John Doe",
      time: "2 hours ago",
      text: "Initial thoughts on the task requirements.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      user: "Jane Smith",
      time: "1 hour ago",
      text: "Agreed, let's prioritize the UI elements first.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((f) => f.name);
    setFiles([...files, ...uploadedFiles]);
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        user: "You",
        time: "Just now",
        text: comment,
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      },
    ]);
    setComment("");
  };

  return (
    <div
      className={`fixed top-[65px] right-0 h-[calc(100%-60px)] w-full sm:w-[400px] bg-white shadow-xl transform transition-transform duration-300 ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300 p-2">
        <ArrowLeft color="gray" />
        <h2 className="text-lg font-semibold">Add New Task</h2>
        <button onClick={onClose}>
          <X className="text-gray-600 hover:text-black" />
        </button>
      </div>

      <form className="p-5 space-y-6 overflow-y-auto h-[calc(100%-64px)] text-sm text-gray-700 mt-4 gap-8">
        {/* Task Info */}
        <div className="flex flex-col gap-4">
          <div className="text-[18px] font-bold">Task Information</div>
          <div className="relative w-full">
            <Pencil
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Task title"
              className="bg-gray-100 w-full rounded px-3 py-2 pl-9 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="Description"
            className="bg-gray-100 w-full rounded px-3 py-2 text-sm focus:outline-none"
          ></textarea>
        </div>

        <div className="text-[18px] font-bold">Assignment & Status</div>
        <div className="relative w-full">
          <User
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />
          <select className="w-full bg-gray-100 rounded px-3 py-2 pl-9 text-sm">
            <option>Select a user</option>
            <option>User 1</option>
            <option>User 2</option>
          </select>
        </div>

        <div className="relative w-full">
          <ListChecks
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          />
          <select className="w-full bg-gray-100 rounded px-3 py-2 pl-9 text-sm">
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-4">
          <label className="text-[16px] font-bold">Priority</label>
          <div className="flex gap-2">
            {["Low", "Medium", "High"].map((level) => (
              <button
                type="button"
                key={level}
                className={`px-4 py-1 text-sm rounded-md ${
                  level === "Low"
                    ? "bg-gray-200 text-gray-700"
                    : level === "Medium"
                    ? "bg-orange-400 text-white"
                    : "bg-red-500 text-white"
                } ${priority === level ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setPriority(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col gap-4">
          <div className="text-[18px] font-bold">Assignment & Status</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative w-full">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  className="w-full rounded px-3 py-2 pl-9 text-sm bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="relative w-full">
                <Clock
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="time"
                  className="w-full rounded px-3 py-2 pl-9 text-sm bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div
            onSubmit={handleAddTag}
            className="relative w-full flex items-center"
          >
            <Tag
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-2/3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Add Tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
              className="w-full px-3 py-2 pl-9 rounded bg-gray-50 text-sm mb-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full"
              >
                {tag}
                <X
                  size={14}
                  className="ml-1 cursor-pointer"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Attachments */}
        <div className="flex flex-col gap-4">
          <div className="text-[18px] font-bold">Attachments</div>
          <label className="flex items-center justify-center gap-2 border px-4 py-2 rounded cursor-pointer w-full text-sm text-black hover:bg-gray-50">
            <Paperclip size={16} />
            Upload File
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
          </label>
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm border-b border-gray-300 pb-1"
              >
                <div className="flex items-center gap-2">
                  {file.endsWith(".png") || file.endsWith(".jpg") ? (
                    <ImageIcon size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                  <span>{file}</span>
                </div>
                <Trash2
                  className="text-red-500 cursor-pointer"
                  size={16}
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-4">
          <label className="text-[18px] font-bold">Comments</label>
          <div className="space-y-4">
            {comments.map((c, index) => (
              <div key={index} className="flex items-start gap-3">
                <img
                  src={c.avatar}
                  alt={c.user}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-gray-800 font-medium text-sm">
                    {c.user}{" "}
                    <span className="text-gray-400 font-normal text-xs ml-1">
                      {c.time}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">{c.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded px-3 py-2 text-sm pr-10 outline-none bg-gray-100"
            />
            <Send
              size={18}
              className="absolute right-3 top-2.5 text-blue-500 cursor-pointer"
              onClick={handleAddComment}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
}
