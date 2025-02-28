"use client";
import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import {
  MessageCircle,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Search,
  PlusCircle,
  ChevronRight,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  BookOpen,
  Tag,
  Star,
  UserPlus
} from 'lucide-react';

export default function CommunityPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Scroll-triggered animations control
  const controls = useAnimation();
  const forumsControls = useAnimation();
  const eventsControls = useAnimation();
  const membersControls = useAnimation();

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Active tab state
  const [activeTab, setActiveTab] = useState('forums');
  
  // State for selected items
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Handle topic click
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };
  
  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  // Handle member click
  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };
  
  // Handle close detail view
  const handleCloseDetail = () => {
    setSelectedTopic(null);
    setSelectedEvent(null);
    setSelectedMember(null);
  };
  
  // Xử lý khi nhấn nút thích
  const handleLike = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic thích ở đây
    alert('Đã thích bài viết!');
  };
  
  // Xử lý khi nhấn nút chia sẻ
  const handleShare = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic chia sẻ ở đây
    alert('Đã chia sẻ bài viết!');
  };
  
  // Xử lý khi nhấn nút đăng ký sự kiện
  const handleRegisterEvent = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đăng ký sự kiện ở đây
    alert('Đã đăng ký tham gia sự kiện!');
  };
  
  // Xử lý khi nhấn nút kết nối với thành viên
  const handleConnect = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic kết nối ở đây
    alert('Đã gửi lời mời kết nối!');
  };
  
  // Xử lý khi nhấn nút theo dõi thành viên
  const handleFollow = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic theo dõi ở đây
    alert('Đã theo dõi thành viên!');
  };
  
  // Xử lý khi nhấn nút gửi bình luận
  const handleSubmitComment = (e) => {
    e.preventDefault();
    // Xử lý logic gửi bình luận ở đây
    alert('Đã gửi bình luận!');
  };

  // Xử lý khi nhấn nút thêm vào lịch
  const handleAddToCalendar = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic thêm vào lịch
    alert('Đã thêm sự kiện vào lịch!');
  };

  // Xử lý khi nhấn nút nhắn tin
  const handleMessage = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic nhắn tin
    alert('Đã mở cửa sổ nhắn tin!');
  };

  // Xử lý khi nhấn nút đăng ký thành viên
  const handleRegisterMember = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đăng ký thành viên
    alert('Đã mở form đăng ký thành viên!');
  };

  // Xử lý khi nhấn nút tìm hiểu thêm
  const handleLearnMore = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tìm hiểu thêm
    alert('Đã mở trang thông tin chi tiết!');
  };

  // Xử lý khi nhấn nút đặt câu hỏi
  const handleAskQuestion = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đặt câu hỏi
    alert('Đã mở form đặt câu hỏi!');
  };

  // Xử lý khi nhấn nút tạo bài viết
  const handleCreatePost = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tạo bài viết
    alert('Đã mở form tạo bài viết mới!');
  };

  // Xử lý khi nhấn nút xem thêm bài viết
  const handleViewMorePosts = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem thêm bài viết
    alert('Đang tải thêm bài viết...');
  };

  // Xử lý khi nhấn nút xem tất cả sự kiện
  const handleViewAllEvents = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem tất cả sự kiện
    alert('Đang chuyển đến trang tất cả sự kiện...');
  };

  // Xử lý khi nhấn nút xem tất cả thành viên
  const handleViewAllMembers = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem tất cả thành viên
    alert('Đang chuyển đến trang tất cả thành viên...');
  };

  // Xử lý khi nhấn nút lịch sự kiện
  const handleEventCalendar = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic lịch sự kiện
    alert('Đang mở lịch sự kiện...');
  };

  // Xử lý khi nhấn nút tìm thành viên
  const handleSearchMembers = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tìm thành viên
    alert('Đang mở công cụ tìm kiếm thành viên...');
  };

  useEffect(() => {
    // Start animations immediately when component mounts
    controls.start("visible");
    forumsControls.start("visible");
    eventsControls.start("visible");
    membersControls.start("visible");
    
    const handleScroll = () => {
      // These will add additional animation effects on scroll
      // but content will be visible from the start
      if (window.scrollY > 100) {
        controls.start("visible");
      }
      
      if (window.scrollY > 300) {
        forumsControls.start("visible");
        eventsControls.start("visible");
      }
      
      if (window.scrollY > 500) {
        membersControls.start("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger initial scroll handler to check initial position
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, forumsControls, eventsControls, membersControls]);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const particlesLoaded = async (container) => {
    console.log("Particles container loaded", container);
  };

  const particlesConfig = {
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      color: {
        value: "#ff4d4f",
      },
      links: {
        color: "#ff4d4f",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.3,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  // Dummy data for forums
  const forumTopics = [
    {
      id: 1,
      title: 'Chia sẻ bí kíp ôn thi siêu tốc mà vẫn hiệu quả 100%',
      author: 'Minh Anh',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      replies: 24,
      views: 152,
      likes: 78,
      category: 'Học tập',
      time: '3 giờ trước',
      tags: ['ôn thi', 'mẹo học', 'siêu tốc']
    },
    {
      id: 2,
      title: 'Review đồ án cuối kỳ môn CSDL - có tâm huyết, ae vào góp ý nha',
      author: 'Quang Huy',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      replies: 36,
      views: 189,
      likes: 52,
      category: 'Đồ án',
      time: '1 ngày trước',
      tags: ['đồ án', 'cơ sở dữ liệu', 'review']
    },
    {
      id: 3,
      title: 'Tìm team dự hackathon sắp tới - cần gấp 2 mem UI/UX với 1 backend',
      author: 'Thu Trang',
      avatar: 'https://randomuser.me/api/portraits/women/86.jpg',
      replies: 42,
      views: 211,
      likes: 35,
      category: 'Tìm nhóm',
      time: '2 ngày trước',
      tags: ['hackathon', 'team', 'project']
    },
    {
      id: 4,
      title: 'Share full tài liệu môn Toán cao cấp - đã có lời giải chi tiết',
      author: 'Đức Mạnh',
      avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
      replies: 18,
      views: 320,
      likes: 124,
      category: 'Tài liệu',
      time: '4 ngày trước',
      tags: ['tài liệu', 'toán cao cấp', 'lời giải']
    }
  ];

  // Dummy data for events
  const events = [
    {
      id: 1,
      title: 'Workshop Kỹ năng thuyết trình',
      organizer: 'CLB Kỹ năng mềm',
      date: '15/04/2023',
      time: '14:00 - 16:30',
      location: 'Hội trường A',
      participants: 58,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvcmtzaG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 2,
      title: 'Cuộc thi Coding Challenge 2023',
      organizer: 'CLB Tin học',
      date: '20/04/2023',
      time: '08:00 - 17:00',
      location: 'Phòng máy tính C',
      participants: 42,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 3,
      title: 'Seminar: Tương lai của AI',
      organizer: 'Khoa CNTT',
      date: '25/04/2023',
      time: '09:00 - 11:30',
      location: 'Phòng hội thảo B',
      participants: 76,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    }
  ];

  // Dummy data for members
  const topMembers = [
    {
      id: 1,
      name: 'Nguyễn Thành Long',
      role: 'Sinh viên xuất sắc',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      contribution: 158,
      specialty: 'Lập trình Web, AI',
      badges: ['Top Contributor', 'Mentor', 'Quiz Master']
    },
    {
      id: 2,
      name: 'Trần Minh Anh',
      role: 'Mentor',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      contribution: 124,
      specialty: 'Kỹ năng mềm, Marketing',
      badges: ['Mentor', 'Event Organizer']
    },
    {
      id: 3,
      name: 'Lê Hoàng Nam',
      role: 'Giảng viên',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
      contribution: 216,
      specialty: 'Toán cao cấp, Machine Learning',
      badges: ['Top Contributor', 'Course Creator']
    },
    {
      id: 4,
      name: 'Phạm Thị Hương',
      role: 'Sinh viên',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
      contribution: 95,
      specialty: 'Thiết kế đồ họa',
      badges: ['Rising Star']
    }
  ];

  // Tab handling
  const renderTabContent = () => {
    switch(activeTab) {
      case 'forums':
        return (
          <motion.div 
            variants={containerVariants}
            initial="visible"
            animate={forumsControls}
            className="space-y-5"
          >
            {selectedTopic ? (
              <div className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={handleCloseDetail}
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Quay lại</span>
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleLike}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Thích</span>
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={selectedTopic.avatar} alt={selectedTopic.author} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-medium">{selectedTopic.author}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{selectedTopic.time}</span>
                        <span className="text-xs bg-[#ff4d4f]/20 text-[#ff4d4f] px-2 py-1 rounded">{selectedTopic.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">{selectedTopic.title}</h2>
                  
                  <div className="prose prose-invert max-w-none mb-6">
                    <p>
                      Chào cả nhà, hôm nay mình muốn chia sẻ với mọi người bí kíp ôn thi siêu tốc mà mình đã áp dụng thành công trong kỳ thi vừa rồi. Mình đã cải thiện điểm số từ trung bình lên thành xuất sắc chỉ trong vòng 2 tuần ôn tập thôi đó 😎
                    </p>
                    <p>
                      <strong>Bí kíp 1: Phương pháp Pomodoro cải tiến</strong><br/>
                      Mình chia thời gian học thành các khung 30p học - 5p nghỉ. Cứ 4 chu kỳ như vậy thì nghỉ dài 15p. Điểm khác biệt là mình sẽ ghi âm lại kiến thức trong lúc học và nghe lại trong lúc nghỉ ngắn. Hiệu quả kinh khủng luôn ý!
                    </p>
                    <p>
                      <strong>Bí kíp 2: Mind map + Flashcard</strong><br/>
                      Mình kết hợp vẽ mind map để nắm tổng quan, sau đó chuyển các ý chính thành flashcard để ôn tập hàng ngày. Mình dùng app Anki để làm điều này, tiện cực kỳ vì nó có thuật toán giúp mình nhớ lâu hơn.
                    </p>
                    <p>
                      <strong>Bí kíp 3: Dạy lại kiến thức</strong><br/>
                      Cái này hơi lạ nhưng mà hiệu quả vcl! Mình lập group học tập và mỗi người sẽ "dạy" lại một phần kiến thức cho cả nhóm. Khi phải giải thích cho người khác hiểu, bản thân mình sẽ hiểu sâu hơn rất nhiều.
                    </p>
                    <p>
                      Mình đã áp dụng 3 bí kíp này và đạt 9.5/10 môn Giải tích, từ một đứa trước đó chỉ được có 6 điểm thôi đó mọi người ơi! Ai muốn biết thêm chi tiết thì cmt bên dưới nha, mình sẽ rep ngay và luôn 👇
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedTopic.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-[#2a2a2a] px-2 py-1 rounded hover:bg-[#333] transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Bình luận ({selectedTopic.replies})</h3>
                    <div className="flex space-x-4 mb-6">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <textarea 
                          className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
                          placeholder="Viết bình luận của bạn..."
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button 
                            onClick={handleSubmitComment}
                            className="bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
                          >
                            Gửi bình luận
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex space-x-4">
                        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Commenter" className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">Phương Linh</h4>
                            <span className="text-xs text-gray-400">2 giờ trước</span>
                          </div>
                          <p className="text-gray-300 mb-2">
                            Bài viết hay quá chị ơi! Em đang cần gấp mấy bí kíp này để cứu bản thân trong kỳ thi sắp tới 😭 Chị có thể chia sẻ thêm về cách tạo flashcard hiệu quả ko ạ? Em toàn quên mất kiến thức sau khi học xong huhu
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>12</span>
                            </button>
                            <button 
                              className="hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMessage(e);
                              }}
                            >Trả lời</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="Commenter" className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">Tuấn Kiệt</h4>
                            <span className="text-xs text-gray-400">1 ngày trước</span>
                          </div>
                          <p className="text-gray-300 mb-2">
                            Bí kíp số 3 xịn xò thật sự! T đã thử áp dụng và thấy hiệu quả ngay. Nhưng mà tìm team để học chung hơi khó, có ai muốn lập team học môn Xác suất thống kê ko? Inbox mình nhé, cùng cày KPI nào ae 💪
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>8</span>
                            </button>
                            <button 
                              className="hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMessage(e);
                              }}
                            >Trả lời</button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Commenter" className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">Minh Anh</h4>
                            <span className="text-xs text-gray-400 bg-[#ff4d4f]/10 px-1 rounded">Tác giả</span>
                            <span className="text-xs text-gray-400">1 ngày trước</span>
                          </div>
                          <p className="text-gray-300 mb-2">
                            @Phương Linh: Chị sẽ làm 1 bài chi tiết về cách tạo flashcard hiệu quả trong tuần tới nha! Còn skrrt thì có thể dùng app Anki hoặc Quizlet đều ok em né. Quan trọng là phải ôn lại thường xuyên ý!
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>15</span>
                            </button>
                            <button 
                              className="hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMessage(e);
                              }}
                            >Trả lời</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Diễn đàn thảo luận</h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        className="pl-10 pr-4 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:outline-none focus:border-[#ff4d4f] text-gray-200"
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <button 
                      className="flex items-center space-x-2 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
                      onClick={handleCreatePost}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Tạo bài viết</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {forumTopics.map((topic) => (
                    <motion.div 
                      key={topic.id}
                      variants={itemVariants}
                      className="bg-[#1f1f1f] rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:bg-[#252525] cursor-pointer"
                      onClick={() => handleTopicClick(topic)}
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <img src={topic.avatar} alt={topic.author} className="w-8 h-8 rounded-full" />
                            <span className="text-gray-400">{topic.author}</span>
                            <span className="text-xs bg-[#ff4d4f]/20 text-[#ff4d4f] px-2 py-1 rounded">{topic.category}</span>
                          </div>
                          <h3 className="text-lg font-semibold hover:text-[#ff4d4f] transition-colors mb-2">{topic.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{topic.replies} trả lời</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{topic.likes} thích</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{topic.time}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {topic.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-[#2a2a2a] px-2 py-1 rounded hover:bg-[#333] transition-colors">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <button 
                    className="text-[#ff4d4f] flex items-center space-x-2 hover:underline"
                    onClick={handleViewMorePosts}
                  >
                    <span>Xem thêm bài viết</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        );
      
      case 'events':
        return (
          <motion.div 
            variants={containerVariants}
            initial="visible"
            animate={eventsControls}
            className="space-y-5"
          >
            {selectedEvent ? (
              <div className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={handleCloseDetail}
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Quay lại</span>
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleAddToCalendar}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Thêm vào lịch</span>
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                    <img 
                      src={selectedEvent.image} 
                      alt={selectedEvent.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6">
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                        <div className="flex items-center space-x-2 text-white/80">
                          <Users className="w-5 h-5 text-[#ff4d4f]" />
                          <span>{selectedEvent.organizer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#252525] rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="w-6 h-6 text-[#ff4d4f]" />
                        <h3 className="font-medium">Ngày</h3>
                      </div>
                      <p className="text-gray-300 pl-9">{selectedEvent.date}</p>
                    </div>
                    <div className="bg-[#252525] rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="w-6 h-6 text-[#ff4d4f]" />
                        <h3 className="font-medium">Thời gian</h3>
                      </div>
                      <p className="text-gray-300 pl-9">{selectedEvent.time}</p>
                    </div>
                    <div className="bg-[#252525] rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <MessageCircle className="w-6 h-6 text-[#ff4d4f]" />
                        <h3 className="font-medium">Địa điểm</h3>
                      </div>
                      <p className="text-gray-300 pl-9">{selectedEvent.location}</p>
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none mb-8">
                    <h3 className="text-xl font-semibold mb-4">Thông tin chi tiết</h3>
                    <p>
                      Đây là mô tả chi tiết về sự kiện. Trong thực tế, nội dung này sẽ được lấy từ cơ sở dữ liệu.
                      Sự kiện này được tổ chức nhằm mục đích chia sẻ kiến thức và kết nối cộng đồng.
                    </p>
                    <p>
                      Người tham gia sẽ có cơ hội học hỏi từ các chuyên gia hàng đầu trong lĩnh vực và mở rộng mạng lưới quan hệ.
                    </p>
                    <h4>Nội dung chương trình:</h4>
                    <ul>
                      <li>Phần 1: Giới thiệu tổng quan</li>
                      <li>Phần 2: Thảo luận chuyên đề</li>
                      <li>Phần 3: Thực hành và ứng dụng</li>
                      <li>Phần 4: Hỏi đáp và kết nối</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#252525] rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Diễn giả</h3>
                    <div className="flex items-center space-x-4">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Speaker" className="w-16 h-16 rounded-full" />
                      <div>
                        <h4 className="font-medium text-lg">TS. Nguyễn Văn A</h4>
                        <p className="text-gray-400">Giảng viên Đại học XYZ</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Chuyên gia hàng đầu trong lĩnh vực với hơn 10 năm kinh nghiệm nghiên cứu và giảng dạy.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-center bg-[#ff4d4f]/10 rounded-lg p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Đăng ký tham gia</h3>
                      <p className="text-gray-300">Hiện có {selectedEvent.participants} người đã đăng ký tham gia</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegisterEvent(e);
                      }}
                      className="mt-4 md:mt-0 bg-[#ff4d4f] text-white px-6 py-3 rounded-lg hover:bg-[#ff3538] transition-colors"
                    >
                      Đăng ký ngay
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Sự kiện sắp diễn ra</h2>
                  <button 
                    className="flex items-center space-x-2 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
                    onClick={handleEventCalendar}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Lịch sự kiện</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <motion.div 
                      key={event.id}
                      variants={itemVariants}
                      className="bg-[#1f1f1f] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center space-x-2 text-white">
                            <Calendar className="w-4 h-4 text-[#ff4d4f]" />
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff4d4f] transition-colors">{event.title}</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-[#ff4d4f]" />
                            <span>{event.organizer}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-[#ff4d4f]" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-[#ff4d4f]" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-400">{event.participants} người tham gia</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegisterEvent(e);
                            }}
                            className="text-sm px-3 py-1 bg-[#ff4d4f]/10 text-[#ff4d4f] rounded-full hover:bg-[#ff4d4f]/20 transition-colors"
                          >
                            Đăng ký
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <button 
                    className="text-[#ff4d4f] flex items-center space-x-2 hover:underline"
                    onClick={handleViewAllEvents}
                  >
                    <span>Xem tất cả sự kiện</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        );
      
      case 'members':
        return (
          <motion.div 
            variants={containerVariants}
            initial="visible"
            animate={membersControls}
            className="space-y-5"
          >
            {selectedMember ? (
              <div className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={handleCloseDetail}
                    className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Quay lại</span>
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleConnect}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Kết nối</span>
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Nhắn tin</span>
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                    <div className="text-center">
                      <img 
                        src={selectedMember.avatar} 
                        alt={selectedMember.name} 
                        className="w-32 h-32 rounded-full border-4 border-[#ff4d4f]/30"
                      />
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {selectedMember.badges.map((badge, idx) => (
                          <span key={idx} className="text-xs bg-[#ff4d4f]/10 text-[#ff4d4f] px-2 py-1 rounded">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{selectedMember.name}</h2>
                      <p className="text-[#ff4d4f] text-lg mb-4">{selectedMember.role}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#252525] rounded-lg p-4">
                          <h3 className="font-medium mb-2">Chuyên môn</h3>
                          <p className="text-gray-300">{selectedMember.specialty}</p>
                        </div>
                        <div className="bg-[#252525] rounded-lg p-4">
                          <h3 className="font-medium mb-2">Đóng góp</h3>
                          <p className="text-gray-300">
                            <span className="text-[#ff4d4f] font-semibold">{selectedMember.contribution}</span> đóng góp
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button 
                          onClick={handleConnect}
                          className="bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors flex items-center space-x-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Kết nối</span>
                        </button>
                        <button 
                          onClick={handleFollow}
                          className="border border-[#ff4d4f] text-[#ff4d4f] px-4 py-2 rounded-lg hover:bg-[#ff4d4f]/10 transition-colors flex items-center space-x-2"
                        >
                          <Star className="w-4 h-4" />
                          <span>Theo dõi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Giới thiệu</h3>
                      <div className="prose prose-invert max-w-none">
                        <p>
                          Đây là phần giới thiệu về thành viên. Trong thực tế, nội dung này sẽ được lấy từ cơ sở dữ liệu.
                          Thành viên có thể chia sẻ về bản thân, kinh nghiệm, và mục tiêu của họ.
                        </p>
                        <p>
                          Họ cũng có thể liệt kê các kỹ năng, thành tựu, và dự án mà họ đã tham gia.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Hoạt động gần đây</h3>
                      <div className="space-y-4">
                        <div className="bg-[#252525] rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                            <MessageSquare className="w-4 h-4 text-[#ff4d4f]" />
                            <span>Đã đăng bài viết mới</span>
                            <span>•</span>
                            <span>2 ngày trước</span>
                          </div>
                          <p className="font-medium hover:text-[#ff4d4f] transition-colors cursor-pointer">
                            Chia sẻ kinh nghiệm học tập hiệu quả
                          </p>
                        </div>
                        
                        <div className="bg-[#252525] rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                            <Calendar className="w-4 h-4 text-[#ff4d4f]" />
                            <span>Đã tham gia sự kiện</span>
                            <span>•</span>
                            <span>1 tuần trước</span>
                          </div>
                          <p className="font-medium hover:text-[#ff4d4f] transition-colors cursor-pointer">
                            Workshop Kỹ năng thuyết trình
                          </p>
                        </div>
                        
                        <div className="bg-[#252525] rounded-lg p-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                            <Award className="w-4 h-4 text-[#ff4d4f]" />
                            <span>Đã nhận huy hiệu mới</span>
                            <span>•</span>
                            <span>2 tuần trước</span>
                          </div>
                          <p className="font-medium">
                            Top Contributor
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Bài viết nổi bật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#252525] rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2 hover:text-[#ff4d4f] transition-colors">Làm sao để học hiệu quả trong thời gian ngắn?</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>24</span>
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>18</span>
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>2 tuần trước</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#252525] rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2 hover:text-[#ff4d4f] transition-colors">Chia sẻ kinh nghiệm làm bài tập lớn</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>32</span>
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button 
                              className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(e);
                              }}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>26</span>
                            </button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>1 tháng trước</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Thành viên nổi bật</h2>
                  <div className="flex space-x-3">
                    <button 
                      className="flex items-center space-x-2 border border-[#ff4d4f] text-[#ff4d4f] px-4 py-2 rounded-lg hover:bg-[#ff4d4f]/10 transition-colors"
                      onClick={handleSearchMembers}
                    >
                      <Search className="w-5 h-5" />
                      <span>Tìm thành viên</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topMembers.map((member) => (
                    <motion.div 
                      key={member.id}
                      variants={itemVariants}
                      className="bg-[#1f1f1f] rounded-xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:bg-[#252525] cursor-pointer relative"
                      onClick={() => handleMemberClick(member)}
                    >
                      <div className="absolute -top-5 right-4">
                        <div className="w-10 h-10 bg-[#f0a92d] rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#ff4d4f]/50"
                      />
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-[#ff4d4f] text-sm mb-3">{member.role}</p>
                      <p className="text-gray-400 text-sm mb-4">{member.specialty}</p>
                      
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {member.badges.map((badge, idx) => (
                          <span key={idx} className="text-xs bg-[#ff4d4f]/10 text-[#ff4d4f] px-2 py-1 rounded">
                            {badge}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          <span className="text-[#ff4d4f] font-semibold">{member.contribution}</span> đóng góp
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnect(e);
                          }}
                          className="text-sm flex items-center space-x-1 text-[#4d79ff] hover:underline"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Kết nối</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <button 
                    className="text-[#ff4d4f] flex items-center space-x-2 hover:underline"
                    onClick={handleViewAllMembers}
                  >
                    <span>Xem tất cả thành viên</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-gray-200 relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particlesConfig}
        />
      </div>

      {/* Floating elements in the background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${100 + i * 30}px`,
              height: `${100 + i * 30}px`,
              background: `radial-gradient(circle, rgba(255,77,79,0.15) 0%, rgba(255,77,79,0) 70%)`,
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, 20, -20, 0],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-b from-[#1f1f1f] to-[#141414] py-16 md:py-24"
        style={{ opacity: opacityTransform }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Cộng đồng học tập và phát triển
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Tham gia cộng đồng để chia sẻ kiến thức, tham gia sự kiện và kết nối với các thành viên khác
            </motion.p>
          </motion.div>

          {/* Community stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12"
          >
            <div className="bg-[#1f1f1f]/50 backdrop-blur-sm rounded-xl p-5 text-center transition-transform hover:scale-105">
              <Users className="w-8 h-8 text-[#ff4d4f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">5,280+</h3>
              <p className="text-sm text-gray-400">Thành viên</p>
            </div>
            <div className="bg-[#1f1f1f]/50 backdrop-blur-sm rounded-xl p-5 text-center transition-transform hover:scale-105">
              <MessageCircle className="w-8 h-8 text-[#ff4d4f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">12,450+</h3>
              <p className="text-sm text-gray-400">Bài viết</p>
            </div>
            <div className="bg-[#1f1f1f]/50 backdrop-blur-sm rounded-xl p-5 text-center transition-transform hover:scale-105">
              <Calendar className="w-8 h-8 text-[#ff4d4f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">320+</h3>
              <p className="text-sm text-gray-400">Sự kiện</p>
            </div>
            <div className="bg-[#1f1f1f]/50 backdrop-blur-sm rounded-xl p-5 text-center transition-transform hover:scale-105">
              <BookOpen className="w-8 h-8 text-[#ff4d4f] mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">1,840+</h3>
              <p className="text-sm text-gray-400">Tài liệu</p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative element with scroll parallax */}
        <motion.div 
          className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-r from-[#141414] via-[#ff4d4f]/10 to-[#141414] opacity-30"
          style={{ y: yParallax }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-700 mb-8">
            <button 
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'forums' ? 'text-[#ff4d4f]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('forums')}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Diễn đàn</span>
              </div>
              {activeTab === 'forums' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4d4f]"
                />
              )}
            </button>
            <button 
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'events' ? 'text-[#ff4d4f]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('events')}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Sự kiện</span>
              </div>
              {activeTab === 'events' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4d4f]"
                />
              )}
            </button>
            <button 
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'members' ? 'text-[#ff4d4f]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('members')}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Thành viên</span>
              </div>
              {activeTab === 'members' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4d4f]"
                />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
      
      {/* Join Community CTA Section */}
      <div className="bg-[#1f1f1f] py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <motion.div 
            className="absolute w-72 h-72 rounded-full bg-[#ff4d4f]/10"
            style={{ top: '-10%', right: '-5%' }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute w-48 h-48 rounded-full bg-[#ff4d4f]/10"
            style={{ bottom: '10%', left: '5%' }}
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl shadow-xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bạn muốn tham gia cộng đồng?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng ngay hôm nay để kết nối với các thành viên khác, 
              chia sẻ kiến thức và cùng nhau phát triển.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                className="bg-[#ff4d4f] text-white px-6 py-3 rounded-lg hover:bg-[#ff3538] transition-colors flex items-center justify-center space-x-2"
                onClick={handleRegisterMember}
              >
                <UserPlus className="w-5 h-5" />
                <span>Đăng ký thành viên</span>
              </button>
              <button 
                className="border border-[#ff4d4f] text-[#ff4d4f] px-6 py-3 rounded-lg hover:bg-[#ff4d4f]/10 transition-colors flex items-center justify-center space-x-2"
                onClick={handleLearnMore}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Tìm hiểu thêm</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Feedback button that follows scroll */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <button
          className="bg-[#ff4d4f] text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-[#ff3538] hover:scale-105 transition-all duration-300 active:scale-95"
          onClick={handleAskQuestion}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Đặt câu hỏi</span>
        </button>
      </motion.div>
    </div>
  );
} 