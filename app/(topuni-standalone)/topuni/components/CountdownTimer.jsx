"use client";
import { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isClient, setIsClient] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);
  const updateCountRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTimeLeft({
      days,
      hours,
      minutes,
      seconds
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Hiệu ứng xuất hiện
    setTimeout(() => {
      setIsActive(true);
    }, 500);

    timerRef.current = setInterval(() => {
      updateCountRef.current += 1;
      
      // Dừng sau 100 lần update để tránh cập nhật vô hạn
      if (updateCountRef.current > 100) {
        clearInterval(timerRef.current);
        return;
      }
      
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        } else if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59
          };
        } else if (prev.hours > 0) {
          return {
            ...prev,
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59
          };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59
          };
        } else {
          clearInterval(timerRef.current);
          return prev;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [days, hours, minutes, seconds]);

  // Labels cho từng box thời gian
  const timeLabels = [
    { value: timeLeft.days, label: "Ngày", icon: "🗓️" },
    { value: timeLeft.hours, label: "Giờ", icon: "🕐" },
    { value: timeLeft.minutes, label: "Phút", icon: "⏱️" },
    { value: timeLeft.seconds, label: "Giây", icon: "⏱️" }
  ];

  // Hiển thị phiên bản đơn giản khi chưa hydrate để tránh lỗi
  if (!isClient) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-center gap-4 mb-3">
          {["Ngày", "Giờ", "Phút", "Giây"].map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-lg blur opacity-75"></div>
                <div className="bg-white text-gray-800 rounded-lg p-4 text-3xl font-bold min-w-[70px] text-center relative z-10 shadow-lg ring-1 ring-white/10">
                  00
                </div>
              </div>
              <span className="text-xs mt-2 uppercase font-semibold tracking-wider">{label}</span>
            </div>
          ))}
        </div>
        <div className="text-center text-sm font-medium animate-pulse text-red-500 mt-2">
          Đang tải bộ đếm thời gian...
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center mb-2">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isHovered ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-red-500/20 text-red-600'}`}>
          Ưu đãi sẽ kết thúc sau:
        </span>
      </div>
      
      <div className="flex justify-center gap-4">
        {timeLabels.map((box, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center transform transition-all duration-500 ${
              isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="relative group">
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-lg blur transition-all duration-300 ${
                  isHovered ? 'opacity-100 scale-110' : 'opacity-75'
                }`}
              ></div>
              <div 
                className={`bg-white text-gray-800 rounded-lg p-4 text-3xl font-bold min-w-[80px] text-center relative z-10 shadow-lg group-hover:shadow-xl transition-all duration-500 ring-1 ring-white/10 ${
                  box.value <= 0 ? 'text-red-500' : ''
                } ${
                  box.value <= 5 && box.label === "Ngày" ? 'animate-pulse text-red-500' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className={`transition-all duration-300 ${isHovered ? 'text-red-600 scale-110' : ''}`}>
                    {String(box.value).padStart(2, '0')}
                  </span>
                  {isHovered && (
                    <span className="text-xs text-gray-400 absolute -top-2 opacity-70 font-normal">
                      {box.icon}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Animated bottom line */}
              <div 
                className={`h-1 bg-gradient-to-r from-red-400 to-yellow-400 rounded-b-lg transition-all duration-500 ${
                  isHovered ? 'w-full' : 'w-0'
                }`}
              ></div>
            </div>
            <div className="mt-2 flex flex-col items-center">
              <span className={`text-xs uppercase font-semibold tracking-wider transition-all duration-300 ${isHovered ? 'text-red-600' : 'text-gray-600'}`}>
                {box.label}
              </span>
              {(box.value <= 1) && (box.label === "Ngày" || box.label === "Giờ") && (
                <span className="text-[10px] text-red-500 mt-1 animate-pulse font-semibold">Sắp hết hạn!</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isHovered && (
        <div className="text-center text-sm text-red-600 font-medium animate-bounce mt-2">
          Đăng ký ngay để nhận ưu đãi!
        </div>
      )}
      
      <style jsx global>{`
        @keyframes pulse-shadow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          50% {
            box-shadow: 0 0 20px 0 rgba(220, 38, 38, 0.5);
          }
        }
        
        .animate-pulse {
          animation: pulse-shadow 2s infinite;
        }
        
        @keyframes number-change {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        .countdown-number {
          position: relative;
          overflow: hidden;
        }
        
        .countdown-number::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg, #f97316, #ef4444);
          transform: scaleX(0);
          transform-origin: bottom right;
          transition: transform 0.3s ease;
        }
        
        .countdown-number:hover::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer; 