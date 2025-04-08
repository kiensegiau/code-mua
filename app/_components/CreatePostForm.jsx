import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

const CreatePostForm = ({ onCancel, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài viết";
      isValid = false;
    } else if (formData.title.length < 10) {
      newErrors.title = "Tiêu đề phải có ít nhất 10 ký tự";
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung bài viết";
      isValid = false;
    } else if (formData.content.length < 30) {
      newErrors.content = "Nội dung phải có ít nhất 30 ký tự";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onPostCreated) {
        onPostCreated({
          id: `post-${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          author: {
            id: "currentUser",
            name: "Bạn",
            avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=You",
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      // Hiển thị thông báo lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#121212] min-h-screen pb-10"
    >
      <button
        onClick={onCancel}
        className="flex items-center text-[#ff4d4f] mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại diễn đàn
      </button>

      <div className="bg-[#1f1f1f] rounded-lg p-6 border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-white">Tạo bài viết mới</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-white font-medium mb-2"
            >
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#2a2a2a] border ${
                errors.title ? "border-red-500" : "border-gray-700"
              } rounded-lg focus:outline-none focus:border-[#ff4d4f] text-gray-200`}
              placeholder="Nhập tiêu đề bài viết..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-white font-medium mb-2"
            >
              Nội dung bài viết
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#2a2a2a] border ${
                errors.content ? "border-red-500" : "border-gray-700"
              } rounded-lg focus:outline-none focus:border-[#ff4d4f] text-gray-200 min-h-[200px]`}
              placeholder="Mô tả chi tiết câu hỏi hoặc vấn đề của bạn..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff3538] transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Đăng bài viết
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePostForm; 