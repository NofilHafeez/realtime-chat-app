import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
    const { fetchUser } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);  // To handle loading state
    const navigate = useNavigate();
    const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading state
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, credentials, {
                withCredentials: true,
            });

            if (response.data.success) {
                setMessage({ type: "success", text: response.data.success[0] });

                await fetchUser();  // Wait for the user to be fetched
                navigate('/');  // Navigate to home or login page
            }
        } catch (error) {
            console.error("Error registering:", error);

            if (error.response?.data?.flash) {
                setMessage({ type: "error", text: error.response.data.flash[0] });
            } else {
                setMessage({ type: "error", text: "Something went wrong, please try again" });
            }
        } finally {
            setLoading(false);  // End loading state
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#ededed] relative">
            {/* Display flash message */}
            {message && (
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 p-3 rounded mb-4 
                  ${message.type === "error" ? "bg-red-500" : "bg-green-500"} text-white`}>
                    {message.text}
                </div>
            )}

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-semibold text-center mb-6">Create an Account</h1>

                <form onSubmit={handleRegister} className="flex flex-col gap-6">
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={credentials.name}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-zinc-800 transition"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-5">
                    Already have an account?{" "}
                    <span
                        className="text-black font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate("/login-page")}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
