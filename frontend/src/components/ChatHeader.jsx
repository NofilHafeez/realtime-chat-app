import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Users, Pen, Check, UserRoundMinus, LogOut, X  } from 'lucide-react';


const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://confused-loraine-nofil-apps-6f553274.koyeb.app";



const ChatHeader = ({
    selectedGroup, isEditingName, setIsEditingName,
    newGroupName, setNewGroupName, changeGroupName,
    leaveGroup, deleteGroup, user, setGroups, setSelectedGroup, removeMember
}) => {
    const [seeMember, setSeeMember] = useState(false);
    const [members, setMembers] = useState([]);

    // Memoized function to leave a group
    const leaveGroupState = useCallback(async (groupId, userId) => {
        if (!window.confirm("Are you sure you want to leave this group?")) return;

        try {
            await leaveGroup(groupId, userId);
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group._id === groupId ? { ...group, isMember: false } : group
                )
            );
            setSelectedGroup(null); // Reset selected group after leaving
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    }, [leaveGroup, setGroups, setSelectedGroup]);

    // Memoized function to delete a group
    const deleteGroupState = useCallback(async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;

        try {
            await deleteGroup(groupId);
            setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId)); // Remove deleted group
            setSelectedGroup(null); // Reset selected group after deletion
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    }, [deleteGroup, setGroups, setSelectedGroup]);

    // Memoized function to change group name
    const changeGroupNameState = useCallback(async (groupId, newGroupName) => {
        if (!newGroupName.trim()) {
            alert("Group name cannot be empty!");
            return;
        }

        try {
            await changeGroupName(groupId, newGroupName);
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group._id === groupId ? { ...group, groupName: newGroupName } : group
                )
            );
            setSelectedGroup(prevSelectedGroup =>
                prevSelectedGroup?._id === groupId ? { ...prevSelectedGroup, groupName: newGroupName } : prevSelectedGroup
            );
            setIsEditingName(false);
        } catch (error) {
            console.error('Error changing group name:', error);
        }
    }, [changeGroupName, setGroups, setSelectedGroup, setIsEditingName]);

    // Memoized function to fetch members
    const fetchMembers = useCallback(async (groupId) => {
        try {
            const res = await axios.get(`${API_URL}/api/group/get-members/${groupId}`, {
                withCredentials: true,
            });

            if (res.data.members) {
                setMembers(res.data.members);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }, [selectedGroup?.admin]);

    // Memoized function to remove a member
    const removeMemberState = useCallback(async (groupId, removeUserId) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;

        try {
            await removeMember(groupId, removeUserId);
            setMembers(prevMembers => prevMembers.filter(member => member._id !== removeUserId));
        } catch (error) {
            console.error('Error removing member:', error);
        }
    }, [removeMember]);

    // Fetch members when "See Members" is clicked
    useEffect(() => {
        if (seeMember && selectedGroup) {
            fetchMembers(selectedGroup._id);
        }
    }, [seeMember, selectedGroup, fetchMembers]);

    return (
        <div className='w-full sticky mt-12 sm:top-0 top-0 sm:relative h-14 flex  sm:mt-0 sm:rounded-md items-center justify-between px-5 bg-zinc-800'>
            <div className='flex gap-3'>
                {isEditingName ? (
                    <input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="text-white bg-zinc-700 px-2 py-1 rounded-md outline-none"
                    />
                ) : (
                    <h2 className="text-white">{selectedGroup?.groupName}</h2>
                )}
               <div className='flex gap-2'>
                    {isEditingName ? (
                        <>
                            <button 
                                onClick={() => changeGroupNameState(selectedGroup._id, newGroupName)} 
                                className="text-green-400 cursor-pointer"
                            >
                                <Check size={20} />
                            </button>
                            <button 
                                onClick={() => {
                                    setIsEditingName(false); // Exit edit mode
                                    setNewGroupName(selectedGroup.groupName); // Reset input value
                                }} 
                                className="text-red-400 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditingName(true)} 
                            className="text-blue-500 cursor-pointer"
                        >
                            <Pen size={16} />
                        </button>
                    )}
                </div>

            </div>
            <div className='flex gap-3'>
                <button onClick={() => setSeeMember(prev => !prev)} className="text-purple-500 cursor-pointer relative mr-3">
                <Users size={20} />
                </button>
                {seeMember && (
                    <div className='bg-zinc-700 p-3 w-[300px] h-[350px] right-0 top-15 sm:right-[150px] sm:top-11 rounded-lg absolute'>
                        <h1 className='text-white'>Group Members</h1>
                        <div className='mt-3 flex gap-2 overflow-y-auto mb-3 flex-col w-full h-full'>
                        {members.map((member) => (
                            <div key={member._id}>
                                {member._id === selectedGroup.admin ? (
                                    <div className='flex w-full items-start justify-between'>
                                        <h1 className='text-white text-sm'>{member.name}</h1> 
                                        <h1 className='text-sm text-blue-400'>Admin</h1>   
                                    </div>
                                ) : (
                                    <div className='flex w-full items-start justify-between'>
                                        <h1 className='text-white text-sm'>{member.name}</h1> 
                                        <button 
                                            onClick={() => removeMemberState(selectedGroup._id, member._id)} 
                                            className="text-red-500">
                                            <UserRoundMinus size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        </div>
                    </div>
                )}
                <button onClick={() => leaveGroupState(selectedGroup._id, user._id)} className="text-red-500 mr-3">
                <LogOut size={20} />
                </button>
                <button onClick={() => deleteGroupState(selectedGroup._id)} className="text-red-500">
                <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;