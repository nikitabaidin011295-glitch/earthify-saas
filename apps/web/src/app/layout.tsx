import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Earthify — Платформа управління бізнесом',
  description: 'Модульна SaaS платформа для готелів, спа, салонів, ресторанів та басейнів',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
