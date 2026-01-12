import React from "react";
import LoginForm from "./LoginForm";

// nothing to do with backend
export default function Part2() {
  return (
    <div className="sm:mt-4 flex justify-center sm:px-6">
      <div className="flex flex-col sm:flex-row items-center p-4">
        <div className=" flex flex-col gap-8 mb-8 sm:mb-0 sm:mr-8 text-center sm:text-left w-full sm:w-[60%] px-6">
          <div className="text-3xl sm:text-6xl font-bold  ">
            Start Your Project Management Journey
          </div>
          <span className="text-gray-500 font-semibold">
            Taskeasy is a task management tool for individuals with the feature
            of Dividing Goals into Tasks to achieve within time.
          </span>
        </div>
        <div className="w-full sm:w-[40%] flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
