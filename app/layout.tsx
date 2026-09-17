import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LenisProvider } from '@/components/LenisProvider'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

export const metadata: Metadata = {
  title: 'Sidak Dhingra',
  description: 'Portfolio of Sidak Dhingra, a software developer based in India.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Sidak Dhingra',
    description: 'Portfolio of Sidak Dhingra, a software developer based in India.',
    siteName: 'Sidak Dhingra',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sidak Dhingra - Software Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sidak Dhingra',
    description: 'Portfolio of Sidak Dhingra, a software developer based in India.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0e' },
  ],
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LenisProvider>
            {children}
          </LenisProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
