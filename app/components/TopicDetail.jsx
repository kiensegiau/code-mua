import React from "react";
import {
  ChevronRight,
  Heart,
  BookOpen,
  Tag,
  Share2,
  Clock,
  MessageSquare,
  Download,
} from "lucide-react";

const TopicDetail = ({
  topic,
  onCloseDetail,
  onLike,
  onSavePost,
  onReportPost,
  onShare,
  onDownloadResource,
  onSubmitComment,
  onMessage,
}) => {
  return (
    <div className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onCloseDetail}
          className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          <span>Quay lại</span>
        </button>
        <div className="flex space-x-3">
          <button
            onClick={onLike}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>Thích</span>
          </button>
          <button
            onClick={onSavePost}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Lưu</span>
          </button>
          <button
            onClick={onReportPost}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
          >
            <Tag className="w-5 h-5" />
            <span>Báo cáo</span>
          </button>
          <button
            onClick={onShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#ff4d4f] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={topic.avatar}
            alt={topic.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium">{topic.author}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{topic.time}</span>
              <span className="text-xs bg-[#ff4d4f]/20 text-[#ff4d4f] px-2 py-1 rounded">
                {topic.category}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>

        <div className="prose prose-invert max-w-none mb-6">
          <p>
            Chào cả nhà, hôm nay mình muốn chia sẻ với mọi người bí kíp ôn thi
            siêu tốc mà mình đã áp dụng thành công trong kỳ thi vừa rồi. Mình đã
            cải thiện điểm số từ trung bình lên thành xuất sắc chỉ trong vòng 2
            tuần ôn tập thôi đó 😎
          </p>
          <p>
            <strong>Bí kíp 1: Phương pháp Pomodoro cải tiến</strong>
            <br />
            Mình chia thời gian học thành các khung 30p học - 5p nghỉ. Cứ 4 chu
            kỳ như vậy thì nghỉ dài 15p. Điểm khác biệt là mình sẽ ghi âm lại
            kiến thức trong lúc học và nghe lại trong lúc nghỉ ngắn. Hiệu quả
            kinh khủng luôn ý!
          </p>
          <p>
            <strong>Bí kíp 2: Mind map + Flashcard</strong>
            <br />
            Mình kết hợp vẽ mind map để nắm tổng quan, sau đó chuyển các ý chính
            thành flashcard để ôn tập hàng ngày. Mình dùng app Anki để làm điều
            này, tiện cực kỳ vì nó có thuật toán giúp mình nhớ lâu hơn.
          </p>
          <p>
            <strong>Bí kíp 3: Dạy lại kiến thức</strong>
            <br />
            Cái này hơi lạ nhưng mà hiệu quả vcl! Mình lập group học tập và mỗi
            người sẽ "dạy" lại một phần kiến thức cho cả nhóm. Khi phải giải
            thích cho người khác hiểu, bản thân mình sẽ hiểu sâu hơn rất nhiều.
          </p>
          <p>
            Mình đã áp dụng 3 bí kíp này và đạt 9.5/10 môn Giải tích, từ một đứa
            trước đó chỉ được có 6 điểm thôi đó mọi người ơi! Ai muốn biết thêm
            chi tiết thì cmt bên dưới nha, mình sẽ rep ngay và luôn 👇
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {topic.tags &&
            topic.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#2a2a2a] px-2 py-1 rounded hover:bg-[#333] transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
        </div>

        <div className="bg-[#252525] rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-1">Tài liệu đính kèm</h3>
            <p className="text-sm text-gray-400">
              Tài liệu tham khảo cho phương pháp học tập
            </p>
          </div>
          <button
            onClick={onDownloadResource}
            className="flex items-center space-x-2 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Tải xuống</span>
          </button>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Bình luận ({topic.replies})
          </h3>
          <div className="flex space-x-4 mb-6">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-[#ff4d4f]"
                placeholder="Viết bình luận của bạn..."
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={onSubmitComment}
                  className="bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
                >
                  Gửi bình luận
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex space-x-4">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Commenter"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">Phương Linh</h4>
                  <span className="text-xs text-gray-400">2 giờ trước</span>
                </div>
                <p className="text-gray-300 mb-2">
                  Bài viết hay quá chị ơi! Em đang cần gấp mấy bí kíp này để cứu
                  bản thân trong kỳ thi sắp tới 😭 Chị có thể chia sẻ thêm về
                  cách tạo flashcard hiệu quả ko ạ? Em toàn quên mất kiến thức
                  sau khi học xong huhu
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <button
                    className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(e);
                    }}
                  >
                    <Heart className="w-4 h-4" />
                    <span>12</span>
                  </button>
                  <button
                    className="hover:text-[#ff4d4f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessage(e);
                    }}
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <img
                src="https://randomuser.me/api/portraits/men/86.jpg"
                alt="Commenter"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">Tuấn Kiệt</h4>
                  <span className="text-xs text-gray-400">1 ngày trước</span>
                </div>
                <p className="text-gray-300 mb-2">
                  Bí kíp số 3 xịn xò thật sự! T đã thử áp dụng và thấy hiệu quả
                  ngay. Nhưng mà tìm team để học chung hơi khó, có ai muốn lập
                  team học môn Xác suất thống kê ko? Inbox mình nhé, cùng cày
                  KPI nào ae 💪
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <button
                    className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(e);
                    }}
                  >
                    <Heart className="w-4 h-4" />
                    <span>8</span>
                  </button>
                  <button
                    className="hover:text-[#ff4d4f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessage(e);
                    }}
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <img
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt="Commenter"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">Minh Anh</h4>
                  <span className="text-xs text-gray-400 bg-[#ff4d4f]/10 px-1 rounded">
                    Tác giả
                  </span>
                  <span className="text-xs text-gray-400">1 ngày trước</span>
                </div>
                <p className="text-gray-300 mb-2">
                  @Phương Linh: Chị sẽ làm 1 bài chi tiết về cách tạo flashcard
                  hiệu quả trong tuần tới nha! Còn skrrt thì có thể dùng app
                  Anki hoặc Quizlet đều ok em né. Quan trọng là phải ôn lại
                  thường xuyên ý!
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <button
                    className="flex items-center space-x-1 hover:text-[#ff4d4f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(e);
                    }}
                  >
                    <Heart className="w-4 h-4" />
                    <span>15</span>
                  </button>
                  <button
                    className="hover:text-[#ff4d4f] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessage(e);
                    }}
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
