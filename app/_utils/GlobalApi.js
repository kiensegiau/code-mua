// FILE NÀY ĐÃ BỊ THAY THẾ BẰNG GlobalMongoApi.js
// Đây là phiên bản không hoạt động (noop) để tương thích ngược

const warnDeprecated = (method) => {
  console.warn(`DEPRECATED: GlobalApi.${method} đã bị thay thế bằng GlobalMongoApi.${method}. Vui lòng cập nhật code của bạn.`);
  throw new Error(`DEPRECATED: GlobalApi.${method} đã bị thay thế bằng GlobalMongoApi.${method}. Vui lòng cập nhật code của bạn.`);
};

// Tạo một object với các phương thức cảnh báo
const GlobalApi = new Proxy({}, {
  get: (target, prop) => {
    // Trả về hàm cảnh báo cho mọi truy cập thuộc tính
    return () => warnDeprecated(prop);
  }
});

export default GlobalApi;
