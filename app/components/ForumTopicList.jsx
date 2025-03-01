import React from "react";
import { motion } from "framer-motion";
import { Search, PlusCircle, ChevronRight } from "lucide-react";
import ForumTopic from "./ForumTopic";

const ForumTopicList = ({
  forumTopics,
  onTopicClick,
  onCreatePost,
  onViewMorePosts,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:outline-none focus:border-[#ff4d4f] text-gray-200"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
        {forumTopics.map((topic) => (
          <ForumTopic
            key={topic.id}
            topic={topic}
            onTopicClick={onTopicClick}
          />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="text-[#ff4d4f] flex items-center space-x-2 hover:underline"
          onClick={onViewMorePosts}
        >
          <span>Xem thêm bài viết</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ForumTopicList;
