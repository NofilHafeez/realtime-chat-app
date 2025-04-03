import React, { useState, useEffect } from "react";
import { Plus, Pen, X, Check, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Folder = () => {
  const [newFolder, setNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [renameFolderId, setRenameFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";


  // Fetch folders
  const fetchFolders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/folder/get-folders`, { withCredentials: true });
      if (res.data.folders) setFolders(res.data.folders);
    } catch (error) {
      console.error("Something's wrong", error);
    }
  };

  // Create folder
  const createFolder = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/folder/create-folder`,
        { folderName },
        { withCredentials: true }
      );
      if (res.data.folder) {
        setNewFolder(false);
        fetchFolders();
        setFolderName("");
      }
    } catch (error) {
      console.error("Something's wrong", error);
    }
  };

  // Delete folder
  const deleteFolder = async (folderId) => {
    try {
      await axios.delete(`${API_URL}/api/folder/delete-folder/${folderId}`, { withCredentials: true });
      setFolders(folders.filter(folder => (folder._id !== folderId)));
    } catch (error) {
      console.error("Something's wrong", error);
    }
  };

  // Rename folder
  const renameFolder = async (folderId) => {
    if (!newFolderName.trim()) return; // Prevent empty names

    try {
      await axios.post(`${API_URL}/api/folder/rename-folder/${folderId}`, 
        { folderName: newFolderName }, 
        { withCredentials: true }
      );
      setRenameFolderId(null);
      fetchFolders(); // Refresh folder list
    } catch (error) {
      console.error("Something's wrong", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <div className="w-full min-h-screen px-5 py-20 sm:px-20 bg-zinc-900">
        <a href="/chat-page " className="text-blue-500"><ArrowLeft size={17} className="inline-block mr-2 " />Go to chat</a>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">My Folders</h1>
        <button
          onClick={() => setNewFolder((prev) => !prev)}
          className="p-2 transition-all duration-300 rounded-lg text-white hover:text-blue-400 hover:bg-zinc-700"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Folder List */}
      {!folders?.length && <p className="text-white mt-4">No folders..</p> }

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {folders.map((folder) => (
          <div
            key={folder._id}
            onClick={() => renameFolderId !== folder._id && navigate(`/see-files/${folder._id}`)}
            className="flex items-center justify-between w-full max-w-[400px] p-3 text-white bg-zinc-700 rounded-lg transition-all duration-300 hover:bg-zinc-600"
          >
            <div className="flex-1">
              {/* Folder Name */}
              {renameFolderId === folder._id ? (
                <input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-2 py-1 text-white bg-zinc-700 rounded-md outline-none"
                  autoFocus
                />
              ) : (
                <h1 className="text-sm font-medium">{folder.folderName}</h1>
              )}
            </div>

            <div className="flex gap-2">
              {/* Rename Actions */}
              {renameFolderId === folder._id ? (
                <>
                  <button onClick={() => renameFolder(folder._id)} className="text-green-400 cursor-pointer">
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setRenameFolderId(null)}
                    className="text-red-400 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameFolderId(folder._id);
                    setNewFolderName(folder.folderName); // Pre-fill with current name
                  }}
                  className="text-blue-500 cursor-pointer"
                >
                  <Pen size={16} />
                </button>
              )}
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigating when clicking delete
                  deleteFolder(folder._id);
                }}
                className="text-red-400 cursor-pointer hover:text-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Folder Input Field */}
        {newFolder && (
          <div className="flex items-center w-full max-w-[250px] justify-between p-3 bg-zinc-700 rounded-lg">
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="text-white w-full outline-none bg-transparent placeholder-gray-400"
              placeholder="Enter folder name..."
            />
            <button
              onClick={createFolder}
              disabled={!folderName.trim()}
              className={`cursor-pointer outline-none transition-all px-3 py-1 rounded-md ${
                folderName.trim() ? "text-yellow-400 hover:text-yellow-500" : "text-gray-500 cursor-not-allowed"
              }`}
            >
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Folder;
