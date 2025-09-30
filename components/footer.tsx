'use client'

import { useLanguage } from '@/contexts/language-context'
import { philosophyBlogs } from '@/data/philosophy-chapters'
import { BookOpen, Github, Mail, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
    const { t, getLocalizedContent } = useLanguage()

    // Get available blogs dynamically
    const availableBlogs = Object.entries(philosophyBlogs)

    return (
        <footer className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t mt-16">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4 lg:col-span-1">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {t('home.title')}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {t('footer.description')}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <Link
                                href="#"
                                className="w-9 h-9 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 shadow-sm"
                            >
                                <Mail className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-9 h-9 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 shadow-sm"
                            >
                                <Github className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-9 h-9 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 shadow-sm"
                            >
                                <Twitter className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">
                            {t('footer.quickLinks')}
                        </h3>
                        <div className="space-y-3">
                            <Link
                                href="/blogs"
                                className="block text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                📚 {t('nav.blog')}
                            </Link>
                            <Link
                                href="/quiz"
                                className="block text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                🧠 {t('footer.quiz')}
                            </Link>
                            <Link
                                href="/feedback"
                                className="block text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                💬 {t('nav.feedback')}
                            </Link>
                        </div>
                    </div>

                    {/* Blogs */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">
                            {t('footer.blogs')}
                        </h3>
                        <div className="space-y-3">
                            {availableBlogs.map(([blogId, blog]) => {
                                const blogTitle = getLocalizedContent(blog.title)
                                return (
                                    <Link
                                        key={blogId}
                                        href={`/blogs?blog=${blogId}`}
                                        className="block text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                                    >
                                        {blogTitle}
                                    </Link>
                                )
                            })}
                            <Link
                                href="/blogs"
                                className="block text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                📖 {t('footer.allArticles')}
                            </Link>
                            <Link
                                href="/quiz"
                                className="block text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 text-sm transition-colors duration-200 hover:translate-x-1 transform"
                            >
                                🎯 {t('footer.practiceQuiz')}
                            </Link>
                        </div>
                    </div>

                    {/* Resources & Tools */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wider">
                            {t('footer.resourcesTools')}
                        </h3>
                        <div className="space-y-3">
                            <div className="text-muted-foreground text-sm">
                                🤖 {t('footer.aiAssistant')}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                🌐 {t('footer.languageSupport')}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                📊 {t('footer.articlesCount')}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                🎓 {t('footer.interactiveQuiz')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            &copy; 2025 {t('home.title')}. {t('footer.rights')}
                        </p>
                        <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                            <span>{t('footer.builtWith')}</span>
                            <span>•</span>
                            <span>Next.js 15 + TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
