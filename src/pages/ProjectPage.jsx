import React, { useEffect, useState } from "react";
import { CirclePlus, Link, MenuIcon, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import axios from "axios";
import DisplayProject from "../components/project/DisplayProject";
import DisplayWork from "../components/project/DisplayWork";
import DisplayPull from "../components/project/DisplayPull";
import { useNavigate } from "react-router-dom";

export default function ProjectPage() {
  const baseURL = "http://localhost:5000/api/projects";
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const toggleDrawer = () => setIsOpen(!isOpen);
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("Projects");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await axios.get(baseURL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch projects 😞");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <ToastContainer />
      <div>
        {/* Mobile nav bar */}
        <div className="flex p-2 bg-[#0078D4] w-full h-[60px] items-center justify-between">
          {!isOpen ? (
            <div className="" onClick={() => setIsOpen(!isOpen)}>
              <MenuIcon size={22} color="white" />
            </div>
          ) : (
            <button onClick={toggleDrawer}>
              <X size={22} color="white" />
            </button>
          )}
          <div className="text-lg font-semibold text-white">TaskEasy</div>
        </div>
        <div className="border sm:mx-[280px] sm:m-10 p-4 flex flex-col gap-4 sm:w-[75%] justify-center">
          <div className="flex items-center justify-between">
            <div className="font-bold text-lg text-gray-600">
            Organization name
          </div>

          <div className=" bg-blue-500 text-white p-2 rounded-lg cursor-pointer flex gap-2 items-center"
          onClick={() => {navigate('/project/create')}}>
           <CirclePlus size={16}/> Add new Project
          </div>

          </div>
          <div className="flex gap-8 items-center">
            <div
              className={`cursor-pointer font-semibold text-gray-700 hover:text-black p-2  ${
                category === "Projects"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-black"
              }`}
              onClick={() => setCategory("Projects")}
            >
              Projects
            </div>
            <div
              className={`cursor-pointer font-semibold text-gray-700 hover:text-black p-2 ${
                category === "Work"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-black"
              }`}
              onClick={() => setCategory("Work")}
            >
              Work
            </div>
            <div
              className={`cursor-pointer font-semibold text-gray-700 hover:text-black p-2 ${
                category === "Pull"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-black"
              }`}
              onClick={() => setCategory("Pull")}
            >
              Pull Request
            </div>
          </div>
          {category === "Projects" ? (
            <DisplayProject projects={projects} setProjects={setProjects} fetchProjects={fetchProjects}/>
          ) : category === "Work" ? (
            <DisplayWork />
          ) : (
            <DisplayPull />
          )}
        </div>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-[60px] left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        Name of the Organization will come
        <div></div>
      </div>

      {/* to close the drawer by clicking outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40"
          onClick={toggleDrawer}
        ></div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
