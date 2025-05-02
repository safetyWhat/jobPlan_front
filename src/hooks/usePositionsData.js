import React, { useEffect, useState } from 'react';
import axios from 'axios';

const usePositionsData = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/positions`);
            setPositions(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching positions:', err);
            setError('Failed to load positions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    return { positions, loading, error, fetchPositions };
};

export default usePositionsData;