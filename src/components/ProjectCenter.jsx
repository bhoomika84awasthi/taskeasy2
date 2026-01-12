import React from 'react'
import Center2 from './Center2'

export default function ProjectCenter() {
  return (
    <div>
      <div className='p-8 flex flex-col gap-6'>
        <div className='text-[32px] font-semibold'>Get Started</div>
        <span className='text-gray-400 text-lg'>Welcome to your cloud platform. Follow these steps to get started with your project.</span>
      </div>
      <div className='border border-gray-300 rounded-xl p-4 m-6 bg-gray-200/30 flex flex-col gap-12 p-8'>
        <div className='flex flex-col gap-4'>
            <div className='text-xl font-semibold'>Navigating the Portal</div>
            <span className='text-gray-500'>Learn how to find your way around the platform and access key features.</span>
        </div>
        <div className='flex flex-col gap-4'>
            <div className='text-xl font-semibold'>Starting your Project</div>
            <span className='text-gray-500'>Create your first project and set up your team.</span>
        </div>
        <div className='flex flex-col gap-4'>
            <div className='text-xl font-semibold'>Pricing and Management</div>
            <span className='text-gray-500'>Understand billing, resource management, and cost optimization.</span>
        </div>
        <div className='flex flex-col gap-4'>
            <div className='text-xl font-semibold'>Complete</div>
            <span className='text-gray-500'>You're all set! Explore advanced features and integrations.</span>
        </div>
        <div className='bg-[#1A73E8] w-[100px] h-[50px] rounded-lg flex justify-center items-center text-white  cursor-pointer'>
            Start
        </div>
      </div>
      <Center2/>
    </div>
  )
}
