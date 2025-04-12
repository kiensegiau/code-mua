export const metadata = {
  title: "TopUni HOCMAI - Luyện thi Đại học 2k8",
  description: "Luyện thi đại học toàn diện cho học sinh 2k8 - Chuyên biệt cho kỳ thi ĐGNL, ĐGTD và Tốt nghiệp THPT"
};

export default function TopuniLayout({ children }) {
  // Sử dụng layout riêng, không dùng layout chung với sidebar
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
} 