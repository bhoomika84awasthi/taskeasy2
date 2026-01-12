import React from 'react'
import CdivNav from '../components/Cdic/CdivNav'
import CdicLeft from '../components/Cdic/CdicLeft'
import CdicCenter from '../components/Cdic/CdicCenter'

export default function CdicPipeline() {
  return (
    <div>
      <CdivNav />
      <div className='flex w-full'>
        <div className='w-[20%] bg-gray-100'>
            <CdicLeft/>
        </div>
         <div className='w-[80%]'>
            <div className='flex gap-6'>
                <CdicCenter />
            </div>
        </div>
      </div>
      <div className='border-t border-gray-300 flex justify-end p-4 text-sm gap-6 mx-4 text-gray-500'>
        <div>Live Agents : 5</div>
        <div>Queue Length : 4</div>
        <div>last Updated : Just now</div>
      </div>
    </div>
  )
}
