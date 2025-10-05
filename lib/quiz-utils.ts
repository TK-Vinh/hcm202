import { blogData } from "@/data/blog-data"
import type { Language } from "@/data/blog-data"
import {
  philosophyBlogs,
  type ChapterId,
  type SectionId,
} from "@/data/philosophy-chapters"
import type { QuizQuestion } from "@/types/quiz"

export const QUIZ_CHUNK_SIZE = 10

export type QuizChunk = {
  partIndex: number
  questions: Record<Language, QuizQuestion[]>
}

export const getQuizChunksForChapter = (
  chapterId: ChapterId,
): QuizChunk[] => {
  const chapter = philosophyBlogs[chapterId]

  if (!chapter) {
    return []
  }

  const sectionsInChapter = chapter.sections as SectionId[]
  const chapterBlogs = Object.values(blogData).filter((blog) =>
    sectionsInChapter.includes(blog.section),
  )

  const languages: Language[] = ["vietnamese", "english"]
  const questionsMap: Record<Language, QuizQuestion[]> = {
    vietnamese: [],
    english: [],
  }

  chapterBlogs.forEach((blog) => {
    languages.forEach((language) => {
      const questionsForLanguage = blog.quiz?.[language] ?? []
      questionsMap[language] = questionsMap[language].concat(
        questionsForLanguage as QuizQuestion[],
      )
    })
  })

  const maxLength = Math.max(
    ...languages.map((language) => questionsMap[language].length),
  )

  if (maxLength === 0) {
    return []
  }

  const chunkCount = Math.ceil(maxLength / QUIZ_CHUNK_SIZE)

  return Array.from({ length: chunkCount }, (_, index) => {
    const start = index * QUIZ_CHUNK_SIZE
    const end = start + QUIZ_CHUNK_SIZE

    const chunkQuestions = languages.reduce<Record<Language, QuizQuestion[]>>(
      (accumulator, language) => {
        accumulator[language] = questionsMap[language].slice(start, end)
        return accumulator
      },
      { vietnamese: [], english: [] },
    )

    return {
      partIndex: index + 1,
      questions: chunkQuestions,
    }
  })
}

export const getQuizStorageKey = (chapterId: ChapterId, partIndex: number) =>
  `${chapterId}-part-${partIndex}`
