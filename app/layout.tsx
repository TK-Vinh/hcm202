"use client"

import { ChatBubble } from '@/components/chat-bubble'
import { ClientOnly } from '@/components/client-only'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const metadata: Metadata = {
    title: 'E-Learning - Khám phá thế giới triết học',
    description:
        'Nền tảng E-Learning triết học với bài viết song ngữ, quiz tương tác và AI assistant',
    generator: 'v0.dev',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <LanguageProvider>
                        <Navigation />
                        <main className="min-h-screen pt-16">{children}</main>
                        <Footer />
                        <ClientOnly>
                            <ChatBubble />
                        </ClientOnly>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
