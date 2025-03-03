"use client";
import React, { memo, useEffect, useState } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

// Sử dụng memo để tránh render lại không cần thiết
const ParticlesBackground = memo(() => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng có muốn giảm chuyển động
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Theo dõi thay đổi của cài đặt này
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  // Chỉ log error chứ không log thông tin thường xuyên để tránh ảnh hưởng performance
  const particlesLoaded = async (container) => {
    if (!container) {
      console.error("Particles container failed to load");
    }
  };

  // Tối ưu cấu hình particle dựa trên kích thước màn hình và cài đặt giảm animation
  const getParticlesConfig = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Nếu người dùng muốn giảm chuyển động, áp dụng cấu hình tối thiểu
    if (prefersReducedMotion) {
      return {
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 30,
        particles: {
          number: {
            value: isMobile ? 5 : 10,
            density: { enable: true, area: 800 },
          },
          color: { value: "#ff4d4f" },
          links: {
            enable: true,
            distance: 150,
            color: "#ff4d4f",
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: "none",
            outModes: { default: "out" },
          },
          opacity: { value: 0.2 },
          size: { value: { min: 1, max: 2 } },
        },
        detectRetina: false,
      };
    }

    return {
      fullScreen: { enable: false },
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60, // Giới hạn FPS để tiết kiệm tài nguyên
      particles: {
        color: {
          value: "#ff4d4f",
        },
        links: {
          color: "#ff4d4f",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out", // Thay đổi từ "bounce" sang "out" để tránh hiệu ứng nảy ở biên
          },
          random: false,
          speed: isMobile ? 0.3 : isTablet ? 0.5 : 0.8, // Giảm tốc độ trên thiết bị di động
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: isMobile ? 15 : isTablet ? 25 : 40, // Giảm số lượng hạt trên thiết bị di động
          limit: 80, // Giới hạn số lượng hạt tối đa
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
      // Thêm cấu hình này để đảm bảo particles không vượt quá container
      absorbers: {
        enable: false,
      },
    };
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={getParticlesConfig()}
        className="hidden sm:block w-full h-full" // Ẩn trên mobile để tăng hiệu suất
      />
    </div>
  );
});

ParticlesBackground.displayName = "ParticlesBackground";

export default ParticlesBackground;
