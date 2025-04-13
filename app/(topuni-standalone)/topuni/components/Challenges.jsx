"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaExclamationTriangle, FaChalkboardTeacher, FaBookOpen, FaChartLine, FaRandom, FaBriefcase } from 'react-icons/fa';

const challengeData = [
  {
    icon: <FaChartLine className="text-orange-500 text-3xl" />,
    title: "Tỷ lệ cạnh tranh cao",
    description: "2008 thuộc thế hệ 'bùng nổ dân số', gần 1,2 triệu thí sinh tranh suất vào đại học mơ ước. Chỉ những thí sinh có sự chuẩn bị chu đáo mới có khả năng cạnh tranh vào trường top."
  },
  {
    icon: <FaChalkboardTeacher className="text-red-500 text-3xl" />,
    title: "Thiếu hụt nguồn ôn tập",
    description: "Siết chặt dạy thêm, học thêm - Học sinh thiếu hụt các nguồn ôn tập quen thuộc, dễ rơi vào trạng thái hoang mang, học lan man, thiếu khoa học nếu chưa tự xây dựng được lộ trình học."
  },
  {
    icon: <FaBookOpen className="text-blue-600 text-3xl" />,
    title: "Thay đổi xu hướng ra đề",
    description: "Xuất hiện loạt câu hỏi mới lạ, kiến thức tích hợp liên môn, bài toán thực tế hóc búa. Các kỳ thi riêng để xét tuyển vào ĐH như ĐGNL, ĐGTD đã cập nhật ngân hàng câu hỏi theo chương trình mới."
  },
  {
    icon: <FaChartLine className="text-purple-600 text-3xl" />,
    title: "Đề thi phân hóa mạnh",
    description: "Tăng độ phân hóa thuộc phân khúc điểm trên 5, muốn đạt múc 8,9,10 thí sinh cần có bứt phá tư duy."
  },
  {
    icon: <FaRandom className="text-yellow-500 text-3xl" />,
    title: "Quy chế tuyển sinh biến động",
    description: "Bộ GD-ĐT vẫn đang trong quá trình cải tiến đề thi và phương án xét tuyển. Thí sinh 2008 buộc phải học cách thích nghi nhanh với chương trình mới và luôn trong tâm thế sẵn sàng cho mọi 'cú sốc' vào phút chót."
  },
  {
    icon: <FaBriefcase className="text-green-600 text-3xl" />,
    title: "Xu hướng nghề nghiệp thay đổi",
    description: "Cần xác định tư duy học không chỉ để thi, mà còn để thích nghi và phục vụ cho công việc trong tương lai."
  }
];

const Challenges = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 70 }
    }
  };

  // Nổi bật - thẻ spotlight effect
  const Spotlight = ({ children, className = "" }) => {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/30 pointer-events-none" />
        {children}
      </div>
    );
  };

  return (
    <section id="challenges" className="py-16 relative">
      {/* Background với pattern và gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200/50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.8,
            type: "spring"
          }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <motion.div 
            className="inline-flex items-center justify-center p-1 px-4 mb-4 rounded-full bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaExclamationTriangle className="text-red-500 mr-2 text-sm" />
            <span className="font-medium text-sm">Cảnh báo kỳ thi 2026</span>
          </motion.div>
          
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-4">
            THỰC TẾ PHŨ PHÀNG
          </h2>
          
          <h3 className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 max-w-3xl mx-auto mb-6">
            Kỳ thi mới, luật chơi mới, 2k8 không có chỗ cho sự mơ hồ
          </h3>
          
          <p className="text-slate-600 max-w-2xl mx-auto">
            Sự cạnh tranh khốc liệt, cùng với những thay đổi liên tục trong cấu trúc đề thi đang khiến các thí sinh 2k8 phải 
            đối mặt với thách thức lớn hơn bao giờ hết. Hãy cùng xem đâu là những rào cản lớn nhất.
          </p>
        </motion.div>

        <motion.div 
          style={{ scale, opacity }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {challengeData.map((challenge, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white backdrop-blur-sm bg-opacity-80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-50 relative overflow-hidden"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Spotlight className="absolute inset-0" />
              
              {/* Decorative elements */}
              <div className="absolute -right-3 -top-3 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-80"></div>
              <div className="absolute -left-4 -bottom-4 w-28 h-28 bg-gradient-to-tr from-blue-50 to-transparent rounded-full opacity-50"></div>
              
              {/* Number tag */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                {index + 1}
              </div>
              
              {/* Content */}
              <div className="relative">
                <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {challenge.icon}
                </div>
                
                <h3 className="font-bold text-lg mb-3 text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                  {challenge.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {challenge.description}
                </p>
                
                {/* Hover indicator */}
                <div className="mt-4 h-1 w-12 bg-blue-500 rounded-full transform origin-left scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100 max-w-3xl mx-auto shadow-lg relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-100 rounded-full opacity-50"></div>
            <div className="absolute left-1/2 -bottom-8 w-32 h-32 bg-orange-100 rounded-full opacity-40"></div>
            
            <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
            
            <h4 className="text-xl font-bold text-red-600 mb-3 relative">
              Thời gian đang cạn dần!
            </h4>
            
            <p className="text-red-700 font-medium text-lg mb-4 relative">
              Thí sinh chưa có lộ trình học cụ thể không nên chủ quan!
            </p>
            
            <p className="text-red-600 relative">
              Việc càng trì hoãn lên kế hoạch chuẩn bị chỉ càng khiến cho cơ hội vào đại học top của bạn giảm dần.
              Mỗi ngày trôi qua không có sự chuẩn bị là một ngày bạn tụt lại phía sau so với các thí sinh khác.
            </p>
            
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <a 
                href="#dang-ky" 
                className="inline-block text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300"
              >
                Nhận tư vấn ngay hôm nay
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Challenges; 