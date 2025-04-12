"use client";
import React from 'react';

export function Button({
  children,
  className,
  variant = "default",
  type = "button",
  onClick,
  ...props
}) {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition duration-200 ease-in-out focus:outline-none";
  
  let variantClasses = "";
  if (variant === "outline") {
    variantClasses = "border border-gray-300 text-gray-700 hover:bg-gray-100";
  } else if (variant === "ghost") {
    variantClasses = "bg-transparent hover:bg-gray-100 text-gray-700";
  } else {
    // Default variant
    variantClasses = "bg-blue-600 hover:bg-blue-700 text-white";
  }
  
  const buttonClasses = `${baseClasses} ${variantClasses} ${className || ""}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};