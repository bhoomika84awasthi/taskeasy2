import React from 'react'
import cdic from '../../assets/cdic.png'

export default function Part5() {
  return (
    <div className='hidden sm:flex flex-col bg-[#007ed3] rounded-xl m-8 mx-6 justify-center text-center'>
      <div className='flex flex-col justify-center items-center text-white p-8 gap-4 text-center'>
        <span className='text-4xl font-semibold'>CI/CD pipeline</span>
        <span className='text-lg p-4'>Automate your software delivery process from code commit to deployment, ensuring faster and more reliable releases.</span>
        <button className='bg-white text-lg text-[#007ed3] cursor-pointer p-4 border hover:bg-gray-200 rounded-lg w-[250px]'>Explore CI/CD pipeline</button>
      </div>
      <div><img src={cdic} alt="" /></div>
    </div>
  )
}
