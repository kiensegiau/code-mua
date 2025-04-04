"use client";
import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useTheme } from "@/app/_context/ThemeContext";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "@/app/_utils/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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

// Component PasswordInput tách riêng để tối ưu hóa render
const PasswordInput = memo(
  ({ placeholder, showPassword, toggleVisibility, autoComplete, innerRef }) => {
    const handleToggleVisibility = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleVisibility();
      // Đặt lại focus sau khi toggle
      setTimeout(() => innerRef.current?.focus(), 0);
    };

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-background)] text-[var(--text-color)]"
          placeholder={placeholder}
          defaultValue=""
          ref={innerRef}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          tabIndex="-1"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          onClick={handleToggleVisibility}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {showPassword ? "Ẩn" : "Hiện"}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

// Hàm API để cập nhật thông tin người dùng
const updateUserProfileAPI = async (userId, updatedData) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gọi API cập nhật thông tin người dùng:", error);
    throw error;
  }
};

export default function SettingsPage() {
  const { user, profile, setProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Ref cho input passwords
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("profile");

  // UI states
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === "dark");

  // Profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Password states - chỉ giữ lại state cho việc hiển thị/ẩn và loading
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Security states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Billing states
  const [isViewPackagesModalOpen, setIsViewPackagesModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Notification states
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

  // Cập nhật darkMode từ theme context
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  // Các hàm xử lý tương tác với dữ liệu profile
  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");

      const updatedUser = await updateUserProfileAPI(
        user.uid,
        editedProfile
      );

      if (updatedUser) {
        setProfile(updatedUser);
        setIsEditing(false);
        toast.success("Thông tin đã được cập nhật thành công!");
      } else {
        setError("Không tìm thấy thông tin người dùng để cập nhật.");
        toast.error("Không tìm thấy thông tin người dùng để cập nhật.");
      }
    } catch (error) {
      setError(error.message || "Đã xảy ra lỗi khi cập nhật thông tin.");
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Lấy giá trị từ refs
    const oldPasswordValue = oldPasswordRef.current?.value || "";
    const newPasswordValue = newPasswordRef.current?.value || "";
    const confirmNewPasswordValue = confirmPasswordRef.current?.value || "";

    // Kiểm tra form trước khi xử lý
    if (newPasswordValue !== confirmNewPasswordValue) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (!oldPasswordValue || !newPasswordValue) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return;
    }

    try {
      setIsChangingPassword(true);
      setError("");

      // Hiển thị thông báo khi bắt đầu xử lý
      toast.loading("Đang xử lý đổi mật khẩu...", { id: "password-change" });

      // Tạo credential để xác thực lại người dùng
      const credential = EmailAuthProvider.credential(
        user.email,
        oldPasswordValue
      );

      // Xác thực lại người dùng trước khi đổi mật khẩu
      await reauthenticateWithCredential(user, credential);

      // Cập nhật mật khẩu
      await updatePassword(user, newPasswordValue);

      // Reset password fields after successful change
      if (oldPasswordRef.current) oldPasswordRef.current.value = "";
      if (newPasswordRef.current) newPasswordRef.current.value = "";
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";

      // Hiển thị thông báo thành công rõ ràng hơn
      toast.success("Mật khẩu đã được thay đổi thành công!", {
        id: "password-change",
        duration: 5000,
      });

      // Thêm thông báo trực tiếp trên UI
      setError("Đổi mật khẩu thành công!");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Mật khẩu cũ không chính xác.", {
          id: "password-change",
          duration: 5000,
        });
        setError("Mật khẩu cũ không chính xác.");
      } else {
        const errorMessage =
          error.message || "Đã xảy ra lỗi khi thay đổi mật khẩu.";
        setError(errorMessage);
        toast.error("Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.", {
          id: "password-change",
          duration: 5000,
        });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Tạo cấu trúc tabs để đảm bảo xử lý icons một cách rõ ràng
  const tabs = useMemo(
    () => [
      { id: "profile", label: "Thông tin cá nhân", icon: User },
      { id: "security", label: "Bảo mật", icon: Lock },
      { id: "notifications", label: "Thông báo", icon: Bell },
      { id: "appearance", label: "Giao diện", icon: Palette },
      { id: "billing", label: "Thanh toán", icon: CreditCard },
    ],
    []
  );

  // Các hàm tiện ích để xử lý class names
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

  // Hàm xử lý thông báo
  const toggleNotification = (index) => {
    setNotificationSettings((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const saveNotificationSettings = () => {
    // Đây là nơi gọi API để lưu cài đặt thông báo
    toast.success("Đã lưu cài đặt thông báo thành công!");
  };

  // Tách các tab thành các components riêng để dễ bảo trì
  const ProfileTab = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff4d4f]" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Thông tin cá nhân</h3>
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
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                  <p className="text-sm text-gray-400">Số điện thoại</p>
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
                  <p className="text-sm text-gray-400">Trình độ học vấn</p>
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
            <ProfileEditForm
              editedProfile={editedProfile}
              setEditedProfile={setEditedProfile}
              user={user}
            />
          )}
        </>
      )}
    </div>
  );

  // Component form edit profile
  const ProfileEditForm = ({ editedProfile, setEditedProfile, user }) => (
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
  );

  // Component tab Security
  const SecurityTab = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Đổi mật khẩu</h3>
        <div className="space-y-6 bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChangePassword();
            }}
            className="space-y-6"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Mật khẩu hiện tại
              </label>
              <PasswordInput
                placeholder="Nhập mật khẩu hiện tại"
                showPassword={showOldPassword}
                toggleVisibility={() => setShowOldPassword(!showOldPassword)}
                autoComplete="current-password"
                innerRef={oldPasswordRef}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Mật khẩu mới
              </label>
              <PasswordInput
                placeholder="Nhập mật khẩu mới"
                showPassword={showNewPassword}
                toggleVisibility={() => setShowNewPassword(!showNewPassword)}
                autoComplete="new-password"
                innerRef={newPasswordRef}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Xác nhận mật khẩu mới
              </label>
              <PasswordInput
                placeholder="Xác nhận mật khẩu mới"
                showPassword={showConfirmPassword}
                toggleVisibility={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                autoComplete="new-password"
                innerRef={confirmPasswordRef}
              />
            </div>

            {/* Hiển thị thông báo lỗi hoặc thành công */}
            {error && (
              <div
                className={`p-3 rounded-lg ${
                  error === "Đổi mật khẩu thành công!"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff7875] transition-colors"
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
          </form>
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
              className={getToggleClassName(twoFactorEnabled)}
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            >
              <span className={getToggleKnobClassName(twoFactorEnabled)} />
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="p-4 bg-[var(--background-color)] rounded-lg">
              <p className="text-sm">
                Xác thực hai yếu tố đã được bật. Bạn sẽ nhận được mã xác thực
                qua email mỗi khi đăng nhập.
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
  );

  // Component tab Notifications
  const NotificationsTab = () => (
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
                  className={getToggleKnobClassName(notification.enabled)}
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
  );

  // Component tab Appearance
  const AppearanceTab = () => (
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
  );

  // Component tab Billing
  const BillingTab = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Thông tin thanh toán</h3>
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div>
                <p className="font-medium text-lg">Chưa có gói Premium</p>
                <p className="text-sm text-gray-400">
                  Nâng cấp để sử dụng đầy đủ tính năng
                </p>
              </div>
            </div>
            <button
              className="bg-[#ff4d4f] text-white px-3 py-1.5 rounded-full hover:bg-[#ff4d4f]/90 transition-colors shadow-sm"
              onClick={() => setIsViewPackagesModalOpen(true)}
            >
              Xem các gói
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaymentMethodCard />
          <PaymentHistoryCard />
        </div>

        <div className="flex items-center gap-4 pt-6">
          <button
            className="px-6 py-2.5 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors shadow-sm flex items-center gap-2"
            onClick={() => setIsViewPackagesModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
              <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
            </svg>
            Mua gói Premium
          </button>
        </div>
      </div>
    </div>
  );

  // Component cho thẻ phương thức thanh toán
  const PaymentMethodCard = () => (
    <div className="p-6 bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Phương thức thanh toán</h4>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-[var(--hover-color)] rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
            <line x1="2" x2="22" y1="10" y2="10"></line>
          </svg>
        </div>
        <p className="text-base text-gray-400 mb-2">
          Chưa có phương thức thanh toán
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Thêm thẻ hoặc ví điện tử để thanh toán
        </p>
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60"
          disabled
        >
          Thêm phương thức
        </button>
      </div>
    </div>
  );

  // Component cho thẻ lịch sử thanh toán
  const PaymentHistoryCard = () => (
    <div className="p-6 bg-[var(--card-background)] rounded-lg border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">Lịch sử thanh toán</h4>
      </div>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-[var(--hover-color)] rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
        </div>
        <p className="text-base text-gray-400 mb-2">
          Chưa có lịch sử thanh toán
        </p>
        <p className="text-sm text-gray-400">
          Lịch sử thanh toán sẽ hiển thị ở đây
        </p>
      </div>
    </div>
  );

  // Component modal xem các gói
  const PackagesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Các Gói Dịch Vụ</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gói Cơ Bản */}
            <PackageCard
              title="Gói Cơ Bản"
              description="Truy cập cơ bản đến nền tảng học tập"
              price="Miễn phí"
              features={[
                { text: "Truy cập nội dung miễn phí", enabled: true },
                { text: "Tham gia diễn đàn cộng đồng", enabled: true },
                { text: "Truy cập khóa học cao cấp", enabled: false },
              ]}
              buttonText="Gói hiện tại"
              buttonClass="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium"
              isCurrentPlan={true}
              badgeText=""
            />

            {/* Gói Premium Tháng */}
            <PackageCard
              title="Gói Premium Tháng"
              description="Truy cập đầy đủ tất cả khóa học"
              price="199.000đ"
              priceDetails="/tháng"
              features={[
                { text: "Tất cả tính năng của gói Cơ bản", enabled: true },
                {
                  text: "Truy cập không giới hạn tất cả khóa học",
                  enabled: true,
                },
                { text: "Tải xuống tài liệu học tập", enabled: true },
              ]}
              buttonText="Nâng cấp ngay"
              buttonClass="w-full py-2 bg-[#ff4d4f] text-white rounded-lg font-medium hover:bg-[#ff4d4f]/90 transition-colors"
              onClick={() => {
                onClose();
                setIsPremiumModalOpen(true);
              }}
              isCurrentPlan={false}
              badgeText="Phổ biến"
              badgeColor="bg-[#ff4d4f]"
            />

            {/* Gói Premium Năm */}
            <PackageCard
              title="Gói Premium Năm"
              description="Tiết kiệm 42% so với gói tháng"
              price="699.000đ"
              priceDetails="/năm"
              features={[
                { text: "Tất cả tính năng của gói Cơ bản", enabled: true },
                {
                  text: "Truy cập không giới hạn tất cả khóa học",
                  enabled: true,
                },
                { text: "Ưu tiên hỗ trợ kỹ thuật", enabled: true },
              ]}
              buttonText="Nâng cấp ngay"
              buttonClass="w-full py-2 bg-[#ff4d4f] text-white rounded-lg font-medium hover:bg-[#ff4d4f]/90 transition-colors"
              onClick={() => {
                onClose();
                setIsPremiumModalOpen(true);
              }}
              isCurrentPlan={false}
              badgeText="Tiết kiệm"
              badgeColor="bg-[#1e9e3e]"
            />
          </div>
        </div>
      </div>
    );
  };

  // Component thẻ gói dịch vụ
  const PackageCard = ({
    title,
    description,
    price,
    priceDetails = "",
    features,
    buttonText,
    buttonClass,
    onClick,
    isCurrentPlan,
    badgeText,
    badgeColor,
  }) => (
    <div
      className={`${
        badgeText ? "border-2 border-[#ff4d4f]" : "border"
      } rounded-lg p-4 relative`}
    >
      {badgeText && (
        <div
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${badgeColor} text-white px-3 py-1 rounded-full text-sm`}
        >
          {badgeText}
        </div>
      )}
      <h4 className="font-semibold text-lg mb-2 mt-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-3">{description}</p>
      <div className="text-2xl font-bold mb-3">
        {price} <span className="text-sm font-normal">{priceDetails}</span>
      </div>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={feature.enabled ? "text-green-500" : "text-gray-400"}
            >
              {feature.enabled ? (
                <polyline points="20 6 9 17 4 12"></polyline>
              ) : (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              )}
            </svg>
            <span className={!feature.enabled ? "text-gray-400" : ""}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="text-center">
        <button
          className={buttonClass}
          onClick={onClick}
          disabled={isCurrentPlan}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  // Component modal mua gói Premium
  const PremiumModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Nâng Cấp Lên Premium</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-[#ff4d4f]/10 p-4 rounded-lg mb-4">
              <div className="font-semibold text-lg text-center mb-2">
                Chọn Gói Premium
              </div>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                Chọn gói phù hợp với nhu cầu của bạn
              </p>

              <div className="space-y-3 mb-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="plan-type"
                    id="monthly"
                    className="accent-[#ff4d4f]"
                    defaultChecked
                  />
                  <label
                    htmlFor="monthly"
                    className="flex items-center justify-between cursor-pointer w-full"
                  >
                    <div>
                      <span className="font-medium">Gói Tháng</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Thanh toán hàng tháng
                      </p>
                    </div>
                    <span className="font-semibold">199.000đ</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 border-2 border-[#1e9e3e] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 relative">
                  <div className="absolute -top-3 right-3 bg-[#1e9e3e] text-white px-2 py-0.5 rounded text-xs">
                    Tiết kiệm 42%
                  </div>
                  <input
                    type="radio"
                    name="plan-type"
                    id="yearly"
                    className="accent-[#1e9e3e]"
                  />
                  <label
                    htmlFor="yearly"
                    className="flex items-center justify-between cursor-pointer w-full"
                  >
                    <div>
                      <span className="font-medium">Gói Năm</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Thanh toán một lần
                      </p>
                    </div>
                    <span className="font-semibold">699.000đ</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Chọn phương thức thanh toán
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                  <input
                    type="radio"
                    name="payment-method"
                    id="momo"
                    className="accent-[#ff4d4f]"
                    defaultChecked
                  />
                  <label
                    htmlFor="momo"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <img
                      src="/images/momo-logo.png"
                      alt="MoMo"
                      className="w-6 h-6"
                    />
                    <span>MoMo</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                  <input
                    type="radio"
                    name="payment-method"
                    id="zalopay"
                    className="accent-[#ff4d4f]"
                  />
                  <label
                    htmlFor="zalopay"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <img
                      src="/images/zalopay-logo.png"
                      alt="ZaloPay"
                      className="w-6 h-6"
                    />
                    <span>ZaloPay</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                  <input
                    type="radio"
                    name="payment-method"
                    id="bank-transfer"
                    className="accent-[#ff4d4f]"
                  />
                  <label
                    htmlFor="bank-transfer"
                    className="flex items-center gap-2 cursor-pointer w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    <span>Chuyển khoản ngân hàng</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button className="px-4 py-2 bg-[#ff4d4f] text-white rounded-lg hover:bg-[#ff4d4f]/90 transition-colors">
              Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render của component chính
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
          {/* Sidebar tabs */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={getTabClassName(tab.id)}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main content area */}
          <div className="bg-[var(--card-background)] rounded-2xl p-6">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "appearance" && <AppearanceTab />}
            {activeTab === "billing" && <BillingTab />}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PackagesModal
        isOpen={isViewPackagesModalOpen}
        onClose={() => setIsViewPackagesModalOpen(false)}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
}
