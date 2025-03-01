import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, PlusCircle, ChevronRight } from "lucide-react";
import ForumTopic from "./ForumTopic";

const ForumTopicList = ({
  topics = [],
  onSelectTopic,
  onCreatePost,
  onViewMorePosts,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleTopicClick = (topic) => {
    console.log("ForumTopicList: handleTopicClick gọi với topic:", topic.id);

    if (onSelectTopic) {
      console.log("ForumTopicList: Gọi onSelectTopic với topic:", topic.id);
      onSelectTopic(topic);
    } else {
      console.log("CẢNH BÁO: onSelectTopic không được định nghĩa");
    }
  };

  // Phương thức mới để đảm bảo click trực tiếp vào container sẽ kích hoạt sự kiện
  const handleContainerClick = (topic, e) => {
    e.stopPropagation(); // Ngăn sự kiện lan toả
    console.log("Container click được kích hoạt cho topic:", topic.id);

    // Hiển thị animation click
    const target = e.currentTarget;
    target.style.transform = "scale(0.98)";
    setTimeout(() => {
      target.style.transform = "scale(1)";
    }, 100);

    // Tiếp tục xử lý click
    handleTopicClick(topic);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="visible"
      animate="visible"
      className="space-y-5"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Diễn đàn thảo luận</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, tag hoặc tác giả..."
              className="w-full pl-10 pr-4 py-2 bg-[#1E1E1E] rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <button
            className="flex items-center space-x-2 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
            onClick={onCreatePost}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tạo bài viết</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topics && topics.length > 0 ? (
          topics.map((topic) => {
            console.log("Rendering topic id:", topic.id, "title:", topic.title);
            return (
              <div
                key={`container-${topic.id}`}
                className="w-full cursor-pointer hover:bg-[#222222] rounded-xl transition-all duration-300 relative"
                onClick={(e) => handleContainerClick(topic, e)}
                style={{ position: "relative" }}
              >
                {/* Thêm một layer phủ đảm bảo sự kiện click được phát hiện */}
                <div
                  className="absolute inset-0 z-10 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(
                      "Overlay click được kích hoạt cho topic:",
                      topic.id
                    );
                    handleTopicClick(topic);
                  }}
                ></div>

                <ForumTopic topic={topic} onTopicClick={handleTopicClick} />
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="mt-4 text-xl font-semibold">
              Không tìm thấy bài viết nào
            </p>
            <p className="mt-2">
              Thử tìm kiếm với từ khóa khác hoặc tạo một bài viết mới
            </p>
          </div>
        )}
      </div>

      {topics && topics.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            className="text-[#ff4d4f] flex items-center space-x-2 hover:underline"
            onClick={onViewMorePosts}
          >
            <span>Xem thêm bài viết</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ForumTopicList;
