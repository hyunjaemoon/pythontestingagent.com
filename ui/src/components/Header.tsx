import { motion } from 'framer-motion'
import { Code2, Sparkles, Zap } from 'lucide-react'

const Header = () => {
  return (
    <motion.header 
      className="text-center py-6 sm:py-12"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      role="banner"
    >
      <motion.div
        className="inline-flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary-400" />
          <motion.div
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-accent-400" />
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400" />
        </motion.div>
      </motion.div>

      <motion.h1 
        className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <span className="gradient-text">
          Python Testing Agent
        </span>
      </motion.h1>
      
      {/* Hidden SEO content */}
      <div className="sr-only">
        <h2>Free AI-Powered Python Code Grading Tool</h2>
        <p>Get instant feedback on your Python programming assignments with our advanced AI grading system. Perfect for students, developers, and educators.</p>
      </div>
      
      <motion.p 
        className="text-sm sm:text-lg md:text-xl lg:text-2xl text-secondary-300 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Experience the future of code evaluation with our 
        <span className="text-accent-400 font-semibold"> AI-powered grading system</span>
      </motion.p>
      
      <motion.p 
        className="text-sm sm:text-base lg:text-lg text-secondary-400 px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Submit your Python code and get instant intelligent feedback
      </motion.p>

      <motion.div
        className="mt-4 sm:mt-8 text-xs sm:text-sm text-secondary-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        Created by{' '}
        <motion.a
          href="https://hyunjaemoon.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 transition-colors duration-300 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          Hyun Jae Moon
        </motion.a>
      </motion.div>
    </motion.header>
  )
}

export default Header
