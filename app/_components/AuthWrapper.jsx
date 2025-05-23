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
    // Tạm thời vô hiệu hóa chuyển hướng tự động để tránh vòng lặp redirect
    // if (!loading && !user) {
    //   router.push("/sign-in");
    // }
    console.log("AuthWrapper: loading =", loading, "user =", user);
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

  // Tạm thời luôn hiển thị nội dung, bất kể có user hay không
  return children;
});

export default AuthWrapper;
