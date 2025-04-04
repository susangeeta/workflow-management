import { useCallback } from "react";

/**
 * Custom hook to use localstorage
 */
export default function useLocalStorage<T>() {
  /**
   * Get a specific item from localStorage
   */
  const getItem = useCallback((key: string): T | null => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : "";
  }, []);

  /**
   * Get all items from localStorage
   */
  const getAllItems = useCallback((): Record<string, T> => {
    const items: Record<string, T> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          items[key] = JSON.parse(item);
        }
      }
    }
    return items;
  }, []);

  /**
   * Add a new item to localStorage
   */
  const addItem = useCallback((key: string, value: T): boolean => {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }, []);

  /**
   * Update an existing item in localStorage
   */
  const updateItem = useCallback((key: string, value: T): boolean => {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }, []);

  /**
   * Delete an item from localStorage
   */
  const deleteItem = useCallback((key: string): boolean => {
    localStorage.removeItem(key);
    return true;
  }, []);

  /**
   * Clear all items from localStorage
   */
  const clearAll = useCallback((): boolean => {
    localStorage.clear();
    return true;
  }, []);

  return { getItem, addItem, clearAll, updateItem, deleteItem, getAllItems };
}
