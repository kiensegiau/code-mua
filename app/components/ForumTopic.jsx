import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Clock } from "lucide-react";

const ForumTopic = ({ topic, onTopicClick }) => {
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

  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1f1f1f] rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:bg-[#252525] cursor-pointer"
      onClick={() => onTopicClick(topic)}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={topic.avatar}
              alt={topic.author}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-400">{topic.author}</span>
            <span className="text-xs bg-[#ff4d4f]/20 text-[#ff4d4f] px-2 py-1 rounded">
              {topic.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold hover:text-[#ff4d4f] transition-colors mb-2">
            {topic.title}
          </h3>
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
              <span
                key={idx}
                className="text-xs bg-[#2a2a2a] px-2 py-1 rounded hover:bg-[#333] transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ForumTopic;
