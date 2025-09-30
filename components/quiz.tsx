"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, RotateCcw, XCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export type QuizQuestion = {
  question: string
  options: string[]
  correct: number
}

type QuizState = {
  currentQuestion: number
  selectedAnswer: string
  showResult: boolean
  score: number
}

interface QuizProps {
  questions: QuizQuestion[]
  storageKey: string
}

const defaultState: QuizState = {
  currentQuestion: 0,
  selectedAnswer: "",
  showResult: false,
  score: 0,
}

export function Quiz({ questions, storageKey }: QuizProps) {
  const { t } = useLanguage()
  const [state, setState] = useState<QuizState>(defaultState)

  const hasHydrated = useRef(false)
  const skipNextStorageWrite = useRef(false)
  const previousShowResult = useRef(false)
  const audioStarted = useRef(false)

  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const sfxRef = useRef<HTMLAudioElement | null>(null)

  const storageKeyName = useMemo(() => {
    const safeKey = storageKey.replace(/[^a-zA-Z0-9-_]/g, "-")
    return `quiz-state-${safeKey}`
  }, [storageKey])

  const ensureBgmPlaying = useCallback(() => {
    if (!bgmRef.current) return

    if (!audioStarted.current || bgmRef.current.paused) {
      const playPromise = bgmRef.current.play()
      if (playPromise) {
        playPromise
          .then(() => {
            audioStarted.current = true
          })
          .catch(() => {
            // Autoplay might be blocked; retry on the next user interaction.
          })
      }
    }
  }, [])

  useEffect(() => {
    if (typeof Audio === "undefined") {
      return
    }

    bgmRef.current = new Audio("/assets/quiz-bgm.mp3")
    bgmRef.current.loop = true
    bgmRef.current.volume = 0.4

    sfxRef.current = new Audio("/assets/quiz-result.mp3")
    sfxRef.current.volume = 0.6

    return () => {
      bgmRef.current?.pause()
      bgmRef.current = null
      sfxRef.current = null
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    try {
      const stored = window.localStorage.getItem(storageKeyName)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<
          QuizState & { questionsLength: number }
        >

        if (parsed.questionsLength === questions.length) {
          const sanitizedScore = Math.min(
            Math.max(Number(parsed.score) || 0, 0),
            questions.length,
          )
          const sanitizedCurrentQuestion = Math.min(
            Math.max(Number(parsed.currentQuestion) || 0, 0),
            Math.max(questions.length - 1, 0),
          )
          const sanitizedShowResult = Boolean(parsed.showResult)
          const sanitizedSelectedAnswer =
            typeof parsed.selectedAnswer === "string" ? parsed.selectedAnswer : ""

          setState({
            currentQuestion: sanitizedShowResult
              ? Math.max(questions.length - 1, 0)
              : sanitizedCurrentQuestion,
            selectedAnswer: sanitizedShowResult ? "" : sanitizedSelectedAnswer,
            showResult: sanitizedShowResult,
            score: sanitizedShowResult
              ? sanitizedScore
              : Math.min(sanitizedScore, sanitizedCurrentQuestion),
          })
        } else {
          window.localStorage.removeItem(storageKeyName)
        }
      }
    } catch (error) {
      window.localStorage.removeItem(storageKeyName)
    } finally {
      hasHydrated.current = true
    }
  }, [questions.length, storageKeyName])

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated.current) {
      return
    }

    if (skipNextStorageWrite.current) {
      skipNextStorageWrite.current = false
      return
    }

    const payload = {
      ...state,
      questionsLength: questions.length,
    }
    window.localStorage.setItem(storageKeyName, JSON.stringify(payload))
  }, [questions.length, state, storageKeyName])

  useEffect(() => {
    if (!state.showResult) {
      ensureBgmPlaying()
    } else if (!previousShowResult.current && state.showResult) {
      if (bgmRef.current) {
        bgmRef.current.pause()
      }
      if (sfxRef.current) {
        sfxRef.current.currentTime = 0
        sfxRef.current.play().catch(() => {
          // Ignore playback errors (e.g., autoplay restrictions).
        })
      }
    }

    previousShowResult.current = state.showResult
  }, [ensureBgmPlaying, state.showResult])

  const getLocalizedText = (path: string) => {
    return t(`quiz.${path}`)
  }

  const handleAnswerSelect = (value: string) => {
    ensureBgmPlaying()
    setState((prev) => ({
      ...prev,
      selectedAnswer: value,
    }))
  }

  const handleSubmitAnswer = () => {
    ensureBgmPlaying()
    setState((prev) => {
      if (prev.selectedAnswer === "") {
        return prev
      }

      const answerIndex = Number.parseInt(prev.selectedAnswer, 10)
      if (Number.isNaN(answerIndex)) {
        return prev
      }

      const currentIndex = Math.min(prev.currentQuestion, Math.max(questions.length - 1, 0))
      const isCorrect =
        questions[currentIndex] && questions[currentIndex].correct === answerIndex

      const updatedScore = prev.score + (isCorrect ? 1 : 0)
      const isLastQuestion = currentIndex >= questions.length - 1

      return {
        currentQuestion: isLastQuestion ? currentIndex : currentIndex + 1,
        selectedAnswer: "",
        showResult: isLastQuestion,
        score: Math.min(updatedScore, questions.length),
      }
    })
  }

  const resetQuiz = () => {
    skipNextStorageWrite.current = true
    setState(defaultState)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKeyName)
    }
    previousShowResult.current = false

    if (bgmRef.current) {
      bgmRef.current.currentTime = 0
    }
    ensureBgmPlaying()
  }

  if (state.showResult) {
    const correctCount = state.score
    const incorrectCount = Math.max(questions.length - correctCount, 0)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {correctCount >= questions.length / 2 ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            {getLocalizedText("quizResult")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              {correctCount}/{questions.length}
            </div>
            <p className="text-muted-foreground">
              {getLocalizedText("score")
                .replace("{score}", correctCount.toString())
                .replace("{total}", questions.length.toString())}
            </p>
            <p className="text-muted-foreground mt-2">
              {getLocalizedText("incorrectCount").replace(
                "{incorrect}",
                incorrectCount.toString(),
              )}
            </p>
          </div>

          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            {getLocalizedText("retakeQuiz")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentIndex = Math.min(state.currentQuestion, Math.max(questions.length - 1, 0))
  const currentQuizQuestion = questions[currentIndex]

  if (!currentQuizQuestion) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {getLocalizedText("quiz")} - {getLocalizedText("question")} {currentIndex + 1}/
          {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuizQuestion.question}</h3>

          <RadioGroup value={state.selectedAnswer} onValueChange={handleAnswerSelect}>
            {currentQuizQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          onClick={handleSubmitAnswer}
          disabled={state.selectedAnswer === ""}
          className="w-full"
        >
          {currentIndex < questions.length - 1
            ? getLocalizedText("nextQuestion")
            : getLocalizedText("complete")}
        </Button>
      </CardContent>
    </Card>
  )
}
