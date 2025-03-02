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
  const [videoKey, setVideoKey] = useState(() => {
    // Sử dụng timestamp + ID để đảm bảo luôn mới khi component mount
    return `${file?.helvidUrl || 'initial'}-${Date.now()}`;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  
  // Sử dụng ref để theo dõi file hiện tại để tránh vấn đề với useEffect cleanup
  const currentFileRef = useRef(file);
  
  useEffect(() => {
    // Cập nhật ref khi file thay đổi
    currentFileRef.current = file;
  }, [file]);
  
  useEffect(() => {
    console.log("Video file received in player:", {
      file,
      helvidUrl: file?.helvidUrl,
      proxyUrl: file?.proxyUrl,
      type: file?.type,
      id: file?.id
    });
    
    if (file?.helvidUrl) {
      setIsLoading(true);
      // Sử dụng timestamp để đảm bảo key là duy nhất mỗi khi file thay đổi
      setVideoKey(`${file.helvidUrl}-${Date.now()}`);
      
      // Cố gắng khôi phục vị trí đã lưu cho video này
      try {
        const savedPositions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
        const savedPosition = savedPositions[file.id];
        if (savedPosition && savedPosition.position > 0) {
          console.log(`Phục hồi vị trí cho video ${file.id}: ${savedPosition.position}s`);
          setCurrentTime(savedPosition.position);
        } else {
          setCurrentTime(0);
        }
      } catch (error) {
        console.error("Lỗi khi khôi phục vị trí video:", error);
        setCurrentTime(0);
      }
    }
  }, [file]);

  // Xử lý sự kiện video kết thúc từ iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Kiểm tra nguồn tin nhắn từ helvid.net
      if (event.origin.includes('helvid.net')) {
        try {
          const data = JSON.parse(event.data);
          const currentFile = currentFileRef.current;
          
          // Kiểm tra nếu video đã kết thúc
          if (data.event === 'ended' && onEnded) {
            console.log("Video đã kết thúc, xóa tiến trình và chuyển bài tiếp theo");
            // Xóa vị trí đã lưu khi video kết thúc
            if (currentFile?.id) {
              saveVideoPosition(currentFile.id, 0, data.duration);
            }
            onEnded();
          }
          
          // Theo dõi tiến trình video
          if (data.event === 'timeupdate' && data.currentTime) {
            setCurrentTime(data.currentTime);
            if (data.duration) {
              setVideoDuration(data.duration);
            }
            
            // Lưu vị trí vào localStorage (giới hạn mỗi 5 giây)
            if (Math.floor(data.currentTime) % 5 === 0 && currentFile?.id) {
              // Chỉ lưu khi thời gian thay đổi thực sự (tránh lưu quá nhiều)
              saveVideoPosition(currentFile.id, data.currentTime, data.duration);
            }
            
            if (onTimeUpdate) {
              onTimeUpdate(data.currentTime, data.duration);
            }
          }
          
          // Xử lý sự kiện người dùng tương tác với video
          if (data.event === 'playing' && currentFile?.id) {
            console.log(`Video đang phát: ${currentFile.id}`);
            // Lưu video đang phát hiện tại
            localStorage.setItem('lastWatchedVideoId', currentFile.id);
            
            // Lưu trạng thái khóa học hiện tại vào localStorage
            if (currentFile) {
              const courseId = window.location.pathname.split('/').pop();
              localStorage.setItem(
                "currentVideoState",
                JSON.stringify({
                  videoId: currentFile.id,
                  timestamp: Date.now(),
                  courseId: courseId
                })
              );
            }
          }
        } catch (e) {
          // Không phải định dạng JSON hoặc không phải dữ liệu từ video
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onEnded, onTimeUpdate]);

  // Lưu vị trí video vào localStorage
  const saveVideoPosition = (videoId, position, duration) => {
    if (!videoId || position === undefined) return;
    
    try {
      // Lấy vị trí đã lưu
      const savedPositions = JSON.parse(localStorage.getItem('videoPositions') || '{}');
      
      // Cập nhật vị trí cho video này
      savedPositions[videoId] = {
        position: position,
        duration: duration || 0,
        timestamp: Date.now(),
      };
      
      // Lưu trở lại vào localStorage
      localStorage.setItem('videoPositions', JSON.stringify(savedPositions));
      
      // Lưu ID video đã xem cuối cùng để khôi phục khi quay lại
      if (position > 0) {
        localStorage.setItem('lastWatchedVideoId', videoId);
      }
    } catch (error) {
      console.error("Lỗi khi lưu vị trí video:", error);
    }
  };

  const handleNextVideo = () => {
    if (onNext) {
      // Lưu vị trí hiện tại trước khi chuyển bài
      if (file?.id) {
        saveVideoPosition(file.id, currentTime, videoDuration);
      }
      onNext();
    }
  };

  const handlePreviousVideo = () => {
    if (onPrevious) {
      // Lưu vị trí hiện tại trước khi chuyển bài
      if (file?.id) {
        saveVideoPosition(file.id, currentTime, videoDuration);
      }
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
    
    // Tạo URL với tham số thời gian nếu có vị trí đã lưu
    let url = '';
    
    // Nếu helvidUrl đã là URL đầy đủ
    if (file.helvidUrl.startsWith('https://helvid.net/play/index/')) {
      url = file.helvidUrl;
    } else {
      // Nếu helvidUrl chỉ là ID
      url = `https://helvid.net/play/index/${file.helvidUrl}`;
    }
    
    // Thêm tham số thời gian bắt đầu nếu có vị trí đã lưu
    if (currentTime > 0) {
      // Thêm tham số start vào URL
      const startTime = Math.floor(currentTime);
      url += url.includes('?') ? '&' : '?';
      url += `start=${startTime}`;
      
      console.log(`Đặt thời gian bắt đầu cho video ${file.id} tại: ${startTime}s`);
    }
    
    // Thêm tham số autoplay
    url += url.includes('?') ? '&' : '?';
    url += `autoplay=1`;
    
    return url;
  };

  const videoUrl = getVideoUrl();
  console.log("URL video cuối cùng:", videoUrl);

  const handleIframeLoad = () => {
    setIsLoading(false);
    console.log(`Video đã tải: ${file.id}`);
  };

  return (
    <div className="relative w-full aspect-video bg-black">
      <div className="relative w-full h-full">
        {/* Overlay loading */}
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

        {/* Nút điều hướng */}
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
        
        {/* Thanh tiến trình */}
        {!isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-[#ff4d4f] transition-all duration-300"
              style={{ width: `${(currentTime / (videoDuration || 1)) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
