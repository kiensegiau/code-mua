export const getNumberFromTitle = (text = "") => {
  // Nếu chuỗi rỗng hoặc null
  if (!text) return 999999;

  // Chuẩn hóa chuỗi (loại bỏ khoảng trắng thừa)
  const normalizedText = text.trim();

  // Xử lý trường hợp có định dạng x.y (ví dụ: "1.2 Bài học")
  const dotFormatMatch = normalizedText.match(/^(\d+)\.(\d+)/);
  if (dotFormatMatch) {
    // Ưu tiên sắp xếp theo số đầu tiên, sau đó mới đến số thứ hai
    const firstNumber = parseInt(dotFormatMatch[1]);
    const secondNumber = parseInt(dotFormatMatch[2]);
    // Trả về giá trị kết hợp (số thứ nhất * 1000 + số thứ hai)
    return firstNumber * 1000 + secondNumber;
  }

  // Xử lý trường hợp có định dạng x-y
  const dashFormatMatch = normalizedText.match(/^(\d+)-(\d+)/);
  if (dashFormatMatch) {
    const firstNumber = parseInt(dashFormatMatch[1]);
    const secondNumber = parseInt(dashFormatMatch[2]);
    return firstNumber * 1000 + secondNumber;
  }

  // Tìm số ở đầu chuỗi
  const startNumberMatch = normalizedText.match(/^(\d+)/);
  if (startNumberMatch) {
    return parseInt(startNumberMatch[1]) * 1000;
  }

  // Tìm bất kỳ số nào đầu tiên trong chuỗi
  const anyNumberMatch = normalizedText.match(/(\d+)/);
  if (anyNumberMatch) {
    return parseInt(anyNumberMatch[1]) * 1000;
  }

  // Không tìm thấy số, xếp xuống cuối
  return 999999;
};

export const sortByTitle = (a, b) => {
  const numA = getNumberFromTitle(a.title);
  const numB = getNumberFromTitle(b.title);
  return numA - numB;
};

export const sortByName = (a, b) => {
  const numA = getNumberFromTitle(a.name);
  const numB = getNumberFromTitle(b.name);
  return numA - numB;
};
