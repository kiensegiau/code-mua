"use client";

import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI khi có lỗi
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ghi log lỗi
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Xử lý đặc biệt cho lỗi Promise trong React
    if (error && error.message && (
      error.message.includes("undefined is not a promise") || 
      error.message.includes("Promise.resolve().then") ||
      error.message.includes("Minified React error") ||
      error.message.includes("Hydration failed")
    )) {
      // Lỗi thường gặp khi chạy Promise.resolve().then không đúng cách
      console.warn("Detected a common React promise/hydration error. Attempting recovery...");
      
      // Tự động làm mới trang sau 3 giây nếu là lỗi hydration
      if (error.message.includes("Hydration failed")) {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    }
    
    // Gửi lỗi đến hệ thống theo dõi nếu cần
    // logErrorToService(error, errorInfo);
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  render() {
    if (this.state.hasError) {
      // Hiển thị thông báo lỗi cụ thể hơn dựa vào loại lỗi
      let errorMessage = "Ứng dụng gặp sự cố khi tải trang này. Vui lòng thử lại sau.";
      let autoReload = false;
      
      // Kiểm tra xem có phải lỗi hydration không
      if (this.state.error && this.state.error.message) {
        if (this.state.error.message.includes("Hydration failed")) {
          errorMessage = "Đang tự động khôi phục trang...";
          autoReload = true;
        } else if (this.state.error.message.includes("Promise") || this.state.error.message.includes("then")) {
          errorMessage = "Lỗi xử lý dữ liệu bất đồng bộ. Đang tải lại trang...";
          autoReload = true;
        }
      }
      
      // Giao diện hiển thị khi có lỗi
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
          <div className="w-full max-w-md p-6 rounded-lg border border-red-500/30 bg-gray-900/60 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-medium mb-3">Đã xảy ra lỗi</h2>
            <p className="text-gray-400 mb-4">
              {errorMessage}
            </p>
            
            {/* Nút hiển thị chi tiết lỗi */}
            <button 
              onClick={this.toggleDetails}
              className="mb-4 text-sm text-gray-400 hover:text-gray-300 underline"
            >
              {this.state.showDetails ? "Ẩn chi tiết lỗi" : "Hiển thị chi tiết lỗi"}
            </button>
            
            {/* Chi tiết lỗi */}
            {this.state.showDetails && (
              <div className="mb-4 p-3 bg-black/50 rounded-md text-left overflow-auto max-h-60 text-xs">
                <p className="font-mono text-red-400 mb-2">
                  {this.state.error && this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="font-mono text-gray-400 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            
            {autoReload ? (
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <div className="bg-red-500 h-2 rounded-full animate-[reload_3s_linear_forwards]"></div>
              </div>
            ) : (
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Tải lại trang
                </button>
                <button
                  onClick={() => window.location.href = '/home'}
                  className="px-5 py-2 border border-gray-600 hover:bg-gray-800 text-gray-300 rounded-md transition-colors"
                >
                  Về trang chủ
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 