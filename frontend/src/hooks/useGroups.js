import { useState, useEffect, useCallback } from 'react';
import { fetchGroups } from '../api/groupService';

const useGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize the loadGroups function to avoid recreating it on every render
    const loadGroups = useCallback(async () => {
        setLoading(true);
        setError(null); // Reset error state before making a new request
        try {
            const data = await fetchGroups();
            setGroups(data);
        } catch (err) {
            setError(err);
            console.error('Error fetching groups:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch groups on initial mount
    useEffect(() => {
        loadGroups();
    }, [loadGroups]); // Add loadGroups as a dependency to ensure it's stable

    return { groups, setGroups, loadGroups, loading, error, refreshGroups: loadGroups };
};

export default useGroups;