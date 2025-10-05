'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import {
    philosophyBlogs,
    type ChapterId,
} from '@/data/philosophy-chapters'
import { getQuizChunksForChapter } from '@/lib/quiz-utils'
import { ArrowRight } from 'lucide-react'

interface QuizPageProps {
    params: Promise<{ chapterId: string }> | { chapterId: string }
}

export default function QuizChapterPage({ params }: QuizPageProps) {
    const paramsPromise = useMemo(
        () => ('then' in params ? params : Promise.resolve(params)),
        [params],
    )

    const { chapterId } = use(paramsPromise)
    const { t, getLocalizedContent } = useLanguage()

    const typedChapterId = chapterId as ChapterId
    const chapter = philosophyBlogs[typedChapterId]

    if (!chapter) {
        notFound()
    }

    const quizChunks = useMemo(
        () => getQuizChunksForChapter(typedChapterId),
        [typedChapterId],
    )

    if (!quizChunks.length) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Card className="border-red-200/70 dark:border-red-800/60">
                    <CardHeader>
                        <CardTitle className="text-red-800 dark:text-yellow-200">
                            {t('quiz.noQuizAvailable')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t('quiz.noQuizQuestionsMessage')}
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/quiz">{t('quiz.backToQuizOverview')}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const totalParts = quizChunks.length
    const chapterTitleLocalized = getLocalizedContent(chapter.title)
    const partCards = quizChunks.map((chunk) => ({
        partIndex: chunk.partIndex,
        questionsCount: Math.max(
            chunk.questions.vietnamese.length,
            chunk.questions.english.length,
        ),
        href: `/quiz/${chapterId}/part/${chunk.partIndex}`,
    }))

    return (
        <div className="container mx-auto max-w-4xl px-4 py-10">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-red-900 dark:text-yellow-50">
                    {`${t('quiz.quizForChapter')} ${chapterId} – ${chapterTitleLocalized}`}
                </h1>
                <p className="mt-4 text-muted-foreground">
                    {t('quiz.partSelectionIntro').replace(
                        '{total}',
                        totalParts.toString(),
                    )}
                </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                {partCards.map((part) => (
                    <Card
                        key={part.partIndex}
                        className="border-red-200/70 bg-white/80 shadow-red-200/60 dark:border-red-800/60 dark:bg-red-950/40"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-red-800 dark:text-yellow-200">
                                {`${t('quiz.partLabel')} ${part.partIndex}`}
                            </CardTitle>
                            <p className="text-sm font-medium text-red-600/80 dark:text-yellow-300/80">
                                {t('quiz.partOfTotal')
                                    .replace('{part}', part.partIndex.toString())
                                    .replace('{total}', totalParts.toString())}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t('quiz.questionsInPart').replace(
                                    '{count}',
                                    part.questionsCount.toString(),
                                )}
                            </p>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-3">
                            <Button asChild className="flex-1">
                                <Link href={part.href} className="flex items-center justify-center">
                                    {t('quiz.startPartButton')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Button asChild variant="outline" className="border-red-500 text-red-700">
                    <Link href="/quiz">{t('quiz.backToQuizOverview')}</Link>
                </Button>
            </div>
        </div>
    )
}
