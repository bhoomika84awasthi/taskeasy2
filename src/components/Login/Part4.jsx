import React from 'react'
import p4 from '../../assets/p4.jpeg'

// nothing to do with backend
export default function Part4() {
  return (
    <div className='w-full flex flex-col mt-12 gap-3 p-4 md:px-0 text-center'>
      <div className='text-3xl font-semibold text-gray-800'>
        Made for complex projects or everyday tasks
      </div>
      <div className='w-full flex mt-6 p-6'>
        <div className='w-full sm:w-[50%] flex flex-col gap-12 p-4'>
            <div className='flex flex-col gap-2 sm:text-left'>
                <span className='font-bold text-lg'> Plan and organize tasks</span>
                <span className='text-gray-500'>From short projects, to large cross-functional programs, Jira helps break big ideas down into achievable steps. Organize work, create milestones, map dependencies and more.</span>
            </div>
            <div className='flex flex-col gap-2 sm:text-left'>
                <span className='font-bold text-lg'> Plan and organize tasks</span>
                <span className='text-gray-500'>From short projects, to large cross-functional programs, Jira helps break big ideas down into achievable steps. Organize work, create milestones, map dependencies and more.</span>
            </div>
            <div className='flex flex-col gap-2 sm:text-left'>
                <span className='font-bold text-lg'>Track work your way</span>
                <span className='text-gray-500'>Visualize work with lists, boards, backlogs, and more. Make workflows for any process and integrate with tools you love.</span>
            </div>
            <div className='flex flex-col gap-2 sm:text-left'>
                <span className='font-bold text-lg'>Optimize with insights</span>
                <span className='text-gray-500'>Get visibility into project progress, understand risks, and surface insights from real-time data to help you improve team performance.</span>
            </div>
        </div>
        <div className='w-[50%] p-8 hidden  sm:flex justify-center items-center'>
            <img className='w-full rounded-2xl ' src={p4} alt="" />
        </div>
        
      </div>
    </div>
  )
}
