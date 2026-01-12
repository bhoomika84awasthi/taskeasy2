import { MenuIcon } from 'lucide-react'
import React from 'react'

export default function ProjectNavbar() {
  return (
    <div>
      <div className='bg-[#0078D4] h-[60px] flex justify-between p-4'>
        <div className='flex sm:hidden'><MenuIcon color='white'/></div>
        <div className='flex items-center font-semibold text-xl text-white'>TaskEasy</div>
        <div className='hidden sm:flex items-center text-white'>
            //Todo : Search bar / profile etc
        </div>
      </div>
    </div>
  )
}
