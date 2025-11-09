import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { ThemeProvider as NottyThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CommandPalette, EasterEggs } from '@/components/DynamicComponents'
import ToastProvider from '@/components/feedback/ToastProvider'
import { WebVitals } from './web-vitals'
import 'highlight.js/styles/github.min.css'

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Notty — World-class Notes',
  description: 'Data-driven, crisp, recall-ready notes with flashcards and quizzes.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <head>
          {/* Preconnect to improve performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        </head>
        <body className={inter.className}>
          <WebVitals />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <NottyThemeProvider>
              <AuthProvider>
                <Navbar />
                <main id="main-content" className="pt-16" role="main">
                  {children}
                </main>
                <Footer />
                <CommandPalette />
                <EasterEggs />
                <ToastProvider>
                  <div id="toast" className="toast hidden no-print" role="status" aria-live="polite" aria-atomic="true"></div>
                </ToastProvider>
              </AuthProvider>
            </NottyThemeProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
