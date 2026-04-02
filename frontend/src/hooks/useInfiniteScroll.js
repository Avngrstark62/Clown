/**
 * useInfiniteScroll Hook
 * Handles infinite scroll functionality with proper cleanup
 * Prevents IntersectionObserver from being recreated on every render
 */

import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (
  fetchMore,
  options = { threshold: 0.3 }
) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const setupObserver = useCallback(() => {
    // Cleanup existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      options
    );

    // Observe sentinel element
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
  }, [fetchMore, options]);

  // Setup observer on mount
  useEffect(() => {
    setupObserver();

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  return sentinelRef;
};
