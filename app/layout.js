"use client"
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { AuthProvider, useAuth } from './_context/AuthContext'
import Toast from './(router)/_components/Toast'
import PageTransition from './(router)/_components/PageTransition'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Spin } from 'antd'; // Import Spin from antd

const inter = Outfit({ subsets: ['latin'] })

function AuthWrapper({ children }) {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthWrapper>
            <PageTransition>
              {children}
            </PageTransition>
          </AuthWrapper>
        </AuthProvider>
        <Toast />
      </body>
    </html>
  )
}
