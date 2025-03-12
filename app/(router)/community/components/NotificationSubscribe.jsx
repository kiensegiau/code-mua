import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Bell,
  Check,
  X,
  AlertCircle,
  Mail,
  MessageSquare,
  Calendar,
  Book,
  Globe,
} from "lucide-react";

const NotificationSubscribe = ({ onClose }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [notifications, setNotifications] = useState({
    forum: true,
    events: true,
    resources: true,
    messages: false,
    newsletter: true,
    community: false,
  });

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSubscribe = () => {
    if (!email) {
      setEmailError("Vui lòng nhập email của bạn");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ");
      return;
    }

    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);

      // Đóng component sau 2 giây khi đăng ký thành công
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  const notificationItems = [
    {
      key: "forum",
      icon: <MessageSquare size={20} />,
      title: "Diễn đàn thảo luận",
      description:
        "Nhận thông báo khi có bài viết mới hoặc bình luận trên bài viết của bạn",
    },
    {
      key: "events",
      icon: <Calendar size={20} />,
      title: "Sự kiện sắp tới",
      description:
        "Cập nhật về workshop, hội thảo và các sự kiện offline/online",
    },
    {
      key: "resources",
      icon: <Book size={20} />,
      title: "Tài liệu học tập",
      description:
        "Thông báo khi có tài liệu mới được đăng tải liên quan đến sở thích của bạn",
    },
    {
      key: "messages",
      icon: <Mail size={20} />,
      title: "Tin nhắn riêng",
      description: "Nhận email khi có tin nhắn mới từ thành viên khác",
    },
    {
      key: "newsletter",
      icon: <Bell size={20} />,
      title: "Bản tin cộng đồng",
      description:
        "Nhận bản tin hàng tuần về các hoạt động và cập nhật từ cộng đồng",
    },
    {
      key: "community",
      icon: <Globe size={20} />,
      title: "Hoạt động cộng đồng",
      description:
        "Thông báo về các thành tích, thay đổi chính sách và sự kiện đặc biệt",
    },
  ];

  return (
    <div className="bg-[#1f1f1f] rounded-xl p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Bell className="text-[#ff4d4f] mr-2" size={24} />
          <h2 className="text-2xl font-bold">Đăng ký thông báo</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
          <span className="sr-only">Quay lại</span>
        </button>
      </div>

      {!subscribed ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-300 mb-6">
            Nhận thông báo về các hoạt động, bài viết mới và sự kiện từ cộng
            đồng học tập của chúng tôi.
          </p>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email của bạn
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`bg-[#2a2a2a] w-full pl-4 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  emailError
                    ? "focus:ring-red-500 border border-red-500"
                    : "focus:ring-[#ff4d4f]"
                }`}
                placeholder="example@gmail.com"
              />
              {emailError && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {emailError}
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Tùy chỉnh thông báo</h3>
            <div className="space-y-4">
              {notificationItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start p-3 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors"
                >
                  <div
                    className={`mr-3 mt-0.5 text-${
                      notifications[item.key] ? "[#ff4d4f]" : "gray-400"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <button
                        onClick={() => handleToggleNotification(item.key)}
                        className={`w-10 h-5 rounded-full flex items-center ${
                          notifications[item.key]
                            ? "bg-[#ff4d4f]"
                            : "bg-gray-600"
                        } transition-colors relative px-0.5`}
                      >
                        <span
                          className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                            notifications[item.key]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        ></span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`px-6 py-2 rounded-lg flex items-center ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-[#ff4d4f] hover:bg-[#ff3538] text-white"
              } transition-colors`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký thông báo"
              )}
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>
              Bằng cách đăng ký, bạn đồng ý nhận email thông báo từ cộng đồng
              của chúng tôi. Bạn có thể hủy đăng ký bất cứ lúc nào bằng cách
              nhấp vào liên kết trong email.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Đăng ký thành công!</h3>
          <p className="text-gray-400 mb-6">
            Bạn sẽ nhận được các thông báo qua email {email}.
          </p>
          <div className="bg-[#2a2a2a] p-4 rounded-lg text-left mb-4">
            <h4 className="text-sm font-medium mb-2">
              Các thông báo đã đăng ký:
            </h4>
            <ul className="space-y-1 text-sm">
              {notificationItems
                .filter((item) => notifications[item.key])
                .map((item) => (
                  <li
                    key={item.key}
                    className="flex items-center text-gray-300"
                  >
                    <Check size={14} className="text-green-500 mr-2" />
                    {item.title}
                  </li>
                ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationSubscribe;
