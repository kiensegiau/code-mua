"use client";
import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

function SettingsForm({ onSubmit, children }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#ff4d4f] hover:bg-[#ff4d4f]/90 text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Lưu thay đổi</span>
        </button>
      </div>
    </motion.form>
  );
}

export default SettingsForm; 