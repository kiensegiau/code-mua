import { useRef, useEffect } from "react";

export default function VideoPlayer({
  file,
  onEnded,
  onTimeUpdate,
  onNext,
  onPrevious,
  autoPlay = true,
}) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    console.log("Video file received in player:", {
      file,
      helvidUrl: file?.helvidUrl,
      proxyUrl: file?.proxyUrl,
      type: file?.type
    });
  }, [file]);

  if (!file) {
    return (
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <p className="text-gray-400">Không có video được chọn</p>
      </div>
    );
  }

  // Xử lý URL video dựa trên thông tin file
  const videoUrl = file.helvidUrl 
    ? `https://helvid.net/play/index/${file.helvidUrl.replace('https://helvid.net/play/index/', '')}`
    : '';

  console.log("Final video URL:", videoUrl);

  return (
    <div className="relative w-full aspect-video bg-black">
      <div className="relative w-full h-full">
        <iframe
          className="w-full h-full"
          src={videoUrl}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  );
}
