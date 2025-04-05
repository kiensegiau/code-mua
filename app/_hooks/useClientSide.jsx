"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Hook để đảm bảo component chỉ render ở phía client
 * Giải quyết vấn đề hydration và window/document
 * 
 * @param {boolean} defaultValue - Giá trị mặc định (nên là false để tránh lỗi hydration)
 * @returns {boolean} - true nếu đang ở client-side
 */
export function useClientSide(defaultValue = false) {
  const [isClient, setIsClient] = useState(defaultValue);

  useEffect(() => {
    // Đặt isClient thành true sau khi component đã mount ở client
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook để truy cập window object an toàn
 * 
 * @param {Function} callback - Callback function sẽ được gọi với window object khi ở client
 * @param {Array} deps - Dependencies array cho useEffect
 * @returns {any} - Kết quả của callback hoặc undefined
 */
export function useWindowSafe(callback, deps = []) {
  const isClient = useClientSide();
  const [result, setResult] = useState(undefined);

  // Bọc callback trong useCallback để có thể dùng làm dependency
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    if (isClient && window) {
      try {
        const callbackResult = memoizedCallback(window);
        setResult(callbackResult);
      } catch (error) {
        console.error("Error in useWindowSafe:", error);
      }
    }
  }, [isClient, memoizedCallback]);

  return result;
}

/**
 * Hook để truy cập localStorage an toàn
 * 
 * @param {string} key - Khóa localStorage
 * @param {any} initialValue - Giá trị mặc định khi không có dữ liệu
 * @returns {[any, Function]} - Giá trị và function để cập nhật
 */
export function useLocalStorage(key, initialValue) {
  const isClient = useClientSide();
  
  // Khởi tạo state với callback để tránh đọc localStorage quá sớm
  const [storedValue, setStoredValue] = useState(() => {
    if (!isClient) return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Hàm cập nhật storedValue và localStorage
  const setValue = useCallback((value) => {
    try {
      // Hỗ trợ cả giá trị và function cập nhật
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage nếu đang ở client
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, storedValue, isClient]);

  return [storedValue, setValue];
}

/**
 * Hook để truy cập document an toàn
 * 
 * @param {Function} callback - Callback function sẽ được gọi với document object khi ở client
 * @param {Array} deps - Dependencies array cho useEffect
 * @returns {any} - Kết quả của callback hoặc undefined
 */
export function useDocumentSafe(callback, deps = []) {
  const isClient = useClientSide();
  const [result, setResult] = useState(undefined);

  // Bọc callback trong useCallback để có thể dùng làm dependency
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    if (isClient && document) {
      try {
        const callbackResult = memoizedCallback(document);
        setResult(callbackResult);
      } catch (error) {
        console.error("Error in useDocumentSafe:", error);
      }
    }
  }, [isClient, memoizedCallback]);

  return result;
} 