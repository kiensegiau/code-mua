"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
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
  UserPlus,
  Bell,
  Download,
} from "lucide-react";
import ForumContainer from "./components/ForumContainer";

export default function CommunityPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
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
  const [activeTab, setActiveTab] = useState("forums");

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
    alert("Đã thích bài viết!");
  };

  // Xử lý khi nhấn nút chia sẻ
  const handleShare = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic chia sẻ ở đây
    alert("Đã chia sẻ bài viết!");
  };

  // Xử lý khi nhấn nút đăng ký sự kiện
  const handleRegisterEvent = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đăng ký sự kiện ở đây
    alert("Đã đăng ký tham gia sự kiện!");
  };

  // Xử lý khi nhấn nút kết nối với thành viên
  const handleConnect = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic kết nối ở đây
    alert("Đã gửi lời mời kết nối!");
  };

  // Xử lý khi nhấn nút theo dõi thành viên
  const handleFollow = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic theo dõi ở đây
    alert("Đã theo dõi thành viên!");
  };

  // Xử lý khi nhấn nút gửi bình luận
  const handleSubmitComment = (e) => {
    e.preventDefault();
    // Xử lý logic gửi bình luận ở đây
    alert("Đã gửi bình luận!");
  };

  // Xử lý khi nhấn nút thêm vào lịch
  const handleAddToCalendar = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic thêm vào lịch
    alert("Đã thêm sự kiện vào lịch!");
  };

  // Xử lý khi nhấn nút nhắn tin
  const handleMessage = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic nhắn tin
    alert("Đã mở cửa sổ nhắn tin!");
  };

  // Xử lý khi nhấn nút đăng ký thành viên
  const handleRegisterMember = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đăng ký thành viên
    alert("Đã mở form đăng ký thành viên!");
  };

  // Xử lý khi nhấn nút tìm hiểu thêm
  const handleLearnMore = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tìm hiểu thêm
    alert("Đã mở trang thông tin chi tiết!");
  };

  // Xử lý khi nhấn nút đặt câu hỏi
  const handleAskQuestion = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đặt câu hỏi
    alert("Đã mở form đặt câu hỏi!");
  };

  // Xử lý khi nhấn nút tạo bài viết
  const handleCreatePost = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tạo bài viết
    alert("Đã mở form tạo bài viết mới!");
  };

  // Xử lý khi nhấn nút xem thêm bài viết
  const handleViewMorePosts = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem thêm bài viết
    alert("Đang tải thêm bài viết...");
  };

  // Xử lý khi nhấn nút xem tất cả sự kiện
  const handleViewAllEvents = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem tất cả sự kiện
    alert("Đang chuyển đến trang tất cả sự kiện...");
  };

  // Xử lý khi nhấn nút xem tất cả thành viên
  const handleViewAllMembers = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem tất cả thành viên
    alert("Đang chuyển đến trang tất cả thành viên...");
  };

  // Xử lý khi nhấn nút lịch sự kiện
  const handleEventCalendar = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic lịch sự kiện
    alert("Đang mở lịch sự kiện...");
  };

  // Xử lý khi nhấn nút tìm thành viên
  const handleSearchMembers = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tìm thành viên
    alert("Đang mở công cụ tìm kiếm thành viên...");
  };

  // Xử lý khi nhấn nút báo cáo bài viết
  const handleReportPost = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic báo cáo bài viết
    alert("Đã mở form báo cáo bài viết!");
  };

  // Xử lý khi nhấn nút lưu bài viết
  const handleSavePost = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic lưu bài viết
    alert("Đã lưu bài viết để đọc sau!");
  };

  // Xử lý khi nhấn nút đánh dấu sự kiện quan trọng
  const handleMarkImportant = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đánh dấu sự kiện
    alert("Đã đánh dấu sự kiện là quan trọng!");
  };

  // Xử lý khi nhấn nút đề xuất sự kiện
  const handleSuggestEvent = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đề xuất sự kiện
    alert("Đã mở form đề xuất sự kiện!");
  };

  // Xử lý khi nhấn nút đánh giá thành viên
  const handleRateMember = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đánh giá thành viên
    alert("Đã mở form đánh giá thành viên!");
  };

  // Xử lý khi nhấn nút xem lịch sử hoạt động
  const handleViewActivityHistory = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem lịch sử hoạt động
    alert("Đang tải lịch sử hoạt động...");
  };

  // Xử lý khi nhấn nút tải tài liệu
  const handleDownloadResource = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tải tài liệu
    alert("Đang tải tài liệu...");
  };

  // Xử lý khi nhấn nút đăng ký nhận thông báo
  const handleSubscribeNotifications = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic đăng ký nhận thông báo
    alert("Đã đăng ký nhận thông báo từ cộng đồng!");
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
      title: "Chia sẻ bí kíp ôn thi siêu tốc mà vẫn hiệu quả 100% 🔥🔥🔥",
      author: "Minh Anh",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      replies: 24,
      views: 152,
      likes: 78,
      category: "Học tập",
      time: "3 giờ trước",
      tags: ["ôn thi", "mẹo học", "siêu tốc"],
    },
    {
      id: 2,
      title:
        "Review đồ án cuối kỳ môn CSDL - có tâm huyết, ae vào góp ý nha 🙏",
      author: "Quang Huy",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      replies: 36,
      views: 189,
      likes: 52,
      category: "Đồ án",
      time: "1 ngày trước",
      tags: ["đồ án", "cơ sở dữ liệu", "review"],
    },
    {
      id: 3,
      title:
        "Tìm team dự hackathon sắp tới - cần gấp 2 mem UI/UX với 1 backend 🥺",
      author: "Thu Trang",
      avatar: "https://randomuser.me/api/portraits/women/86.jpg",
      replies: 42,
      views: 211,
      likes: 35,
      category: "Tìm nhóm",
      time: "2 ngày trước",
      tags: ["hackathon", "team", "project"],
    },
    {
      id: 4,
      title:
        "Share full tài liệu môn Toán cao cấp - đã có lời giải chi tiết 📚",
      author: "Đức Mạnh",
      avatar: "https://randomuser.me/api/portraits/men/57.jpg",
      replies: 18,
      views: 320,
      likes: 124,
      category: "Tài liệu",
      time: "4 ngày trước",
      tags: ["tài liệu", "toán cao cấp", "lời giải"],
    },
    {
      id: 5,
      title: "Bài tập kỳ này khó vcl, ai có tài liệu giải gấp ko? 😵‍💫",
      author: "Hà Linh",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      replies: 27,
      views: 203,
      likes: 63,
      category: "Học tập",
      time: "6 giờ trước",
      tags: ["bài tập", "giải bài", "help me"],
    },
    {
      id: 6,
      title:
        "Trải lòng về kỳ thực tập đầu tiên - nhật ký của 1 đứa nhóc sv năm 3 🥲",
      author: "Tuấn Kiệt",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg",
      replies: 51,
      views: 312,
      likes: 147,
      category: "Chia sẻ",
      time: "3 ngày trước",
      tags: ["thực tập", "kinh nghiệm", "tâm sự"],
    },
    {
      id: 7,
      title: "HOT! Lộ trình tự học MERN stack chuẩn nhất 2023 cho newbie 👶",
      author: "Minh Trí",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      replies: 39,
      views: 452,
      likes: 183,
      category: "Tự học",
      time: "5 ngày trước",
      tags: ["lộ trình", "MERN stack", "tự học"],
    },
    {
      id: 8,
      title: "Xin review trường ABC, ngành xyz - có nên đăng ký ko mng?? 🤔",
      author: "Thanh Thảo",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      replies: 32,
      views: 178,
      likes: 41,
      category: "Tuyển sinh",
      time: "12 giờ trước",
      tags: ["review trường", "tuyển sinh", "ngành học"],
    },
    {
      id: 9,
      title:
        "Ai đã học môn này với thầy XYZ chưa? Thầy dễ hay khó tính vậy? 👀",
      author: "Hoàng Nam",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      replies: 15,
      views: 97,
      likes: 28,
      category: "Môn học",
      time: "1 ngày trước",
      tags: ["giảng viên", "môn học", "review"],
    },
    {
      id: 10,
      title:
        "Mua laptop code mùa này, budget 15 triệu thì nên chọn con nào ae nhỉ? 💸",
      author: "Gia Bảo",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      replies: 43,
      views: 267,
      likes: 72,
      category: "Thiết bị",
      time: "2 ngày trước",
      tags: ["laptop", "lập trình", "tư vấn"],
    },
    {
      id: 11,
      title:
        "Crush ngồi cùng bàn trong lớp thực hành, nên tỏ tình kiểu gì ta? 💘",
      author: "Phương Nam",
      avatar: "https://randomuser.me/api/portraits/men/13.jpg",
      replies: 78,
      views: 412,
      likes: 203,
      category: "Chuyện đời",
      time: "1 ngày trước",
      tags: ["crush", "tình cảm", "tỏ tình"],
    },
    {
      id: 12,
      title:
        "Nghĩ mãi vẫn chưa có ý tưởng cho đồ án tốt nghiệp, giúp em với ạ 😭",
      author: "Hồng Nhung",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
      replies: 37,
      views: 215,
      likes: 89,
      category: "Đồ án",
      time: "3 ngày trước",
      tags: ["đồ án", "tốt nghiệp", "ý tưởng"],
    },
  ];

  // Dummy data for events
  const events = [
    {
      id: 1,
      title: "Workshop Kỹ năng thuyết trình",
      organizer: "CLB Kỹ năng mềm",
      date: "15/04/2023",
      time: "14:00 - 16:30",
      location: "Hội trường A",
      participants: 58,
      image:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHdvcmtzaG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      title: "Cuộc thi Coding Challenge 2023",
      organizer: "CLB Tin học",
      date: "20/04/2023",
      time: "08:00 - 17:00",
      location: "Phòng máy tính C",
      participants: 42,
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      title: "Seminar: Tương lai của AI",
      organizer: "Khoa CNTT",
      date: "25/04/2023",
      time: "09:00 - 11:30",
      location: "Phòng hội thảo B",
      participants: 76,
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHRlY2hub2xvZ3l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    },
  ];

  // Dummy data for members
  const topMembers = [
    {
      id: 1,
      name: "Nguyễn Thành Long",
      role: "Sinh viên xuất sắc",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      contribution: 158,
      specialty: "Lập trình Web, AI",
      badges: ["Top Contributor", "Mentor", "Quiz Master"],
    },
    {
      id: 2,
      name: "Trần Minh Anh",
      role: "Mentor",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      contribution: 124,
      specialty: "Kỹ năng mềm, Marketing",
      badges: ["Mentor", "Event Organizer"],
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      role: "Giảng viên",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg",
      contribution: 216,
      specialty: "Toán cao cấp, Machine Learning",
      badges: ["Top Contributor", "Course Creator"],
    },
    {
      id: 4,
      name: "Phạm Thị Hương",
      role: "Sinh viên",
      avatar: "https://randomuser.me/api/portraits/women/57.jpg",
      contribution: 95,
      specialty: "Thiết kế đồ họa",
      badges: ["Rising Star"],
    },
  ];

  // Tab handling
  const renderTabContent = () => {
    switch (activeTab) {
      case "forums":
        return (
          <motion.div
            variants={containerVariants}
            initial="visible"
            animate={forumsControls}
            className="space-y-5"
          >
            {renderForumContent()}
          </motion.div>
        );

      case "events":
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
                      onClick={handleMarkImportant}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <Star className="w-5 h-5" />
                      <span>Đánh dấu</span>
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
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {selectedEvent.title}
                        </h2>
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
                      <p className="text-gray-300 pl-9">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none mb-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Thông tin chi tiết
                    </h3>
                    <p>
                      Đây là mô tả chi tiết về sự kiện. Trong thực tế, nội dung
                      này sẽ được lấy từ cơ sở dữ liệu. Sự kiện này được tổ chức
                      nhằm mục đích chia sẻ kiến thức và kết nối cộng đồng.
                    </p>
                    <p>
                      Người tham gia sẽ có cơ hội học hỏi từ các chuyên gia hàng
                      đầu trong lĩnh vực và mở rộng mạng lưới quan hệ.
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
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Speaker"
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-lg">
                          TS. Nguyễn Văn A
                        </h4>
                        <p className="text-gray-400">Giảng viên Đại học XYZ</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Chuyên gia hàng đầu trong lĩnh vực với hơn 10 năm kinh
                          nghiệm nghiên cứu và giảng dạy.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center bg-[#ff4d4f]/10 rounded-lg p-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Đăng ký tham gia
                      </h3>
                      <p className="text-gray-300">
                        Hiện có {selectedEvent.participants} người đã đăng ký
                        tham gia
                      </p>
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
                  <div className="flex space-x-3">
                    <button
                      className="flex items-center space-x-2 border border-[#ff4d4f] text-[#ff4d4f] px-4 py-2 rounded-lg hover:bg-[#ff4d4f]/10 transition-colors"
                      onClick={handleSuggestEvent}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Đề xuất sự kiện</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
                      onClick={handleEventCalendar}
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Lịch sự kiện</span>
                    </button>
                  </div>
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
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ff4d4f] transition-colors">
                          {event.title}
                        </h3>
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
                          <span className="text-sm text-gray-400">
                            {event.participants} người tham gia
                          </span>
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

      case "members":
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
                      onClick={handleRateMember}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <Star className="w-5 h-5" />
                      <span>Đánh giá</span>
                    </button>
                    <button
                      onClick={handleViewActivityHistory}
                      className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span>Lịch sử</span>
                    </button>
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
                          <span
                            key={idx}
                            className="text-xs bg-[#ff4d4f]/10 text-[#ff4d4f] px-2 py-1 rounded"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        {selectedMember.name}
                      </h2>
                      <p className="text-[#ff4d4f] text-lg mb-4">
                        {selectedMember.role}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#252525] rounded-lg p-4">
                          <h3 className="font-medium mb-2">Chuyên môn</h3>
                          <p className="text-gray-300">
                            {selectedMember.specialty}
                          </p>
                        </div>
                        <div className="bg-[#252525] rounded-lg p-4">
                          <h3 className="font-medium mb-2">Đóng góp</h3>
                          <p className="text-gray-300">
                            <span className="text-[#ff4d4f] font-semibold">
                              {selectedMember.contribution}
                            </span>{" "}
                            đóng góp
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
                          Đây là phần giới thiệu về thành viên. Trong thực tế,
                          nội dung này sẽ được lấy từ cơ sở dữ liệu. Thành viên
                          có thể chia sẻ về bản thân, kinh nghiệm, và mục tiêu
                          của họ.
                        </p>
                        <p>
                          Họ cũng có thể liệt kê các kỹ năng, thành tựu, và dự
                          án mà họ đã tham gia.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Hoạt động gần đây
                      </h3>
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
                          <p className="font-medium">Top Contributor</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Bài viết nổi bật
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#252525] rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                        <h4 className="font-medium mb-2 hover:text-[#ff4d4f] transition-colors">
                          Làm sao để học hiệu quả trong thời gian ngắn?
                        </h4>
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
                        <h4 className="font-medium mb-2 hover:text-[#ff4d4f] transition-colors">
                          Chia sẻ kinh nghiệm làm bài tập lớn
                        </h4>
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
                      <h3 className="font-semibold text-lg mb-1">
                        {member.name}
                      </h3>
                      <p className="text-[#ff4d4f] text-sm mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        {member.specialty}
                      </p>

                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {member.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#ff4d4f]/10 text-[#ff4d4f] px-2 py-1 rounded"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          <span className="text-[#ff4d4f] font-semibold">
                            {member.contribution}
                          </span>{" "}
                          đóng góp
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

  // Phần render diễn đàn thảo luận
  const renderForumContent = () => {
    return <ForumContainer initialTopics={forumTopics} />;
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
              Tham gia cộng đồng để chia sẻ kiến thức, tham gia sự kiện và kết
              nối với các thành viên khác
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
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "forums"
                  ? "text-[#ff4d4f]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("forums")}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Diễn đàn</span>
              </div>
              {activeTab === "forums" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4d4f]"
                />
              )}
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "events"
                  ? "text-[#ff4d4f]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("events")}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Sự kiện</span>
              </div>
              {activeTab === "events" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4d4f]"
                />
              )}
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "members"
                  ? "text-[#ff4d4f]"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("members")}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Thành viên</span>
              </div>
              {activeTab === "members" && (
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
            style={{ top: "-10%", right: "-5%" }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-[#ff4d4f]/10"
            style={{ bottom: "10%", left: "5%" }}
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Bạn muốn tham gia cộng đồng?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng ngay hôm nay để kết nối với các thành viên
              khác, chia sẻ kiến thức và cùng nhau phát triển.
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
              <button
                className="bg-[#2a2a2a] text-white px-6 py-3 rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center space-x-2"
                onClick={handleSubscribeNotifications}
              >
                <Bell className="w-5 h-5" />
                <span>Đăng ký thông báo</span>
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
