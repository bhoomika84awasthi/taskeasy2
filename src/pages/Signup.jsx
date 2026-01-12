import React, { useState } from 'react'
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react'
import RegisterForm from '../components/RegisterForm';

export default function Signup() {

    const [open, isOpen] = useState(false);
  return (
    <div className=''>
      <nav className="flex items-center gap-2 p-4 border-b border-gray-300 justify-between w-full">
        <div className="flex items-center gap-3 p-2 px-4">
          <LayoutGrid color="#0078D4" />
          <span className="font-semibold text-lg">TaskEasy.in</span>
        </div>
        {/* Visible on Desktop */}
        <div className="hidden sm:flex gap-6 p-2 px-4 text-gray-700 font-medium">
          <div className="cursor-pointer hover:text-black">Features</div>
          <div className="cursor-pointer hover:text-black">Pricing</div>
          <div className="cursor-pointer hover:text-black">Contact</div>
        </div>

        <div className="flex sm:hidden">
          {open ? (
            <>
              <ChevronUp onClick={() => isOpen(false)} />
            </>
          ) : (
            <>
              {" "}
              <ChevronDown onClick={() => isOpen(true)} />
            </>
          )}
        </div>
        {/* Visible only on Mobile */}
        {open && (
          <div className="absolute top-[76px] right-0 left-auto w-60 bg-white border border-gray-300 flex flex-col gap-4 p-4 text-gray-700 font-medium sm:hidden shadow-md">
            <div className="cursor-pointer hover:text-black">Features</div>
            <div className="cursor-pointer hover:text-black">Pricing</div>
            <div className="cursor-pointer hover:text-black">Contact</div>
          </div>
        )}
      </nav>
      <RegisterForm />
    </div>
  )
}
