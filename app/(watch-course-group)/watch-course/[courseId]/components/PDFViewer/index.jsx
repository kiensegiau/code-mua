import React, { useState, useRef, useEffect } from "react";
import { X, Maximize, Minimize, ExternalLink, Download } from "lucide-react";

const PDFViewer = ({ file, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(isOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Xử lý tất cả các effect khi component mở
  useEffect(() => {
    if (!isOpen) return;
    
    // Xử lý click bên ngoài để đóng modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    
    // Khởi tạo viewer khi mở
    setIsLoading(true);
    setError(null);
    
    if (!file?.driveFileId) {
      setError("Không thể tải file PDF. File không có ID Google Drive.");
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, file, onClose]);
  
  if (!isOpen) return null;
  
  // Các hàm xử lý sự kiện
  const openInNewTab = () => file?.driveFileId && 
    window.open(`https://drive.google.com/file/d/${file.driveFileId}/view?usp=sharing`, '_blank');

  const downloadFile = () => {
    if (!file?.driveFileId) return;
    
    // Tạo một thẻ a ẩn để tải xuống
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.driveFileId}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = file.name || `document_${file.driveFileId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const driveUrl = file?.driveFileId ? 
    `https://drive.google.com/file/d/${file.driveFileId}/preview?usp=drivesdk&embedded=true` : '';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className={`bg-gradient-to-b from-[#1e1e2e] to-[#181825] rounded-xl w-full 
        ${isFullscreen ? 'h-full max-w-full' : 'max-w-5xl h-[85vh]'} 
        flex flex-col overflow-hidden border border-indigo-500/20 shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-gray-800/50 bg-[#1e1e2e]/90">
          <h3 className="text-sm sm:text-lg font-medium text-white truncate flex items-center">
            <span className="hidden sm:flex mr-4 space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </span>
            {file?.name || "Xem tài liệu PDF"}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={downloadFile} 
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50"
              title="Tải xuống"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={openInNewTab} 
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50"
              title="Mở trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50"
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose} 
              className="text-white bg-red-500/80 hover:bg-red-500 p-1 rounded-full"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full h-full overflow-hidden bg-black/50">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-300/20 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-6 max-w-md bg-gray-900/90 rounded-xl border border-red-500/20">
                <X className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={onClose} className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-400">
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={driveUrl}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              title="PDF Viewer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;