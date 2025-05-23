import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "./plyr-custom.css"; // Import CSS tùy chỉnh cho Plyr
import { useAuth } from "@/app/_context/AuthContext";

// Hàm helper để lấy stream URL từ API
const getStreamUrl = async (key, userId, courseId) => {
  try {
    if (!key || !userId || !courseId) {
      console.error("Thiếu thông tin cần thiết để lấy stream URL", { key, userId, courseId });
      return null;
    }

    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`/api/stream?key=${encodedKey}&userId=${userId}&courseId=${courseId}`);
    const data = await response.json();

    if (data.success && data.streamUrl) {
      return data.streamUrl;
    } else {
      console.error("Lỗi khi lấy stream URL:", data.error || "Không xác định");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi gọi API stream:", error);
    return null;
  }
};

// Component loading riêng biệt
const LoadingOverlay = memo(function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black dark:bg-black z-10 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-[#ff4d4f] rounded-full animate-spin"></div>
    </div>
  );
});

// Component điều hướng riêng biệt
const NavigationButtons = memo(function NavigationButtons({
  onNext,
  onPrevious,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        key="prev-button"
        onClick={onPrevious}
        className={`w-12 h-12 ${
          isVisible ? "bg-black/50" : "bg-black/20"
        } backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 pointer-events-auto hover:bg-[#ff4d4f]/80 ${
          isVisible ? "opacity-100" : "opacity-20"
        }`}
        title="Bài trước"
      >
        <IoChevronBack className="w-6 h-6 text-white" />
      </button>

      <button
        key="next-button"
        onClick={onNext}
        className={`w-12 h-12 ${
          isVisible ? "bg-black/50" : "bg-black/20"
        } backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 pointer-events-auto hover:bg-[#ff4d4f]/80 ${
          isVisible ? "opacity-100" : "opacity-20"
        }`}
        title="Bài tiếp theo"
      >
        <IoChevronForward className="w-6 h-6 text-white" />
      </button>
    </div>
  );
});

const VideoPlayer = memo(function VideoPlayer({
  file,
  onEnded,
  onTimeUpdate,
  onNext,
  onPrevious,
  autoPlay = true,
}) {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(() => {
    return `${file?.id || "initial"}-${Date.now()}`;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [streamUrl, setStreamUrl] = useState("");
  
  // Lấy courseId từ URL
  const courseId = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.split("/").pop();
    }
    return null;
  }, []);

  // Sử dụng ref để theo dõi file hiện tại để tránh vấn đề với useEffect cleanup
  const currentFileRef = useRef(file);

  useEffect(() => {
    // Cập nhật ref khi file thay đổi
    currentFileRef.current = file;
  }, [file]);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      setVideoKey(`${file.id}-${Date.now()}`);

      // Cố gắng khôi phục vị trí đã lưu cho video này
      try {
        const savedPositions = JSON.parse(
          localStorage.getItem("videoPositions") || "{}"
        );
        const savedPosition = savedPositions[file.id];
        if (savedPosition && savedPosition.position > 0) {
          setCurrentTime(savedPosition.position);
          if (playerRef.current) {
            playerRef.current.currentTime = savedPosition.position;
          }
        } else {
          setCurrentTime(0);
        }
      } catch (error) {
        // console.error("Lỗi khi khôi phục vị trí video:", error);
      }
    }
  }, [file]);

  // Thêm useEffect để lấy streamUrl khi file thay đổi
  useEffect(() => {
    const fetchStreamUrl = async () => {
      if (!file?.storage?.key) {
        console.error("Không có storage key cho video");
        setIsLoading(false);
        return;
      }
      
      if (!user?.uid) {
        console.error("Không có thông tin user để xác thực");
        setIsLoading(false);
        return;
      }
      
      if (!courseId) {
        console.error("Không thể xác định courseId");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const url = await getStreamUrl(file.storage.key, user.uid, courseId);

      if (url) {
        setStreamUrl(url);
      } else {
        console.error("Không thể lấy URL video");
      }
      
      setIsLoading(false);
    };

    fetchStreamUrl();
  }, [file, user, courseId]);

  // Khởi tạo Plyr khi có streamUrl
  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    // Hủy player cũ nếu có
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    // Khởi tạo Plyr
    const player = new Plyr(videoRef.current, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "fullscreen",
      ],
      autoplay: true,
      keyboard: { focused: true, global: true },
      tooltips: { controls: true, seek: true },
      i18n: {
        play: "Phát",
        pause: "Tạm dừng",
        mute: "Tắt tiếng",
        unmute: "Bật tiếng",
        enterFullscreen: "Toàn màn hình",
        exitFullscreen: "Thoát toàn màn hình",
        settings: "Cài đặt",
        speed: "Tốc độ",
        normal: "Bình thường",
      },
    });

    // Cập nhật playerRef
    playerRef.current = player;

    // Đăng ký các sự kiện
    player.on("timeupdate", () => {
      const time = player.currentTime;
      const duration = player.duration;

      setCurrentTime(time);
      setVideoDuration(duration);

      // Lưu vị trí vào localStorage (giới hạn mỗi 5 giây)
      if (Math.floor(time) % 5 === 0 && file?.id) {
        saveVideoPosition(file.id, time, duration);
      }

      if (onTimeUpdate) {
        onTimeUpdate(time, duration);
      }
    });

    player.on("ended", handleVideoEnd);
    player.on("play", handleVideoPlay);
    player.on("ready", () => {
      handleLoadedMetadata();
      if (autoPlay) {
        player.play().catch(() => {});
      }
    });

    return () => {
      // Dọn dẹp khi component unmount
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [streamUrl, autoPlay, file]);

  const handleVideoEnd = useCallback(() => {
    if (!file?.id) return;

    saveVideoPosition(file.id, 0, videoDuration);

    if (onEnded) {
      onEnded();
    }
  }, [file, videoDuration, onEnded]);

  const handleVideoPlay = useCallback(() => {
    if (!file?.id) return;

    localStorage.setItem("lastWatchedVideoId", file.id);

    // Lưu trạng thái khóa học hiện tại vào localStorage
    const courseId = window.location.pathname.split("/").pop();
    localStorage.setItem(
      "currentVideoState",
      JSON.stringify({
        videoId: file.id,
        timestamp: Date.now(),
        courseId: courseId,
      })
    );
  }, [file]);

  const handleLoadedMetadata = useCallback(() => {
    setIsLoading(false);
  }, [file]);

  // Lưu vị trí video vào localStorage
  const saveVideoPosition = useCallback((videoId, position, duration) => {
    if (!videoId || position === undefined) return;

    try {
      // Lấy vị trí đã lưu
      const savedPositions = JSON.parse(
        localStorage.getItem("videoPositions") || "{}"
      );

      // Cập nhật vị trí cho video này
      savedPositions[videoId] = {
        position: position,
        duration: duration || 0,
        timestamp: Date.now(),
      };

      // Lưu trở lại vào localStorage
      localStorage.setItem("videoPositions", JSON.stringify(savedPositions));

      // Lưu ID video đã xem cuối cùng để khôi phục khi quay lại
      if (position > 0) {
        localStorage.setItem("lastWatchedVideoId", videoId);
      }
    } catch (error) {
      // console.error("Lỗi khi lưu vị trí video:", error);
    }
  }, []);

  const handleNextVideo = useCallback(() => {
    if (onNext) {
      // Lưu vị trí hiện tại trước khi chuyển bài
      if (file?.id) {
        saveVideoPosition(file.id, currentTime, videoDuration);
      }
      onNext();
    }
  }, [onNext, file, currentTime, videoDuration, saveVideoPosition]);

  const handlePreviousVideo = useCallback(() => {
    if (onPrevious) {
      // Lưu vị trí hiện tại trước khi chuyển bài
      if (file?.id) {
        saveVideoPosition(file.id, currentTime, videoDuration);
      }
      onPrevious();
    }
  }, [onPrevious, file, currentTime, videoDuration, saveVideoPosition]);

  // Hiển thị message khi không có video
  if (!file) {
    return (
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <p className="text-gray-400">Không có video được chọn</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black">
      <div className="relative w-full h-full">
        {/* Overlay loading */}
        {isLoading && <LoadingOverlay />}

        <video
          ref={videoRef}
          key={videoKey}
          className={`w-full h-full transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          src={streamUrl}
          autoPlay={true}
          playsInline
        />

        {/* Nút điều hướng */}
        <NavigationButtons
          onNext={handleNextVideo}
          onPrevious={handlePreviousVideo}
        />
      </div>
    </div>
  );
});

export default VideoPlayer;
