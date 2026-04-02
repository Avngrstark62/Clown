/**
 * useUserData Hook
 * Fetches user data with Redux caching
 * Prevents redundant API calls within TTL
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../api/api';
import { setUserData, selectUserData } from '../redux/dataSlice';
import { CONFIG } from '../constants';

export const useUserData = (username) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check cache first
  const cachedData = useSelector((state) =>
    selectUserData(state, username, CONFIG.CACHE_TTL.USER_DATA)
  );
  
  const data = useSelector((state) => state.data.userData[username]);

  useEffect(() => {
    if (!username) return;

    // If cache is valid, don't fetch
    if (cachedData) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUserData(username);
        dispatch(setUserData({
          username,
          data: response.data.user,
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, cachedData, dispatch]);

  return {
    data,
    loading,
    error,
  };
};
