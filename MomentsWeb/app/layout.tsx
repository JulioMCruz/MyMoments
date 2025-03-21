"use client"

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import '@coinbase/onchainkit/styles.css';
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from './providers';
import { cookieToInitialState } from 'wagmi';

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "My Moments - Dashboard",
//   description: "View and manage your special moments",
//     generator: 'my-moments'
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'