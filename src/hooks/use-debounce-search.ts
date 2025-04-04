import { useEffect, useState } from "react";

/**
 * Custom hook for debouncing search input
 */
export default function useDebounceSearch(value: string, delay = 500): string {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
