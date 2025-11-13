import { useState, useCallback, useRef } from 'react';

// Debounce hook for optimized search and input
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay])();

  return debouncedValue;
}

// Throttle hook for performance-critical events
export function useThrottle(callback, delay = 250) {
  const timeoutRef = useRef(null);
  const lastRanRef = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    const elapsed = now - lastRanRef.current;

    if (elapsed >= delay) {
      callback(...args);
      lastRanRef.current = Date.now();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(
        () => {
          callback(...args);
          lastRanRef.current = Date.now();
        },
        delay - elapsed
      );
    }
  }, [callback, delay]);
}
