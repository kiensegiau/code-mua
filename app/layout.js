import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './_context/AuthContext'
import Toast from './(router)/_components/Toast'
import PageTransition from './(router)/_components/PageTransition'
import dynamic from 'next/dynamic'

const AuthWrapper = dynamic(() => import('./_components/AuthWrapper'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Loading...</div>
    </div>
  ),
})

const inter = Outfit({ subsets: ['latin'] })

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
