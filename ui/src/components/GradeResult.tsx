import { motion } from 'framer-motion'
import { Trophy, Star, Target, BookOpen, CheckCircle, AlertCircle, XCircle, Scroll } from 'lucide-react'
import { GradeData } from '../App'
import MarkdownViewer from './MarkdownViewer'
import { useEffect, useRef } from 'react'

interface GradeResultProps {
  data: GradeData
}

const GradeResult = ({ data }: GradeResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to result when component mounts
  useEffect(() => {
    if (resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 300) // Small delay to let animations start
      
      return () => clearTimeout(timer)
    }
  }, [])

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-400'
    if (grade >= 80) return 'text-blue-400'
    if (grade >= 70) return 'text-yellow-400'
    if (grade >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getGradeIcon = (grade: number) => {
    if (grade >= 90) return <Trophy className="w-8 h-8 text-green-400" />
    if (grade >= 80) return <Star className="w-8 h-8 text-blue-400" />
    if (grade >= 70) return <Target className="w-8 h-8 text-yellow-400" />
    if (grade >= 60) return <CheckCircle className="w-8 h-8 text-orange-400" />
    return <XCircle className="w-8 h-8 text-red-400" />
  }

  const getGradeLevel = (grade: number) => {
    if (grade >= 95) return 'Exceptional'
    if (grade >= 90) return 'Excellent'
    if (grade >= 85) return 'Very Good'
    if (grade >= 80) return 'Good'
    if (grade >= 75) return 'Above Average'
    if (grade >= 70) return 'Average'
    if (grade >= 60) return 'Below Average'
    return 'Needs Improvement'
  }

  const getMotivationalMessage = (grade: number) => {
    if (grade >= 90) return "Outstanding work! You've mastered this concept."
    if (grade >= 80) return "Great job! You're on the right track."
    if (grade >= 70) return "Good effort! A few improvements will make it excellent."
    if (grade >= 60) return "Keep practicing! You're making progress."
    return "Don't give up! Every expert was once a beginner."
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  }

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${data.grade}%`,
      transition: { duration: 1.5, ease: "easeOut", delay: 0.5 }
    }
  }

  return (
    <motion.div
      ref={resultRef}
      className="glass-card p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-8" variants={itemVariants}>
        <motion.div
          className="flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {getGradeIcon(data.grade)}
        </motion.div>
        
        <motion.div
          className={`text-6xl font-black mb-2 ${getGradeColor(data.grade)}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {data.grade}
          <span className="text-3xl">/100</span>
        </motion.div>
        
        <motion.p
          className={`text-xl font-semibold mb-2 ${getGradeColor(data.grade)}`}
          variants={itemVariants}
        >
          {getGradeLevel(data.grade)}
        </motion.p>
        
        <motion.p
          className="text-secondary-300 italic"
          variants={itemVariants}
        >
          {getMotivationalMessage(data.grade)}
        </motion.p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary-300">Score Progress</span>
          <span className="text-sm font-medium text-secondary-300">{data.grade}%</span>
        </div>
        <div className="w-full bg-secondary-800/50 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              data.grade >= 90 ? 'bg-gradient-to-r from-green-500 to-green-400' :
              data.grade >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
              data.grade >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
              data.grade >= 60 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            variants={progressVariants}
            initial="hidden"
            animate="visible"
          />
        </div>
      </motion.div>

      {/* Feedback Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-3 mb-6">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <BookOpen className="w-6 h-6 text-primary-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">Detailed Feedback</h3>
          <motion.div
            className="ml-auto"
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Scroll className="w-5 h-5 text-accent-400" />
          </motion.div>
        </div>
        
        <motion.div
          className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[200px]"
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <MarkdownViewer 
            content={data.feedback}
            className="text-secondary-200"
          />
        </motion.div>
      </motion.div>

      {/* Action Hints */}
      <motion.div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        variants={itemVariants}
      >
        {data.grade < 80 && (
          <motion.div
            className="flex items-center space-x-2 glass-button px-4 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-secondary-300">Consider reviewing the feedback and trying again</span>
          </motion.div>
        )}
        
        {data.grade >= 90 && (
          <motion.div
            className="flex items-center space-x-2 glass-button px-4 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-secondary-300">Ready for the next challenge!</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default GradeResult
