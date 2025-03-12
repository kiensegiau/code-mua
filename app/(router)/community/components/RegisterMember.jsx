import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  User,
  Mail,
  Lock,
  UserCheck,
  Calendar,
  Bookmark,
  Award,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Phone,
  MapPin,
  UserPlus,
  Loader2,
} from "lucide-react";

const RegisterMember = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dob: "",
    bio: "",
    interests: [],
    education: "",
    acceptTerms: false,
    notificationPreference: "email",
  });
  const [errors, setErrors] = useState({});

  const interestOptions = [
    "Công nghệ thông tin",
    "Ngoại ngữ",
    "Kỹ năng mềm",
    "Khoa học tự nhiên",
    "Văn học",
    "Toán học",
    "Lịch sử",
    "Địa lý",
    "Kinh tế",
    "Nghệ thuật",
    "Thể thao",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Kiểu checkbox cần xử lý khác
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
    // Xử lý cho danh sách interests
    else if (name === "interests") {
      const currentInterests = [...formData.interests];
      if (checked) {
        currentInterests.push(value);
      } else {
        const index = currentInterests.indexOf(value);
        if (index > -1) {
          currentInterests.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        interests: currentInterests,
      });
    }
    // Các trường input khác
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Xóa lỗi nếu người dùng đã nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
      if (!formData.email) newErrors.email = "Vui lòng nhập email";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email không hợp lệ";

      if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
      else if (formData.password.length < 6)
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (currentStep === 2) {
      if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
      if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ";
      if (!formData.dob) newErrors.dob = "Vui lòng chọn ngày sinh";
    }

    if (currentStep === 3) {
      if (formData.interests.length === 0)
        newErrors.interests = "Vui lòng chọn ít nhất một lĩnh vực quan tâm";
      if (!formData.acceptTerms)
        newErrors.acceptTerms = "Bạn cần đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep(step)) {
      setLoading(true);

      // Giả lập API call
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);

        // Đóng component sau 3 giây khi đăng ký thành công
        setTimeout(() => {
          onClose();
        }, 3000);
      }, 2000);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber === step
                  ? "bg-[#ff4d4f] text-white"
                  : stepNumber < step
                  ? "bg-green-500 text-white"
                  : "bg-[#333] text-gray-400"
              }`}
            >
              {stepNumber < step ? <Check size={16} /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-12 h-1 ${
                  stepNumber < step ? "bg-green-500" : "bg-[#333]"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepTitle = () => {
    switch (step) {
      case 1:
        return "Thông tin cơ bản";
      case 2:
        return "Thông tin bổ sung";
      case 3:
        return "Sở thích & Điều khoản";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Họ và tên <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.fullName
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                  placeholder="Nhập họ và tên của bạn"
                />
                <User
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.fullName && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.fullName}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                  placeholder="example@email.com"
                />
                <Mail
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.email && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Mật khẩu <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                />
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.password && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Xác nhận mật khẩu <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
                <Lock
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Số điện thoại <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
                <Phone
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.phone && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Địa chỉ <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.address
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                  placeholder="Nhập địa chỉ của bạn"
                />
                <MapPin
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.address && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.address}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Ngày sinh <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.dob
                      ? "focus:ring-red-500 border border-red-500"
                      : "focus:ring-[#ff4d4f]"
                  }`}
                />
                <Calendar
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                {errors.dob && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.dob}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Trình độ học vấn
              </label>
              <div className="relative">
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="bg-[#2a2a2a] w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] appearance-none"
                >
                  <option value="">Chọn trình độ học vấn</option>
                  <option value="high-school">Trung học phổ thông</option>
                  <option value="college">Cao đẳng</option>
                  <option value="bachelor">Đại học</option>
                  <option value="master">Thạc sĩ</option>
                  <option value="phd">Tiến sĩ</option>
                </select>
                <BookOpen
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Giới thiệu bản thân
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="bg-[#2a2a2a] w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4f]"
                placeholder="Giới thiệu ngắn về bản thân (không bắt buộc)"
              ></textarea>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Lĩnh vực quan tâm <span className="text-[#ff4d4f]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <div key={interest} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`interest-${interest}`}
                      name="interests"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleChange}
                      className="w-4 h-4 mr-2 accent-[#ff4d4f]"
                    />
                    <label
                      htmlFor={`interest-${interest}`}
                      className="text-sm text-gray-300"
                    >
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
              {errors.interests && (
                <div className="text-red-500 text-xs mt-2 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.interests}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nhận thông báo qua
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="notification-email"
                    name="notificationPreference"
                    value="email"
                    checked={formData.notificationPreference === "email"}
                    onChange={handleChange}
                    className="w-4 h-4 mr-2 accent-[#ff4d4f]"
                  />
                  <label
                    htmlFor="notification-email"
                    className="text-sm text-gray-300"
                  >
                    Email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="notification-app"
                    name="notificationPreference"
                    value="app"
                    checked={formData.notificationPreference === "app"}
                    onChange={handleChange}
                    className="w-4 h-4 mr-2 accent-[#ff4d4f]"
                  />
                  <label
                    htmlFor="notification-app"
                    className="text-sm text-gray-300"
                  >
                    Ứng dụng
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="notification-both"
                    name="notificationPreference"
                    value="both"
                    checked={formData.notificationPreference === "both"}
                    onChange={handleChange}
                    className="w-4 h-4 mr-2 accent-[#ff4d4f]"
                  />
                  <label
                    htmlFor="notification-both"
                    className="text-sm text-gray-300"
                  >
                    Cả hai
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-4 rounded-lg mt-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">
                Điều khoản dịch vụ
              </h4>
              <div className="text-xs text-gray-400 h-28 overflow-y-auto mb-4 p-2 bg-[#222] rounded">
                <p className="mb-2">
                  Khi đăng ký và sử dụng dịch vụ, bạn đồng ý với các điều khoản
                  sau:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    Thông tin cá nhân của bạn sẽ được bảo mật theo chính sách
                    riêng tư.
                  </li>
                  <li>Bạn phải từ đủ 16 tuổi trở lên để đăng ký tài khoản.</li>
                  <li>
                    Bạn đồng ý không đăng tải nội dung vi phạm pháp luật Việt
                    Nam.
                  </li>
                  <li>
                    Chúng tôi có quyền xóa tài khoản nếu vi phạm điều khoản sử
                    dụng.
                  </li>
                  <li>Bạn chịu trách nhiệm về bảo mật tài khoản của mình.</li>
                  <li>
                    Nội dung bạn đăng tải có thể được sử dụng để cải thiện dịch
                    vụ.
                  </li>
                </ol>
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 mr-2 accent-[#ff4d4f]"
                />
                <label htmlFor="acceptTerms" className="text-xs text-gray-300">
                  Tôi đã đọc và đồng ý với điều khoản sử dụng và chính sách bảo
                  mật <span className="text-[#ff4d4f]">*</span>
                </label>
              </div>
              {errors.acceptTerms && (
                <div className="text-red-500 text-xs mt-2 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.acceptTerms}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Quay lại
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg flex items-center"
          >
            <ChevronLeft size={18} className="mr-1" />
            Hủy
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="bg-[#ff4d4f] hover:bg-[#ff3538] text-white px-4 py-2 rounded-lg flex items-center"
          >
            Tiếp theo
            <ChevronRight size={18} className="ml-1" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-[#ff4d4f] hover:bg-[#ff3538]"
            } text-white px-6 py-2 rounded-lg flex items-center`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserPlus size={18} className="mr-2" />
                Hoàn tất đăng ký
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1f1f1f] rounded-xl p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <UserPlus className="text-[#ff4d4f] mr-2" size={24} />
          <h2 className="text-2xl font-bold">Đăng ký thành viên</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
          <span className="sr-only">Quay lại</span>
        </button>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {renderStepIndicator()}

          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">{renderStepTitle()}</span>
          </h3>

          {renderStepContent()}

          {renderNavButtons()}
        </form>
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
            Chào mừng {formData.fullName} đã trở thành thành viên của cộng đồng.
          </p>
          <div className="bg-[#2a2a2a] p-4 rounded-lg text-left mb-4">
            <p className="text-sm text-gray-300">
              Chúng tôi đã gửi một email xác nhận đến{" "}
              <span className="text-[#ff4d4f]">{formData.email}</span>. Vui lòng
              kiểm tra hộp thư và nhấp vào liên kết xác nhận trong email để kích
              hoạt tài khoản của bạn.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Bạn sẽ được chuyển hướng tự động sau vài giây...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RegisterMember;
