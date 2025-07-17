import React, {useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import { useLocation } from "react-router-dom";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { logoutUser } = useAuth();
  const location = useLocation();


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        const uid = storedUser?.uid; // firebase user id
        
        if (!uid) {
        console.error("No userId found in localStorage");
        return;
        }
        const res = await axios.get(`http://localhost:3000/api/notifications?donorId=${uid}`);

        setNotificationCount(res.data.length); // only pending ones are fetched in backend
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
  
    fetchNotifications();
  }, []);

  // it is used to logout the user and get redirect to the sign in page
  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/Login";
  };

  // it is used to hide the header on the login and signup page
  const hideHeaderOn = ["/Login", "/SignUp"];
  const shouldHideHeader = hideHeaderOn.includes(location.pathname);

  if (shouldHideHeader) return null;
  return (
    <header className=" bg-sky-200 text-black px-6 py-8 flex justify-between items-center">
      <a href="/home" className="text-xl font-bold">Bookbridge</a>
      
      <nav className="flex items-center space-x-6 text-md font-medium">
        <a href="/home" className="hover:underline">Home</a>
        <a href="/about" className="hover:underline">About Us</a>
        <a href="/contact" className="hover:underline">Contact Us</a>
        <a href="/notifications" className="relative">
          <Bell className="w-5 h-5 cursor-pointer" />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </a>

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
                onClick={handleLogout}
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