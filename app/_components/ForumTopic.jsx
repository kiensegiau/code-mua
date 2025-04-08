import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, User, Calendar, ArrowUpRight } from "lucide-react";

const ForumTopic = ({ topic, onTopicClick }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleClick = () => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  const formattedDate = new Date(topic.createdAt).toLocaleString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      variants={variants}
      onClick={handleClick}
      className="bg-[#1f1f1f] border border-gray-800 rounded-lg p-5 hover:border-[#ff4d4f] transition-colors cursor-pointer"
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold mb-2 text-white">{topic.title}</h3>
        <ArrowUpRight className="w-5 h-5 text-[#ff4d4f]" />
      </div>
      <p className="text-gray-400 mb-4 line-clamp-2">{topic.content}</p>
      <div className="flex items-center text-gray-500 text-sm space-x-6">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>{topic.author.name}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          <span>{topic.commentsCount} bình luận</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ForumTopic; 