import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bibek Joshi - Software Developer Engineer & Tech Community Mentor',
  description: 'Professional portfolio of Bibek Joshi, specializing in backend development with Django, FastAPI, and system design. Passionate about community learning and mentoring.',
  keywords: ['Bibek Joshi', 'Software Developer', 'Backend Developer', 'Django', 'FastAPI', 'Python', 'Tech Mentor'],
  authors: [{ name: 'Bibek Joshi' }],
  openGraph: {
    title: 'Bibek Joshi - Software Developer Engineer',
    description: 'Professional portfolio showcasing expertise in backend development and tech community mentoring',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  )
}