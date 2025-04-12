"use client";
import React from 'react';

export function Input({
  className,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  ...props
}) {
  const baseClasses = "px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  
  const inputClasses = `${baseClasses} ${className || ""}`;
  
  return (
    <input
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...props}
    />
  );
}; 