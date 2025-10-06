import { useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import CodeEditor from './components/CodeEditor'
import QuestionInput from './components/QuestionInput'
import GradeResult from './components/GradeResult'
import ParticleBackground from './components/ParticleBackground'
import StatusIndicator from './components/StatusIndicator'
import AffiliateSidebar from './components/AffiliateSidebar'
import { useGradeCode } from './hooks/useGradeCode'
import { useGenerateQuestion } from './hooks/useGenerateQuestion'

export interface GradeData {
  grade: number
  feedback: string
}

function App() {
  const [question, setQuestion] = useState('Write a function that calculates the factorial of a number')
  const [code, setCode] = useState('')
  const [gradeResult, setGradeResult] = useState<GradeData | null>(null)
  const questionInputRef = useRef<HTMLDivElement>(null)

  const gradeCodeMutation = useGradeCode()
  const generateQuestionMutation = useGenerateQuestion()

  const handleSubmit = async () => {
    if (!question.trim() || !code.trim()) {
      return
    }

    try {
      const result = await gradeCodeMutation.mutateAsync({ question: question.trim(), code: code.trim() })
      setGradeResult(result)
    } catch (error) {
      console.error('Failed to grade code:', error)
    }
  }

  const handleGenerateQuestion = async () => {
    try {
      const result = await generateQuestionMutation.mutateAsync({ topic: 'leetcode style python programming' })
      setQuestion(result.question)
    } catch (error) {
      console.error('Failed to generate question:', error)
    }
  }

  const handleClearCode = () => {
    setCode('')
    setGradeResult(null)
  }

  const handleRetry = () => {
    setGradeResult(null)
  }

  const handleNewQuestionFromResult = async () => {
    setGradeResult(null)
    setCode('')
    await handleGenerateQuestion()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen transition-all duration-500 dark">
      <ParticleBackground />
      
      <motion.div
        className="relative z-10 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
          <motion.div variants={itemVariants}>
            <Header />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatusIndicator />
          </motion.div>

          <main role="main" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-12">
            <motion.div className="space-y-4 sm:space-y-6" variants={itemVariants}>
              <QuestionInput
                ref={questionInputRef}
                value={question}
                onChange={setQuestion}
                onGenerate={handleGenerateQuestion}
                isGenerating={generateQuestionMutation.isPending}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
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

          {/* Affiliate Section - Always below main content */}
          <aside role="complementary" aria-label="Learning Resources">
            <motion.div variants={itemVariants} className="mt-6 sm:mt-12">
              <AffiliateSidebar />
            </motion.div>
          </aside>

          <AnimatePresence mode="wait">
            {gradeResult && (
              <motion.div
                key="grade-result"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="mt-6 sm:mt-12"
              >
                <GradeResult 
                  data={gradeResult} 
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
          className: 'glass-card border-white/20',
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
    </div>
  )
}

export default App
