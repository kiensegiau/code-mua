"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "./components/CountdownTimer";
import TeacherCard from "./components/TeacherCard";
import StudentReview from "./components/StudentReview";
import RoadmapItem from "./components/RoadmapItem";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

export default function TopuniPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student"); // student hoặc parent
  const [grade, setGrade] = useState("");
  const [examType, setExamType] = useState("");
  const [remainingSeats, setRemainingSeats] = useState(19);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Danh sách giáo viên
  const teachers = [
    {
      name: "Thầy Nguyễn Thanh Tùng",
      image: null, // "/images/teacher-tung.jpg",
      achievement: "Kĩ sư tốt nghiệp Đại học Bách khoa Hà Nội, 16 năm kinh nghiệm giảng dạy môn Toán",
      description: "Bài giảng của thầy được thiết kế theo hình thức sơ đồ tư duy vì thế học sinh yêu thương gọi thầy là 'THẦY TÙNG MIND-MAP'"
    },
    {
      name: "Thầy Đặng Thành Nam",
      image: null, // "/images/teacher-nam.jpg",
      achievement: "17 năm kinh nghiệm, TOP giáo viên luyện thi được học sinh yêu thích nhất",
      description: "Phương pháp giảng dạy đổi mới, truyền cảm hứng tới học sinh"
    },
  ];

  // Danh sách học sinh chia sẻ
  const students = [
    {
      name: "Bùi Đào Lân",
      school: "ĐH Công nghệ - ĐHQG Hà Nội",
      score: "122/150",
      examType: "Điểm thi HSA",
      avatar: null // "/images/student-1.jpg"
    },
    {
      name: "Nguyễn Trung Kiên",
      school: "Đại học Y Hà Nội",
      score: "28,75/30",
      examType: "Điểm thi TN THPT",
      avatar: null // "/images/student-2.jpg"
    }
  ];

  // Danh sách lộ trình
  const roadmapItems = [
    {
      title: "NỀN TẢNG (4-6 tháng)",
      description: "Trang bị kiến thức nền\nThực hành dạng bài cơ bản",
      color: "blue"
    },
    {
      title: "TỔNG ÔN (3-4 tháng)",
      description: "Hệ thống hóa kiến thức\nQuét mọi chuyên đề",
      color: "green"
    },
    {
      title: "LUYỆN ĐỀ (3 tháng)",
      description: "Rèn phương pháp\nLuyện kĩ năng",
      color: "red"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi thông tin đăng ký
    console.log({ name, phone, email, role, grade, examType });
    setIsModalOpen(true);
  };

  // Thêm class animation fadeIn cho Modal
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .bg-pattern {
          background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-[150px] h-[40px] bg-red-600 flex items-center justify-center text-white font-bold mr-4">
              HOCMAI
            </div>
            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">TopUni</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#roadmap" className="font-medium hover:text-red-600 transition relative group py-2">
              Lộ trình
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#teachers" className="font-medium hover:text-red-600 transition relative group py-2">
              Giáo viên
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#reviews" className="font-medium hover:text-red-600 transition relative group py-2">
              Học sinh chia sẻ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#register" className="font-medium hover:text-red-600 transition relative group py-2">
              Đăng ký
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
            Đăng ký ngay
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-red-800 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-medium mb-6 animate-pulse">
                Đợt cuối tuyển sinh 2K8
              </div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white leading-tight">
                Luyện thi Đại học <br />
                <span className="relative inline-block text-yellow-400">
                  2K8 xuất phát ngay!
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9C118.957 4.47226 236.066 3.86015 355 9" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 leading-relaxed">
                Chiến lược ôn thi đột phá giúp học sinh 2k8 chinh phục trường đại học top đầu với phương pháp học hiệu quả
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-8 border border-white/20">
                <h3 className="text-xl font-bold mb-4 text-white">ĐẶT CHỖ SỚM - ƯU ĐÃI LỚN</h3>
                <p className="mb-6 text-yellow-200 font-medium">DÀNH CHO {100 - remainingSeats} / 100 HỌC SINH ĐẶT CHỖ SỚM NHẤT</p>
                <CountdownTimer days={3} hours={12} minutes={30} seconds={0} />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-red-600 hover:bg-red-700 py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl hover:shadow-red-700/20 transition-all duration-300 hover:-translate-y-1">
                  Đăng ký ngay
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 py-3 px-8 text-lg rounded-full transition-all duration-300 hover:-translate-y-1">
                  Tư vấn lộ trình
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl blur-md opacity-70"></div>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 to-red-900 p-1">
                <div className="w-full h-[500px] bg-gray-800 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-4">2K8</div>
                    <div className="text-xl">Chinh phục đại học</div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full shadow-lg">
                  <p className="font-bold text-sm">Sắp hết, chỉ còn {remainingSeats} suất!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              THỰC TẾ PHŨ PHÀNG
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">Những thách thức mà thí sinh 2K8 phải đối mặt trong kỳ thi sắp tới</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-red-600">2008 thuộc thế hệ "bùng nổ dân số"</h3>
              <p className="text-gray-600 relative z-10">Gần 1,2 triệu thí sinh tranh suất vào đại học mơ ước. Chỉ những thí sinh có sự chuẩn bị chu đáo mới có khả năng cạnh tranh vào trường top</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Siết chặt dạy thêm, học thêm</h3>
              <p className="text-gray-600 relative z-10">Học sinh thiếu hụt các nguồn ôn tập quen thuộc, dễ rơi vào trạng thái hoang mang, học lan man, thiếu khoa học</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-green-600">Thay đổi xu hướng ra đề</h3>
              <p className="text-gray-600 relative z-10">Mọi "lối tắt" học tủ, học mẹo đều vô dụng. Xuất hiện loạt câu hỏi mới lạ, kiến thức tích hợp liên môn, bài toán thực tế hóc búa.</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full"></div>
              <h3 className="text-xl font-bold mb-4 text-purple-600">Đề thi phân hóa mạnh</h3>
              <p className="text-gray-600 relative z-10">Điểm cao, trường top chỉ dành cho những thí sinh có năng lực thực sự. Tăng độ phân hóa thuộc phân khúc điểm trên 5.</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-purple-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-1 rounded-lg blur-md bg-gradient-to-r from-yellow-400 to-red-600 opacity-70"></div>
              <h3 className="relative bg-white px-6 py-4 rounded-lg text-2xl font-bold">Kỳ thi mới, luật chơi mới, 2k8 không có chỗ cho sự mơ hồ</h3>
            </div>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              Đăng ký tư vấn ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-50 to-transparent rounded-full -mt-32 -mr-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-50 to-transparent rounded-full -mb-32 -ml-32 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              ÔN THI LỘ TRÌNH "CHẤT"
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">X2 hiệu quả, Tiết kiệm 30% thời gian ôn luyện với phương pháp độc quyền</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-green-200 to-red-200 transform -translate-y-1/2 hidden md:block"></div>
            
            {roadmapItems.map((item, index) => (
              <RoadmapItem 
                key={index}
                title={item.title}
                description={item.description}
                color={item.color}
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-10 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold mb-8 text-center relative inline-block">
              Ưu điểm vượt trội
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-600"></div>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Chương trình được biên soạn bám sát cấu trúc</h4>
                  <p className="text-gray-600">Liên tục cập nhật theo từng kỳ thi, đảm bảo sinh viên luôn được học với tài liệu mới nhất</p>
                </div>
              </div>
              
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Đội ngũ giáo viên luyện thi hàng đầu</h4>
                  <p className="text-gray-600">18+ năm kinh nghiệm, huấn luyện phương pháp kỹ năng & chiến lược làm bài hiệu quả</p>
                </div>
              </div>
              
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Phòng luyện & thi thử iTest độc quyền</h4>
                  <p className="text-gray-600">Giúp học sinh trải nghiệm như thi thật, làm quen với môi trường thi trước khi bước vào kỳ thi chính thức</p>
                </div>
              </div>
              
              <div className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <span className="font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Phối hợp với đại diện các trường Đại học</h4>
                  <p className="text-gray-600">Liên tục cập nhật các thay đổi & tư vấn định hướng cho học sinh về chuyên ngành và trường đại học phù hợp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-50 rounded-full filter blur-3xl opacity-70 -mr-32 -mb-32"></div>
        <div className="absolute left-0 top-1/3 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-70 -ml-32"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              ĐỘI NGŨ GIÁO VIÊN HÀNG ĐẦU
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">Đồng hành cùng các thầy cô giàu kinh nghiệm, tận tâm với nghề và đam mê giảng dạy</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {teachers.map((teacher, index) => (
              <TeacherCard 
                key={index}
                name={teacher.name}
                image={teacher.image}
                achievement={teacher.achievement}
                description={teacher.description}
              />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="p-6 inline-block bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 shadow-sm max-w-2xl">
              <h3 className="font-bold text-xl mb-2 text-gray-800">Tham gia cùng giáo viên hàng đầu</h3>
              <p className="text-gray-600 mb-4">Cùng học tập và trao đổi trực tiếp với những giáo viên giàu kinh nghiệm nhất trong lĩnh vực luyện thi đại học</p>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-3 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mt-2">
                Xem thêm giáo viên
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Reviews */}
      <section id="reviews" className="py-20 bg-white relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('/images/dots-pattern.png')] bg-repeat opacity-5"></div> */}
        <div className="absolute inset-0 bg-gray-100 bg-opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              HỌC SINH CHIA SẺ THÀNH CÔNG
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">Những câu chuyện truyền cảm hứng từ các học sinh đã chinh phục thành công kỳ thi đại học</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((student, index) => (
              <StudentReview 
                key={index}
                name={student.name}
                school={student.school}
                score={student.score}
                examType={student.examType}
                avatar={student.avatar}
              />
            ))}
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col justify-center items-center p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Bạn sẽ là người tiếp theo?</h3>
              <p className="text-gray-600 mb-6">Hãy để HOCMAI đồng hành cùng bạn trên con đường chinh phục kỳ thi đại học sắp tới!</p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full py-3 px-6 text-white font-medium transition-all duration-300 hover:-translate-y-1">
                Đăng ký học thử
              </Button>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="p-6 inline-block bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-amber-100 shadow-sm">
              <h3 className="font-bold text-xl mb-4 text-amber-900">98.5% học sinh hài lòng về lộ trình học tập</h3>
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6 text-yellow-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">Tham gia cùng hơn 5000+ học sinh 2K8 đã đăng ký khóa học tại HOCMAI</p>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-full py-3 px-8 text-white font-medium transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Xem thêm đánh giá
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-red-900 z-0"></div>
        <div className="absolute inset-0 bg-pattern opacity-20 mix-blend-overlay z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-white/10 backdrop-blur-sm text-yellow-300 px-4 py-1 rounded-full text-sm font-semibold mb-4">Còn {remainingSeats} suất cuối cùng</span>
              <h2 className="text-4xl font-bold mb-4 text-white relative inline-block">
                ĐĂNG KÝ NGAY HÔM NAY
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-200 mt-6 max-w-2xl mx-auto">Bứt phá điểm số trong kỳ thi ĐGNL/ĐGTD và xét tuyển đại học 2025</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl mb-12 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-center text-white">ĐẶT CHỖ SỚM - ƯU ĐÃI LỚN</h3>
              <div className="flex justify-center items-center mb-4">
                <div className="px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full animate-pulse">
                  GIẢM GIÁ ĐẾN 30% CHỈ TRONG HÔM NAY
                </div>
              </div>
              <CountdownTimer days={3} hours={12} minutes={30} seconds={0} />
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-10 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-6">Quyền lợi khi đăng ký</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Lộ trình học tập cá nhân hóa</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Tài liệu độc quyền theo cấu trúc đề thi mới</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Hướng dẫn học tập 1-1 từ chuyên gia</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Thi thử trên nền tảng iTest độc quyền</span>
                    </li>
                  </ul>
                </div>
                
                <div className="md:w-3/5 p-10">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Thông tin đăng ký</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Bạn là</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="role" 
                              value="parent"
                              checked={role === "parent"}
                              onChange={() => setRole("parent")}
                              className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span>Phụ huynh</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="role" 
                              value="student"
                              checked={role === "student"}
                              onChange={() => setRole("student")}
                              className="mr-2 text-red-600 focus:ring-red-500"
                            />
                            <span>Học sinh</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Khối lớp</label>
                        <select 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          required
                        >
                          <option value="">Chọn khối lớp</option>
                          <option value="10">Lớp 10</option>
                          <option value="11">Lớp 11</option>
                          <option value="12">Lớp 12</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Họ tên</label>
                      <Input 
                        type="text" 
                        placeholder="Nhập họ tên" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Số điện thoại</label>
                        <Input 
                          type="tel" 
                          placeholder="Nhập số điện thoại" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Email</label>
                        <Input 
                          type="email" 
                          placeholder="Nhập email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">Kỳ thi quan tâm</label>
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        required
                      >
                        <option value="">Chọn kỳ thi</option>
                        <option value="hsa">Luyện thi ĐGNL ĐHQG HN (HSA)</option>
                        <option value="hcm">Luyện thi ĐGNL ĐHQG HCM (HCM)</option>
                        <option value="tsa">Luyện thi ĐGNL ĐGTD ĐHBK (TSA)</option>
                        <option value="ielts">Luyện thi IELTS</option>
                        <option value="other">Tôi cần tư vấn thêm kỳ thi</option>
                      </select>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      ĐĂNG KÝ NGAY - NHẬN TƯ VẤN MIỄN PHÍ
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Bạn sẽ nhận được tư vấn miễn phí từ đội ngũ chuyên gia <br/> 
                      của HOCMAI trong vòng 24 giờ sau khi đăng ký
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="70" height="70" x="15" y="15" fill="white" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="mb-8">
                <div className="w-[150px] h-[40px] bg-red-600 text-white flex items-center justify-center font-bold mb-4">
                  HOCMAI
                </div>
                <h3 className="text-2xl font-bold mb-4">HOCMAI</h3>
                <p className="text-gray-400 mb-4">Nền tảng học trực tuyến số 1 Việt Nam<br />Đồng hành cùng hàng nghìn sĩ tử chinh phục ĐH TOP mỗi năm</p>
              </div>
              
              <div className="flex space-x-4 mb-6">
                <a href="#" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Văn phòng Hà Nội
              </h3>
              <p className="text-gray-400 mb-4 pl-7">Tòa 25T1 Nguyễn Thị Thâp, Phường Trung Hòa, Quận Cầu Giấy</p>
              
              <h3 className="text-xl font-bold mb-6 mt-8 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email liên hệ
              </h3>
              <p className="text-gray-400 mb-2 pl-7">hotro@hocmai.vn</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Văn phòng Hồ Chí Minh
              </h3>
              <p className="text-gray-400 mb-4 pl-7">Lầu 8, Tòa nhà Giày Việt Plaza 180-182 Lý Chính Thắng P9, Q3, TP. Hồ Chí Minh</p>
              
              <h3 className="text-xl font-bold mb-6 mt-8 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Hotline
              </h3>
              <p className="text-gray-400 mb-2 pl-7">0967.180.038 / 0901.726.798</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p className="mb-2">Giấy phép cung cấp dịch vụ mạng xã hội trực tuyến số 597/GP-BTTTT Bộ Thông tin và Truyền thông cấp ngày 30/12/2016.</p>
            <p className="mb-2">Cơ quan chủ quản: Công ty Cổ phần Đầu tư và Dịch vụ Giáo dục</p>
            <p>MST: 0102183602 do Sở kế hoạch và Đầu tư thành phố Hà Nội cấp ngày 13 tháng 03 năm 2007</p>
            <p className="mt-4 text-sm">© 2024 HOCMAI. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>

      {/* Đăng ký thành công modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Đăng ký thành công!</h3>
              <div className="w-16 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 mb-8">
                Cảm ơn bạn đã đăng ký khóa học tại HOCMAI. Tư vấn viên sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
              <Button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 px-8 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 