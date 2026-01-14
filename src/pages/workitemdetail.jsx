import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import TaskboardSidebar from "../components/TaskboardSidebar";
import ProjectName from '../components/ProjectName';
import axios from 'axios';

export default function WorkItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '14450';
  const user = params.get('user') || 'Casey Smith';
  
  const handleDeleteWorkItem = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this work item? This action cannot be undone.')) {
        return;
      }

      const token = localStorage.getItem('token');
      const selectedProjectId = localStorage.getItem('selectedProjectId');
      
      if (!token) {
        alert('Not authenticated');
        return;
      }

      if (!selectedProjectId) {
        alert('No project selected');
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/projects/${selectedProjectId}/workitems/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        alert('Work item deleted successfully!');
        navigate(-1);
      }
    } catch (err) {
      console.error('Failed to delete work item:', err);
      alert('Failed to delete work item: ' + (err.response?.data?.message || err.message));
    }
  };
  return (
    <div className="font-display bg-[#F9FAFB] text-[#1F2937] flex flex-col min-h-screen w-full">

      {/* HEADER */}
      <header className="flex w-full items-center justify-between gap-6 px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">TaskEasy</h1>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <a className="hover:underline whitespace-nowrap" href="#">sanexsolution</a>
            <span>/</span>
            <ProjectName className="hover:underline whitespace-nowrap" />
            <span>/</span>
            <a className="hover:underline whitespace-nowrap" href="#">Boards</a>
            <span>/</span>
            <a className="font-medium text-gray-700 whitespace-nowrap" href="#">Work Items</a>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
          <div className="relative w-full max-w-sm ml-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="search"
              className="w-full rounded-md border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:ring-[#6D28D9] focus:border-[#6D28D9]"
              placeholder="Search..."
            />
          </div>

          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFhwYR5GO1wNMsEbX9ipas-9prUPF0GwxUHlKX7M6aqhe-jfiSdRMz2KqLqdDdu34B409f-gPuRKL4kbRmbxPQ2tXrP9JLCVvFlTnDKvnJUl1Mn6mqw5QyIxvvmvZRA5zEmRhjQRaDy5mUOH-ULMtwP-fo5WYiy6A8Cpuj3RfdOWS97UREdF_B4F0EqL_u9n3SqypvFI0G7rqi3DOaJj5_0JUg40gNDZSXgq_I2pgmd05jO_309GWw4NFR4yiJO7MRhXlYVsIue_M")'
            }}
          ></div>
        </div>
      </header>

      <div className="flex flex-1">

        <TaskboardSidebar />

        {/* MAIN */}
        <main className="flex-1 flex flex-col ml-64">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl p-6 lg:p-8">

              {/* Breadcrumb + Title */}
              <header className="mb-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <a className="text-[#617289] text-sm font-medium" href="#">Work Items</a>
                  <span className="material-symbols-outlined text-sm text-[#617289]">chevron_right</span>
                  <span className="text-[#111418] text-sm font-medium">ID: {id}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="text-[#111418] tracking-tight text-3xl font-bold">
                    Login button unresponsive on Safari 15.2
                  </h1>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                      <span className="material-symbols-outlined text-base">visibility</span>
                      Follow
                    </button>

                    <button className="flex items-center gap-2 rounded-md bg-[#6D28D9] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a20b5]">
                      <span className="material-symbols-outlined text-base">save</span>
                      Save
                    </button>
                  </div>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-4 items-center mt-4 border-b border-gray-200 pb-4">

                  <div className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white border border-gray-200">
                    <div
                      className="bg-center bg-no-repeat bg-cover rounded-full size-8"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFhwYR5GO1wNMsEbX9ipas-9prUPF0GwxUHlKX7M6aqhe-jfiSdRMz2KqLqdDdu34B409f-gPuRKL4kbRmbxPQ2tXrP9JLCVvFlTnDKvnJUl1Mn6mqw5QyIxvvmvZRA5zEmRhjQRaDy5mUOH-ULMtwP-fo5WYiy6A8Cpuj3RfdOWS97UREdF_B4F0EqL_u9n3SqypvFI0G7rqi3DOaJj5_0JUg40gNDZSXgq_I2pgmd05jO_309GWw4NFR4yiJO7MRhXlYVsIue_M")'
                      }}
                    ></div>
                    <p className="text-sm font-medium">{user}</p>
                  </div>

                  <div className="flex h-8 items-center rounded-full bg-green-100 px-3">
                    <p className="text-green-800 text-sm font-medium">State: Resolved</p>
                  </div>

                  <div className="flex h-8 items-center rounded-full bg-gray-100 px-3">
                    <p className="text-gray-800 text-sm font-medium">Reason: Fixed</p>
                  </div>

                  <div className="flex h-8 items-center rounded-full bg-gray-100 px-3">
                    <p className="text-gray-800 text-sm font-medium">Iteration: Sprint 3</p>
                  </div>
                </div>
              </header>

              {/* CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Summary */}
                  <div className="rounded-lg border border-gray-200 bg-white">
                    <h2 className="px-6 py-4 text-lg font-semibold border-b border-gray-200">Summary</h2>
                    <div className="p-6 text-gray-600 space-y-4">
                      <p>
                        The primary "Log In" button on the main authentication page is currently unresponsive
                        when accessed via Safari version 15.2 on macOS. Clicking the button does not trigger any
                        network requests or UI changes. The issue appears to be specific to this browser version,
                        as functionality remains normal on Chrome, Firefox, and older versions of Safari.
                      </p>
                    </div>
                  </div>

                  {/* Repro Steps */}
                  <div className="rounded-lg border border-gray-200 bg-white">
                    <h2 className="px-6 py-4 text-lg font-semibold border-b border-gray-200">Repro Steps</h2>
                    <div className="p-6 text-gray-600 space-y-4">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Open Safari browser, version 15.2, on a macOS device.</li>
                        <li>Navigate to the application's login page.</li>
                        <li>Enter valid user credentials into the username and password fields.</li>
                        <li>Click the "Log In" button.</li>
                        <li>
                          <strong>Expected Result:</strong> The user is authenticated and redirected to the dashboard.
                        </li>
                        <li>
                          <strong>Actual Result:</strong> Nothing happens. The button appears disabled or non-functional.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Preconditions */}
                  <div className="rounded-lg border border-gray-200 bg-white">
                    <h2 className="px-6 py-4 text-lg font-semibold border-b border-gray-200">Preconditions</h2>
                    <div className="p-6 text-gray-600 space-y-4">
                      <ul className="list-disc list-inside space-y-2">
                        <li>User must be on macOS.</li>
                        <li>Browser must be Safari version 15.2.</li>
                        <li>No specific user account type is required to reproduce the issue.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-1">
                  <div className="space-y-6 lg:sticky lg:top-8">

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                      <nav className="-mb-px flex space-x-6">
                        <a className="border-b-2 border-[#6D28D9] py-3 px-1 text-sm font-semibold text-[#6D28D9]" href="#">
                          Details
                        </a>
                        <a className="border-b-2 border-transparent py-3 px-1 text-sm text-gray-500 hover:border-gray-300" href="#">
                          Time Log
                        </a>
                        <a className="border-b-2 border-transparent py-3 px-1 text-sm text-gray-500 hover:border-gray-300" href="#">
                          History
                        </a>
                      </nav>
                    </div>

                    {/* Planning */}
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-800">Planning</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Story Points</label>
                          <p className="text-sm font-medium mt-1">8</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Priority</label>
                          <p className="text-sm font-medium mt-1">1 - High</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Severity</label>
                          <p className="text-sm font-medium mt-1">2 - Severe</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Effort (Hours)</label>
                          <p className="text-sm font-medium mt-1">16</p>
                        </div>
                      </div>
                    </div>

                    {/* Deployment */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h3 className="text-base font-semibold text-gray-800">Deployment</h3>

                      <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <span className="material-symbols-outlined text-green-600">check_circle</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Production</p>
                          <p className="text-xs text-gray-500">Deployed 2 days ago</p>
                        </div>
                      </div>
                    </div>

                    {/* Development */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h3 className="text-base font-semibold text-gray-800">Development</h3>
                      <a className="flex items-center gap-3 text-sm text-[#6D28D9] hover:underline" href="#">
                        <span className="material-symbols-outlined text-base">merge_type</span>
                        <span>Create a pull request</span>
                      </a>
                    </div>

                    {/* Related Work */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h3 className="text-base font-semibold text-gray-800">Related Work</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="material-symbols-outlined text-base text-gray-400">subdirectory_arrow_right</span>
                          <span className="text-gray-500">Parent:</span>
                          <a className="font-medium text-[#6D28D9] hover:underline" href="#">
                            USER STORY 1234 - Implement New Login Flow
                          </a>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
