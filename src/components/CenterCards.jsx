import img3 from '../assets/card3.png'
import img2 from '../assets/card2.png'
import img1 from '../assets/card1.png'
import { useNavigate } from 'react-router-dom';

export default function CenterCards() {
  return (
    <div className="flex flex-col justify-center items-center px-4 md:px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">
        <Card
          img={img1}
          title="Start with a TaskEasy free trial"
          desc="Get $200 free credit toward TaskEasy products and services, plus 12 months of popular free services."
          btn1="Start"
        />

        <Card
          img={img2}
          title="Manage TaskEasy Entra ID"
          desc="Manage access, set smart policies, and enhance security with TaskEasy Entra ID."
          btn1="View"
          btn2="Learn more"
        />

        <Card
          img={img3}
          title="TaskEasy for Students"
          desc="Get free software, TaskEasy credit, or access TaskEasy Tools for Teaching after you verify your academic status."
          btn1="Start"
        />
      </div>
    </div>
  );
}

function Card({ img, title, desc, btn1, btn2 }) {
    const navigate = useNavigate()
  return (
    <div className="bg-white md:bg-[#F8F8F9] rounded-2xl md:rounded-3xl shadow-md p-6 md:p-10 text-center hover:shadow-xl transition-all duration-300">
      <img src={img} alt={title} className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5" />
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-500 mb-4 md:mb-6 text-[13px] md:text-sm">{desc}</p>
      <div className="flex justify-center gap-3">
        <button className="cursor-pointer bg-[#0078D4] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-500"
        onClick={() => navigate('/StartPage')}>
          {btn1}
        </button>
        {btn2 && (
          <button className="cursor-pointer text-[#0078D4] text-sm font-medium hover:underline">
            {btn2}
          </button>
        )}
      </div>
    </div>
  );
}