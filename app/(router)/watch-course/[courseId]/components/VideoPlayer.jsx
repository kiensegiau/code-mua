import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Plyr from "plyr-react";
import { toast } from "sonner";
import { useControlsVisibility } from "../hooks/useControlsVisibility";
import { PLAYER_OPTIONS } from "../constants/playerOptions";
import { PreviousIcon, NextIcon } from "./icons/NavigationIcons";
import "plyr-react/plyr.css";

export default function VideoPlayer({
  fileId,
  onEnded,
  onTimeUpdate,
  onNext,
  onPrevious,
  autoPlay = true,
}) {
  const playerRef = useRef(null);
  const { isControlsVisible, handleMouseMove, handleMouseLeave } =
    useControlsVisibility();

  const videoUrl = useMemo(() => {
    if (!fileId) {
      console.warn("No fileId provided");
      return "";
    }

    if (fileId.includes("/api/proxy/files?id=")) {
      console.log("FileId already contains API path");
      return `${process.env.NEXT_PUBLIC_API_URL}${fileId}`;
    }

    if (fileId.startsWith("http")) {
      console.log("FileId is full URL:", fileId);
      return fileId;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/proxy/files?id=${fileId}`;
    console.log("Constructed video URL:", url);
    return url;
  }, [fileId]);

  const source = useMemo(
    () => ({
      type: "video",
      sources: [
        {
          src: videoUrl,
          type: "video/mp4",
        },
      ],
    }),
    [videoUrl]
  );

  const handleError = useCallback(
    (error) => {
      console.error("Player error:", error);
      console.log("Current video URL:", videoUrl);
      console.log("Current fileId:", fileId);
      toast.error("Có lỗi khi phát video");
    },
    [fileId, videoUrl]
  );

  useEffect(() => {
    console.log("FileId received:", fileId);
  }, [fileId]);

  useEffect(() => {
    const container = playerRef.current?.elements?.container;
    if (!container) return;

    const handlePreviousVideo = () => {
      console.log("Received previousVideo event");
      onPrevious?.();
    };
    const handleNextVideo = () => {
      console.log("Received nextVideo event");
      onNext?.();
    };

    container.addEventListener("previousVideo", handlePreviousVideo);
    container.addEventListener("nextVideo", handleNextVideo);

    return () => {
      container.removeEventListener("previousVideo", handlePreviousVideo);
      container.removeEventListener("nextVideo", handleNextVideo);
    };
  }, [onPrevious, onNext]);

  return (
    <div className="relative w-full h-full">
      <div
        className={`
          absolute inset-0 
          group 
          ${!isControlsVisible ? "plyr--hide-controls" : ""}
        `}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <NavigationButton
          direction="previous"
          onClick={() => {
            console.log("Clicked previous button");
            onPrevious?.();
          }}
        />
        <NavigationButton
          direction="next"
          onClick={() => {
            console.log("Clicked next button");
            onNext?.();
          }}
        />

        <Plyr
          ref={playerRef}
          source={source}
          options={PLAYER_OPTIONS}
          autoPlay={autoPlay}
          onReady={() => console.log("Player ready")}
          onLoadedData={() => console.log("Video data loaded")}
          onLoadedMetadata={() => console.log("Video metadata loaded")}
          onEnded={() => {
            console.log("Video ended");
            onEnded?.();
          }}
          onTimeUpdate={(e) => {
            const time = e.target.currentTime;
            onTimeUpdate?.(time);
          }}
          onError={handleError}
        />
      </div>
    </div>
  );
}

const NavigationButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className={`
      hidden group-hover:flex 
      absolute top-1/2 -translate-y-1/2 
      w-10 h-10
      items-center justify-center 
      bg-black/30
      hover:bg-black/50
      transition-all duration-200 
      z-[51] 
      ${direction === "previous" ? "left-0" : "right-0"}
    `}
  >
    <div className="w-5 h-5 text-white/90">
      {direction === "previous" ? <PreviousIcon /> : <NextIcon />}
    </div>
  </button>
);
