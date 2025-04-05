import React from 'react';

/**
 * Kiểm tra an toàn dữ liệu và truy cập thuộc tính lồng nhau
 * Tránh lỗi "Cannot read property X of undefined/null"
 * 
 * @param {Object} obj - Đối tượng cần kiểm tra
 * @param {string|function} path - Đường dẫn thuộc tính (vd: 'user.profile.name') hoặc callback function
 * @param {*} defaultValue - Giá trị mặc định khi không tìm thấy thuộc tính
 * @returns {*} Giá trị thuộc tính hoặc giá trị mặc định
 */
export function safeProp(obj, path, defaultValue = null) {
  // Nếu path là function, thực thi nó với obj và trả về kết quả hoặc defaultValue
  if (typeof path === 'function') {
    try {
      const result = path(obj);
      return result !== undefined && result !== null ? result : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  // Nếu path là chuỗi, xử lý truy cập thuộc tính lồng nhau
  if (!obj || typeof path !== 'string') return defaultValue;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    
    current = current[keys[i]];
  }

  return current !== undefined && current !== null ? current : defaultValue;
}

/**
 * Kiểm tra một đối tượng có an toàn để render không
 * 
 * @param {Object} obj - Đối tượng cần kiểm tra
 * @param {Array<string>} requiredProps - Danh sách thuộc tính bắt buộc
 * @returns {boolean} True nếu đối tượng an toàn để render
 */
export function isSafeToRender(obj, requiredProps = []) {
  if (!obj) return false;
  
  if (requiredProps.length === 0) return true;
  
  return requiredProps.every(prop => {
    const nested = prop.split('.');
    let current = obj;
    
    for (let i = 0; i < nested.length; i++) {
      if (current === null || current === undefined) {
        return false;
      }
      current = current[nested[i]];
    }
    
    return current !== undefined && current !== null;
  });
}

/**
 * Kiểm tra một mảng có an toàn để map không
 * 
 * @param {Array} array - Mảng cần kiểm tra
 * @returns {boolean} True nếu mảng an toàn để map
 */
export function isSafeArray(array) {
  return Array.isArray(array) && array.length > 0;
}

/**
 * Bọc một component để đảm bảo nhận props an toàn
 * 
 * @param {Function} Component - Component cần bọc
 * @param {Array<string>} requiredProps - Danh sách props bắt buộc
 * @param {React.ReactNode} fallback - Component hiển thị khi không đủ props
 * @returns {Function} Component đã được bọc
 */
export function withSafeProps(Component, requiredProps = [], fallback = null) {
  function SafeComponent(props) {
    if (!isSafeToRender(props, requiredProps)) {
      return fallback;
    }
    
    return <Component {...props} />;
  }
  
  // Giữ lại displayName cho React DevTools
  const displayName = Component.displayName || Component.name || 'Component';
  SafeComponent.displayName = `withSafeProps(${displayName})`;
  
  return SafeComponent;
} 