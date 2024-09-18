"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/_context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/_utils/firebase';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { logToServer } from '@/app/_utils/logger';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            logToServer("Không tìm thấy thông tin người dùng trong Firestore", { userId: user.uid });
            setError("Không tìm thấy thông tin người dùng. Vui lòng liên hệ hỗ trợ.");
          }
        } catch (error) {
          logToServer("Lỗi khi tải thông tin người dùng", { error: error.message, userId: user.uid });
          setError("Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      } else {
        logToServer("Không có người dùng đăng nhập");
        setLoading(false);
        router.push('/sign-in');
      }
    };

    fetchProfile();
  }, [user, router]);

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
        <div className="mb-4">
          <label className="font-bold">Họ và tên:</label>
          <p>{profile.fullName}</p>
        </div>
        <div className="mb-4">
          <label className="font-bold">Email:</label>
          <p>{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="font-bold">Số điện thoại:</label>
          <p>{profile.phoneNumber}</p>
        </div>
        <div className="mb-4">
          <label className="font-bold">Ngày tạo tài khoản:</label>
          <p>{profile.createdAt?.toDate().toLocaleDateString() || 'Không có thông tin'}</p>
        </div>
      </div>
    </motion.div>
  );
}