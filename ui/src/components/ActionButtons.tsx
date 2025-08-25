import { motion } from 'framer-motion'
import { Send, Trash2, Zap, Sparkles } from 'lucide-react'

interface ActionButtonsProps {
  onSubmit: () => void
  onClear: () => void
  isSubmitting?: boolean
  canSubmit?: boolean
}

const ActionButtons = ({ onSubmit, onClear, isSubmitting, canSubmit }: ActionButtonsProps) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.button
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitting}
        className={`
          flex-1 px-8 py-4 rounded-xl font-bold text-lg
          ${canSubmit && !isSubmitting
            ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg hover:shadow-primary-500/25 neon-glow'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
          transition-all duration-300 flex items-center justify-center space-x-3
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        whileHover={canSubmit && !isSubmitting ? { 
          scale: 1.02, 
          y: -2,
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
        } : {}}
        whileTap={canSubmit && !isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <span>Analyzing Code...</span>
          </>
        ) : (
          <>
            <Send className="w-6 h-6" />
            <span>Grade My Code</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </>
        )}
      </motion.button>

      <motion.button
        onClick={onClear}
        className="px-6 py-4 glass-button text-white hover:text-red-300 transition-all duration-300 flex items-center justify-center space-x-2 hover:border-red-500/30"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Trash2 className="w-5 h-5" />
        <span className="font-medium">Clear</span>
      </motion.button>
    </motion.div>
  )
}

export default ActionButtons
