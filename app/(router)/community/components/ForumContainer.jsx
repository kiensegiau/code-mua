import React, { useState, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import ForumTopicList from "./ForumTopicList";
import TopicDetail from "./TopicDetail";
import CreatePostForm from "./CreatePostForm";

const ForumContainer = ({ initialTopics = [] }) => {
  const [topics, setTopics] = useState(initialTopics);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [renderKey, setRenderKey] = useState(Date.now());
  // Thêm flag để debug
  const [debugInfo, setDebugInfo] = useState({
    lastAction: null,
    lastTopicId: null,
    renderCount: 0,
  });

  // Debug để xem khi nào component được render lại và selectedTopic có giá trị
  useEffect(() => {
    // Tăng render count mỗi khi component render lại
    setDebugInfo((prev) => ({
      ...prev,
      renderCount: prev.renderCount + 1,
    }));
  }, [selectedTopic]);

  // Log trạng thái khi component mount
  useEffect(() => {}, []);

  // Sử dụng useCallback để tránh tạo lại hàm mỗi lần render
  const handleSelectTopic = useCallback((topic) => {
    setSelectedTopic(topic);
    // Đánh dấu là đã đọc
    setTopics((prevTopics) =>
      prevTopics.map((t) => {
        if (t.id === topic.id) {
          return { ...t, isRead: true };
        }
        return t;
      })
    );
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedTopic(null);
  }, []);

  const handleCreatePost = useCallback(() => {
    setIsCreatingPost(true);
  }, []);

  const handleCloseCreatePost = useCallback(() => {
    setIsCreatingPost(false);
  }, []);

  const handleSubmitPost = useCallback((postData) => {
    // Tạo ID mới cho bài đăng
    const newPostId = `post-${Date.now()}`;

    // Tạo bài đăng mới với dữ liệu từ form
    const newPost = {
      id: newPostId,
      ...postData,
      author: "Người dùng hiện tại", // Giả sử thông tin người dùng
      avatar: "/avatars/student1.jpg", // Giả sử avatar người dùng
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isRead: true,
    };

    // Thêm bài đăng mới vào danh sách
    setTopics((prevTopics) => [newPost, ...prevTopics]);

    // Đóng form tạo bài đăng
    setIsCreatingPost(false);

    // Tùy chọn: Chọn bài đăng vừa tạo để xem chi tiết
    setSelectedTopic(newPost);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Lọc danh sách topic dựa trên search query
  const filteredTopics = topics.filter((topic) => {
    if (!searchQuery) return true;

    return (
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex-1">
      {selectedTopic ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1f1f1f] rounded-xl p-4 md:p-6"
        >
          <TopicDetail topic={selectedTopic} onClose={handleCloseDetail} />
        </motion.div>
      ) : isCreatingPost ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1f1f1f] rounded-xl p-4 md:p-6"
        >
          <CreatePostForm
            onSubmit={handleSubmitPost}
            onCancel={handleCloseCreatePost}
          />
        </motion.div>
      ) : (
        <ForumTopicList
          topics={filteredTopics}
          onSelectTopic={handleSelectTopic}
          onCreatePost={handleCreatePost}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
};

// Sử dụng memo để tránh re-render không cần thiết
export default memo(ForumContainer);
