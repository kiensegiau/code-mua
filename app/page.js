"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tạo hiệu ứng loading trước khi chuyển trang
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100 text-amber-900">
      {isLoading ? (
        <div className="text-center p-8 max-w-2xl">
          <div className="mb-8 relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-3 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-700 text-4xl font-bold">AT</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-amber-800">
            An Thành <span className="text-amber-600">Phát</span>
          </h1>
          
          <p className="text-lg text-amber-700 mb-4 animate-pulse">
            Đang tải trang chuyên nghiệp về đồ cúng...
          </p>
          
          <div className="flex justify-center space-x-2 mt-4">
            <span className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
            <span className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            <span className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-amber-800">Đang chuyển hướng...</p>
        </div>
      )}
    </div>
  );
}
