"use client"
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/_utils/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Đăng ký thành công!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email này đã được sử dụng. Vui lòng sử dụng email khác.');
      } else {
        toast.error('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Tạo tài khoản mới
        </h1>
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Địa chỉ email"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Đăng ký
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/sign-in" className="text-sm text-indigo-600 hover:text-indigo-800">
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}