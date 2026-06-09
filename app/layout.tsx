import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Bolão da Copa 2026',
  description: 'Participe do bolão da Copa do Mundo 2026 com seus amigos!',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Bolão da Copa 2026',
    description: 'Faça seus palpites e dispute com seus amigos na Copa do Mundo!',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
