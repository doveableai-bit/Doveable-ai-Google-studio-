import { useState, useEffect } from 'react';

// FIX: The useDebounce hook was not implemented. This adds the implementation.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if the value or delay changes
    // before the timeout has completed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect only if value or delay changes

  return debouncedValue;
}
