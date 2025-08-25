import { motion } from 'framer-motion'
import { HelpCircle, Dice6, Sparkles } from 'lucide-react'

interface QuestionInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isGenerating?: boolean
}

const QuestionInput = ({ value, onChange, onGenerate, isGenerating }: QuestionInputProps) => {
  return (
    <motion.div
      className="glass-card p-3 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
          </motion.div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Question or Problem</h2>
        </div>
        
        <motion.button
          onClick={onGenerate}
          disabled={isGenerating}
          className="glass-button px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:text-accent-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 self-start sm:self-auto"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Dice6 className="w-4 h-4" />
              <span>Generate Question</span>
            </>
          )}
        </motion.button>
      </div>

      <motion.div
        className="relative"
        whileFocus="focused"
        variants={{
          focused: { scale: 1.02 }
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the problem or question you're working on... 
          
Examples:
• Write a function that calculates the factorial of a number
• Create a class to manage a simple banking system
• Implement a binary search algorithm
• Write a program that finds the longest palindrome in a string"
          className="w-full h-32 sm:h-40 px-3 py-2 sm:px-4 sm:py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-secondary-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          style={{ 
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        />
        
        <motion.div
          className="absolute bottom-3 right-3 text-xs text-secondary-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value.length}/1000
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-4 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-secondary-400 w-full mb-2">Quick templates:</p>
        {[
          'Write a function that sorts a list',
          'Create a class for a student record',
          'Implement error handling',
          'Write a recursive algorithm'
        ].map((template, index) => (
          <motion.button
            key={template}
            onClick={() => onChange(template)}
            className="glass-button px-3 py-1 text-xs text-secondary-300 hover:text-white transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            {template}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default QuestionInput
