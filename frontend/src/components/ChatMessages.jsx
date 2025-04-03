import React, { useRef, useEffect } from 'react';

const ChatMessages = ({ messages, user }) => {
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div 
            ref={chatContainerRef} 
            className='w-full mt-24 mb-15 sm:mt-0 sm:mb-0 scroll-smooth p-5 flex gap-2 flex-col overflow-y-auto h-full'
        >
            {Array.isArray(messages) && messages.map((msg, index) => {
                const isUserMessage = msg.senderId?._id === user._id;

                // Format timestamp outside of hooks
                const formattedTimestamp = new Date(msg.createdAt || Date.now()).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                return (
                    <div 
                        key={msg._id || index} 
                        className={`px-4 py-2 rounded-2xl max-w-sm w-fit 
                            ${isUserMessage ? "bg-blue-500 self-end text-white" : "bg-zinc-700 self-start text-white"}`}
                    >
                        <h1 className='text-zinc-900 text-[13px]'>~{msg.senderId?.name || "Unknown"}</h1>
            
                        {msg.file ? (
                            msg.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                // 📷 Image Preview
                                <img className="h-auto w-full mt-2 rounded-lg" src={msg.file} alt="Uploaded image" />
                            ) : msg.file.match(/\.(mp4|webm|ogg)$/i) ? (
                                // 🎥 Video Preview
                                <video controls className="h-auto w-full mt-2 rounded-lg">
                                    <source src={msg.file} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : msg.file.match(/\.(pdf)$/i) ? (
                                // 📄 PDF Preview (Downloadable Link)
                                <a 
                                    href={msg.file} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-400 underline"
                                >
                                    View PDF
                                </a>
                            ) : (
                                // 📝 Fallback for Other File Types
                                <p className="text-gray-300">Unsupported file type</p>
                            )
                        ) : (
                            // 📝 Text Message
                            <h1 className="break-words">{msg.text}</h1>
                        )}


                        <h1 className='mt-5 text-zinc-200 text-[10px]' style={{ fontFamily: 'Arial' }}>
                            {formattedTimestamp}
                        </h1>
                    </div>
                );
            })}
        </div>
    );
};

export default ChatMessages;
