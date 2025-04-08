"use client";
import React from "react";
import { motion } from "framer-motion";

function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 bg-[#ff4d4f]/5 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 5,
          }}
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingElements; 