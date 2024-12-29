"use client"
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/_utils/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
      toast.success('Email đặt lại mật khẩu đã được gửi!');
    } catch (error) {
      let errorMessage = 'Đã xảy ra lỗi khi gửi email đặt lại mật khẩu. Vui lòng thử lại.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Địa chỉ email không hợp lệ.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Không tìm thấy tài khoản với email này.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
          break;
      }
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Quên mật khẩu
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isEmailSent ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.</p>
            <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Quay lại trang đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Gửi email đặt lại mật khẩu'}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link href="/sign-in" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </motion.div>
  );
}