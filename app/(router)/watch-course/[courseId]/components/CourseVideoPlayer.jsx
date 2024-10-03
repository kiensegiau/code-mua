import React, { useEffect, useRef } from 'react';

function CourseVideoPlayer({ lesson, videoUrl, isLoading }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
      videoRef.current.play().catch(error => console.error('Autoplay was prevented:', error));
    }
  }, [videoUrl]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {isLoading ? (
        <div className="text-white">Đang tải video...</div>
      ) : videoUrl ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          src={videoUrl}
          key={videoUrl}
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      ) : (
        <div className="text-white">
          Bài giảng đang được cập nhật, vui lòng chờ
        </div>
      )}
    </div>
  );
}

export default CourseVideoPlayer;