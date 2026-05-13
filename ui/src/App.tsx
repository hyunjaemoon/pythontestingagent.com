import { useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import QuestionInput from './components/QuestionInput'
import GradeResult from './components/GradeResult'
import ParticleBackground from './components/ParticleBackground'
import SiteNav from './components/SiteNav'
import { useGradeCode } from './hooks/useGradeCode'
import { useGenerateQuestion } from './hooks/useGenerateQuestion'
import { useLang } from './i18n/LanguageContext'

export interface GradeData {
  grade: number
  feedback: string
}

function App() {
  const { lang } = useLang()
  const [question, setQuestion] = useState('')
  const [code, setCode] = useState('')
  const [gradeResult, setGradeResult] = useState<GradeData | null>(null)
  const questionInputRef = useRef<HTMLDivElement>(null)

  const gradeCodeMutation = useGradeCode()
  const generateQuestionMutation = useGenerateQuestion()

  const handleSubmit = async () => {
    if (!question.trim() || !code.trim()) return
    try {
      const result = await gradeCodeMutation.mutateAsync({
        question: question.trim(),
        code: code.trim(),
        lang,
      })
      setGradeResult(result)
    } catch (error) {
      console.error('Failed to grade code:', error)
    }
  }

  const handleGenerateQuestion = async () => {
    try {
      const result = await generateQuestionMutation.mutateAsync({
        topic:
          lang === 'ko'
            ? '리트코드 스타일 파이썬 프로그래밍'
            : 'leetcode style python programming',
        lang,
      })
      setQuestion(result.question)
    } catch (error) {
      console.error('Failed to generate question:', error)
    }
  }

  const handleClearCode = () => {
    setCode('')
    setGradeResult(null)
  }

  const handleRetry = () => setGradeResult(null)

  const handleNewQuestionFromResult = async () => {
    setGradeResult(null)
    setCode('')
    await handleGenerateQuestion()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { y: 18, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen dark relative">
      <ParticleBackground />

      <motion.div
        className="relative z-10 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <SiteNav />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20 max-w-7xl">
          <motion.div variants={itemVariants}>
            <Header />
          </motion.div>

          <main role="main" className="grid grid-cols-12 gap-5 sm:gap-7 mt-6 sm:mt-10">
            <motion.div className="col-span-12 lg:col-span-6" variants={itemVariants}>
              <QuestionInput
                ref={questionInputRef}
                value={question}
                onChange={setQuestion}
                onGenerate={handleGenerateQuestion}
                isGenerating={generateQuestionMutation.isPending}
              />
            </motion.div>

            <motion.div className="col-span-12 lg:col-span-6" variants={itemVariants}>
              <CodeEditor
                value={code}
                onChange={setCode}
                isLoading={gradeCodeMutation.isPending}
                question={question}
                onGrade={handleSubmit}
                onClear={handleClearCode}
                canGrade={!!question.trim() && !!code.trim()}
                isGrading={gradeCodeMutation.isPending}
              />
            </motion.div>
          </main>

          <AnimatePresence mode="wait">
            {gradeResult && (
              <motion.div
                key="grade-result"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mt-6 sm:mt-10"
              >
                <GradeResult
                  data={gradeResult}
                  question={question}
                  onRetry={handleRetry}
                  onNewQuestion={handleNewQuestionFromResult}
                  questionInputRef={questionInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#16151F',
            color: '#EDE9DC',
            border: '1px solid #2A2837',
            borderRadius: '2px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.05em',
            padding: '12px 16px',
          },
        }}
      />
    </div>
  )
}

export default App
