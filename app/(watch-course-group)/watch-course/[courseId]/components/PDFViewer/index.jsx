import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const PDFViewer = ({ file, isOpen, onClose }) => {
  const [streamUrl, setStreamUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1f1f1f] rounded-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-gray-800 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">
            {file?.name || "Xem tài liệu PDF"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 w-full h-full overflow-hidden bg-black">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-[#ff4d4f] rounded-full animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-6 max-w-md">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#ff4d4f] text-white rounded-md hover:bg-[#ff3538] transition-colors"
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