"use client"
import { useAuth } from '../_context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Spin } from 'antd'

export default function AuthWrapper({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      console.log('User not authenticated, redirecting to sign-in');
      router.push('/sign-in');
      return null;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return children;
} 