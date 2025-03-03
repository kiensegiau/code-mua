import React, { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Particles loaded, không cần thêm console.log tại đây để tránh spam console
  }, []);

  // Giảm số lượng particles và tối ưu config
  const particlesConfig = {
    background: {
      color: {
        value: "transparent",
      },
    },
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
        frequency: 0.5, // Giới hạn số lượng kết nối
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 0.8, // Giảm tốc độ
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1000, // Tăng area để giảm mật độ
        },
        value: 30, // Giảm số lượng hạt
        limit: 50, // Giới hạn số lượng hạt
      },
      opacity: {
        value: 0.2, // Giảm độ mờ
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2 }, // Giảm kích thước
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
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesConfig}
      className="h-full w-full"
    />
  );
};

export default ParticlesBackground;
