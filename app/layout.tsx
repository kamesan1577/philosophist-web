// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Header from './Header'

export const metadata: Metadata = {
  title: 'Philosophist - 詭弁チェッカー',
  description: 'テキストに含まれる誤謬/詭弁を判定します',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">
        <Header />
        {children}
      </body>
    </html>
  )
}
