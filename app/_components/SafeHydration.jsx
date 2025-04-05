"use client";

import { useState, useEffect } from "react";

/**
 * Component bọc để xử lý sự khác biệt giữa server-side rendering và client-side rendering
 * Giải quyết lỗi hydration khi SSR và CSR khác nhau
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component con
 * @param {React.ReactNode} props.fallback - Component hiển thị khi đang hydrating (optional)
 * @returns {React.ReactElement|null} - Component con hoặc fallback
 */
export default function SafeHydration({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hiển thị fallback hoặc không hiển thị gì cho đến khi component được mount
  return mounted ? children : fallback;
}

/**
 * Higher Order Component để bọc component con trong SafeHydration
 * 
 * @param {Function} Component - Component cần bọc
 * @param {React.ReactNode} fallback - Component hiển thị khi đang hydrating (optional)
 * @returns {Function} Component đã được bọc
 */
export function withSafeHydration(Component, fallback = null) {
  function WithSafeHydrationComponent(props) {
    return (
      <SafeHydration fallback={fallback}>
        <Component {...props} />
      </SafeHydration>
    );
  }

  // Giữ lại displayName cho React DevTools
  const displayName = Component.displayName || Component.name || "Component";
  WithSafeHydrationComponent.displayName = `WithSafeHydration(${displayName})`;

  return WithSafeHydrationComponent;
}

/**
 * Component phát hiện lỗi hydration và xử lý chúng
 * CHÚ Ý: KHÔNG nên bọc lại trong ErrorBoundary vì sẽ gây bọc hai lần
 * Chỉ sử dụng khi ứng dụng đã bọc trong root ErrorBoundary
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component con
 * @param {string} props.message - Thông báo lỗi tùy chỉnh
 * @returns {React.ReactElement} - Component con hoặc thông báo lỗi
 */
export function HydrationErrorHandler({ children, message = "Đang tải dữ liệu..." }) {
  const [hasHydrationError, setHasHydrationError] = useState(false);

  useEffect(() => {
    // Cố gắng phát hiện lỗi hydration qua các thông báo lỗi trong console
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(" ");
      if (
        typeof errorMessage === "string" &&
        (errorMessage.includes("Hydration failed") ||
         errorMessage.includes("Text content did not match") ||
         errorMessage.includes("Minified React error"))
      ) {
        setHasHydrationError(true);
      }
      originalConsoleError.apply(console, args);
    };

    // Đặt lại console.error khi component unmount
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Tự động làm mới trang nếu phát hiện lỗi hydration
  useEffect(() => {
    if (hasHydrationError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasHydrationError]);

  if (hasHydrationError) {
    return (
      <div className="p-4 text-center">
        <div className="w-10 h-10 border-4 border-[#ff4d4f] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p>{message}</p>
        <p className="text-sm text-gray-500 mt-1">Trang sẽ tự động tải lại...</p>
      </div>
    );
  }

  return children;
} 