import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  User,
} from "lucide-react";

const mockComments = [
  {
    id: "comment1",
    content:
      "Tôi nghĩ bạn nên bắt đầu với tài liệu chính thức của React về Hooks. Rất dễ hiểu và có nhiều ví dụ thực tế.",
    author: {
      id: "user4",
      name: "Phạm Hoàng D",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Emily",
    },
    createdAt: "2023-09-05T16:30:00",
    likes: 8,
  },
  {
    id: "comment2",
    content:
      "useEffect có thể hơi khó hiểu lúc đầu. Tôi khuyên bạn nên nghĩ về nó như một cách để đồng bộ component của bạn với các hệ thống bên ngoài.",
    author: {
      id: "user5",
      name: "Hoàng Thị E",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Michael",
    },
    createdAt: "2023-09-05T17:45:00",
    likes: 12,
  },
  {
    id: "comment3",
    content:
      "Tôi đề xuất khóa học của Kent C. Dodds về React Hooks. Rất chi tiết và dễ hiểu!",
    author: {
      id: "user6",
      name: "Trương Văn F",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia",
    },
    createdAt: "2023-09-06T09:20:00",
    likes: 5,
  },
  {
    id: "comment4",
    content:
      "Việc hiểu cách hoạt động của Hooks sẽ mất thời gian. Hãy kiên nhẫn và thực hành nhiều!",
    author: {
      id: "user7",
      name: "Lý Thị G",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=William",
    },
    createdAt: "2023-09-06T11:10:00",
    likes: 7,
  },
  {
    id: "comment5",
    content:
      "Custom hooks là một tính năng mạnh mẽ mà bạn nên tìm hiểu sau khi đã hiểu các hooks cơ bản.",
    author: {
      id: "user8",
      name: "Ngô Văn H",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Olivia",
    },
    createdAt: "2023-09-07T14:05:00",
    likes: 9,
  },
];

const TopicDetail = ({ topic, onBackClick }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(mockComments);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: `comment${Date.now()}`,
      content: newComment,
      author: {
        id: "currentUser",
        name: "Bạn",
        avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=You",
      },
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  if (!topic) return null;

  const formattedDate = new Date(topic.createdAt).toLocaleString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#121212] min-h-screen pb-10"
    >
      <button
        onClick={onBackClick}
        className="flex items-center text-[#ff4d4f] mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại danh sách
      </button>

      <div className="bg-[#1f1f1f] rounded-lg p-6 mb-8 border border-gray-800">
        <h1 className="text-2xl font-bold mb-4 text-white">{topic.title}</h1>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#2a2a2a] overflow-hidden mr-3">
            <img
              src={topic.author.avatar}
              alt={topic.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-white">{topic.author.name}</p>
            <p className="text-sm text-gray-400">{formattedDate}</p>
          </div>
        </div>
        <p className="text-gray-300 mb-6 leading-relaxed">{topic.content}</p>
        <div className="flex items-center space-x-6 text-gray-400">
          <button className="flex items-center hover:text-[#ff4d4f]">
            <ThumbsUp className="w-5 h-5 mr-2" />
            <span>Thích</span>
          </button>
          <button className="flex items-center hover:text-[#ff4d4f]">
            <MessageSquare className="w-5 h-5 mr-2" />
            <span>Bình luận</span>
          </button>
          <button className="flex items-center hover:text-[#ff4d4f]">
            <Share2 className="w-5 h-5 mr-2" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1f1f1f] rounded-lg p-6 mb-8 border border-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-white">
          Bình luận ({comments.length})
        </h2>

        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center mr-3 overflow-hidden">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-[#ff4d4f] text-gray-200 min-h-[100px]"
              />
              <button
                type="submit"
                className="absolute bottom-3 right-3 text-[#ff4d4f] hover:bg-[#2a2a2a] p-2 rounded-full"
                disabled={!newComment.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] overflow-hidden mr-3">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-white">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                  <button className="hover:text-[#ff4d4f]">Thích</button>
                  <button className="hover:text-[#ff4d4f]">Trả lời</button>
                  <span>{comment.likes} lượt thích</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TopicDetail; 