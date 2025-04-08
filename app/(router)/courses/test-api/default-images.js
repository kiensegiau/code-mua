"use client";

import { useState, useRef, useEffect } from "react";

// Định nghĩa các môn học và màu sắc tương ứng
const subjects = [
  { id: "literature", name: "Ngữ văn", color: "#AA66CC" },
  { id: "math", name: "Toán học", color: "#4285F4" },
  { id: "physics", name: "Vật lý", color: "#DB4437" },
  { id: "chemistry", name: "Hóa học", color: "#F4B400" },
  { id: "biology", name: "Sinh học", color: "#0F9D58" },
  { id: "english", name: "Tiếng Anh", color: "#34A853" },
  { id: "history", name: "Lịch sử", color: "#FF6D00" },
  { id: "geography", name: "Địa lý", color: "#2196F3" },
  { id: "informatics", name: "Tin học", color: "#9C27B0" },
  { id: "others", name: "Khác", color: "#757575" },
];

export default function DefaultImages() {
  const canvasRefs = useRef({});
  const [generatedImages, setGeneratedImages] = useState({});
  
  // Tạo canvas cho mỗi môn học
  useEffect(() => {
    subjects.forEach(subject => {
      if (canvasRefs.current[subject.id]) {
        const canvas = canvasRefs.current[subject.id];
        const ctx = canvas.getContext('2d');
        
        // Đặt kích thước canvas
        canvas.width = 400;
        canvas.height = 225;
        
        // Vẽ background
        ctx.fillStyle = subject.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Vẽ lưới
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Vẽ đường dọc
        for (let x = 0; x <= canvas.width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Vẽ đường ngang
        for (let y = 0; y <= canvas.height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        
        // Vẽ overlay gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Vẽ tên môn học
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(subject.name, canvas.width / 2, canvas.height / 2);
        
        // Thêm logo hoặc icon nhỏ
        ctx.font = 'normal 14px Arial';
        ctx.fillText('hocmai.vn', canvas.width / 2, canvas.height - 20);
        
        // Tạo URL cho ảnh
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setGeneratedImages(prev => ({
          ...prev,
          [subject.id]: imageUrl
        }));
      }
    });
  }, []);
  
  const downloadAllImages = () => {
    subjects.forEach(subject => {
      if (generatedImages[subject.id]) {
        const link = document.createElement('a');
        link.href = generatedImages[subject.id];
        link.download = `${subject.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tạo hình nền cho các môn học</h1>
      <p className="mb-6 text-gray-400">
        Các hình này sẽ được sử dụng khi khóa học không có thumbnail. Bạn có thể tải về và đặt vào thư mục <code className="bg-gray-700 px-1.5 py-0.5 rounded">public/images/subjects/</code>
      </p>
      
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mb-6 hover:bg-blue-700"
        onClick={downloadAllImages}
      >
        Tải tất cả hình ảnh
      </button>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative">
              {/* Canvas ẩn để tạo hình ảnh */}
              <canvas 
                ref={el => canvasRefs.current[subject.id] = el} 
                style={{ display: 'none' }}
              />
              
              {/* Hiển thị hình ảnh đã tạo */}
              {generatedImages[subject.id] && (
                <img 
                  src={generatedImages[subject.id]} 
                  alt={subject.name}
                  className="w-full aspect-video object-cover"
                />
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Nút tải xuống */}
              <a
                href={generatedImages[subject.id] || '#'}
                download={`${subject.id}.jpg`}
                className="absolute bottom-3 right-3 bg-white/20 hover:bg-white/30 text-white text-xs rounded-full px-3 py-1 backdrop-blur-sm"
              >
                Tải xuống
              </a>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-white mb-1">{subject.name}</h3>
              <p className="text-xs text-gray-400">Filename: {subject.id}.jpg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 