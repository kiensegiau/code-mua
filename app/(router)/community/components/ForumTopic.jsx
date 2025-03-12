import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Eye, Heart, Clock, Tag, Paperclip } from "lucide-react";

// Component hiển thị một topic trong danh sách
const ForumTopic = ({ topic, onTopicClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Xử lý sự kiện click
  const handleClick = (e) => {
    // Ngăn sự kiện lan tỏa
    e.stopPropagation();

    // Hiệu ứng click
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);

    // Thêm thông báo nếu onTopicClick không tồn tại
    if (!onTopicClick) {
      return;
    }

    // Gọi callback onTopicClick
    onTopicClick(topic);
  };

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isClicked
          ? "bg-[#333333] border border-blue-500"
          : isHovered
          ? "bg-[#222222] border border-gray-700"
          : "bg-[#1f1f1f] border border-transparent"
      }`}
      style={{
        transform: isClicked ? "scale(0.98)" : "scale(1)",
        zIndex: 20,
        position: "relative",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="hidden sm:block">
            <img
              src={topic.avatar || "https://via.placeholder.com/40"}
              alt={topic.author}
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white line-clamp-2 break-words">
              {topic.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-400">
              <span className="font-medium text-gray-300">{topic.author}</span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {topic.time}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {topic.replies}
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {topic.views}
              </span>
              <span className="flex items-center">
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    topic.likes > 0 ? "text-red-500" : ""
                  }`}
                />
                {topic.likes}
              </span>
            </div>

            {/* Thêm một thông báo để debug */}
            <div className="mt-2 text-xs text-gray-500">
              ID: {topic.id} • Nhấp để xem chi tiết
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="px-3 py-1 text-sm bg-[#2d2d2d] rounded-full text-blue-400 font-medium">
            {topic.category}
          </div>
          <div className="flex flex-wrap gap-2">
            {topic.tags &&
              topic.tags.slice(0, 2).map((tag, index) => (
                <div
                  key={index}
                  className="px-2 py-1 text-xs bg-[#222222] rounded-full text-gray-300 flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </div>
              ))}
            {topic.attachments > 0 && (
              <div className="px-2 py-1 text-xs bg-[#222222] rounded-full text-gray-300 flex items-center">
                <Paperclip className="w-3 h-3 mr-1" />
                {topic.attachments}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vùng nhấp có thể click tương tác */}
      <div
        className={`absolute inset-0 rounded-xl transition-colors duration-300 ${
          isHovered ? "bg-blue-500 opacity-5" : "opacity-0"
        }`}
        onClick={handleClick}
      />
    </motion.div>
  );
};

export default ForumTopic;
