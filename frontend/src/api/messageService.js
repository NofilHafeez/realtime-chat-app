import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

/**
 * Sends a message to a group.
 * @param {string} groupId - The ID of the group.
 * @param {string} text - The message text.
 * @param {string} senderId - The ID of the sender.
 * @param {Function} emitMessage - Function to emit the message via socket.
 * @param {string} senderName - The name of the sender.
 * @returns {Promise<Object>} - The response data from the API.
 */
export const sendMessage = async (groupId, text, fileUrl,senderId, emitMessage, senderName) => {
    try {
        const message = {
            groupId,
            senderId: {
                _id: senderId,
                name: senderName,
            },
            text,
            file: fileUrl,
            createdAt: new Date().toLocaleString("en-US", {
                month: "short", // "Oct"
                day: "numeric", // "15"
                year: "numeric", // "2023"
                hour: "2-digit", // "04"
                minute: "2-digit", // "45"
                hour12: true, // Use AM/PM
            }),
        };

        console.log(message.text);

        const res = await axios.post(`${API_URL}/api/message/send-message/${groupId}`, 
            message,
            { withCredentials: true }
        );

        if (res.data) {
            emitMessage(message); // Emit the message via socket
        }

        return res.data; // Return the response data
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error);
        throw error; // Throw the error for the caller to handle
    }
};

/**
 * Fetches messages for a group.
 * @param {string} groupId - The ID of the group.
 * @returns {Promise<Array>} - The list of messages.
 */
export const fetchMessages = async (groupId) => {
    if (!groupId) {
        throw new Error('Group ID is required.');
    }

    try {
        const res = await axios.get(`${API_URL}/api/message/group-messages/${groupId}`, {
            withCredentials: true,
        });
        return res.data.messages || []; // Return the messages (or an empty array if none)
    } catch (error) {
        console.error('Error fetching messages:', error.response?.data || error);
        throw error; // Throw the error for the caller to handle
    }
};