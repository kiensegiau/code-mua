import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "./plyr-custom.css"; // Import CSS tùy chỉnh cho Plyr

// Hàm helper để lấy stream URL từ API
const getStreamUrl = async (key) => {
  try {
    const encodedKey = encodeURIComponent(key);
    const response = await fetch(`/api/stream?key=${encodedKey}`);
    const data = await response.json();

    if (data.success && data.streamUrl) {
      console.log("Đã lấy được stream URL");
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
    <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-[#ff4d4f] rounded-full animate-spin"></div>
    </div>
  );
});

// Component điều hướng riêng biệt
const NavigationButtons = memo(function NavigationButtons({
  onNext,
  onPrevious,
}) {
  return (
    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
      <button
        onClick={onPrevious}
        className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-200 transform hover:scale-110 pointer-events-auto hover:bg-[#ff4d4f]/80"
        title="Bài trước"
      >
        <IoChevronBack className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={onNext}
        className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-200 transform hover:scale-110 pointer-events-auto hover:bg-[#ff4d4f]/80"
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
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(() => {
    return `${file?.id || "initial"}-${Date.now()}`;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [streamUrl, setStreamUrl] = useState("");

  // Sử dụng ref để theo dõi file hiện tại để tránh vấn đề với useEffect cleanup
  const currentFileRef = useRef(file);

  useEffect(() => {
    // Cập nhật ref khi file thay đổi
    currentFileRef.current = file;
  }, [file]);

  useEffect(() => {
    console.log("Video file received in player:", {
      file,
      key: file?.storage?.key,
      type: file?.type,
      id: file?.id,
    });

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
          console.log(
            `Phục hồi vị trí cho video ${file.id}: ${savedPosition.position}s`
          );
          setCurrentTime(savedPosition.position);
          if (playerRef.current) {
            playerRef.current.currentTime = savedPosition.position;
          }
        } else {
          setCurrentTime(0);
        }
      } catch (error) {
        console.error("Lỗi khi khôi phục vị trí video:", error);
        setCurrentTime(0);
      }
    }
  }, [file]);

  // Thêm useEffect để lấy streamUrl khi file thay đổi
  useEffect(() => {
    const fetchStreamUrl = async () => {
      if (!file?.storage?.key) {
        console.error("Không có storage key cho video");
        return;
      }

      setIsLoading(true);
      const url = await getStreamUrl(file.storage.key);

      if (url) {
        setStreamUrl(url);
        console.log("Đã cập nhật URL video:", file.id);
      } else {
        console.error("Không thể lấy URL video");
      }
    };

    fetchStreamUrl();
  }, [file]);

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
      autoplay: autoPlay,
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
    player.on("ready", handleLoadedMetadata);

    return () => {
      // Dọn dẹp khi component unmount
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [streamUrl, autoPlay, file]);

  const handleVideoEnd = useCallback(() => {
    if (!file?.id) return;

    console.log("Video đã kết thúc, xóa tiến trình và chuyển bài tiếp theo");
    saveVideoPosition(file.id, 0, videoDuration);

    if (onEnded) {
      onEnded();
    }
  }, [file, videoDuration, onEnded]);

  const handleVideoPlay = useCallback(() => {
    if (!file?.id) return;

    console.log(`Video đang phát: ${file.id}`);
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
    console.log(`Video đã tải: ${file?.id}`);
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
      console.error("Lỗi khi lưu vị trí video:", error);
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
          autoPlay={false} // Plyr sẽ xử lý autoplay
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
