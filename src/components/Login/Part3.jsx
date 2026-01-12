import React from 'react'

// nothing to do with backend
export default function Part3() {
  return (
    <div className='mt-10 sm:mt-24 sm:px-16 items-center justify-center p-4'>
      <div className='w-full grid grid-cols-2 gap-4 sm:flex'>
        <div className='bg-gray-100 sm:w-[140rem] p-4 rounded-md flex flex-col gap-2 '>
            <span>PRODUCT AND ISSUE TRACKING</span>
            <span className='text-black font-bold'>Software Development</span>
        </div>
        <div className='bg-gray-100 sm:w-[140rem] p-4 rounded-md flex flex-col gap-2'>
            <span>PLAN AND LAUNCH CAMPAIGNS</span>
            <span className='text-black font-bold'>Marketing</span>
        </div>
        <div className='bg-gray-100 sm:w-[140rem] p-4 rounded-md flex flex-col gap-2'>
            <span>PLAN AND TRACK PROJECTS</span>
            <span className='text-black font-bold'>IT Support Services</span>
        </div>
        <div className='bg-gray-100 sm:w-[140rem] p-4 rounded-md flex flex-col gap-2'>
            <span>BUILD CREATIVE WORKFLOW</span>
            <span className='text-black font-bold'>Design</span>
        </div>
        <div className='bg-gray-100 sm:w-[140rem] p-4 rounded-md flex flex-col gap-2'>
            <span>CREATE INTAKE PROCESS</span>
            <span className='text-black font-bold'>Operations</span>
        </div>
      </div>
    </div>
  )
}
