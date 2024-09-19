"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/_context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db, auth } from '@/app/_utils/firebase';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { logToServer } from '@/app/_utils/logger';
import toast from 'react-hot-toast';

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
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
      setLoading(false);
    } else if (!user) {
      setLoading(false);
      router.push('/sign-in');
    }
  }, [profile, user, router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Thông tin đã được cập nhật thành công!');
    } catch (error) {
      logToServer("Lỗi khi cập nhật thông tin người dùng", { error: error.message, userId: user.uid });
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast.success('Mật khẩu đã được thay đổi thành công!');
    } catch (error) {
      logToServer("Lỗi khi thay đổi mật khẩu", { error: error.message, userId: user.uid });
      if (error.code === 'auth/wrong-password') {
        toast.error('Mật khẩu cũ không chính xác.');
      } else {
        toast.error('Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PulseLoader color="#4F46E5" size={15} margin={2} />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="text-center mt-8">
        <p>{error || "Không tìm thấy thông tin người dùng."}</p>
        <button
          onClick={() => router.push('/sign-in')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-8"
    >
      <h1 className="text-3xl font-bold mb-8">Thông tin cá nhân</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {isEditing ? (
          <>
            <div className="mb-4">
              <label className="font-bold">Họ và tên:</label>
              <input
                type="text"
                value={editedProfile.fullName || ''}
                onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="font-bold">Số điện thoại:</label>
              <input
                type="text"
                value={editedProfile.phoneNumber || ''}
                onChange={(e) => setEditedProfile({...editedProfile, phoneNumber: e.target.value})}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded mr-2">Lưu</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Hủy</button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="font-bold">Họ và tên:</label>
              <p>{profile.fullName || 'Chưa cập nhật'}</p>
            </div>
            <div className="mb-4">
              <label className="font-bold">Email:</label>
              <p>{profile.email || user.email}</p>
            </div>
            <div className="mb-4">
              <label className="font-bold">Số điện thoại:</label>
              <p>{profile.phoneNumber || 'Chưa cập nhật'}</p>
            </div>
            <div className="mb-4">
              <label className="font-bold">Ngày tạo tài khoản:</label>
              <p>{profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'Không có thông tin'}</p>
            </div>
            <button onClick={handleEdit} className="bg-indigo-600 text-white px-4 py-2 rounded">Chỉnh sửa</button>
          </>
        )}
      </div>
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Đổi mật khẩu</h2>
        <div className="mb-4 relative">
          <input
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu cũ"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showOldPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <div className="mb-4 relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showNewPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <div className="mb-4 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới"
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button onClick={handleChangePassword} className="bg-indigo-600 text-white px-4 py-2 rounded">Đổi mật khẩu</button>
      </div>
    </motion.div>
  );
}