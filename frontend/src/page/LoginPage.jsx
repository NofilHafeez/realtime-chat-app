import React, { useState, useContext, useCallback } from "react";  
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, fetchUser } = useContext(AuthContext); // ✅ Use AuthContext
  const [message, setMessage] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);  // To handle loading state
  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials, {
        withCredentials: true, // Include cookies
      });

      if (response.data.success) {
        setMessage({ type: "success", text: response.data.success[0] });
        
        // Await the fetchUser function to ensure data is fetched before redirect
        await fetchUser(); 

        navigate("/chat-page"); // Redirect after login and data fetch
      }
      
    } catch (error) {
      console.error("Error Logging In:", error);
      setMessage({ type: "error", text: error.response?.data?.flash?.[0] || "Something went wrong" });
    } finally {
      setLoading(false); // End loading state
    }
  }); 

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ededed] relative">
      {/* Flash Message */}
      {message && (
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {message.text}
        </div>
      )}

      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-8 text-black">
        <h2 className="text-3xl font-semibold mb-4 text-center">Login</h2>
        <p className="text-center text-gray-500 mb-6">Enter your details to access your account</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-black transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <span
            className="text-black font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register-page")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
