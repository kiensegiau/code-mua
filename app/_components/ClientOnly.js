"use client";

import { useEffect, useState } from "react";

/**
 * ClientOnly component bọc các component con để đảm bảo chúng chỉ render ở phía client
 * Giúp tránh lỗi hydration và lỗi access window/document
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Component con cần được render chỉ ở client-side
 * @param {React.ReactNode} props.fallback - Component placeholder hiển thị khi chưa render ở client (optional)
 * @returns {React.ReactElement|null} Component đã được bảo vệ hoặc fallback
 */
export default function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chỉ render component con khi đã ở phía client
  return isClient ? children : fallback;
}

// HOC để bọc các component khác
export function withClientOnly(Component, fallback = null) {
  return function WithClientOnly(props) {
    return (
      <ClientOnly fallback={fallback}>
        <Component {...props} />
      </ClientOnly>
    );
  };
} 