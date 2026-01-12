import { Home, Cloud, FileText, Receipt, HelpCircle } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around py-2 md:hidden z-50">
      <NavItem icon={<Home size={20} />} label="Home" active />
      <NavItem icon={<Cloud size={20} />} label="Services" />
      <NavItem icon={<FileText size={20} />} label="Resources" />
      <NavItem icon={<Receipt size={20} />} label="Billing" />
      <NavItem icon={<HelpCircle size={20} />} label="Support" />
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        active ? "text-[#0078D4]" : "text-gray-500"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  );
}
