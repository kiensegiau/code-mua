import React, { useState } from "react";
import { motion } from "framer-motion";
import ForumTopicList from "./ForumTopicList";
import TopicDetail from "./TopicDetail";
import CreatePostForm from "./CreatePostForm";

const ForumContainer = ({ forumTopics }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Handle topic click
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  // Handle close detail view
  const handleCloseDetail = () => {
    setSelectedTopic(null);
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

  // Xử lý khi nhấn nút gửi bình luận
  const handleSubmitComment = (e) => {
    e.preventDefault();
    // Xử lý logic gửi bình luận ở đây
    alert("Đã gửi bình luận!");
  };

  // Xử lý khi nhấn nút tải tài liệu
  const handleDownloadResource = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic tải tài liệu
    alert("Đang tải tài liệu...");
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

  // Xử lý khi nhấn nút nhắn tin
  const handleMessage = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic nhắn tin
    alert("Đã mở cửa sổ nhắn tin!");
  };

  // Xử lý khi nhấn nút tạo bài viết
  const handleCreatePost = () => {
    setIsCreatingPost(true);
  };

  // Xử lý khi đóng form tạo bài viết
  const handleCloseCreatePost = () => {
    setIsCreatingPost(false);
  };

  // Xử lý khi gửi bài viết mới
  const handleSubmitPost = (postData) => {
    // Xử lý logic đăng bài viết mới
    console.log("Bài viết mới:", postData);
    alert("Đã đăng bài viết thành công!");
    setIsCreatingPost(false);
  };

  // Xử lý khi nhấn nút xem thêm bài viết
  const handleViewMorePosts = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên phần tử cha
    // Xử lý logic xem thêm bài viết
    alert("Đang tải thêm bài viết...");
  };

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
      {selectedTopic ? (
        <TopicDetail
          topic={selectedTopic}
          onCloseDetail={handleCloseDetail}
          onLike={handleLike}
          onSavePost={handleSavePost}
          onReportPost={handleReportPost}
          onShare={handleShare}
          onDownloadResource={handleDownloadResource}
          onSubmitComment={handleSubmitComment}
          onMessage={handleMessage}
        />
      ) : (
        <ForumTopicList
          forumTopics={forumTopics}
          onTopicClick={handleTopicClick}
          onCreatePost={handleCreatePost}
          onViewMorePosts={handleViewMorePosts}
        />
      )}

      {isCreatingPost && (
        <CreatePostForm
          onClose={handleCloseCreatePost}
          onSubmit={handleSubmitPost}
        />
      )}
    </motion.div>
  );
};

export default ForumContainer;
