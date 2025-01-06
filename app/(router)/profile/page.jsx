"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/_context/AuthContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/app/_utils/firebase';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '../_components/Header';
import Sidebar from '../_components/SideNav';
import GlobalApi from '@/app/_utils/GlobalApi';
import { Eye, EyeOff, Loader2, Camera, Briefcase, MapPin, Calendar, GraduationCap, Mail, Phone, Globe2 } from 'lucide-react';
import Image from 'next/image';

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security' | 'preferences'
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        ...profile,
        occupation: profile.occupation || '',
        location: profile.location || '',
        education: profile.education || '',
        bio: profile.bio || '',
        website: profile.website || '',
        birthDate: profile.birthDate || '',
        socialLinks: profile.socialLinks || {
          facebook: '',
          twitter: '',
          linkedin: '',
          github: ''
        }
      });
      setLoading(false);
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedUser = await GlobalApi.updateUserProfile(user.uid, editedProfile);
      if (updatedUser) {
        setProfile(updatedUser);
        setIsEditing(false);
        toast.success('Thông tin đã được cập nhật thành công!');
      } else {
        toast.error('Không tìm thấy thông tin người dùng để cập nhật.');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    try {
      setIsChangingPassword(true);
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast.success('Mật khẩu đã được thay đổi thành công!');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Mật khẩu cũ không chính xác.');
      } else {
        toast.error('Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">{error || "Không tìm thấy thông tin người dùng."}</p>
        <button
          onClick={() => router.push('/sign-in')}
          className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="relative">
              {/* Cover Image */}
              <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 to-primary/30 rounded-t-xl" />
              
              {/* Profile Image */}
              <div className="absolute left-4 -bottom-12 md:-bottom-16">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                    <Image
                      src={profile.photoURL || '/default-avatar.png'}
                      alt="Profile"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-14 md:pt-20">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        value={editedProfile.fullName || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nghề nghiệp</label>
                      <input
                        type="text"
                        value={editedProfile.occupation || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, occupation: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="VD: Software Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        value={editedProfile.phoneNumber || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, phoneNumber: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Nhập số điện thoại của bạn"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <input
                        type="text"
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="VD: Hà Nội, Việt Nam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Học vấn</label>
                      <input
                        type="text"
                        value={editedProfile.education || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, education: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="VD: Đại học Bách Khoa Hà Nội"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        value={editedProfile.website || ''}
                        onChange={(e) => setEditedProfile({...editedProfile, website: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="VD: https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu bản thân</label>
                    <textarea
                      value={editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary h-24"
                      placeholder="Viết một vài điều về bản thân..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang lưu...
                        </>
                      ) : 'Lưu thay đổi'}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile.fullName || 'Chưa cập nhật'}</h2>
                      {profile.occupation && (
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Briefcase className="w-4 h-4" />
                          {profile.occupation}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={handleEdit}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full md:w-auto"
                    >
                      Chỉnh sửa thông tin
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-gray-900">{profile.email || user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="text-gray-900">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ</p>
                          <p className="text-gray-900">{profile.location || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Học vấn</p>
                          <p className="text-gray-900">{profile.education || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <p className="text-gray-900">
                            {profile.website ? (
                              <a 
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {profile.website}
                              </a>
                            ) : 'Chưa cập nhật'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                          <p className="text-gray-900">
                            {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
                      <p className="text-gray-600 whitespace-pre-line">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Đổi mật khẩu</h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu cũ"
                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : 'Đổi mật khẩu'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Bảo mật tài khoản</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Xác thực hai yếu tố</h3>
                    <p className="text-sm text-gray-500">Thêm một lớp bảo mật cho tài khoản của bạn</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                    Thiết lập
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Phiên đăng nhập</h3>
                    <p className="text-sm text-gray-500">Quản lý các thiết bị đang đăng nhập</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                    Xem
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Tùy chọn thông báo</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Email thông báo</h3>
                    <p className="text-sm text-gray-500">Nhận thông báo về khóa học qua email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Thông báo khóa học mới</h3>
                    <p className="text-sm text-gray-500">Nhận thông báo khi có khóa học mới</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-4">Ngôn ngữ và khu vực</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ</label>
                  <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Múi giờ</label>
                  <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
                    <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 px-4 md:px-6 py-4 md:py-6 overflow-auto"
        >
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'info'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'security'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Bảo mật
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'preferences'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tùy chọn
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm">
              {renderTabContent()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}