import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeLoader from '@/components/ThemeLoader'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GoalSaver',
  description: 'Aplikasi tabungan berbasis goal',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GoalSaver',
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* Inject dark mode sebelum render untuk hindari flash */}
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              var s = localStorage.getItem('goalsaver_settings');
              if (s && JSON.parse(s).darkMode) {
                document.documentElement.classList.add('dark');
              }
              var sb = localStorage.getItem('sidebar_collapsed');
              if (sb === 'true') {
                document.documentElement.setAttribute('data-sidebar', 'collapsed');
              }
            } catch(e) {}
          `
        }} />
      </head>
      <body className={inter.className}>
        <ThemeLoader />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
