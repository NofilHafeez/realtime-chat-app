import React, { useState, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { fetchGroups } from '../api/groupService';

const GroupList = ({ 
    groups, loading, selectedGroup, selectGroup, joinGroup, 
    groupName, setGroupName, createGroup, 
    showGroups, user, setGroups, 
}) => {
    const [newGroup, setNewGroup] = useState(false);
    const joinGroupState = useCallback(async (groupId, userId) => {
        try {
            const updatedGroup = await joinGroup(groupId, userId);
            setGroups(prevGroups => 
                prevGroups.map(group => 
                    group._id === groupId ? { ...group, isMember: true } : group
                )
            );
        } catch (error) {
            console.error('Error joining group:', error.message);
        }
    }, [joinGroup, setGroups]);

    const createGroupState = useCallback(async () => {
        if (!groupName.trim()) return;

        try {
            const createdGroup = await createGroup(groupName);
          // Fetch the updated group list after creation
          const updatedGroups = await fetchGroups(); 

          setGroups(updatedGroups); // Update state with fresh groups
          setGroupName("");  
          setNewGroup(false);
        } catch (error) {
            console.error('Error creating group:', error.message);
        }
    }, [groupName, createGroup, setGroups, setGroupName, setNewGroup]);

    return (
        <div
            className={`fixed sm:mt-0 mt-10 sm:relative sm:w-96 sm:h-[450px] bg-zinc-950 sm:bg-zinc-900 p-4 
                overflow-y-auto flex flex-col gap-3 rounded-md transition-transform duration-300 ease-in-out
                ${showGroups ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 z-40`}
        >
            {loading && (
                <div className='flex justify-center items-center'>
                    <ClipLoader color="#007bff" size={20} />
                </div>
            )}
            
            <div className='flex justify-between items-center'>
                <h1 className='text-white font-semibold'>- GROUPS</h1>
                <button
                    onClick={() => setNewGroup(!newGroup)}
                    className='text-white text-2xl hover:text-blue-400 transition-all'
                >
                    {newGroup ? <X /> : <Plus />}
                </button>
            </div>

            {groups.map((grp, index) => (
                <div
                    key={grp._id || `group-${index}`} 
                    onClick={() => selectGroup(grp)}
                    className={`w-full  flex justify-between items-center h-12 p-5 
                        bg-zinc-700 rounded-md cursor-pointer transition-all hover:bg-zinc-600
                        ${selectedGroup?._id === grp._id ? "bg-blue-600" : ""}`}
                >
                    <h1 className='text-white'>{grp.groupName}</h1>
                    {!grp.isMember && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                joinGroupState(grp._id, user._id);
                            }}
                            className='text-blue-400 outline-none cursor-pointer hover:text-blue-500 transition-all'
                        >
                            JOIN
                        </button>
                    )}
                </div>
            ))}

            {newGroup && (
                <div className='w-full flex mt-3 justify-between items-center h-12 p-5 bg-zinc-700 rounded-md'>
                    <input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className='text-white w-full outline-none bg-transparent placeholder-gray-400'
                        placeholder='Enter group name...'
                    />
                    <button 
                        onClick={createGroupState} 
                        disabled={!groupName.trim()}
                        className={`cursor-pointer outline-none transition-all px-3 py-1 rounded-md
                            ${groupName.trim() ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-500 cursor-not-allowed'}`}
                    >
                        Create
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupList;
