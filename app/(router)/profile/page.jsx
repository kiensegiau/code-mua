"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/settings");
  }, [router]);

  return (
    <div className="p-8 flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Đang chuyển hướng...</h2>
        <p className="text-gray-400">
          Trang cá nhân đã được tích hợp vào trang Cài đặt.
        </p>
      </div>
    </div>
  );
}
