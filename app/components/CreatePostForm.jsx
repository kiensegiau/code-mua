import React, { useState } from "react";
import { X, Image, Paperclip, Tag as TagIcon } from "lucide-react";

const CreatePostForm = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const categories = [
    "Học tập",
    "Đồ án",
    "Tìm nhóm",
    "Tài liệu",
    "Chia sẻ",
    "Hỏi đáp",
    "Tuyển dụng",
    "Khác",
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      alert("Vui lòng điền đầy đủ tiêu đề, nội dung và chọn danh mục!");
      return;
    }

    onSubmit({
      title,
      content,
      category,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1f1f1f] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-[#1f1f1f] z-10">
          <h2 className="text-2xl font-bold">Tạo bài viết mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block mb-2 font-medium">
              Danh mục
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 font-medium">
              Nội dung
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung bài viết của bạn..."
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
              rows={8}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Thẻ</label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#2a2a2a] px-3 py-1 rounded-full"
                >
                  <span className="text-sm">#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-gray-400 hover:text-[#ff4d4f]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="Thêm thẻ..."
                className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-l-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#2a2a2a] border border-l-0 border-gray-700 rounded-r-lg px-4 text-gray-200 hover:bg-[#333] transition-colors"
              >
                <TagIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-medium">
              Đính kèm tài liệu (tùy chọn)
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className="flex items-center space-x-2 bg-[#2a2a2a] border border-gray-700 rounded-lg py-2 px-4 text-gray-200 hover:bg-[#333] transition-colors"
              >
                <Image className="w-5 h-5" />
                <span>Thêm ảnh</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 bg-[#2a2a2a] border border-gray-700 rounded-lg py-2 px-4 text-gray-200 hover:bg-[#333] transition-colors"
              >
                <Paperclip className="w-5 h-5" />
                <span>Đính kèm tệp</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-[#2a2a2a] transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff3538] transition-colors"
            >
              Đăng bài
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
