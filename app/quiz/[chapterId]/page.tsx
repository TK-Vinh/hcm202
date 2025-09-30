// app/quiz/[chapterId]/page.tsx
'use client'

import { Quiz } from '@/components/quiz'
import { notFound } from 'next/navigation'
import { blogData } from '@/data/blog-data'
import {
    philosophyBlogs,
    type ChapterId,
    type SectionId,
} from '@/data/philosophy-chapters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { use, useMemo } from 'react'

interface QuizPageProps {
    params: Promise<{ chapterId: string }> | { chapterId: string }
}

export default function QuizChapterPage({ params }: QuizPageProps) {
    const paramsPromise = useMemo(
        () => ('then' in params ? params : Promise.resolve(params)),
        [params],
    )

    const { chapterId } = use(paramsPromise)
    const { t, getLocalizedContent, currentLanguage } = useLanguage()

    const typedChapterId = chapterId as ChapterId
    const chapter = philosophyBlogs[typedChapterId]

    if (!chapter) {
        notFound()
    }

    const sectionsInChapter = chapter.sections as SectionId[]
    const chapterTitleLocalized = getLocalizedContent(chapter.title)

    // Lọc dữ liệu blog để lấy các quiz của các section trong chương
    const chapterBlogs = Object.values(blogData).filter((blog) =>
        sectionsInChapter.includes(blog.section),
    )

    // Kết hợp tất cả các câu hỏi quiz từ các blog của chương
    const combinedQuizQuestions = chapterBlogs.flatMap(
        (blog) => blog.quiz?.[currentLanguage] || [],
    )

    if (combinedQuizQuestions.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('quiz.noQuizAvailable')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{t('quiz.noQuizQuestionsMessage')}</p>
                        <Button asChild className="mt-4">
                            <Link href="/quiz">
                                {t('quiz.backToQuizOverview')}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">
                {`${t('quiz.quizForChapter')} ${chapterId} – ${chapterTitleLocalized}`}
            </h1>
            <Quiz questions={combinedQuizQuestions} storageKey={chapterId} />
        </div>
    )
}