"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useTheme } from "@/app/_context/ThemeContext";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GlobalApi from "@/app/_utils/GlobalApi";
import Image from "next/image";
import {
  Loader2,
  Moon,
  Sun,
  CheckCircle2,
  User,
  Lock,
  Bell,
  Palette,
  CreditCard,
  Camera,
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, setProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  // States từ trang Profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // State cho các tùy chọn thông báo
  const [notificationSettings, setNotificationSettings] = useState([
    {
      title: "Thông báo khóa học",
      description: "Nhận thông báo về bài học mới và cập nhật khóa học",
      enabled: true,
    },
    {
      title: "Thông báo bài tập",
      description: "Nhận thông báo về bài tập và deadline",
      enabled: true,
    },
    {
      title: "Thông báo tin tức",
      description: "Nhận thông báo về tin tức và sự kiện mới",
      enabled: false,
    },
    {
      title: "Email marketing",
      description: "Nhận email về khuyến mãi và ưu đãi",
      enabled: false,
    },
  ]);

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        ...profile,
        occupation: profile.occupation || "",
        location: profile.location || "",
        education: profile.education || "",
        bio: profile.bio || "",
        website: profile.website || "",
        birthDate: profile.birthDate || "",
        socialLinks: profile.socialLinks || {
          facebook: "",
          twitter: "",
          linkedin: "",
          github: "",
        },
      });
      setLoading(false);
    }
  }, [profile]);

  // Cập nhật darkMode từ theme context khi mount component
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedUser = await GlobalApi.updateUserProfile(
        user.uid,
        editedProfile
      );
      if (updatedUser) {
        setProfile(updatedUser);
        setIsEditing(false);
        toast.success("Thông tin đã được cập nhật thành công!");
      } else {
        toast.error("Không tìm thấy thông tin người dùng để cập nhật.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    try {
      setIsChangingPassword(true);
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Mật khẩu đã được thay đổi thành công!");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Mật khẩu cũ không chính xác.");
      } else {
        toast.error("Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Thay đổi cấu trúc tabs để đảm bảo xử lý icons một cách rõ ràng hơn
  const tabs = [
    { id: "profile", label: "Thông tin cá nhân" },
    { id: "security", label: "Bảo mật" },
    { id: "notifications", label: "Thông báo" },
    { id: "appearance", label: "Giao diện" },
    { id: "billing", label: "Thanh toán" },
  ];

  // Tạo một hàm riêng để render icon dựa vào id
  const renderTabIcon = (tabId) => {
    switch (tabId) {
      case "profile":
        return <User className="w-5 h-5" />;
      case "security":
        return <Lock className="w-5 h-5" />;
      case "notifications":
        return <Bell className="w-5 h-5" />;
      case "appearance":
        return <Palette className="w-5 h-5" />;
      case "billing":
        return <CreditCard className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTabClassName = (tabId) => {
    return `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      activeTab === tabId
        ? "bg-[#ff4d4f] text-white"
        : "hover:bg-[var(--hover-color)]"
    }`;
  };

  const getConnectedButtonClassName = (isConnected) => {
    return `px-4 py-2 rounded-lg transition-colors ${
      isConnected
        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
        : "bg-[#ff4d4f]/10 text-[#ff4d4f] hover:bg-[#ff4d4f]/20"
    }`;
  };

  const getToggleClassName = (enabled) => {
    return `w-12 h-6 rounded-full transition-colors ${
      enabled ? "bg-[#ff4d4f]" : "bg-[var(--border-color)]"
    } relative`;
  };

  const getToggleKnobClassName = (enabled) => {
    return `absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
      enabled ? "translate-x-6" : "translate-x-0"
    }`;
  };

  // Hàm xử lý bật/tắt thông báo
  const toggleNotification = (index) => {
    const updatedSettings = [...notificationSettings];
    updatedSettings[index].enabled = !updatedSettings[index].enabled;
    setNotificationSettings(updatedSettings);
  };

  // Hàm lưu cài đặt thông báo
  const saveNotificationSettings = () => {
    // Đây là nơi bạn sẽ gọi API để lưu cài đặt thông báo
    toast.success("Đã lưu cài đặt thông báo thành công!");
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cài đặt tài khoản</h1>
          <p className="text-gray-400">
            Quản lý thông tin và tùy chỉnh tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={getTabClassName(tab.id)}
              >
                {renderTabIcon(tab.id)}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-[var(--card-background)] rounded-2xl p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff4d4f]" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">
                        Thông tin cá nhân
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 bg-[var(--card-background)] text-[#ff4d4f] rounded-lg border border-[#ff4d4f] hover:bg-[#ff4d4f]/10 transition-colors"
                        >
                          Chỉnh sửa
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-[var(--card-background)] text-gray-400 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors flex items-center gap-2"
                            disabled={isSaving}
                          >
                            {isSaving && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Lưu thay đổi
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[var(--card-background)] overflow-hidden border-2 border-[var(--card-background)]">
                          {profile?.photoURL ? (
                            <img
                              src={profile.photoURL}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--card-background)] text-[#ff4d4f]">
                              <User className="w-12 h-12" />
                            </div>
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff4d4f] rounded-full flex items-center justify-center hover:bg-[#ff4d4f]/90 transition-colors">
                          <Camera className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {profile?.displayName || "Họ và tên chưa cập nhật"}
                        </h3>
                        <p className="text-gray-400">
                          {profile?.occupation || "Chưa cập nhật nghề nghiệp"}
                        </p>
                      </div>
                    </div>

                    {!isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Họ và tên</p>
                            <p className="font-medium">
                              {profile?.displayName || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">
                              Số điện thoại
                            </p>
                            <p className="font-medium">
                              {profile?.phoneNumber || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Địa chỉ</p>
                            <p className="font-medium">
                              {profile?.location || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Nghề nghiệp</p>
                            <p className="font-medium">
                              {profile?.occupation || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Ngày sinh</p>
                            <p className="font-medium">
                              {profile?.birthDate || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">
                              Trình độ học vấn
                            </p>
                            <p className="font-medium">
                              {profile?.education || "Chưa cập nhật"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-400">Website</p>
                            <p className="font-medium">
                              {profile?.website || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1 pt-2">
                          <p className="text-sm text-gray-400">Giới thiệu</p>
                          <p className="font-medium">
                            {profile?.bio || "Chưa có thông tin giới thiệu"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Họ và tên
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              placeholder="Nguyễn Văn A"
                              value={editedProfile.displayName || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  displayName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Email
                            </label>
                            <input
                              type="email"
                              className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                              value={user?.email || ""}
                              disabled
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Số điện thoại
                            </label>
                            <input
                              type="tel"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              placeholder="0123456789"
                              value={editedProfile.phoneNumber || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  phoneNumber: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Địa chỉ
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              placeholder="Địa chỉ của bạn"
                              value={editedProfile.location || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  location: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Nghề nghiệp
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              placeholder="Nghề nghiệp"
                              value={editedProfile.occupation || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  occupation: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Ngày sinh
                            </label>
                            <input
                              type="date"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              value={editedProfile.birthDate || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  birthDate: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Trình độ học vấn
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              placeholder="THPT Chu Văn An"
                              value={editedProfile.education || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  education: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-400">
                              Website
                            </label>
                            <input
                              type="url"
                              className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)]"
                              placeholder="https://example.com"
                              value={editedProfile.website || ""}
                              onChange={(e) =>
                                setEditedProfile({
                                  ...editedProfile,
                                  website: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-400">
                            Giới thiệu bản thân
                          </label>
                          <textarea
                            className="w-full px-4 py-2.5 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[#ff4d4f] transition-colors text-[var(--text-color)] min-h-[100px] resize-none"
                            placeholder="Giới thiệu ngắn về bản thân"
                            value={editedProfile.bio || ""}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                bio: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Đổi mật khẩu</h3>
                  <div className="space-y-6 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Mật khẩu hiện tại
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-background)] text-[var(--text-color)]"
                          placeholder="Nhập mật khẩu hiện tại"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                          {showOldPassword ? "Ẩn" : "Hiện"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-background)] text-[var(--text-color)]"
                          placeholder="Nhập mật khẩu mới"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? "Ẩn" : "Hiện"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-background)] text-[var(--text-color)]"
                          placeholder="Xác nhận mật khẩu mới"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? "Ẩn" : "Hiện"}
                        </button>
                      </div>
                    </div>

                    <button
                      className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff7875] transition-colors"
                      onClick={handleChangePassword}
                    >
                      {isChangingPassword ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </span>
                      ) : (
                        "Đổi mật khẩu"
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Xác thực hai yếu tố</h3>
                  <div className="space-y-6 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-[#ff4d4f]">🔒</div>
                        <div>
                          <p className="font-medium">Xác thực hai yếu tố</p>
                          <p className="text-sm text-gray-400">
                            Bảo vệ tài khoản bằng xác thực hai yếu tố
                          </p>
                        </div>
                      </div>
                      <button
                        className={getToggleClassName(false)}
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      >
                        <span className={getToggleKnobClassName(false)} />
                      </button>
                    </div>
                    {twoFactorEnabled && (
                      <div className="p-4 bg-[var(--background-color)] rounded-lg">
                        <p className="text-sm">
                          Xác thực hai yếu tố đã được bật. Bạn sẽ nhận được mã
                          xác thực qua email mỗi khi đăng nhập.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Kết nối mạng xã hội</h3>
                  <div className="space-y-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-white">
                          G
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-gray-400">
                            Kết nối tài khoản với Google
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors">
                        Kết nối
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                          F
                        </div>
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-sm text-gray-400">
                            Kết nối tài khoản với Facebook
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors">
                        Kết nối
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-white">
                          GH
                        </div>
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-gray-400">
                            Kết nối tài khoản với GitHub
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors">
                        Kết nối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Tùy chọn thông báo</h3>
                  <div className="space-y-4">
                    {notificationSettings.map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-400">
                            {notification.description}
                          </p>
                        </div>
                        <button
                          className={getToggleClassName(notification.enabled)}
                          onClick={() => toggleNotification(index)}
                        >
                          <span
                            className={getToggleKnobClassName(
                              notification.enabled
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <button
                      className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff7875] transition-colors"
                      onClick={saveNotificationSettings}
                    >
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Tùy chỉnh giao diện</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg">
                      <div className="flex items-center space-x-3">
                        {theme === "dark" ? (
                          <div className="p-1.5 rounded-md bg-[var(--hover-color)]">
                            <Moon className="w-5 h-5 text-[#ff4d4f]" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-md bg-[var(--hover-color)]">
                            <Sun className="w-5 h-5 text-[#ff4d4f]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">Chế độ tối</p>
                          <p className="text-sm text-gray-400">
                            {theme === "dark"
                              ? "Đang sử dụng chế độ tối"
                              : "Đang sử dụng chế độ sáng"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--hover-color)] transition-colors"
                      >
                        {theme === "dark" ? "Chuyển sáng" : "Chuyển tối"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 rounded-md bg-[var(--hover-color)]">
                          <Palette className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Màu chủ đạo</p>
                          <p className="text-sm text-gray-400">
                            Tùy chỉnh màu chính của ứng dụng
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="w-6 h-6 rounded-full bg-[#ff4d4f] border-2 border-white"></button>
                        <button className="w-6 h-6 rounded-full bg-blue-500 border-2 border-transparent"></button>
                        <button className="w-6 h-6 rounded-full bg-green-500 border-2 border-transparent"></button>
                        <button className="w-6 h-6 rounded-full bg-purple-500 border-2 border-transparent"></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">
                    Thông tin thanh toán
                  </h3>
                  <div className="p-4 bg-[var(--card-background)] rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-3 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <p className="font-medium">Gói Premium - Còn 280 ngày</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[var(--card-background)] rounded-lg border border-[var(--border-color)]">
                      <h4 className="text-lg font-semibold mb-4">
                        Phương thức thanh toán
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-white rounded flex items-center justify-center">
                          <img src="/visa.png" alt="Visa" className="h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ****4242</p>
                          <p className="text-sm text-gray-400">Hết hạn 12/24</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-[var(--card-background)] rounded-lg border border-[var(--border-color)]">
                      <h4 className="text-lg font-semibold mb-4">
                        Lịch sử thanh toán
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Gói Premium - 1 năm</p>
                            <p className="text-sm text-gray-400">20/03/2024</p>
                          </div>
                          <p className="font-medium">1,990,000đ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="px-6 py-2.5 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors">
                      Nâng cấp gói
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
