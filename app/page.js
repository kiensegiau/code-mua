"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100 text-amber-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-amber-800">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
