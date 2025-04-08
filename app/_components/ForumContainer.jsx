import React, { useState } from "react";
import ForumTopicList from "./ForumTopicList";
import TopicDetail from "./TopicDetail";
import CreatePostForm from "./CreatePostForm";

const mockTopics = [
  {
    id: "1",
    title: "Làm thế nào để hiểu rõ ReactJS Hooks?",
    content:
      "Tôi mới bắt đầu học ReactJS và gặp khó khăn với Hooks. Làm thế nào để hiểu rõ useEffect, useState và useContext?",
    author: {
      id: "user1",
      name: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=John",
    },
    createdAt: "2023-09-05T15:30:00",
    commentsCount: 12,
  },
  {
    id: "2",
    title: "Tài liệu học NextJS tốt nhất hiện nay?",
    content:
      "Các bạn có thể giới thiệu cho tôi một số tài liệu học NextJS tốt, dễ hiểu không? Tôi muốn áp dụng vào dự án thực tế.",
    author: {
      id: "user2",
      name: "Trần Thị B",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sarah",
    },
    createdAt: "2023-09-06T10:15:00",
    commentsCount: 8,
  },
  {
    id: "3",
    title: "Tối ưu hiệu suất cho ứng dụng React lớn",
    content:
      "Tôi đang phát triển một ứng dụng React khá lớn và gặp vấn đề về hiệu suất. Có ai có kinh nghiệm về việc tối ưu không?",
    author: {
      id: "user3",
      name: "Lê Văn C",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Alex",
    },
    createdAt: "2023-09-07T08:20:00",
    commentsCount: 15,
  },
];

const ForumContainer = () => {
  const [activeView, setActiveView] = useState("list");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setActiveView("detail");
  };

  const handleBackToList = () => {
    setActiveView("list");
    setSelectedTopic(null);
  };

  const handleCreatePost = () => {
    setActiveView("create");
  };

  const handlePostCreated = () => {
    // Tạm thời chỉ quay về danh sách, sau này sẽ thêm logic cập nhật danh sách
    setActiveView("list");
  };

  const renderContent = () => {
    switch (activeView) {
      case "list":
        return (
          <ForumTopicList
            forumTopics={mockTopics}
            onTopicClick={handleTopicClick}
            onCreatePost={handleCreatePost}
            onViewMorePosts={() => console.log("View more posts")}
          />
        );
      case "detail":
        return (
          <TopicDetail
            topic={selectedTopic}
            onBackClick={handleBackToList}
          />
        );
      case "create":
        return (
          <CreatePostForm
            onCancel={handleBackToList}
            onPostCreated={handlePostCreated}
          />
        );
      default:
        return <div>Không có nội dung</div>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {renderContent()}
    </div>
  );
};

export default ForumContainer; 