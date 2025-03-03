import React, { useCallback, memo } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Particles loaded
  }, []);

  // Tối ưu cấu hình particles để cải thiện hiệu suất
  const particlesConfig = {
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 0.8, // Giảm tốc độ chuyển động
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800, // Tăng area để giảm mật độ
        },
        value: 30, // Giảm số lượng particles
        max: 30, // Giới hạn số lượng tối đa
      },
      opacity: {
        value: 0.3, // Giảm độ mờ
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 }, // Giảm kích thước
      },
      reduceDuplicates: true, // Giảm trùng lặp
    },
    detectRetina: true,
    fullScreen: { enable: false },
    fps_limit: 30, // Giới hạn FPS
    interactivity: {
      events: {
        onClick: {
          enable: false, // Tắt tương tác click
        },
        onHover: {
          enable: false, // Tắt tương tác hover
        },
        resize: true,
      },
    },
  };

  return (
    <Particles
      id="tsparticles-community"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute inset-0 -z-10"
      options={particlesConfig}
    />
  );
};

// Sử dụng memo để tránh re-render không cần thiết
export default memo(ParticlesBackground);
