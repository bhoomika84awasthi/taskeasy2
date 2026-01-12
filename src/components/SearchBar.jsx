import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none"
      />
      
      {/* Input Field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search resources, services, and docs (G+/)"
        className="w-full bg-[#1A88E1] placeholder-white/70 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none"
      />
    </div>
  );
}
