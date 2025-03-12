import React, { useEffect, useRef } from "react";
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
  const contentRef = useRef(null);

  // Thêm useEffect để debug khi component mount và thiết lập click ra ngoài
  useEffect(() => {
    // Thêm event listener cho click ra ngoài
    const handleOutsideClick = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        if (typeof onCloseDetail === "function") {
          onCloseDetail();
        }
      }
    };

    // Thêm sự kiện vào document
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up khi unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onCloseDetail]);

  const handleBackClick = (e) => {
    // Ngăn chặn sự kiện lan tỏa
    e.stopPropagation();

    if (typeof onCloseDetail === "function") {
      // Gọi hàm callback để quay lại
      onCloseDetail();
    }
  };

  if (!topic) {
    return (
      <div className="p-8 text-center">
        <p>Không tìm thấy thông tin bài viết</p>
        <button
          className="mt-4 bg-[#ff4d4f] text-white px-4 py-2 rounded-lg hover:bg-[#ff3538] transition-colors"
          onClick={handleBackClick}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={contentRef}
        className="bg-[#1f1f1f] rounded-xl p-6 transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-[#444444] z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Quay lại</span>
          </button>

          {/* Giữ phần còn lại không đổi */}
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
            {topic.id === 5 ? (
              <>
                <p>
                  Chào ae, em đang khóc dở mếu dở với mấy bài tập kỳ này 😭😭
                  Hôm qua thầy cho mấy bài tính toán phức tạp cực kỳ, em loay
                  hoay từ chiều đến h mà vẫn ko làm nổi. Em thề đã coi hết slide
                  + ghi chép đầy đủ + xem lại video các buổi học mà vẫn bế tắc.
                  Huhu!
                </p>
                <p>
                  Các anh chị có tài liệu hay mẹo nào để giải mấy bài dạng này
                  ko ạ? Em nộp muộn là -2 điểm luôn, deadline còn đúng 2 ngày
                  nữa thôi 🥲 Em đang rất rất cần giúp đỡ ạ!!!
                </p>
                <p>
                  <strong>Em up bài tập lên đây:</strong>
                  <br />
                  Bài 1: Tìm nghiệm tổng quát của phương trình vi phân bậc 2:
                  y'' - 3y' + 2y = 2e^x + 5sin(x)
                  <br />
                  Bài 2: Giải hệ phương trình vi phân tuyến tính:
                  <br />
                  x' = 3x + 4y
                  <br />
                  y' = 2x + y
                  <br />
                  Bài 3: Tính tích phân đường của trường vector F = (y^2, x^2,
                  xyz) dọc theo đường cong C cho bởi phương trình r(t) =
                  (cos(t), sin(t), t), 0 ≤ t ≤ 2π.
                </p>
                <p>
                  Em cảm ơn mọi người nhiều ạ, ai giúp được em xin 1 vé cf cưng
                  luôn 😭🙏
                </p>
              </>
            ) : topic.id === 6 ? (
              <>
                <p>
                  Helloooo ae, hôm nay Kiệt xin phép được "xàm xí" 1 tí về kỳ
                  thực tập đầu đời vừa rồi của mình. Đúng kiểu đi làm về nhận ra
                  đi học sướng vcllll mà ko biết 🥲🥲
                </p>
                <p>
                  <strong>✨ Setting:</strong> Công ty IT, nằm ở khu Cầu Giấy,
                  quy mô 150+ nhân viên, mảng Fintech.
                </p>
                <p>
                  <strong>✨ Ngày đầu tiên:</strong>
                  <br />
                  8h: Đến công ty với cái mặt hớn hở nhất quả đất 😎😎
                  <br />
                  8h30: Được anh lead dẫn đi gặp team, được phát 1 cái laptop
                  xịn sò
                  <br />
                  9h: Bắt đầu setup môi trường, cài đặt các công cụ cần thiết
                  <br />
                  11h: Setup cái database loằng ngoằng mà k hiểu gì, ăn trưa với
                  team (có free lunch, ngon đét)
                  <br />
                  13h: Được anh lead giao task đầu tiên, khá đơn giản: cài đặt 1
                  số tính năng cơ bản cho 1 module nhỏ.
                  <br />
                  18h: Vẫn chưa hiểu structure code của công ty, lết về nhà
                  trong trạng thái không biết mình đang làm gì 😵‍💫
                </p>
                <p>
                  <strong>✨ Tuần đầu tiên:</strong>
                  <br />
                  T2-T6: Nhận task, không hiểu code, hỏi anh lead, anh lead giải
                  thích, vẫn không hiểu, anh lead giải thích lại, hiểu được 30%,
                  bắt đầu code, stuck, google, hỏi anh lead, fix bug, commit
                  code, bị reject, fix lại, bị reject lần 2, fix lại lần 2...
                  <br />
                  T6: Daily meeting với team, đến lượt báo cáo tiến độ... ú ớ và
                  thú nhận là chưa làm xong gì cả 🙃
                </p>
                <p>
                  <strong>✨ Tuần thứ 2:</strong>
                  <br />
                  Bắt đầu hiểu structure code hơn một chút, làm nhanh hơn, nhưng
                  vẫn bị reject code liên tục vì thiếu test case, sai coding
                  convention, chưa tối ưu...
                  <br />
                  Buồn cười là daily meeting tới lượt báo cáo cứ bảo "Em đang
                  fix bug ạ" là xong, như 1 câm thần chú 😅
                  <br />
                  Mỗi ngày nghe anh lead bảo: "Em phải đọc log chứ, bị lỗi mà
                  không biết tại sao thì debug kiểu gì?" (Đúng là trường không
                  dạy mình cách đọc log 🥲)
                </p>
                <p>
                  <strong>✨ Drama bên lề:</strong>
                  <br />
                  - Công ty có phòng nghỉ trưa, có khu bếp rộng, có máy pha cafe
                  ngon
                  <br />
                  - Được xem senior lead "battle" về technical trong cuộc họp,
                  đỉnh vl luôn
                  <br />
                  - Crush làm HR xinh xỉu nhưng có vẻ như đã có gấu 💔
                  <br />
                  - 10h đêm vẫn có người online trên Slack, bọn này không về nhà
                  à??
                  <br />- Được gọi là "ông/bà thực tập", giờ vào công ty ai cũng
                  "Chào ông/bà thực tập" 😅😅
                </p>
                <p>
                  <strong>✨ Tổng kết sau 1 tháng:</strong>
                  <br />
                  - Đầu óc mình đã khai sáng hơn rất nhiều
                  <br />
                  - Nhận ra mấy năm đi học mình có biết cái gì đâu
                  <br />
                  - Biết cách tìm hiểu, đặt câu hỏi và DEBUG 😭😭
                  <br />
                  - Biết thêm nhiều thứ không liên quan đến code: cách làm việc
                  nhóm thực tế, quy trình phát triển phần mềm, teamwork, version
                  control nghiêm túc...
                  <br />
                  - Thấy mình còn non và xanh lắm
                  <br />
                </p>
                <p>
                  Nói chung là thực tập đợt này giúp mình trưởng thành hơn
                  nhiều! Ai đang chuẩn bị đi thực tập thì cứ mạnh dạn lên, đừng
                  sợ gì hết, vào rồi từ từ học. Người ta không ai ăn thịt mình
                  đâu 😉
                  <br />
                  <br />
                  P/S: Lỡ trong group có hr công ty đang đọc thì em xin lỗi ạ...
                  em vẫn yêu công ty lắm!!! 💕💕
                </p>
              </>
            ) : topic.id === 11 ? (
              <>
                <p>
                  Ê ae, hôm nay tự nhiên muốn thủ thỉ chuyện này 1 chút, lỡ onl
                  nên chém gió tí 😂 Tình hình là hồi đầu kỳ, thầy xếp chỗ ngồi
                  và tình cờ t được ngồi với crush lâu năm 🥰 Nói chung là kiểu
                  thanh xuân sắp trôi qua mà chưa tỏ tình bao giờ, nên lần này
                  phải mạnh dạn lên aeeee 💪
                </p>
                <p>
                  <strong>Info crush:</strong>
                  <br />
                  - Xinh, hiền, học giỏi (kiểu con ngoan trò giỏi đó)
                  <br />
                  - Không biết có người yêu hay chưa (stalking FB chưa thấy hint
                  gì)
                  <br />
                  - Hay thắc mắc hỏi bài, nhưng mà đúng kiểu hỏi thật chứ ko
                  phải tìm cớ nói chuyện
                  <br />- K thân nhau lắm, nhưng cũng có làm việc nhóm chung vài
                  lần, nch bt bt
                </p>
                <p>
                  Trong giờ thực hành, t hay cố tình giúp đỡ nhiệt tình khi bạn
                  ý gặp khó khăn trong bài. Tuần trước lúc bạn ý gặp lỗi, t còn
                  qua ngồi debug giúp 30p, khoảng cách gần đến mức t nghe được
                  cả mùi dầu gội đầu của bạn ý 😳
                </p>
                <p>
                  <strong>Vấn đề là:</strong>
                  <br />
                  T muốn tỏ tình mà không biết nên làm kiểu gì? Có mấy phương án
                  sau:
                  <br />
                  <br />
                  1. Rủ đi ăn trưa, xong tranh thủ nói
                  <br />
                  2. Rủ đi cf cuối tuần để nói chuyện (có vẻ công thức quá)
                  <br />
                  3. Đợi buổi thực hành cuối, viết 1 cái chương trình nho nhỏ
                  hiển thị lời tỏ tình (nhưng sợ cringe)
                  <br />
                  4. Chat với bạn ý (nhưng chat messenger thì lỡ bạn ý seen mà
                  ko rep thì toi)
                </p>
                <p>
                  Ae thấy nên chọn cách nào nhỉ? Hoặc ae có cao kiến gì khác ko?
                  Giúp t vượt qua friendzone vớiiii 😭😭
                </p>
                <p>
                  Đính chính: T ko phải wibu, t là người bt mà chỉ hơi nhút nhát
                  tí thôi 😅
                </p>
              </>
            ) : (
              <>
                <p>
                  Chào cả nhà, hôm nay mình muốn chia sẻ với mọi người bí kíp ôn
                  thi siêu tốc mà mình đã áp dụng thành công trong kỳ thi vừa
                  rồi. Mình đã cải thiện điểm số từ trung bình lên thành xuất
                  sắc chỉ trong vòng 2 tuần ôn tập thôi đó 😎
                </p>
                <p>
                  <strong>Bí kíp 1: Phương pháp Pomodoro cải tiến</strong>
                  <br />
                  Mình chia thời gian học thành các khung 30p học - 5p nghỉ. Cứ
                  4 chu kỳ như vậy thì nghỉ dài 15p. Điểm khác biệt là mình sẽ
                  ghi âm lại kiến thức trong lúc học và nghe lại trong lúc nghỉ
                  ngắn. Hiệu quả kinh khủng luôn ý!
                </p>
                <p>
                  <strong>Bí kíp 2: Mind map + Flashcard</strong>
                  <br />
                  Mình kết hợp vẽ mind map để nắm tổng quan, sau đó chuyển các ý
                  chính thành flashcard để ôn tập hàng ngày. Mình dùng app Anki
                  để làm điều này, tiện cực kỳ vì nó có thuật toán giúp mình nhớ
                  lâu hơn.
                </p>
                <p>
                  <strong>Bí kíp 3: Dạy lại kiến thức</strong>
                  <br />
                  Cái này hơi lạ nhưng mà hiệu quả vcl! Mình lập group học tập
                  và mỗi người sẽ "dạy" lại một phần kiến thức cho cả nhóm. Khi
                  phải giải thích cho người khác hiểu, bản thân mình sẽ hiểu sâu
                  hơn rất nhiều.
                </p>
                <p>
                  Mình đã áp dụng 3 bí kíp này và đạt 9.5/10 môn Giải tích, từ
                  một đứa trước đó chỉ được có 6 điểm thôi đó mọi người ơi! Ai
                  muốn biết thêm chi tiết thì cmt bên dưới nha, mình sẽ rep ngay
                  và luôn 👇
                </p>
              </>
            )}
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
              {/* Bình luận thảo luận cho bài viết 1 - Bí kíp học tập */}
              {topic.id === 1 && (
                <>
                  <div className="flex space-x-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Phương Linh</h4>
                        <span className="text-xs text-gray-400">
                          2 giờ trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Bài viết hay quá chị ơi! Em đang cần gấp mấy bí kíp này
                        để cứu bản thân trong kỳ thi sắp tới 😭 Chị có thể chia
                        sẻ thêm về cách tạo flashcard hiệu quả ko ạ? Em toàn
                        quên mất kiến thức sau khi học xong huhu
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
                        <span className="text-xs text-gray-400">
                          1 ngày trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Bí kíp số 3 xịn xò thật sự! T đã thử áp dụng và thấy
                        hiệu quả ngay. Nhưng mà tìm team để học chung hơi khó,
                        có ai muốn lập team học môn Xác suất thống kê ko? Inbox
                        mình nhé, cùng cày KPI nào ae 💪
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
                        <span className="text-xs text-gray-400">
                          1 ngày trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        @Phương Linh: Chị sẽ làm 1 bài chi tiết về cách tạo
                        flashcard hiệu quả trong tuần tới nha! Còn skrrt thì có
                        thể dùng app Anki hoặc Quizlet đều ok em né. Quan trọng
                        là phải ôn lại thường xuyên ý!
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
                </>
              )}

              {/* Bình luận cho bài 5 - Bài tập khó */}
              {topic.id === 5 && (
                <>
                  <div className="flex space-x-4">
                    <img
                      src="https://randomuser.me/api/portraits/men/38.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Quân Nguyễn</h4>
                        <span className="text-xs text-gray-400">
                          30 phút trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Bài này khó vl thật, hôm bữa anh làm cũng toát mồ hôi 🥵
                        Em thử xem video này xem: youtube.com/xyz123 có phương
                        pháp giải nhanh nè. Với lại bài 2 thì cần dùng phương
                        pháp trị riêng, vector riêng để giải nhé em!
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
                          <span>5</span>
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
                      src="https://randomuser.me/api/portraits/men/78.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Thắng Đinh</h4>
                        <span className="text-xs text-gray-400 bg-[#ff4d4f]/10 px-1 rounded">
                          Trợ giảng
                        </span>
                        <span className="text-xs text-gray-400">
                          15 phút trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Em inbox a nhé, a có lời giải mẫu. Đừng copy paste nhé,
                        cứ đọc hiểu rồi tự làm lại. Thầy mà phát hiện đạo bài
                        thì toang đó 😉 Btw tuần sau anh sẽ mở buổi ôn tập, em
                        cứ đăng ký tham gia nhé!
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
                          <span>13</span>
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
                      src="https://randomuser.me/api/portraits/women/33.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Hà Linh</h4>
                        <span className="text-xs text-gray-400 bg-[#ff4d4f]/10 px-1 rounded">
                          Tác giả
                        </span>
                        <span className="text-xs text-gray-400">
                          10 phút trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Cảm ơn mng nhiều ạ 😭 Em đã check inbox và đang làm theo
                        hướng dẫn. Ngày mai em sẽ update kết quả. @Thắng Đinh em
                        sẽ đăng ký lớp ôn tập luôn ạ ❤️ Đúng là làm bài tập khó
                        nhưng có cộng đồng support là ấm lòng thật!
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
                          <span>9</span>
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
                </>
              )}

              {/* Bình luận cho bài 11 - Crush */}
              {topic.id === 11 && (
                <>
                  <div className="flex space-x-4">
                    <img
                      src="https://randomuser.me/api/portraits/men/42.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Hùng Trần</h4>
                        <span className="text-xs text-gray-400">
                          45 phút trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Vote phương án 3 nhé bro, viết chương trình tỏ tình thực
                        sự hợp với sv IT :))) Tao đã tỏ tình vs ny tao bằng cách
                        viết 1 cái mini game và thành công luôn. Nhưng mà nhớ là
                        phải "dò đường" trước nha, đừng bất ngờ quá làm bạn ấy
                        bối rối. Good luck 👍
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
                          <span>23</span>
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
                      src="https://randomuser.me/api/portraits/women/28.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Mai Anh</h4>
                        <span className="text-xs text-gray-400">
                          30 phút trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Nhìn từ góc độ con gái thì phương án 1 hoặc 2 ổn hơn
                        nha. Đi ăn trưa hay cafe là tự nhiên và ko gây áp lực
                        quá. Còn phương án 3 cẩn thận kẻo thành "cringeeeeeee"
                        đó 😬 Nếu là tui thì sẽ chọn phương án 2 rồi tìm quán
                        cafe xinh xinh, view đẹp nói chuyện. Mà nhớ là phải thủ
                        sẵn câu trả lời cho tình huống bị từ chối nha, đừng để
                        bị đơ out!
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
                          <span>37</span>
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
                      src="https://randomuser.me/api/portraits/men/13.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Phương Nam</h4>
                        <span className="text-xs text-gray-400 bg-[#ff4d4f]/10 px-1 rounded">
                          Tác giả
                        </span>
                        <span className="text-xs text-gray-400">
                          10 phút trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Cảm ơn ae nhiềuuu! Hôm qua t lỡ chat hỏi thăm và nhắn
                        "có gì cuối tuần này t rủ m đi cf nhé?" Và... bạn ý đã
                        rep là oki luôn rồi 😍 Giờ chuẩn bị tìm quán cf chill
                        chill như của @Mai Anh recommend. Hơi lo lo nhưng quyết
                        tâm tỏ tình thành công trong tuần này! Thứ 7 này là ngày
                        đó, ae cầu nguyện cho t với 🙏
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
                          <span>52</span>
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
                </>
              )}

              {/* Bình luận mặc định cho các bài khác */}
              {topic.id !== 1 && topic.id !== 5 && topic.id !== 11 && (
                <>
                  <div className="flex space-x-4">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">Phương Linh</h4>
                        <span className="text-xs text-gray-400">
                          2 giờ trước
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">
                        Bài viết hay quá! Cảm ơn bạn đã chia sẻ thông tin hữu
                        ích 💯 Mình sẽ thử áp dụng xem sao. Hy vọng sẽ có thêm
                        các bài viết chất lượng như thế này!
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
