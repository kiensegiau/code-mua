"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  // Khôi phục theme từ localStorage khi component mount
  useEffect(() => {
    // Chỉ chạy trên client
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      applyTheme(savedTheme);
      setIsLoaded(true);
    }
  }, []);

  // Đảm bảo theme được áp dụng ngay khi DOM đã sẵn sàng
  useEffect(() => {
    if (isLoaded) {
      const checkReadyState = () => {
        if (document.readyState === "complete") {
          applyTheme(theme);
          // Không sử dụng MutationObserver vì gây vấn đề hiệu suất
        } else {
          setTimeout(checkReadyState, 10);
        }
      };
      checkReadyState();
    }
  }, [isLoaded, theme]);

  // Xóa bỏ MutationObserver vì gây vấn đề với pointer-events và hiệu suất

  // Xử lý các trường hợp đặc biệt khi thay đổi theme nhưng đơn giản hơn
  const fixSpecificElements = (currentTheme) => {
    if (typeof document === "undefined") return;

    // Đảm bảo pointer-events luôn được bật
    document.body.style.pointerEvents = "auto";
    document.documentElement.style.pointerEvents = "auto";
  };

  const applyTheme = (currentTheme) => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.toggle(
      "dark-theme",
      currentTheme === "dark"
    );
    document.documentElement.classList.toggle(
      "light-theme",
      currentTheme === "light"
    );

    // Thêm data attribute cho theme vào document
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Đảm bảo pointer-events luôn được bật
    document.body.style.pointerEvents = "auto";
    document.documentElement.style.pointerEvents = "auto";

    // Sửa lại không có setTimeout để tránh vấn đề bất đồng bộ
    document.body.style.backgroundColor = "var(--background-color)";
    document.body.style.color = "var(--text-color)";

    // Xử lý các trường hợp đặc biệt
    fixSpecificElements(currentTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Đảm bảo pointer-events luôn được bật
    document.body.style.pointerEvents = "auto";
    document.documentElement.style.pointerEvents = "auto";

    // Lưu theme vào localStorage
    localStorage.setItem("theme", newTheme);

    // Áp dụng theme
    applyTheme(newTheme);

    // Cập nhật state sau khi đã áp dụng các thay đổi DOM
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
