"use client";
import { useAuth } from "../_context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, memo } from "react";
import { Spin } from "antd";

// Sử dụng memo để tránh re-render không cần thiết
const AuthWrapper = memo(function AuthWrapper({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Chỉ điều hướng khi loading đã hoàn tất và không có user
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  // Hiển thị loading spinner khi đang tải
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Chỉ render children khi đã có user
  return user ? children : null;
});

export default AuthWrapper;
