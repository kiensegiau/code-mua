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
      title: 'Làm sao để học hiệu quả trong thời gian ngắn?',
      author: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      replies: 24,
      views: 152,
      likes: 18,
      category: 'Học tập',
      time: '3 giờ trước',
      tags: ['học tập', 'kỹ năng']
    },
    {
      id: 2,
      title: 'Chia sẻ kinh nghiệm làm bài tập lớn cuối kỳ',
      author: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      replies: 16,
      views: 89,
      likes: 32,
      category: 'Kinh nghiệm',
      time: '1 ngày trước',
      tags: ['bài tập', 'đồ án']
    },
    {
      id: 3,
      title: 'Tìm nhóm học tập cho kỳ thi sắp tới',
      author: 'Lê Văn C',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
      replies: 35,
      views: 211,
      likes: 42,
      category: 'Tìm nhóm',
      time: '2 ngày trước',
      tags: ['nhóm học', 'kỳ thi']
    },
    {
      id: 4,
      title: 'Tài liệu ôn tập môn Toán cao cấp',
      author: 'Phạm Thị D',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
      replies: 18,
      views: 320,
      likes: 64,
      category: 'Tài liệu',
      time: '4 ngày trước',
      tags: ['tài liệu', 'toán học']
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
                <button className="flex items-center space-x-2 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors">
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
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <img src={topic.avatar} alt={topic.author} className="w-8 h-8 rounded-full" />
                        <span className="text-gray-400">{topic.author}</span>
                        <span className="text-xs bg-[#ff4d4f]/20 text-[#ff4d4f] px-2 py-1 rounded">{topic.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold hover:text-[#ff4d4f] transition-colors mb-2">{topic.title}</h3>
                      <div className="flex space-x-4 text-sm text-gray-400">
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
              <button className="text-[#ff4d4f] flex items-center space-x-2 hover:underline">
                <span>Xem thêm bài viết</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sự kiện sắp diễn ra</h2>
              <button className="flex items-center space-x-2 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors">
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
                      <button className="text-sm px-3 py-1 bg-[#ff4d4f]/10 text-[#ff4d4f] rounded-full hover:bg-[#ff4d4f]/20 transition-colors">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="text-[#ff4d4f] flex items-center space-x-2 hover:underline">
                <span>Xem tất cả sự kiện</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Thành viên nổi bật</h2>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 border border-[#ff4d4f] text-[#ff4d4f] px-4 py-2 rounded-lg hover:bg-[#ff4d4f]/10 transition-colors">
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
                    <button className="text-sm flex items-center space-x-1 text-[#4d79ff] hover:underline">
                      <UserPlus className="w-4 h-4" />
                      <span>Kết nối</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <button className="text-[#ff4d4f] flex items-center space-x-2 hover:underline">
                <span>Xem tất cả thành viên</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
              <button className="bg-[#ff4d4f] text-white px-6 py-3 rounded-lg hover:bg-[#ff3538] transition-colors flex items-center justify-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <span>Đăng ký thành viên</span>
              </button>
              <button className="border border-[#ff4d4f] text-[#ff4d4f] px-6 py-3 rounded-lg hover:bg-[#ff4d4f]/10 transition-colors flex items-center justify-center space-x-2">
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
        >
          <MessageSquare className="w-5 h-5" />
          <span>Đặt câu hỏi</span>
        </button>
      </motion.div>
    </div>
  );
} 