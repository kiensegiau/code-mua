"use client";
import { useEffect, useState } from 'react';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export default function TopuniLayout({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={poppins.className}>
      {children}
    </div>
  );
} 