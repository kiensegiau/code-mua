"use client";
import React from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">TopUni</span>
              <span className="text-sm bg-blue-600 text-white px-2 py-0.5 rounded">2026</span>
            </div>
            <p className="text-sm mb-4">
              Nền tảng luyện thi đại học hàng đầu Việt Nam, đồng hành cùng hàng nghìn sĩ tử chinh phục đại học top mỗi năm.
            </p>
            <div className="flex space-x-4 text-lg">
              <a href="https://facebook.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                <FaFacebook />
              </a>
              <a href="https://youtube.com" className="text-red-500 hover:text-red-400 transition-colors">
                <FaYoutube />
              </a>
              <a href="https://tiktok.com" className="text-gray-200 hover:text-white transition-colors">
                <FaTiktok />
              </a>
            </div>
          </div>
          
          {/* Column 2 - Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#lo-trinh" className="hover:text-blue-400 transition-colors">Lộ trình học</Link>
              </li>
              <li>
                <Link href="#giao-vien" className="hover:text-blue-400 transition-colors">Đội ngũ giáo viên</Link>
              </li>
              <li>
                <Link href="#hoc-sinh" className="hover:text-blue-400 transition-colors">Học sinh xuất sắc</Link>
              </li>
              <li>
                <Link href="#challenges" className="hover:text-blue-400 transition-colors">Thách thức kỳ thi</Link>
              </li>
              <li>
                <Link href="#dang-ky" className="hover:text-blue-400 transition-colors">Đăng ký tư vấn</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Courses */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Khóa học</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">Luyện thi ĐGNL ĐHQG HN</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">Luyện thi ĐGTD ĐHBK</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">Luyện thi ĐGNL ĐHQG HCM</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">Luyện thi THPT QG</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">Luyện thi IELTS</Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 text-lg mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white mb-1">Văn phòng Hà Nội</p>
                  <p>Tòa 25T1 Nguyễn Thị Thâp, Phường Trung Hòa, Quận Cầu Giấy</p>
                </div>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 text-lg mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white mb-1">Văn phòng Hồ Chí Minh</p>
                  <p>Lầu 8, Tòa nhà Giày Việt Plaza 180-182 Lý Chính Thắng P9, Q3</p>
                </div>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-400 text-lg mr-3 flex-shrink-0" />
                <a href="tel:0967180038" className="hover:text-blue-400 transition-colors">0967.180.038 / 0901.726.798</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-blue-400 text-lg mr-3 flex-shrink-0" />
                <a href="mailto:hotro@hocmai.vn" className="hover:text-blue-400 transition-colors">hotro@hocmai.vn</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-800 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>© 2023 TopUni. Bản quyền thuộc về Công ty Cổ phần Đầu tư và Dịch vụ Giáo dục</p>
              <p className="mt-1">MST: 0102183602 do Sở kế hoạch và Đầu tư thành phố Hà Nội cấp ngày 13/03/2007</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-400 transition-colors">Điều khoản sử dụng</Link>
              <Link href="#" className="hover:text-blue-400 transition-colors">Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 