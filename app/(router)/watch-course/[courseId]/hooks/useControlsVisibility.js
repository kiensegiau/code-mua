import { useState, useRef, useCallback } from 'react';

export const useControlsVisibility = (timeout = 2000) => {
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const timeoutRef = useRef(null);

  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, timeout);
  }, [timeout]);

  const handleMouseLeave = useCallback(() => {
    setIsControlsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isControlsVisible,
    handleMouseMove,
    handleMouseLeave
  };
}; 