import React, { useCallback, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";



const ChatInput = ({ text, setText, sendMessage, selectedGroup, user, emitMessage }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No file');
    const [isUploading, setIsUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState('');

    // Handle file selection and preview
    const handleFileChange = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFile(file);
        setFileName(file.name);

        // Generate a preview URL
        const previewUrl = URL.createObjectURL(file);
        setFileUrl(previewUrl);
    }, []);

    // Handle file upload
    const uploadFile = useCallback(async () => {
        if (!file) return null;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${API_URL}/api/file/upload-file`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('File uploaded successfully:', res.data);
            setFileUrl(res.data.fileUrl);
            return res.data.fileUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [file]);

    // Handle sending message (text or file)
    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (!text.trim() && !file) return;

        let uploadedFileUrl = file ? await uploadFile() : '';

        sendMessage(selectedGroup._id, text.trim(), uploadedFileUrl, user._id, emitMessage, user.name);
        
        // Reset input fields after sending
        setText("");
        setFile(null);
        setFileName('No file');
        setFileUrl('');
    };

    const removeFile = () => {
        setFile(null);
        setFileUrl('');
        setFileName('No file');
    };

    return (
    <>
        {/* Fixed Bottom Bar for Mobile */}
        <div className="sm:relative sticky bottom-0 left-0 w-full bg-[#ededed] z-50">
            {/* File Preview */}
            {file && (
                <div className="p-2 bg-zinc-700 flex items-center gap-3">
                    {file.type.startsWith("image/") ? (
                        <img src={fileUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                    ) : file.type.startsWith("video/") ? (
                        <video className="h-20 w-20 rounded-md" controls>
                            <source src={fileUrl} type={file.type} />
                            Your browser does not support video playback.
                        </video>
                    ) : file.type.endsWith(".pdf") ? (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                            {fileName}
                        </a>
                    ) : (
                        <p className="text-gray-300">{fileName}</p>
                    )}
                    <button onClick={removeFile} className="text-red-400 cursor-pointer">
                        <X />
                    </button>
                </div>
            )}

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex w-full border-t border-zinc-300">
                <input
                    id='TypeMsg'
                    className="flex-1 outline-none p-3 bg-zinc-100"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept=".jpg, .png, .mp4, .pdf"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="fileInput"
                    className="px-4 flex items-center bg-zinc-700 text-white cursor-pointer hover:bg-zinc-600"
                >
                    <Paperclip size={20} />
                </label>
                <button
                    type="submit"
                    disabled={(text.trim().length === 0 && !file) || isUploading}
                    className={`sm:px-5 px-2 text-white transition-all 
                        ${(text.trim().length > 0 || file)
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {isUploading ? '...' : 'Send'}
                </button>
            </form>
        </div>

        {/* Spacer for bottom on mobile to avoid overlapping content */}
        
    </>
);

};

export default ChatInput;
