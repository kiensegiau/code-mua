import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ForumTopicList from "./ForumTopicList";
import TopicDetail from "./TopicDetail";
import CreatePostForm from "./CreatePostForm";

const ForumContainer = ({ initialTopics = [] }) => {
  console.log(
    "ForumContainer được render với initialTopics:",
    initialTopics.length
  );

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
    console.log(
      "ForumContainer rendered, selectedTopic:",
      selectedTopic ? selectedTopic.id : "null"
    );

    // Tăng render count mỗi khi component render lại
    setDebugInfo((prev) => ({
      ...prev,
      renderCount: prev.renderCount + 1,
    }));
  }, [selectedTopic]);

  // Log trạng thái khi component mount
  useEffect(() => {
    console.log(
      "ForumContainer mounted with initialTopics:",
      initialTopics.length
    );
    console.log(
      "Sample topic:",
      initialTopics.length > 0 ? initialTopics[0].id : "none"
    );
  }, []);

  const handleSelectTopic = (topic) => {
    console.log("ForumContainer: handleSelectTopic được gọi với topic:", topic);

    // Kiểm tra xem topic có hợp lệ không
    if (!topic || !topic.id) {
      console.error("Topic không hợp lệ:", topic);
      // Xóa alert
      return;
    }

    if (topic) {
      console.log("Topic được chọn có id:", topic.id, "và title:", topic.title);

      // Tạo một bản sao hoàn toàn mới của topic để đảm bảo state cập nhật đúng
      const newSelectedTopic = JSON.parse(JSON.stringify(topic));
      console.log(
        "Đang cập nhật selectedTopic với topic mới:",
        newSelectedTopic.id
      );

      // Log thông tin để debug
      setDebugInfo((prev) => ({
        ...prev,
        lastAction: "select_topic",
        lastTopicId: topic.id,
      }));

      // Cập nhật state
      setSelectedTopic(newSelectedTopic);
      setRenderKey(Date.now());

      console.log(
        "Đã cập nhật selectedTopic, giá trị mới là:",
        newSelectedTopic.id
      );
      console.log("Đã cập nhật renderKey:", renderKey);
    } else {
      console.log("CẢNH BÁO: topic được truyền vào là null hoặc undefined");
      // Xóa alert
    }
  };

  const handleCloseDetail = () => {
    console.log("Đóng chi tiết bài viết");

    // Log thông tin để debug
    setDebugInfo((prev) => ({
      ...prev,
      lastAction: "close_detail",
      lastTopicId: selectedTopic ? selectedTopic.id : null,
    }));

    // Log thêm thông tin để debug
    console.log(
      "handleCloseDetail được gọi - chuẩn bị đặt selectedTopic về null"
    );
    console.log(
      "selectedTopic trước khi đặt null:",
      selectedTopic ? selectedTopic.id : "không có"
    );

    // Đặt selectedTopic về null và cập nhật renderKey
    setSelectedTopic(null);
    setRenderKey(Date.now());

    // Log sau khi đã cập nhật
    console.log(
      "Đã đặt selectedTopic về null và cập nhật renderKey:",
      Date.now()
    );
  };

  const handleCreatePost = () => {
    setIsCreatingPost(true);
    setRenderKey(Date.now());

    // Log thông tin để debug
    setDebugInfo((prev) => ({
      ...prev,
      lastAction: "create_post",
    }));
  };

  const handleCloseCreatePost = () => {
    setIsCreatingPost(false);
    setRenderKey(Date.now());

    // Log thông tin để debug
    setDebugInfo((prev) => ({
      ...prev,
      lastAction: "close_create_post",
    }));
  };

  const handleSubmitPost = (postData) => {
    const newTopic = {
      id: Date.now().toString(),
      title: postData.title,
      author: "Người dùng hiện tại",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      time: "Vừa xong",
      category: postData.category,
      replies: 0,
      views: 0,
      likes: 0,
      tags: postData.tags,
      attachments: postData.attachedFiles.length,
      content: postData.content,
    };

    setTopics([newTopic, ...topics]);
    setIsCreatingPost(false);
    setRenderKey(Date.now());

    // Log thông tin để debug
    setDebugInfo((prev) => ({
      ...prev,
      lastAction: "submit_post",
      lastTopicId: newTopic.id,
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    // Log thông tin để debug
    setDebugInfo((prev) => ({
      ...prev,
      lastAction: "search",
      searchQuery: query,
    }));
  };

  const handleLike = () => {
    if (selectedTopic) {
      const updatedTopics = topics.map((topic) => {
        if (topic.id === selectedTopic.id) {
          return { ...topic, likes: topic.likes + 1 };
        }
        return topic;
      });
      setTopics(updatedTopics);
      setSelectedTopic({ ...selectedTopic, likes: selectedTopic.likes + 1 });
      setRenderKey(Date.now());

      // Log thông tin để debug
      setDebugInfo((prev) => ({
        ...prev,
        lastAction: "like",
        lastTopicId: selectedTopic.id,
      }));
    }
  };

  const filteredTopics = searchQuery
    ? topics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (topic.tags &&
            topic.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      )
    : topics;

  console.log(
    "ForumContainer sẽ render, selectedTopic:",
    selectedTopic ? selectedTopic.id : "null"
  );
  console.log("ForumContainer sẽ render, topics length:", topics.length);
  console.log("ForumContainer renderKey:", renderKey);
  console.log("ForumContainer debug info:", debugInfo);

  // Quyết định component nào sẽ được render
  if (selectedTopic) {
    console.log("Hiển thị chi tiết cho topic id:", selectedTopic.id);

    // Kiểm tra và xác thực handleCloseDetail
    console.log(
      "handleCloseDetail là function:",
      typeof handleCloseDetail === "function"
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={`detail-${selectedTopic.id}-${renderKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111111] rounded-2xl shadow-xl overflow-hidden"
        >
          <TopicDetail
            topic={selectedTopic}
            onCloseDetail={handleCloseDetail}
            onLike={handleLike}
            onSavePost={() => {
              console.log("Lưu bài viết:", selectedTopic.id);

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "save_post",
                lastTopicId: selectedTopic.id,
              }));
            }}
            onReportPost={() => {
              console.log("Báo cáo bài viết:", selectedTopic.id);

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "report_post",
                lastTopicId: selectedTopic.id,
              }));
            }}
            onShare={() => {
              console.log("Chia sẻ bài viết:", selectedTopic.id);

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "share_post",
                lastTopicId: selectedTopic.id,
              }));
            }}
            onDownloadResource={() => {
              console.log(
                "Tải xuống tài nguyên từ bài viết:",
                selectedTopic.id
              );

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "download_resource",
                lastTopicId: selectedTopic.id,
              }));
            }}
            onSubmitComment={(comment) => {
              console.log(
                "Gửi bình luận cho bài viết:",
                selectedTopic.id,
                comment
              );

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "submit_comment",
                lastTopicId: selectedTopic.id,
              }));
            }}
            onMessage={() => {
              console.log("Gửi tin nhắn về bài viết:", selectedTopic.id);

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "message",
                lastTopicId: selectedTopic.id,
              }));
            }}
          />
        </motion.div>
      </div>
    );
  } else if (isCreatingPost) {
    console.log("Hiển thị form tạo bài viết");
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={`create-${renderKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111111] rounded-2xl shadow-xl overflow-hidden"
        >
          <CreatePostForm
            onClose={handleCloseCreatePost}
            onSubmit={handleSubmitPost}
          />
        </motion.div>
      </div>
    );
  } else {
    console.log("Hiển thị danh sách topic");
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          key={`list-${renderKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111111] rounded-2xl shadow-xl overflow-hidden"
        >
          <ForumTopicList
            topics={filteredTopics}
            onSelectTopic={handleSelectTopic}
            onCreatePost={handleCreatePost}
            onSearch={handleSearch}
            onViewMorePosts={() => {
              console.log("Xem thêm bài viết");

              // Log thông tin để debug
              setDebugInfo((prev) => ({
                ...prev,
                lastAction: "view_more_posts",
              }));
            }}
          />
        </motion.div>
      </div>
    );
  }
};

export default ForumContainer;
