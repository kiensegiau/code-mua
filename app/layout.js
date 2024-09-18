"use client"
import { Inter,Outfit } from 'next/font/google'
import './globals.css'

import { UserMemberContext } from './_context/UserMemberContext'
import { useState } from 'react'
import { AuthProvider } from './_context/AuthContext'
import Toast from './(router)/_components/Toast';
import PageTransition from './(router)/_components/PageTransition';

const inter = Outfit({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
        <Toast />
      </body>
    </html>
  )
}
