import React, { useState, useContext } from "react";
import axios from "axios";  
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { VscAccount } from "react-icons/vsc";
import { ArrowRight } from "lucide-react";




const profilePlaceholder = "https://via.placeholder.com/40"; // ✅ Placeholder Image

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";


  
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/"); // ✅ Fixed Path
    } catch (error) {
      console.error("Error Logging Out:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="fixed top-0 left-0 w-full bg-zinc-900 text-white z-50 flex justify-between items-center h-12 px-5 shadow-md">
        {/* Logo & Name */}
        <div className="ml-10 flex items-center font-bold text-lg">
          <img className="w-10 h-10 mt-1 " src="../chat-icon1.png" alt="icon" />
          <Link to="/chat-page">DoSimple</Link>
        </div>
  
        {/* Right Side Icons */}
        <div className="flex gap-7 text-xl relative">
          <div
            className="relative flex items-center"
           
          >
            <VscAccount onClick={() => setIsOpen(!isOpen)} className="hover:text-gray-500 cursor-pointer" />
            {isOpen && (
              <div className="absolute right-0 top-8 w-56 bg-zinc-800 shadow-lg rounded-lg p-4 z-50">
                <div className="flex flex-col items-center">
                  <p className="mt-2 text-md font-semibold">{user ? user.name : "Guest"}</p>
                </div>
                <div className="w-full flex flex-col gap-1 mt-5 text-sm">
                  <Link className="text-blue-500 flex" to="/my-folders">
                    <ArrowRight size={18} className="inline-block" /> My Folders
                  </Link>
                  <Link to="/chat-page" className="text-blue-500 flex">
                    <ArrowRight size={18} className="inline-block" /> Chat Page
                  </Link>
                </div>
                <div className="mt-4">
                  {!user ? (
                    <Link
                      to="/register-page"
                      className="block text-sm bg-blue-500 text-white text-center py-2 rounded-md mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white py-2 rounded-md text-sm"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Header;
