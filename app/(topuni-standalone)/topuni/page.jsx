"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Challenges from "./components/Challenges";
import Roadmap from "./components/Roadmap";
import Registration from "./components/Registration";
import Footer from "./components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

export default function TopUniPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // State to track scroll position for animations
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Main Content */}
      <Header />
      <HeroSection />
      <Challenges />
      <Roadmap />
      
      {/* Testimonials Section */}
      <section id="hoc-sinh" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">HỌC SINH CHIA SẺ</h2>
            <h3 className="text-xl text-blue-600 font-semibold max-w-3xl mx-auto">
              Hàng nghìn học sinh đã thành công cùng chúng tôi
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Testimonial Card 1 */}
            <TestimonialCard
              name="Bùi Đào Lân"
              school="ĐH Công nghệ - ĐHQG Hà Nội"
              score="122/150"
              exam="Điểm thi HSA"
              delay={0}
            />
            
            {/* Testimonial Card 2 */}
            <TestimonialCard
              name="Nguyễn Trung Kiên"
              school="Đại học Y Hà Nội"
              score="28,75/30"
              exam="Điểm thi TN THPT"
              delay={0.1}
            />
            
            {/* Testimonial Card 3 */}
            <TestimonialCard
              name="Lê Minh Hà"
              school="Học viện Ngân Hàng"
              score="675/990"
              exam="Điểm thi ĐGTD"
              delay={0.2}
            />
          </div>
        </div>
      </section>
      
      {/* Teachers Section */}
      <section id="giao-vien" className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">ĐỘI NGŨ GIÁO VIÊN</h2>
            <h3 className="text-xl text-blue-600 font-semibold max-w-3xl mx-auto">
              18+ năm kinh nghiệm luyện thi đại học
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Teacher Card 1 */}
            <TeacherCard
              name="Thầy Nguyễn Thanh Tùng"
              subject="Toán học"
              experience="16+ năm kinh nghiệm"
              description="Là kĩ sư tốt nghiệp Đại học Bách khoa Hà Nội, nhưng với đam mê to lớn với việc giảng dạy, thầy đã từ bỏ ngành nghề được đào tạo bài bản để trở thành một người thầy giáo."
              delay={0}
            />
            
            {/* Teacher Card 2 */}
            <TeacherCard
              name="Cô Trần Thị Minh Hiền"
              subject="Ngữ văn"
              experience="15+ năm kinh nghiệm"
              description="Giảng viên khoa Ngữ Văn trường Đại học Sư phạm Hà Nội. Cô có kinh nghiệm dạy học và biên soạn nhiều tài liệu về môn Ngữ văn, được học sinh và phụ huynh tin tưởng."
              delay={0.1}
            />
            
            {/* Teacher Card 3 */}
            <TeacherCard
              name="Thầy Lê Đình Hợi"
              subject="Vật lý"
              experience="20+ năm kinh nghiệm"
              description="Thạc sĩ Vật lý, giáo viên giỏi cấp thành phố, có nhiều học sinh đạt giải cao trong các kỳ thi học sinh giỏi quốc gia và đỗ vào các trường đại học danh tiếng."
              delay={0.2}
            />
          </div>
        </div>
      </section>
      
      {/* News and Media Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">BÁO CHÍ - TRUYỀN THÔNG</h2>
            <h3 className="text-xl text-blue-600 font-semibold max-w-3xl mx-auto">
              nói về GIẢI PHÁP LUYỆN THI ĐẠI HỌC TOÀN DIỆN
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <NewsCard
              title="Giải pháp PEN và PAT của TopUni là gì mà luôn được 'săn đón'?"
              source="VTV.vn"
              delay={0}
            />
            
            <NewsCard
              title="Giải pháp giúp học sinh 2006 chắc suất vào ĐH hàng đầu"
              source="GiaoDuc.net.vn"
              delay={0.1}
            />
            
            <NewsCard
              title="'Học sinh lớp 11 cần chuẩn bị ôn thi đại học sớm'"
              source="VnExpress.net"
              delay={0.2}
            />
          </div>
        </div>
      </section>
      
      <Registration />
      <Footer />
      
      {/* Fixed Contact Button */}
      <a 
        href="#dang-ky"
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>
    </div>
  );
}

// Testimonial Card Component 
const TestimonialCard = ({ name, school, score, exam, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
          {/* Student photo placeholder */}
          <span className="text-blue-600 font-semibold">{name.split(' ').pop().charAt(0)}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-blue-600 font-medium text-sm mb-3">{school}</p>
        
        <div className="bg-blue-50 rounded-lg px-4 py-2 w-full">
          <p className="text-2xl font-bold text-blue-600">{score}</p>
          <p className="text-sm text-gray-600">{exam}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Teacher Card Component
const TeacherCard = ({ name, subject, experience, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
          {/* Teacher photo placeholder */}
          <span className="text-blue-600 font-semibold">{name.split(' ').pop().charAt(0)}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-blue-600 font-medium text-sm">{subject}</p>
        <p className="text-gray-600 text-xs">{experience}</p>
      </div>
      
      <p className="text-sm text-gray-700 text-center">{description}</p>
    </motion.div>
  );
};

// News Card Component
const NewsCard = ({ title, source, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
        {/* News image placeholder */}
        [Hình ảnh báo chí]
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
      <p className="text-blue-600 text-sm font-medium">{source}</p>
    </motion.div>
  );
};

