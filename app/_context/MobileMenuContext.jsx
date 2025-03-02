"use client";
import React, { createContext, useContext, useState } from "react";

// Tạo context cho menu trên thiết bị di động
const MobileMenuContext = createContext();

// Hook để sử dụng context
export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu phải được sử dụng trong MobileMenuProvider");
  }
  return context;
};

// Provider component
export function MobileMenuProvider({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hàm để mở/đóng menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Hàm để đóng menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Giá trị được chia sẻ trong context
  const value = {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  };

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
    </MobileMenuContext.Provider>
  );
}
