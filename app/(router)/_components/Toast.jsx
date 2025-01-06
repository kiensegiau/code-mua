"use client"
import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster 
      position="top-center" 
      reverseOrder={false}
      toastOptions={{
        style: {
          background: '#1f1f1f',
          color: '#fff',
          border: '1px solid #333'
        },
        success: {
          iconTheme: {
            primary: '#ff4d4f',
            secondary: '#1f1f1f',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4d4f',
            secondary: '#1f1f1f',
          },
        },
      }}
    />
  );
}