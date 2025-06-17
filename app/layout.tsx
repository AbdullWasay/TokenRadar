import SolanaWalletProvider from "@/components/solana-wallet-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { WalletProvider } from "@/lib/wallet-context"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Token Tracker",
  description: "Track and monitor tokens in real-time",
    generator: 'token-tracker-dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js"></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SolanaWalletProvider>
            <WalletProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </WalletProvider>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
