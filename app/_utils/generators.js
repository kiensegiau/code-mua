/**
 * Tạo username ngẫu nhiên với tiền tố cho trước
 * @param {string} prefix - Tiền tố cho username
 * @returns {string} - Username đã tạo
 */
export function generateUsername(prefix = 'user') {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}_${timestamp}${random}`;
}

/**
 * Tạo mật khẩu ngẫu nhiên với độ dài cho trước
 * @param {number} length - Độ dài của mật khẩu
 * @returns {string} - Mật khẩu đã tạo
 */
export function generatePassword(length = 12) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Đảm bảo mật khẩu có ít nhất một ký tự từ mỗi loại
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Tạo phần còn lại của mật khẩu
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Đảo ngẫu nhiên các ký tự trong mật khẩu
  return password.split('').sort(() => 0.5 - Math.random()).join('');
} 