import React, { useState } from "react";
import { Image, Hash, X } from "lucide-react";
import { PaperClip } from "lucide-react/dist/esm/icons/paperclip";

const CreatePostForm = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);

  const categories = [
    { id: "study", name: "Học tập" },
    { id: "exam", name: "Kỳ thi" },
    { id: "general", name: "Chung" },
    { id: "resources", name: "Tài liệu" },
    { id: "admission", name: "Tuyển sinh" },
  ];

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAttachFile = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setAttachedFiles([...attachedFiles, ...fileData]);
  };

  const handleRemoveFile = (fileName) => {
    setAttachedFiles(attachedFiles.filter((file) => file.name !== fileName));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags,
      category: selectedCategory,
      attachedFiles,
    });
  };

  return (
    <div className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tạo bài viết mới</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-[#ff4d4f] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Chuyên mục
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
            required
          >
            <option value="">Chọn chuyên mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Nội dung
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
            placeholder="Nhập nội dung bài viết"
            rows={10}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Thẻ
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-[#2a2a2a] text-gray-200 px-2 py-1 rounded"
              >
                <Hash className="w-4 h-4 mr-1" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-gray-400 hover:text-[#ff4d4f] focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyPress}
              className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
              placeholder="Thêm thẻ (Enter hoặc Tab để thêm)"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 bg-[#2a2a2a] border border-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tệp đính kèm
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-[#2a2a2a] text-gray-200 px-3 py-2 rounded"
              >
                <PaperClip className="w-4 h-4 mr-2" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="ml-2 text-gray-400 hover:text-[#ff4d4f] focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-[#2a2a2a] border border-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center"
            >
              <PaperClip className="w-5 h-5 mr-2" />
              <span>Đính kèm tệp</span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                onChange={handleAttachFile}
              />
            </label>
            <label
              htmlFor="image-upload"
              className="cursor-pointer ml-2 bg-[#2a2a2a] border border-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-[#333] transition-colors flex items-center"
            >
              <Image className="w-5 h-5 mr-2" />
              <span>Thêm ảnh</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleAttachFile}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#ff4d4f] text-white hover:bg-[#ff3538] transition-colors"
          >
            Đăng bài
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
