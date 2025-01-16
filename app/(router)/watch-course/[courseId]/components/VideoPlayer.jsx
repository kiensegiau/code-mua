import React, { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Thêm custom CSS để override video.js styles
const customStyles = `
.video-js {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
}
.vjs-tech {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}
`;

export default function VideoPlayer({
  fileId,
  onEnded,
  onTimeUpdate,
  autoPlay = true,
  key,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(0);
  const previousRequestRef = useRef(null);

  // Thêm custom styles khi component mount
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Hàm để hủy request cũ
  const cancelPreviousRequest = useCallback(() => {
    if (previousRequestRef.current) {
      previousRequestRef.current.abort();
      previousRequestRef.current = null;
    }
  }, []);

  // Tạo URL một lần và cache lại
  const getVideoUrl = useCallback(
    (part) => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      return fileId.startsWith("http")
        ? `${fileId}&part=${part}`
        : `${baseUrl}${fileId}&part=${part}`;
    },
    [fileId]
  );

  // Xử lý khi seek video
  const handleSeek = useCallback(() => {
    if (playerRef.current) {
      cancelPreviousRequest();
    }
  }, [cancelPreviousRequest]);

  // Cleanup khi component unmount hoặc fileId thay đổi
  useEffect(() => {
    return () => {
      cancelPreviousRequest();
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [fileId, cancelPreviousRequest]);

  // Khởi tạo player
  useEffect(() => {
    if (!fileId || !containerRef.current || playerRef.current) return;

    const videoElement = document.createElement("video");
    videoElement.className = "video-js";
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      controls: true,
      fluid: false,
      responsive: true,
      aspectRatio: "16:9",
      autoplay: autoPlay,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      sources: [
        {
          src: getVideoUrl(currentPart),
          type: "video/mp4",
        },
      ],
    });

    // Thêm event listeners
    player.on("ready", () => {
      console.log("Player ready");
    });

    player.on("error", (e) => {
      console.error("Video player error:", player.error());
    });

    player.on("ended", () => {
      console.log("Video ended event fired");
      if (onEnded) {
        console.log("Calling onEnded callback");
        onEnded();
      }
    });

    player.on("seeking", handleSeek);

    if (onTimeUpdate) {
      player.on("timeupdate", () => {
        onTimeUpdate(player.currentTime());
      });
    }

    playerRef.current = player;
  }, [fileId, onEnded, handleSeek]);

  // Cập nhật source khi part hoặc fileId thay đổi
  useEffect(() => {
    if (!playerRef.current) return;

    // Hủy request cũ trước khi tải video mới
    cancelPreviousRequest();

    const videoUrl = getVideoUrl(currentPart);

    // Lưu XMLHttpRequest mới
    const xhr = new XMLHttpRequest();
    previousRequestRef.current = xhr;

    playerRef.current.src({
      src: videoUrl,
      type: "video/mp4",
    });

    // Reset time về 0 khi đổi video
    playerRef.current.currentTime(0);
  }, [currentPart, getVideoUrl, fileId, cancelPreviousRequest]);

  return (
    <div 
      key={key} 
      ref={containerRef} 
      className="w-full h-full relative"
    />
  );
}
