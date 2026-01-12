import React from "react";

export default function Welcome() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col mt-8 gap-3 px-4 md:px-0">
        <div className="flex justify-center font-[Times_New_Roman] text-[28px] md:text-[36px] font-semibold text-center">
          Welcome to TaskEasy!
        </div>
        <div className="flex justify-center text-[#737373] text-sm md:text-base text-center">
          Don’t have a subscription? Check out the following options.
        </div>
      </div>
    </div>
  );
}

