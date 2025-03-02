"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#ff4d4f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
