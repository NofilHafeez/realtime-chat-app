import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Chat from "./page/Chat";
import RegisterPage from "./page/RegisterPage";
import LoginPage from "./page/LoginPage";
import Header from "./components/Header";
import Folder from "./page/Folder"; 
import Files from "./page/Files"; 


const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-md">
      {location.pathname !== "/register-page" && location.pathname !== "/login-page" && <Header />}
      <Routes>
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/chat-page" element={<Chat />} />
        <Route path="/my-folders" element={<Folder />} />
        <Route path="/see-files/:id" element={<Files />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
