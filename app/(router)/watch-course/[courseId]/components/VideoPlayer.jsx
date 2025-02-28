import { useRef, useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function VideoPlayer({
  file,
  onEnded,
  onTimeUpdate,
  onNext,
  onPrevious,
  autoPlay = true,
}) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoKey, setVideoKey] = useState(file?.helvidUrl || 'initial');
  
  useEffect(() => {
    console.log("Video file received in player:", {
      file,
      helvidUrl: file?.helvidUrl,
      proxyUrl: file?.proxyUrl,
      type: file?.type
    });
    
    if (file?.helvidUrl) {
      setIsLoading(true);
      setVideoKey(file.helvidUrl); // Set a new key to force iframe refresh
    }
  }, [file]);

  // Handle video ended event from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Check if message is from helvid.net
      if (event.origin.includes('helvid.net')) {
        try {
          const data = JSON.parse(event.data);
          // Check if the video has ended
          if (data.event === 'ended' && onEnded) {
            onEnded();
          }
          // Track video progress
          if (data.event === 'timeupdate' && onTimeUpdate) {
            onTimeUpdate(data.currentTime, data.duration);
          }
        } catch (e) {
          // Not JSON or not our data
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onEnded, onTimeUpdate]);

  const handleNextVideo = () => {
    if (onNext) {
      onNext();
    }
  };

  const handlePreviousVideo = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  if (!file) {
    return (
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <p className="text-gray-400">Không có video được chọn</p>
      </div>
    );
  }

  // Xử lý URL video dựa trên thông tin file
  const getVideoUrl = () => {
    if (!file.helvidUrl) return '';
    
    // Nếu helvidUrl đã là URL đầy đủ
    if (file.helvidUrl.startsWith('https://helvid.net/play/index/')) {
      return file.helvidUrl;
    }
    
    // Nếu helvidUrl chỉ là ID
    return `https://helvid.net/play/index/${file.helvidUrl}`;
  };

  const videoUrl = getVideoUrl();
  console.log("Final video URL:", videoUrl);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      <div className="relative w-full h-full">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#ff4d4f] rounded-full animate-spin"></div>
          </div>
        )}
        
        <iframe
          key={videoKey}
          className={`w-full h-full transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          src={videoUrl}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeLoad}
        ></iframe>

        {/* Navigation controls */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
          <button 
            onClick={handlePreviousVideo}
            className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-200 transform hover:scale-110 pointer-events-auto hover:bg-[#ff4d4f]/80"
            title="Bài trước"
          >
            <IoChevronBack className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={handleNextVideo}
            className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-200 transform hover:scale-110 pointer-events-auto hover:bg-[#ff4d4f]/80"
            title="Bài tiếp theo"
          >
            <IoChevronForward className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
