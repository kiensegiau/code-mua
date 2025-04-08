"use client";

import { useEffect, useRef } from "react";

export default function CourseDefaultImage() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Thiết lập kích thước
      canvas.width = 800;
      canvas.height = 450;
      
      // Vẽ background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#ff4d4f');
      gradient.addColorStop(1, '#ff7875');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Vẽ lưới
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      // Vẽ đường dọc
      for (let x = 0; x <= canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Vẽ đường ngang
      for (let y = 0; y <= canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Vẽ hiệu ứng overlay
      const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
      overlay.addColorStop(0, 'rgba(0, 0, 0, 0)');
      overlay.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = overlay;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Vẽ logo
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText('HỌC MAI', canvas.width / 2, canvas.height / 2 - 40);
      
      // Vẽ tagline
      ctx.font = '30px Arial';
      ctx.fillText('Đầu tư trí tuệ - Gặt hái thành công', canvas.width / 2, canvas.height / 2 + 30);
    }
  }, []);
  
  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'course-default.jpg';
      link.href = canvasRef.current.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hình ảnh mặc định cho khóa học</h1>
      <p className="mb-6 text-gray-400">
        Hình ảnh này sẽ được sử dụng khi khóa học không có thumbnail.
      </p>
      
      <div className="mb-6 bg-gray-800 rounded-xl overflow-hidden">
        <canvas 
          ref={canvasRef}
          className="w-full h-auto"
        />
      </div>
      
      <button
        onClick={downloadImage}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Tải xuống hình ảnh
      </button>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Hướng dẫn sử dụng</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300">
          <li>Nhấn nút "Tải xuống hình ảnh" để tải file</li>
          <li>Đặt tên file là <code className="bg-gray-700 px-1.5 rounded">course-default.jpg</code></li>
          <li>Đặt file vào thư mục <code className="bg-gray-700 px-1.5 rounded">public/images/</code></li>
        </ol>
      </div>
    </div>
  );
} 