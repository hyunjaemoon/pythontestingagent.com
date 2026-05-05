import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

const Header = () => {
  return (
    <motion.header
      className="text-center pt-8 pb-6 sm:pt-14 sm:pb-10"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      role="banner"
    >
      <div className="inline-flex items-center justify-center mb-5 sm:mb-7">
        <Code2
          className="w-9 h-9 sm:w-11 sm:h-11 text-primary-300"
          strokeWidth={1.5}
        />
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-3 sm:mb-4">
        <span className="gradient-text">Python Testing Agent</span>
      </h1>

      <div className="sr-only">
        <h2>Free AI-Powered Python Code Grading Tool</h2>
        <p>Get instant feedback on your Python programming assignments with our advanced AI grading system. Perfect for students, developers, and educators.</p>
      </div>

      <p className="text-base sm:text-lg text-secondary-300 max-w-xl mx-auto leading-relaxed px-4">
        Submit Python code, get an AI-graded review in seconds.
      </p>
    </motion.header>
  )
}

export default Header
