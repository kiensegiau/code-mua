import React, { useState, useEffect } from "react";
import { X, Maximize, Minimize } from "lucide-react";

const PDFViewer = ({ file, isOpen, onClose }) => {
  const [streamUrl, setStreamUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Hàm để lấy signed URL từ wasabi nếu có storage key
  const getStreamUrl = async (key) => {
    try {
      const encodedKey = encodeURIComponent(key);
      const response = await fetch(`/api/stream?key=${encodedKey}`);
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

  useEffect(() => {
    if (isOpen && file) {
      setIsLoading(true);
      setError(null);
      
      // Nếu file có storage key (từ wasabi), sử dụng API stream
      if (file.storage?.key) {
        getStreamUrl(file.storage.key)
          .then(url => {
            if (url) {
              setStreamUrl(url);
              setIsLoading(false);
            } else {
              // Fallback sang drive nếu không lấy được URL từ wasabi
              if (file.driveFileId) {
                const driveViewUrl = `https://drive.google.com/file/d/${file.driveFileId}/preview`;
                setStreamUrl(driveViewUrl);
                setIsLoading(false);
              } else {
                setError("Không thể tải file PDF này.");
                setIsLoading(false);
              }
            }
          })
          .catch(err => {
            console.error("Lỗi khi tải file:", err);
            setError("Đã có lỗi xảy ra khi tải file PDF.");
            setIsLoading(false);
          });
      } 
      // Sử dụng drive nếu không có storage key
      else if (file.driveFileId) {
        const driveViewUrl = `https://drive.google.com/file/d/${file.driveFileId}/preview`;
        setStreamUrl(driveViewUrl);
        setIsLoading(false);
      } else {
        setError("Không thể tải file PDF này.");
        setIsLoading(false);
      }
    }
  }, [isOpen, file]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className={`bg-gradient-to-b from-[#1e1e2e] to-[#181825] rounded-xl w-full ${isFullscreen ? 'h-full max-w-full' : 'max-w-5xl h-[85vh]'} flex flex-col overflow-hidden border border-indigo-500/20 shadow-2xl transition-all duration-300`}>
        {/* Header với các controls */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-800/50 bg-[#1e1e2e]/90 backdrop-blur-sm">
          <div className="flex items-center space-x-2 max-w-[70%]">
            <div className="hidden sm:block w-2 h-2 rounded-full bg-red-500"></div>
            <div className="hidden sm:block w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="hidden sm:block w-2 h-2 rounded-full bg-green-500"></div>
            <h3 className="text-sm sm:text-lg font-medium text-white ml-0 sm:ml-4 truncate">
              {file?.name || "Xem tài liệu PDF"}
            </h3>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-white transition-colors p-1 sm:p-1.5 rounded-full hover:bg-gray-800/50"
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-white bg-red-500/80 hover:bg-red-500 transition-colors p-1 sm:p-1.5 rounded-full"
              title="Đóng"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full h-full overflow-hidden bg-black/50 backdrop-blur-sm">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-300/20 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-300/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8 max-w-md bg-gray-900/90 rounded-xl shadow-xl border border-red-500/20">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-500/10">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-red-400 mb-6 text-lg">{error}</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-md hover:from-red-500 hover:to-red-400 transition-colors shadow-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && streamUrl && (
            <iframe
              src={streamUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              title="PDF Viewer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;