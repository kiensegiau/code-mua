"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CountdownTimer component - Hiển thị bộ đếm ngược với hiệu ứng chuyên nghiệp
 * @param {string} targetDate - Ngày đích để đếm ngược (định dạng ISO)
 * @param {string} title - Tiêu đề của đồng hồ đếm ngược
 * @param {string} subtitle - Phụ đề mô tả
 * @param {string} expiredMessage - Thông báo khi hết thời gian
 * @param {string} ctaText - Nội dung cho nút CTA (mặc định: "Đăng ký ngay")
 * @param {string} ctaUrl - Đường dẫn cho nút CTA (mặc định: "#register")
 * @param {boolean} showCta - Hiển thị nút CTA hay không (mặc định: true)
 * @param {string} theme - Giao diện màu (mặc định: "blue-indigo", có thể là "purple-pink", "emerald-teal", "amber-red")
 */
const CountdownTimer = ({
  targetDate,
  title,
  subtitle,
  expiredMessage = "Đã kết thúc!",
  ctaText = "Đăng ký ngay",
  ctaUrl = "#register",
  showCta = true,
  theme = "blue-indigo"
}) => {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  
  // Track previous values to animate flips
  const prevValuesRef = useRef({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFlipping, setIsFlipping] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false
  });

  // Xác định bảng màu dựa trên theme
  const themeConfig = useMemo(() => {
    const themes = {
      'blue-indigo': {
        from: 'from-blue-500 to-indigo-600',
        text: 'from-blue-600 to-indigo-600',
        cardGlow: 'from-blue-500 to-indigo-600',
        cardBack: 'from-blue-600 to-indigo-700',
        buttonGradient: 'from-blue-500 to-indigo-600',
        iconColor: 'text-indigo-500 dark:text-indigo-400',
        corner1: 'from-indigo-100 dark:from-indigo-900/40',
        corner2: 'from-blue-100 dark:from-blue-900/40',
        pulseColor: 'bg-indigo-50 dark:bg-indigo-900/10',
        expiredBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        expiredText: 'text-indigo-600 dark:text-indigo-400',
        expiredIcon: 'text-indigo-500'
      },
      'purple-pink': {
        from: 'from-purple-500 to-pink-600',
        text: 'from-purple-600 to-pink-600',
        cardGlow: 'from-purple-500 to-pink-600',
        cardBack: 'from-purple-600 to-pink-700',
        buttonGradient: 'from-purple-500 to-pink-600',
        iconColor: 'text-purple-500 dark:text-purple-400',
        corner1: 'from-purple-100 dark:from-purple-900/40',
        corner2: 'from-pink-100 dark:from-pink-900/40',
        pulseColor: 'bg-purple-50 dark:bg-purple-900/10',
        expiredBg: 'bg-purple-50 dark:bg-purple-900/20',
        expiredText: 'text-purple-600 dark:text-purple-400',
        expiredIcon: 'text-purple-500'
      },
      'emerald-teal': {
        from: 'from-emerald-500 to-teal-600',
        text: 'from-emerald-600 to-teal-600',
        cardGlow: 'from-emerald-500 to-teal-600',
        cardBack: 'from-emerald-600 to-teal-700',
        buttonGradient: 'from-emerald-500 to-teal-600',
        iconColor: 'text-emerald-500 dark:text-emerald-400',
        corner1: 'from-emerald-100 dark:from-emerald-900/40',
        corner2: 'from-teal-100 dark:from-teal-900/40',
        pulseColor: 'bg-emerald-50 dark:bg-emerald-900/10',
        expiredBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        expiredText: 'text-emerald-600 dark:text-emerald-400',
        expiredIcon: 'text-emerald-500'
      },
      'amber-red': {
        from: 'from-amber-500 to-red-600',
        text: 'from-amber-600 to-red-600',
        cardGlow: 'from-amber-500 to-red-600',
        cardBack: 'from-amber-600 to-red-700',
        buttonGradient: 'from-amber-500 to-red-600',
        iconColor: 'text-amber-500 dark:text-amber-400',
        corner1: 'from-amber-100 dark:from-amber-900/40',
        corner2: 'from-red-100 dark:from-red-900/40',
        pulseColor: 'bg-amber-50 dark:bg-amber-900/10',
        expiredBg: 'bg-amber-50 dark:bg-amber-900/20',
        expiredText: 'text-amber-600 dark:text-amber-400',
        expiredIcon: 'text-amber-500'
      }
    };
    
    return themes[theme] || themes['blue-indigo'];
  }, [theme]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Memoize calculation function to reduce recalculations
  const calculateTimeLeft = useCallback(() => {
    const targetTime = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;
    
    if (difference <= 0) {
      return { isFinished: true, timeValues: { days: 0, hours: 0, minutes: 0, seconds: 0 } };
    }
    
    return {
      isFinished: false,
      timeValues: {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    };
  }, [targetDate]);

  // Update timer on interval
  useEffect(() => {
    setIsClient(true);
    
    const updateTimer = () => {
      const { isFinished: finished, timeValues } = calculateTimeLeft();
      
      if (finished) {
        setIsFinished(true);
        setTimeLeft(timeValues);
        return;
      }
      
      // Check which values have changed to trigger flip animations
      const flippingStates = {};
      Object.keys(timeValues).forEach(key => {
        if (timeValues[key] !== prevValuesRef.current[key]) {
          flippingStates[key] = true;
          // Reset flip state after animation completes
          setTimeout(() => {
            setIsFlipping(prev => ({ ...prev, [key]: false }));
          }, 600); // Match with animation duration
        } else {
          flippingStates[key] = false;
        }
      });
      
      setIsFlipping(flippingStates);
      prevValuesRef.current = { ...timeValues };
      setTimeLeft(timeValues);
    };
    
    // Run initially
    updateTimer();
    
    // Set up interval
    const timerId = setInterval(updateTimer, 1000);
    
    // Clean up
    return () => clearInterval(timerId);
  }, [calculateTimeLeft]);

  // Placeholder for when component first loads (pre-hydration)
  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-8 rounded-xl bg-gray-50 dark:bg-slate-900/50 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-8"></div>
        <div className="flex gap-4 justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-24 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Format time unit with leading zero
  const formatUnit = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  // Time unit labels
  const timeUnits = {
    days: 'Ngày',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây'
  };

  // Time unit icons
  const timeIcons = {
    days: (
      <svg className="w-4 h-4 mb-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    hours: (
      <svg className="w-4 h-4 mb-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    minutes: (
      <svg className="w-4 h-4 mb-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.07 4.93L16.24 7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.76 16.24L4.93 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    seconds: (
      <svg className="w-4 h-4 mb-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7V13L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  return (
    <motion.div 
      className="w-full px-4 py-8 rounded-xl relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Glass morphism background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 to-white/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm rounded-xl -z-10"></div>
      
      {/* Animated background shape */}
      <motion.div 
        className={`absolute w-96 h-96 bg-gradient-to-r ${themeConfig.from} rounded-full filter blur-3xl opacity-20 dark:opacity-30 -z-10`}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 50, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 20,
        }}
        style={{ top: '-30%', right: '-10%' }}
      ></motion.div>
      
      <motion.div 
        className={`absolute w-72 h-72 bg-gradient-to-r ${themeConfig.from} rounded-full filter blur-3xl opacity-10 dark:opacity-20 -z-10`}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 50, -40, 0],
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 25,
          delay: 1
        }}
        style={{ bottom: '-20%', left: '-5%' }}
      ></motion.div>
      
      {/* Title with gradient text */}
      {title && (
        <motion.h2 
          className={`text-center text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r ${themeConfig.text} bg-clip-text text-transparent`}
          variants={itemVariants}
        >
          {title}
        </motion.h2>
      )}
      
      {/* Subtitle with enhanced styling */}
      {subtitle && (
        <motion.p 
          className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      )}
      
      <AnimatePresence mode="wait">
        {isFinished ? (
          <motion.div 
            key="expired"
            className={`text-center py-10 text-xl font-medium ${themeConfig.expiredText} ${themeConfig.expiredBg} rounded-xl`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <svg className={`w-16 h-16 ${themeConfig.expiredIcon} mx-auto mb-4`} viewBox="0 0 24 24" fill="none">
              <path d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {expiredMessage}
          </motion.div>
        ) : (
          <motion.div 
            key="timer"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 justify-center"
            variants={itemVariants}
            layout
          >
            {Object.entries(timeLeft).map(([unit, value]) => (
              <motion.div 
                key={unit}
                className="flip-card-container perspective-500 relative"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(unit)}
                onHoverEnd={() => setIsHovered(null)}
                layout
              >
                {/* Card backdrop with subtle gradient */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${themeConfig.cardGlow} rounded-xl blur opacity-40 ${isHovered === unit ? 'opacity-60' : 'opacity-40'} transition-opacity duration-300`}></div>
                
                <div 
                  className={`flip-card relative w-full ${isFlipping[unit] ? 'flip' : ''}`}
                >
                  <div className="flip-card-front absolute w-full h-full backface-hidden">
                    <div className="relative z-10 bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-xl shadow-lg p-4 h-full flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700">
                      {/* Decorative corner elements */}
                      <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl ${themeConfig.corner1} to-transparent rounded-bl-xl rounded-tr-xl`}></div>
                      <div className={`absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr ${themeConfig.corner2} to-transparent rounded-br-xl rounded-tl-xl`}></div>
                      
                      {/* Time unit icon */}
                      <div className={themeConfig.iconColor}>
                        {timeIcons[unit]}
                      </div>
                      
                      <span className={`text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br ${themeConfig.text} bg-clip-text text-transparent`}>
                        {formatUnit(value)}
                      </span>
                      <span className="text-xs md:text-sm font-medium mt-1 text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {timeUnits[unit]}
                      </span>
                      
                      {/* Pulse effect on hover */}
                      {isHovered === unit && (
                        <div className={`absolute inset-0 rounded-xl ${themeConfig.pulseColor} animate-pulse`}></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flip-card-back absolute w-full h-full backface-hidden rotateY-180">
                    <div className={`relative z-10 bg-gradient-to-br ${themeConfig.cardBack} text-white rounded-xl shadow-lg p-4 h-full flex flex-col items-center justify-center border border-indigo-500`}>
                      <span className="text-3xl md:text-4xl font-bold tracking-tight">
                        {formatUnit(value)}
                      </span>
                      <span className="text-xs md:text-sm font-medium mt-1 text-blue-100 uppercase tracking-wide">
                        {timeUnits[unit]}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative divider */}
      <motion.div 
        className={`w-24 h-1 mx-auto mt-12 mb-6 bg-gradient-to-r ${themeConfig.from} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: 96 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      ></motion.div>
      
      {/* Extra information text & CTA */}
      {showCta && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Đăng ký ngay để được hỗ trợ từ đội ngũ TopUni
          </p>
          
          <motion.a
            href={ctaUrl}
            className={`inline-flex items-center px-6 py-2 bg-gradient-to-r ${themeConfig.buttonGradient} text-white text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {ctaText}
            <svg className="w-3 h-3 ml-1" viewBox="0 0 16 16" fill="none">
              <path d="M6.66667 4L11.3333 8L6.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>
      )}
      
      <style jsx global>{`
        .perspective-500 {
          perspective: 500px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotateY-180 {
          transform: rotateY(180deg);
        }
        
        .flip-card {
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        
        .flip-card.flip {
          animation: flip-animation 0.6s forwards;
        }
        
        @keyframes flip-animation {
          0% {
            transform: rotateX(0);
          }
          50% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default CountdownTimer; 