"use client";
import React from "react";
import { motion } from "framer-motion";

function SettingsSection({ title, description, children }) {
  return (
    <motion.div
      className="bg-[#1f1f1f] rounded-xl border border-gray-800 p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-gray-400">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

export default SettingsSection; 