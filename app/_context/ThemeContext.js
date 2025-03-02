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

          // Thêm một hàm xử lý MutationObserver để theo dõi các phần tử mới được thêm vào DOM
          setTimeout(() => {
            addMutationObserver();
          }, 500);
        } else {
          setTimeout(checkReadyState, 10);
        }
      };
      checkReadyState();
    }
  }, [isLoaded, theme]);

  // Theo dõi các thay đổi trong DOM và áp dụng theme cho các phần tử mới
  const addMutationObserver = () => {
    if (
      typeof window === "undefined" ||
      typeof MutationObserver === "undefined"
    )
      return;

    const observer = new MutationObserver((mutations) => {
      // Khi DOM thay đổi, áp dụng lại theme
      fixSpecificElements(theme);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  };

  // Xử lý các trường hợp đặc biệt khi thay đổi theme
  const fixSpecificElements = (currentTheme) => {
    if (typeof document === "undefined") return;

    // Xử lý riêng cho các phần tử cố định màu sắc
    if (currentTheme === "light") {
      document
        .querySelectorAll(
          ".text-white, .text-gray-100, .text-gray-200, .text-gray-300"
        )
        .forEach((el) => {
          if (!el.dataset.originalColor) {
            el.dataset.originalColor = el.className;
            el.classList.add("force-dark-text");
          }
        });
    } else {
      document.querySelectorAll("[data-original-color]").forEach((el) => {
        el.classList.remove("force-dark-text");
      });
    }
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

    // Force re-render các style
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    setTimeout(() => {
      document.body.style.backgroundColor = "var(--background-color)";
      document.body.style.color = "var(--text-color)";

      // Xử lý các trường hợp đặc biệt
      fixSpecificElements(currentTheme);
    }, 0);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // Lưu theme vào localStorage
    localStorage.setItem("theme", newTheme);

    // Áp dụng theme
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
