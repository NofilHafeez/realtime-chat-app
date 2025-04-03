import React, { useState, useContext, useCallback } from "react";  
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, fetchUser } = useContext(AuthContext); // ✅ Use AuthContext
  const [message, setMessage] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";



  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials, {
        withCredentials: true, // Include cookies
      });

      if (response.data.success) {
        setMessage({ type: "success", text: response.data.success[0] });
        
        await fetchUser(); 

        navigate("/chat-page"); // Redirect after login
      }
      
    } catch (error) {
      console.error("Error Logging In:", error);
        setMessage({ type: "error", text: error.response?.data?.flash?.[0] || "Something went wrong" });
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ededed] relative">
      {/* Flash Message */}
      {message && (
        <div className={`absolute top-0 px-4 py-2 rounded text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {message.text}
        </div>
      )}

      <div className="w-[400px] bg-white shadow-lg rounded-2xl p-8 text-black">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <p className="text-center text-gray-500 mb-5">Enter your details to access your account</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" name="email" placeholder="Email" className="border border-gray-300 p-3 rounded-lg outline-none focus:border-black" value={credentials.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="border border-gray-300 p-3 rounded-lg outline-none focus:border-black" value={credentials.password} onChange={handleChange} required />

          <button type="submit" className="bg-black text-white py-3 rounded-lg hover:bg-gray-900">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          Don't have an account?{" "}
          <span className="text-black font-bold cursor-pointer" onClick={() => navigate("/register-page")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
