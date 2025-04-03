import { useState, useEffect, useCallback } from 'react';
import { fetchMessages } from '../api/messageService';

const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize the loadMessages function to avoid recreating it on every render
    const loadMessages = useCallback(async (id) => {
        if (!id) return; // Early return if no ID is provided
        setLoading(true);
        setError(null); // Reset error state before making a new request
        try {
            const data = await fetchMessages(id);
            setMessages(data);
        } catch (err) {
            setError(err);
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // No need to call loadMessages in useEffect here since it's meant to be called manually
    // (e.g., when a group is selected)

    return { messages, setMessages, loading, error, loadMessages };
};

export default useMessages;