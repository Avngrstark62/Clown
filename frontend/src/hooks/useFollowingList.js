/**
 * useFollowingList Hook
 * Fetches user following list with Redux caching
 * Prevents redundant API calls within TTL
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowingList } from '../api/api';
import { setFollowingList, selectFollowingList } from '../redux/dataSlice';
import { CONFIG } from '../constants';

export const useFollowingList = (username) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check cache first
  const cachedData = useSelector((state) =>
    selectFollowingList(state, username, CONFIG.CACHE_TTL.FOLLOWING_LIST)
  );
  
  const data = useSelector((state) => state.data.followingList[username]);

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
        const response = await getFollowingList(username);
        dispatch(setFollowingList({
          username,
          data: response.data.following,
        }));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch following list');
        console.error('Error fetching following list:', err);
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
