import React, { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoPlayer({
  fileId,
  onEnded,
  onTimeUpdate,
  autoPlay = true,
  startTime = 0,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [currentPart, setCurrentPart] = useState(0);

  // Tạo URL một lần và cache lại
  const getVideoUrl = useCallback((part) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return fileId.startsWith('http') 
      ? `${fileId}&part=${part}`
      : `${baseUrl}${fileId}&part=${part}`;
  }, [fileId]);

  // Khởi tạo player một lần
  useEffect(() => {
    if (!fileId || !containerRef.current || playerRef.current) return;

    const videoElement = document.createElement("video");
    videoElement.className = "video-js vjs-big-play-centered";
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      controls: true,
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",
      autoplay: autoPlay,
      sources: [
        {
          src: getVideoUrl(currentPart),
          type: "video/mp4"
        },
      ],
    });

    player.on("ready", () => {
      console.log("Player ready");
      if (startTime > 0) {
        player.currentTime(startTime);
      }
    });

    player.on("error", (e) => {
      console.error("Video player error:", player.error());
    });

    player.on("ended", () => {
      const nextPart = currentPart + 1;
      const nextUrl = getVideoUrl(nextPart);

      fetch(nextUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            setCurrentPart(nextPart);
            player.src({
              src: nextUrl,
              type: "video/mp4"
            });
            player.play();
          } else {
            if (onEnded) onEnded();
          }
        })
        .catch(error => {
          console.error("Error checking next part:", error);
          if (onEnded) onEnded();
        });
    });

    if (onTimeUpdate) {
      player.on("timeupdate", () => {
        onTimeUpdate(player.currentTime());
      });
    }

    playerRef.current = player;

    // Cleanup khi component unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [fileId]); // Chỉ chạy khi fileId thay đổi

  // Cập nhật source khi part thay đổi
  useEffect(() => {
    if (!playerRef.current) return;
    
    const videoUrl = getVideoUrl(currentPart);
    playerRef.current.src({
      src: videoUrl,
      type: "video/mp4"
    });
  }, [currentPart, getVideoUrl]);

  return (
    <div ref={containerRef} className="video-player-container" />
  );
}
