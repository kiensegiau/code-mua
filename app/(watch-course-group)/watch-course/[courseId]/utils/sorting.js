/**
 * Hàm phân tích số từ tiêu đề/tên, hỗ trợ nhiều định dạng
 * - Xử lý format x.y (ví dụ: "1.2 Bài học")
 * - Xử lý format x-y (ví dụ: "1-2 Bài học")
 * - Xử lý định dạng "Bài X Phần Y" (ví dụ: "Bài 1 Phần 2") - sắp xếp theo Y
 * - Xử lý định dạng "Buổi X" (ví dụ: "Buổi 1", "Buổi 10") - sắp xếp theo số buổi
 * - Xử lý định dạng có hai số liền nhau (ví dụ: "Bài 2 Danh từ 61 80")
 * - Xử lý số ở đầu chuỗi (ví dụ: "1 Bài học")
 * - Xử lý chuỗi "Tổng Hợp Từ Vựng 1700 Phần (...)" - sắp xếp theo số ở cuối
 * - Xử lý bất kỳ số nào trong chuỗi nếu không tìm thấy theo các cách trên
 * @param {string} text - Chuỗi cần phân tích
 * @returns {number} - Số để sắp xếp
 */
export const getNumberFromTitle = (text = "") => {
  // Nếu chuỗi rỗng hoặc null
  if (!text) return 999999;

  // Chuẩn hóa chuỗi (loại bỏ khoảng trắng thừa và chuyển về chữ thường)
  const normalizedText = text.trim().toLowerCase();

  // ===== ĐỊNH DẠNG ĐẶC BIỆT =====

  // 0. Xử lý định dạng "Buổi X" - thêm case này để xử lý đúng thứ tự các buổi
  const buoiMatch = normalizedText.match(/^buổi\s+(\d+)/i);
  if (buoiMatch) {
    const buoiNumber = parseInt(buoiMatch[1]);
    return addMagnitudePrefix(buoiNumber);
  }

  // 0AA. Xử lý đặc biệt cho "Bài Tập Từ Vựng X Y" - sắp xếp theo số X
  const baiTapMatch = normalizedText.match(/^bài\s+tập\s+từ\s+vựng\s+(\d+)\s+(\d+)(?:(?:\s+|\.).*)?$/i);
  if (baiTapMatch) {
    const firstNumber = parseInt(baiTapMatch[1]);
    const secondNumber = parseInt(baiTapMatch[2]);
    // Kết hợp hai số thành một số duy nhất để sắp xếp, ưu tiên số đầu tiên (X)
    return addMagnitudePrefix(firstNumber * 1000 + secondNumber % 1000);
  }

  // 0A. Xử lý định dạng "Bài X" - tương tự như Buổi X
  const baiMatch = normalizedText.match(/^bài\s+(\d+)/i);
  if (baiMatch) {
    const baiNumber = parseInt(baiMatch[1]);
    return addMagnitudePrefix(baiNumber);
  }

  // 0B. Xử lý định dạng "Chương X" - tương tự như Buổi X
  const chuongMatch = normalizedText.match(/^chương\s+(\d+)/i);
  if (chuongMatch) {
    const chuongNumber = parseInt(chuongMatch[1]);
    return addMagnitudePrefix(chuongNumber);
  }

  // 0C. Xử lý định dạng "Phần X" - tương tự như Buổi X
  const phanMatch = normalizedText.match(/^phần\s+(\d+)/i);
  if (phanMatch) {
    const phanNumber = parseInt(phanMatch[1]);
    return addMagnitudePrefix(phanNumber);
  }

  // 0D. Xử lý đặc biệt cho "Tổng Hợp Từ Vựng 1700 Phần" - cố định theo mẫu chính xác
  if (normalizedText.includes("tổng hợp từ vựng 1700 phần")) {
    // Tách lấy số ở cuối chuỗi
    const matches = normalizedText.match(/phần\s*(\d+)|phần\s*\(?(\d+)\)?/i);
    if (matches) {
      const partNumber = parseInt(matches[1] || matches[2]);
      return partNumber * 1000;
    }
  }

  // 0E. Định dạng "Tổng Hợp Từ Vựng 1700 Phần (X)" - backup với regex linh hoạt hơn
  const tongHopMatch = normalizedText.match(
    /tổng\s+hợp\s+từ\s+vựng\s+1700\s+phần.*?(\d+)(?:\s|\(|\)|$)/i
  );
  if (tongHopMatch) {
    const partNumber = parseInt(tongHopMatch[1]);
    return partNumber * 1000;
  }

  // ===== XỬ LÝ THEO MAGNITUDE PREFIXING =====

  // Tìm tất cả các số trong chuỗi
  const allNumbers = normalizedText.match(/\d+/g) || [];

  if (allNumbers.length > 0) {
    // 1. Định dạng "Bài X Phần Y" - lấy Y làm tiêu chí sắp xếp chính
    const baiPhanMatch = normalizedText.match(/bài\s+\d+\s+phần\s+(\d+)/i);
    if (baiPhanMatch) {
      const partNumber = parseInt(baiPhanMatch[1]);
      return addMagnitudePrefix(partNumber);
    }

    // 2. Định dạng "Bài X Danh từ Y Z" - lấy Y làm tiêu chí sắp xếp chính
    const danhTuMatch = normalizedText.match(
      /bài\s+\d+\s+danh\s+từ\s+(\d+)(?:\s+|-)(\d+)/i
    );
    if (danhTuMatch) {
      const firstNumber = parseInt(danhTuMatch[1]);
      return addMagnitudePrefix(firstNumber);
    }

    // 3. Định dạng "xx yy" - lấy xx làm tiêu chí sắp xếp
    const twoNumbersPattern = /^(\d+)\s+(\d+)/;
    const twoNumbers = normalizedText.match(twoNumbersPattern);
    if (twoNumbers) {
      const firstNumber = parseInt(twoNumbers[1]);
      return addMagnitudePrefix(firstNumber);
    }

    // 4. Định dạng x.y (ví dụ: "1.2 Bài học")
    const dotFormatMatch = normalizedText.match(/^(\d+)\.(\d+)/);
    if (dotFormatMatch) {
      const firstNumber = parseInt(dotFormatMatch[1]);
      const secondNumber = parseInt(dotFormatMatch[2]);
      // Kết hợp hai số thành một số duy nhất để sắp xếp
      return addMagnitudePrefix(firstNumber * 1000 + secondNumber);
    }

    // 5. Định dạng x-y (ví dụ: "1-2 Bài học")
    const dashFormatMatch = normalizedText.match(/^(\d+)-(\d+)/);
    if (dashFormatMatch) {
      const firstNumber = parseInt(dashFormatMatch[1]);
      const secondNumber = parseInt(dashFormatMatch[2]);
      return addMagnitudePrefix(firstNumber * 1000 + secondNumber);
    }

    // 6. Tìm số ở đầu chuỗi
    const startNumberMatch = normalizedText.match(/^(\d+)/);
    if (startNumberMatch) {
      const num = parseInt(startNumberMatch[1]);
      return addMagnitudePrefix(num);
    }

    // 7. Tìm số ở cuối chuỗi (đặc biệt hữu ích cho các tiêu đề dài giống nhau)
    const endNumberMatch = normalizedText.match(/(\d+)(?:\s|\(|\)|$)$/);
    if (endNumberMatch) {
      const num = parseInt(endNumberMatch[1]);
      return addMagnitudePrefix(num);
    }

    // 8. Sử dụng số đầu tiên tìm thấy (fallback)
    const firstNumber = parseInt(allNumbers[0]);
    return addMagnitudePrefix(firstNumber);
  }

  // 9. Không có số nào, sắp xếp theo bảng chữ cái
  return normalizedText.charCodeAt(0) * 10000 + normalizedText.length;
};

/**
 * Hàm áp dụng kỹ thuật "magnitude prefixing" cho số
 * Đây là kỹ thuật để đảm bảo sắp xếp đúng thứ tự số
 * bằng cách thêm số chữ số vào trước số đó
 * Ví dụ: 5 -> 15000, 10 -> 210000, 100 -> 3100000
 * @param {number} num - Số cần xử lý
 * @returns {number} - Số đã được xử lý để sắp xếp
 */
function addMagnitudePrefix(num) {
  if (num === 0) return 0;

  // Đổi thành chuỗi để đếm số chữ số
  const numStr = num.toString();
  const digitCount = numStr.length;

  // Thêm số chữ số vào đầu và nhân với 10^6 để đảm bảo đủ lớn
  // Sau đó cộng thêm số gốc để giữ thứ tự giữa các số cùng độ dài
  return digitCount * 1000000 + num;
}

/**
 * Sắp xếp các đối tượng theo số trong thuộc tính title
 * @param {Object} a - Đối tượng đầu tiên
 * @param {Object} b - Đối tượng thứ hai
 * @returns {number} - Kết quả so sánh (-1, 0, 1)
 */
export const sortByTitle = (a, b) => {
  // Xử lý trường hợp title không tồn tại
  if (!a.title && !b.title) return 0;
  if (!a.title) return 1;
  if (!b.title) return -1;

  const numA = getNumberFromTitle(a.title);
  const numB = getNumberFromTitle(b.title);

  // Nếu hai số giống nhau, so sánh theo alphabet
  if (numA === numB) {
    return a.title.localeCompare(b.title);
  }

  return numA - numB;
};

/**
 * Sắp xếp các đối tượng theo số trong thuộc tính name
 * @param {Object} a - Đối tượng đầu tiên
 * @param {Object} b - Đối tượng thứ hai
 * @returns {number} - Kết quả so sánh (-1, 0, 1)
 */
export const sortByName = (a, b) => {
  // Xử lý trường hợp name không tồn tại
  if (!a.name && !b.name) return 0;
  if (!a.name) return 1;
  if (!b.name) return -1;

  const numA = getNumberFromTitle(a.name);
  const numB = getNumberFromTitle(b.name);

  // Nếu hai số giống nhau, so sánh theo alphabet
  if (numA === numB) {
    return a.name.localeCompare(b.name);
  }

  return numA - numB;
};
