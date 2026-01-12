import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.toLowerCase().includes(path.toLowerCase());

  const menuItems = [
    {
      category: "OVERVIEW",
      items: [
        { id: "summary", label: "Summary", icon: "summary", path: "/summary" },
        { id: "dashboards", label: "Dashboards", icon: "dashboards", path: "/Dashboard" },
        { id: "wiki", label: "Wiki", icon: "wiki", path: "/Wiki" },
      ],
    },
    {
      category: "",
      items: [
        { id: "boards", label: "Boards", icon: "boards", path: "/Board" },
        { id: "pipelines", label: "Pipelines", icon: "pipelines", path: "/pipelines" },
        { id: "artifacts", label: "Artifacts", icon: "artifacts", path: "/library" },
      ],
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const renderIcon = (name, active) => {
    const commonProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" };
    switch (name) {
      case "summary":
        return (
          <svg {...commonProps}>
            <rect x="3" y="4" width="4" height="16" rx="1" fill="currentColor" />
            <rect x="9" y="8" width="4" height="12" rx="1" fill="currentColor" />
            <rect x="15" y="2" width="4" height="18" rx="1" fill="currentColor" />
          </svg>
        );
      case "dashboards":
        return (
          <svg {...commonProps}>
            <rect x="3" y="3" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="15" y="3" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="3" y="15" width="6" height="6" rx="1" fill="currentColor" />
            <rect x="15" y="15" width="6" height="6" rx="1" fill="currentColor" />
          </svg>
        );
      case "wiki":
        return (
          <svg {...commonProps}>
            <path d="M6 2h9a2 2 0 0 1 2 2v16l-7-3-7 3V4a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case "boards":
        return (
          <svg {...commonProps}>
            <rect x="3" y="3" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="15" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case "pipelines":
        return (
          <svg {...commonProps}>
            <path d="M3 12h6l3 6 6-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );
      case "artifacts":
        return (
          <svg {...commonProps}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed left-0 w-64 bg-white border-r border-[#f0f2f4] shadow-sm overflow-y-auto"
      style={{ top: "64px", height: "calc(100vh - 64px)" }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#6b46c1] text-white font-semibold text-lg">P</div>
          <h2 className="text-sm font-semibold text-[#111418]">ProdigiSign</h2>
        </div>
      </div>

      <nav className="px-3 py-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {section.category ? (
              <h3 className="px-3 mb-3 text-xs font-semibold text-[#7b8794] uppercase tracking-wider">{section.category}</h3>
            ) : null}

            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const active = isActive(item.path);

                return (
                  <button key={itemIdx} onClick={() => handleNavigate(item.path)} className="w-full">
                    <div className={`relative flex items-center gap-3 text-sm transition-all ${active ? 'bg-[#efefef] rounded-lg' : 'hover:bg-[#fafafa] rounded-md'}`}>
                      {active && <span className="absolute left-0 top-1 bottom-1 w-1.5 bg-black rounded-l-md"></span>}
                      <div className={`pl-4 pr-3 py-2 flex items-center gap-3 w-full ${active ? 'pl-6' : ''}`}>
                        <span className={`w-9 h-9 flex items-center justify-center rounded-md flex-shrink-0 ${active ? 'text-[#111418]' : 'text-[#111418]'}`}>
                          <span style={{ color: active ? '#111418' : '#111418' }}>{renderIcon(item.icon, active)}</span>
                        </span>
                        <span className="ml-1 text-[#111418]">{item.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
