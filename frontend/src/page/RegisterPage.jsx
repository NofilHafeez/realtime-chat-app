import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
    const { fetchUser } = useContext(AuthContext); 
    const [credentials, setCredentials] = useState({name: "", email: "", password: "" });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";



    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, credentials, {
                withCredentials: true,
            });
    
            if (response.data.success) {
                setMessage({ type: "success", text: response.data.success[0] });
    
                await fetchUser(); // Wait for the user to be fetched
                navigate('/login-page');
            }
        } catch (error) {
            console.error("Error registering:", error);
    
            if (error.response?.data?.flash) {
                setMessage({ type: "error", text: error.response.data.flash[0] });
            } else {
                setMessage({ type: "error", text: "Something went wrong, please try again" });
            }
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen relative bg-[#ededed]">
            {/* Display flash message */}
            {message && (
                <div className={`absolute top-0 p-3 rounded mb-4 
                  ${message.type === "error" ? "bg-red-500" : "bg-green-500"} text-white`}>
                    {message.text}
                </div>
            )}

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={credentials.name}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg outline-none"
                    />
                    <button type="submit" className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
