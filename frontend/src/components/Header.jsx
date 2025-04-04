import React, { useState, useContext } from "react";
import axios from "axios";  
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { VscAccount } from "react-icons/vsc";

const profilePlaceholder = "https://via.placeholder.com/40"; // ✅ Placeholder Image

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";


  
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/login-page"); // ✅ Fixed Path
    } catch (error) {
      console.error("Error Logging Out:", error);
    }
  };

  return (
    <div>
      <div className="bg-zinc-900 sm:fixed fixed top-0 left-0 text-white z-40 flex w-full justify-between items-center h-10 px-5 shadow-md">
        <div className="ml-10 flex items-center  font-bold text-lg">
          <img className="w-13 mt-1 h-13" src="../chat-icon1.png" alt="icon" />
          <Link to="/">DoSimple</Link>
        </div>

        {/* Icons */}
        <div className="flex gap-7 text-xl relative">
          {/* Profile Icon with Hover Menu */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <VscAccount className="hover:text-gray-500 cursor-pointer" />
            {isOpen && (
              <div className="absolute right-2 top-2 mt-2 w-56 bg-zinc-800 shadow-lg rounded-lg p-4 z-50">
                <div className="flex flex-col items-center">
                  <p className="mt-2 text-md font-semibold">{user ? user.name : "Guest"}</p>
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
