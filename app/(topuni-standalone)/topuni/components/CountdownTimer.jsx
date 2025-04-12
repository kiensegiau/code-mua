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
  const timerRef = useRef(null);
  const updateCountRef = useRef(0);

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

  const boxes = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" }
  ];

  if (!isClient) {
    return (
      <div className="flex justify-center gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-lg blur opacity-75"></div>
              <div className="bg-white text-gray-800 rounded-lg p-4 text-3xl font-bold min-w-[70px] text-center relative z-10 shadow-lg ring-1 ring-white/10">
                00
              </div>
            </div>
            <span className="text-xs mt-2 uppercase font-semibold tracking-wider">{["Ngày", "Giờ", "Phút", "Giây"][index]}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      {boxes.map((box, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="bg-white text-gray-800 rounded-lg p-4 text-3xl font-bold min-w-[70px] text-center relative z-10 shadow-lg group-hover:shadow-xl transition duration-300 ring-1 ring-white/10">
              {String(box.value).padStart(2, '0')}
            </div>
          </div>
          <span className="text-xs mt-2 uppercase font-semibold tracking-wider">{box.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer; 