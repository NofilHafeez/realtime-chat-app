import { createContext, useState, useEffect, useCallback } from "react";
import { ClipLoader } from 'react-spinners';
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app/";


  // Function to fetch user data
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/get-user`, {
        withCredentials: true, 
      });

      setUser(data.user || null);
    } catch (error) {
      console.error("Failed to fetch user:", error.response?.data?.message || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Removed API_URL dependency (it won't change)

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // ✅ Added fetchUser to dependencies

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <ClipLoader color="#007bff" size={50} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
