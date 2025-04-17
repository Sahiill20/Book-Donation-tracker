import React, { useState } from "react";
import { Bell } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-sky-200 text-black px-6 py-8 flex justify-between items-center shadow relative ">
      <div className="text-xl font-bold">Bookbridge</div>
      
      <nav className="flex items-center space-x-6 text-md font-medium">
        <a href="/home" className="hover:underline">Home</a>
        <a href="/about" className="hover:underline">About Us</a>
        <a href="/contact" className="hover:underline">Contact Us</a>
        <Bell className="w-5 h-5 cursor-pointer" />

        {/* Profile Picture */}
        <div className="relative">
          <img
            src="/profile.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full border border-blue-400 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-blue-100"
              >
                Dashboard
              </a>
              <button
                onClick={() => alert("Logging out...")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
