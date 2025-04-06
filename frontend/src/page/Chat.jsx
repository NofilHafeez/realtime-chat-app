import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { AuthContext } from "../context/AuthContext";
import { X, Menu, ArrowRight } from 'lucide-react';
import useGroups from '../hooks/useGroups';
import useMessages from '../hooks/useMessages';
import { createGroup, deleteGroup, joinGroup, leaveGroup, changeGroupName, removeMember } from '../api/groupService';
import { sendMessage } from '../api/messageService';
import socket from '../hooks/useSocket';
import GroupList from '../components/GroupList';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import ChatInput from '../components/ChatInput';
 // ✅ Make sure Chevron icons are imported


const Chat = () => {
    const [text, setText] = useState("");
    const [groupName, setGroupName] = useState("");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [showGroups, setShowGroups] = useState(false);
    const { user } = useContext(AuthContext);
    const { groups, setGroups, loadGroups, loading, error } = useGroups();
    const { messages, loadMessages, setMessages } = useMessages();

    // Load messages when a group is selected
    useEffect(() => {
        if (selectedGroup) {
            loadMessages(selectedGroup._id);
        }
    }, [selectedGroup?._id, loadMessages]);

    // Socket event listeners
    useEffect(() => {
        const handleMessage = (data) => {
            if (selectedGroup && selectedGroup._id === data.groupId) {
                setMessages((prev) => [...prev, data]);
            }
        };

        const handleJoinedGroup = ({ groupId, userId }) => {
            console.log(`User ${userId} joined group ${groupId}`);
            
        };
             
        socket.on("message", handleMessage);
        socket.on("joinedGroup", handleJoinedGroup);

        return () => {
            socket.off("message", handleMessage);
            socket.off("joinedGroup", handleJoinedGroup);

        };
    }, [selectedGroup, setMessages]);

    // Memoized function to select a group
    const selectGroup = useCallback((group) => {
        if (!group.isMember) return;
        socket.emit("joinGroup", { groupId: group._id, userId: user._id });
        setSelectedGroup(group);
    }, [user._id]);


    // Memoized function to emit a message
    const emitMessage = useCallback(async (message) => {
        if (!socket) {
            console.error('Socket is not initialized.');
            return;
        }

        try {
            socket.emit('sendMessage', message);
            setText('');
        } catch (error) {
            console.error('Error emitting message:', error);
        }
    }, []);

    // Memoized group list props to prevent unnecessary re-renders
    const groupListProps = useMemo(() => ({
        groups,
        setGroups,
        loading,
        selectedGroup,
        selectGroup,
        joinGroup,
        groupName,
        setGroupName,
        createGroup,
        showGroups,
        user,
        setShowGroups,
    }), [groups, loading, selectedGroup, groupName, showGroups, user]);

    // Memoized chat header props
    const chatHeaderProps = useMemo(() => ({
        selectedGroup,
        setSelectedGroup,
        isEditingName,
        setIsEditingName,
        newGroupName,
        setNewGroupName,
        changeGroupName,
        leaveGroup,
        user,
        setGroups,
        deleteGroup,
        removeMember,
    }), [selectedGroup, isEditingName, newGroupName, user]);

    // Memoized chat input props
    const chatInputProps = useMemo(() => ({
        text,
        setText,
        sendMessage,
        selectedGroup,
        user,
        emitMessage,
    }), [text, selectedGroup, user]);

    return (
        <>
        <div className='bg-black sm:p-20 flex min-h-screen w-full'>
           

            {/* Group list */}
            <GroupList {...groupListProps} />

            {/* Chat window */}
            <div className='bg-zinc-900 sm:ml-3 w-full sm:h-[450px] flex justify-between flex-col rounded-md'>
                {selectedGroup ? (
                    <>
                        <ChatHeader {...chatHeaderProps} />
                        <ChatMessages messages={messages} user={user} />
                        <ChatInput {...chatInputProps} />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-white">Select a group to chat</div>
                )}
            </div>
        </div>
        </>
    ); 
};

export default Chat;