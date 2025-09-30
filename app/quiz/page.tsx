'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { philosophyBlogs, type ChapterId } from '@/data/philosophy-chapters'
import { ArrowRight, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

type LocalizedText = {
    vietnamese: string
    english: string
}

type ChapterCard = {
    chapterId: ChapterId
    icon: LucideIcon
    gradient: string
    border: string
    accent: string
    iconBg: string
    buttonHover: string
    description: LocalizedText
}

type QuizStatus = 'notStarted' | 'inProgress' | 'completed'

type QuizOverviewResult = {
    total: number
    score: number
    answered: number
    status: QuizStatus
}

type StoredQuizPayload = Partial<{
    currentQuestion: number
    score: number
    showResult: boolean
    questionsLength: number
}>

const statusColorMap: Record<QuizStatus, string> = {
    completed: 'text-emerald-600 dark:text-emerald-400',
    inProgress: 'text-amber-600 dark:text-amber-400',
    notStarted: 'text-muted-foreground',
}

const chapterCards: ChapterCard[] = [
    {
        chapterId: '6',
        icon: Heart,
        gradient:
            'from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20',
        border: 'border-rose-200 dark:border-rose-800',
        accent: 'bg-rose-500/10',
        iconBg: 'bg-rose-500',
        buttonHover: 'group-hover:bg-rose-500 group-hover:text-white',
        description: {
            vietnamese:
                'Ôn tập hệ chuẩn đạo đức Hồ Chí Minh, bảng so sánh đạo đức cách mạng và ý nghĩa với công tác cán bộ.',
            english:
                "Revisit Hồ Chí Minh's ethical standards, compare revolutionary and ordinary morality, and link them to cadre development.",
        },
    },
]

const storageKeyForChapter = (chapterId: ChapterId) =>
    `quiz-state-${chapterId.replace(/[^a-zA-Z0-9-_]/g, '-')}`

const sanitizeStoredQuizPayload = (
    payload: StoredQuizPayload,
): QuizOverviewResult | null => {
    const total = Math.max(Number(payload.questionsLength) || 0, 0)

    if (total <= 0) {
        return null
    }

    const showResult = Boolean(payload.showResult)
    const maxIndex = Math.max(total - 1, 0)

    const rawCurrent = Number(payload.currentQuestion)
    const sanitizedCurrent = Number.isFinite(rawCurrent)
        ? Math.min(Math.max(rawCurrent, 0), maxIndex)
        : 0

    const answered = showResult ? total : Math.min(sanitizedCurrent, total)

    const rawScore = Number(payload.score)
    const sanitizedScoreBase = Number.isFinite(rawScore) ? rawScore : 0
    const sanitizedScore = Math.min(
        Math.max(sanitizedScoreBase, 0),
        showResult ? total : answered,
    )

    const status: QuizStatus = showResult
        ? 'completed'
        : answered > 0 || sanitizedScore > 0
          ? 'inProgress'
          : 'notStarted'

    return {
        total,
        score: sanitizedScore,
        answered,
        status,
    }
}

export default function QuizOverviewPage() {
    const { t, getLocalizedContent } = useLanguage()

    const [quizResults, setQuizResults] =
        useState<Partial<Record<ChapterId, QuizOverviewResult>>>({})

    const loadStoredResults = useCallback(() => {
        if (typeof window === 'undefined') {
            return
        }

        const next: Partial<Record<ChapterId, QuizOverviewResult>> = {}

        chapterCards.forEach(({ chapterId }) => {
            const storageKey = storageKeyForChapter(chapterId)
            const raw = window.localStorage.getItem(storageKey)

            if (!raw) {
                return
            }

            try {
                const parsed = JSON.parse(raw) as StoredQuizPayload
                const sanitized = sanitizeStoredQuizPayload(parsed)

                if (!sanitized) {
                    window.localStorage.removeItem(storageKey)
                    return
                }

                next[chapterId] = sanitized
            } catch {
                window.localStorage.removeItem(storageKey)
            }
        })

        setQuizResults(next)
    }, [])

    useEffect(() => {
        loadStoredResults()

        if (typeof window === 'undefined') {
            return
        }

        const handleFocus = () => {
            loadStoredResults()
        }

        const handleStorage = () => {
            loadStoredResults()
        }

        window.addEventListener('focus', handleFocus)
        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('storage', handleStorage)
        }
    }, [loadStoredResults])

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="mt-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('quiz.quiz')}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t('quiz.selectBlogPrompt')}
                    </p>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>{t('quiz.recentResultsTitle')}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {t('quiz.recentResultsDescription')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {chapterCards.map((card) => {
                                const chapter = philosophyBlogs[card.chapterId]
                                const result = quizResults[card.chapterId]
                                const status: QuizStatus = result?.status ?? 'notStarted'

                                const statusLabel =
                                    status === 'completed'
                                        ? t('quiz.resultStatusCompleted')
                                        : status === 'inProgress'
                                          ? t('quiz.resultStatusInProgress')
                                          : t('quiz.resultStatusNotStarted')

                                let detailText = t('quiz.noAttemptsYet')

                                if (result) {
                                    if (status === 'completed') {
                                        detailText = t('quiz.score')
                                            .replace(
                                                '{score}',
                                                result.score.toString(),
                                            )
                                            .replace(
                                                '{total}',
                                                result.total.toString(),
                                            )
                                    } else if (status === 'inProgress') {
                                        detailText = t('quiz.resultProgressCount')
                                            .replace(
                                                '{answered}',
                                                result.answered.toString(),
                                            )
                                            .replace(
                                                '{total}',
                                                result.total.toString(),
                                            )
                                    } else if (result.total > 0) {
                                        detailText = t('quiz.resultNotStartedHint').replace(
                                            '{total}',
                                            result.total.toString(),
                                        )
                                    }
                                }

                                return (
                                    <div
                                        key={card.chapterId}
                                        className="rounded-xl border bg-background/60 p-4 text-left shadow-sm transition-shadow hover:shadow-md dark:bg-background/40"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="font-semibold">
                                                {getLocalizedContent(chapter.title)}
                                            </p>
                                            <span
                                                className={`text-xs font-medium uppercase tracking-wide ${statusColorMap[status]}`}
                                            >
                                                {statusLabel}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {detailText}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {chapterCards.map((card) => {
                        const Icon = card.icon
                        const chapter = philosophyBlogs[card.chapterId]

                        return (
                            <div
                                key={card.chapterId}
                                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-8 border ${card.border} transition-all duration-300 hover:shadow-2xl`}
                            >
                                <div
                                    className={`absolute top-0 right-0 w-32 h-32 ${card.accent} rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`}
                                ></div>

                                <div className="relative z-10">
                                    <div
                                        className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center mb-4`}
                                    >
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">
                                        {getLocalizedContent(chapter.title)}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {getLocalizedContent(card.description)}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className={`${card.buttonHover} transition-colors`}
                                        >
                                            <Link href={`/quiz/${card.chapterId}`}>
                                                {t('home.explore')}{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            {`${chapter.sections.length} ${t('home.articles')}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}