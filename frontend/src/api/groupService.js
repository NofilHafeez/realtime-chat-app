import axios from 'axios';
import socket from '../hooks/useSocket';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";


export const fetchGroups = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/group/all-groups`, {
            withCredentials: true,
        });
        return res.data.groupsWithMembership; // Return the fetched data
    } catch (error) {
        console.error('Something went wrong while fetching groups', error);
        throw error; // Throw the error for the caller to handle
    }
};
 
export const createGroup = async (groupName) => { // Add groupName as a parameter
    try {
        const res = await axios.post(`${API_URL}/api/group/create-group`, { groupName }, {
            withCredentials: true,
        });
        return res.data; // Return the created group data
    } catch (error) {
        console.error('Something went wrong while creating group', error);
        throw error; // Throw the error for the caller to handle
    }
};

export const deleteGroup = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/api/group/delete-group/${id}`, {
            withCredentials: true,
        });
        return res.data; // Return the deletion response
    } catch (error) {
        console.error('Something went wrong while deleting group', error);
        throw error; // Throw the error for the caller to handle
    }
};

export const joinGroup = async (id, userId) => {
    try {
        const res = await axios.post(`${API_URL}/api/group/join-group/${id}`, { userId }, {
            withCredentials: true,
        });

        if (res.data.success) {
            socket.emit('joinGroup', { groupId: id, userId }); // Emit socket event
        }

        return res.data; // Return the join response
    } catch (error) {
        console.error('Something went wrong while joining group', error);
        throw error; // Throw the error for the caller to handle
    }
};

export const leaveGroup = async (id, userId) => {
    try {
        const res = await axios.post(`${API_URL}/api/group/leave-group/${id}`, { userId }, {
            withCredentials: true,
        });
        return res.data; // Return the leave response
    } catch (error) {
        console.error('Something went wrong while leaving group', error);
        throw error; // Throw the error for the caller to handle
    }
};

export const changeGroupName = async (id, newGroupName) => { // Add newGroupName as a parameter
    if (!newGroupName.trim()) {
        console.error('New group name cannot be empty.');
        throw new Error('New group name cannot be empty.'); // Throw an error for invalid input
    }

    try {
        const res = await axios.put(`${API_URL}/api/group/rename-group/${id}`, 
            { newGroupName }, // Pass newGroupName
            { withCredentials: true }
        );
        return res.data; // Return the rename response
    } catch (error) {
        console.error('Something went wrong while renaming group', error.response?.data || error);
        throw error; // Throw the error for the caller to handle
    }
};

export const removeMember = async (groupId, removeUserId) => {
    try {
        const res = await axios.post(`${API_URL}/api/group/remove-member/${removeUserId}`, { groupId }, {
            withCredentials: true,
        });
        return res.data; // Return the leave response
    } catch (error) {
        console.error('Something went wrong while removing the member', error);
        throw error; // Throw the error for the caller to handle
    }
};