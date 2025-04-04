import React, { useState, useCallback, useEffect } from "react";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";




const Files = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { id } = useParams();

  const fetchFiles = async () => {
    if (!id) return; // Prevent request if id is missing

    try {
      const res = await axios.get(`${API_URL}/api/file/get-files/${id}`, {
        withCredentials: true,
      }); 

      if (res.data.files) {
        setFiles(res.data.files);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  
    useEffect(() => {
      fetchFiles();
    }, []);
  
  // Handle file selection
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
  }, []);

  // Upload file to backend
  const uploadFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderId", id); 

    try {
      const res = await axios.post(`${API_URL}/api/file/upload-file`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedFileUrl = res.data.fileUrl;

      // Add the file to the files list
      const fileType = selectedFile.type.startsWith("image") ? "image" : "video";
      setFiles([...files, { id: files.length + 1, name: selectedFile.name, type: fileType, url: uploadedFileUrl }]);
      await fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  }, [selectedFile, files]);

  // Remove file from list
  const removeFile = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/api/file/delete-file`, {
        data: { fileId: id }, // Correct way to send data in DELETE request
        withCredentials: true,
      });
  
      if (res.status === 200) {
        setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
      }
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };
  

  return (
    <div className="w-full min-h-screen px-5 py-20 sm:px-20 bg-zinc-900">
      <a href="/my-folders" className="text-blue-500"><ArrowLeft size={17} className="inline-block mr-2 " />See Folders</a>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-white">My Files</h1>



        {/* Plus Button for Upload */}
        <label className="relative p-2 transition-all duration-300 rounded-lg cursor-pointer text-white hover:text-blue-400 hover:bg-zinc-700">
          <Plus size={20} />
          <input
            type="file"
            accept="image/*, video/*, .pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>
      
      {!files?.length && <p className="text-white mt-4">No Files..</p> }

      {/* File Preview Box (before uploading) */}
      {selectedFile && (
        <div className="p-2 bg-zinc-700 flex items-center gap-3 rounded-md">
          <p className="text-gray-300 truncate w-40">{selectedFile.name}</p>

          {/* Remove File Button */}
          <button onClick={() => setSelectedFile(null)} className="text-red-400 cursor-pointer">
            <Trash2 size={18} />
          </button>

          {/* Upload Button */}
          <button
            onClick={uploadFile}
            className="ml-auto px-4 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {/* Files Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {files.map((file, index) => (
          <a 
            key={index} 
            href={file.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative overflow-hidden bg-zinc-700 rounded-lg group  block"
          >
            {/* Remove Button */}
            <button
            className="absolute top-2 right-2 p-2 text-red-500 transition-all duration-300 bg-black rounded-full 
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:hover:bg-red-600"
            onClick={(e) => {
              e.preventDefault(); // Prevent opening the file when clicking the delete button
              removeFile(file._id);
            }}
          >
            <Trash2 size={18} />
            </button>

            {/* Display Image, Video, or PDF */}
            { file.fileUrl && file.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <img src={file.fileUrl} alt="file" className="object-cover w-full h-40 rounded-lg" />
            ) : file.fileUrl && file.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video controls className="object-cover w-full h-40 rounded-lg">
                <source src={file.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : file.fileUrl && file.fileUrl.match(/\.(pdf)$/i) ? (
              <span className="text-blue-400 underline">{file.name}</span>
            ) : (
              <p className="p-2 text-sm text-white">{file.name}</p>
            )}

            {/* File Name */}
            <div className="p-2 text-sm text-white text-center truncate">{file.name}</div>
          </a>
        ))}
      </div>


    </div>
  );
};

export default Files;
