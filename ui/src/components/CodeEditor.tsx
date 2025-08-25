import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { Code, Maximize2, Minimize2, Send, Zap } from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  question?: string
  onGrade?: () => void
  canGrade?: boolean
  isGrading?: boolean
}

const CodeEditor = ({ value, onChange, isLoading, question, onGrade, canGrade, isGrading }: CodeEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editorTheme, setEditorTheme] = useState('vs-dark')

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    onChange(newValue || '')
  }, [onChange])

  const handleGradeAndMinimize = () => {
    if (onGrade && canGrade) {
      setIsFullscreen(false) // Minimize first
      setTimeout(() => {
        onGrade() // Then grade
      }, 300) // Small delay to let the minimize animation complete
    }
  }


  return (
    <motion.div
      className={`glass-card ${isFullscreen ? 'fixed inset-2 sm:inset-4 z-50 p-2 sm:p-4 overflow-hidden flex flex-col' : 'relative p-3 sm:p-6'}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Viewer - Only show in fullscreen mode */}
      {isFullscreen && question && (
        <motion.div
          className="mb-4 p-3 bg-white/5 border border-white/10 rounded-xl flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
              Question
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary-500/50 to-transparent"></div>
          </div>
          <p className="text-sm text-secondary-200 leading-relaxed">{question}</p>
        </motion.div>
      )}

      <div className={`flex items-center justify-between ${isFullscreen ? 'mb-3' : 'mb-4'} flex-shrink-0`}>
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Code className={`${isFullscreen ? 'w-5 h-5' : 'w-6 h-6'} text-primary-400`} />
          </motion.div>
          <h2 className={`${isFullscreen ? 'text-lg' : 'text-xl'} font-bold text-white`}>
            Python Code Editor
            {isFullscreen && <span className="text-xs font-normal text-secondary-400 ml-2">(Fullscreen)</span>}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.select
            value={editorTheme}
            onChange={(e) => setEditorTheme(e.target.value)}
            className={`glass-button ${isFullscreen ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
            whileHover={{ scale: 1.05 }}
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </motion.select>
          
          
          <motion.button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`glass-button ${isFullscreen ? 'p-1.5' : 'p-2'} text-white hover:text-primary-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFullscreen ? <Minimize2 className={`${isFullscreen ? 'w-4 h-4' : 'w-5 h-5'}`} /> : <Maximize2 className={`${isFullscreen ? 'w-4 h-4' : 'w-5 h-5'}`} />}
          </motion.button>
        </div>
      </div>

      <motion.div
        className="relative flex-1 min-h-0"
        animate={{ 
          height: isFullscreen 
            ? (question ? 'calc(100vh - 280px)' : 'calc(100vh - 220px)')
            : '400px' 
        }}
        transition={{ duration: 0.3 }}
      >
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
              <p className="text-white font-medium">Analyzing your code...</p>
            </div>
          </motion.div>
        )}
        
        <div className="border border-white/20 rounded-xl overflow-hidden h-full">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme={editorTheme}
            value={value}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
              wordWrap: 'on',
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
              renderLineHighlight: 'all',
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              mouseWheelZoom: true,
              smoothScrolling: true,
              cursorBlinking: 'blink',
              renderWhitespace: 'boundary',
              glyphMargin: true,
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              lineNumbers: 'on',
              rulers: [80, 120],
              bracketPairColorization: {
                enabled: true,
              },
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            }
          />
        </div>
      </motion.div>

      {!isFullscreen && (
        <motion.div
          className="mt-4 text-sm text-secondary-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="flex items-center space-x-2">
            <span>💡</span>
            <span>Press Ctrl+Space for autocomplete, Ctrl+/ to comment, and use the sample code button to get started</span>
          </p>
        </motion.div>
      )}

      {/* Grade button at bottom - only show in fullscreen */}
      {isFullscreen && onGrade && (
        <motion.div
          className="flex-shrink-0 pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.button
            onClick={handleGradeAndMinimize}
            disabled={!canGrade || isGrading}
            className={`
              w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-lg
              ${canGrade && !isGrading
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg hover:shadow-primary-500/25'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
            `}
            whileHover={canGrade && !isGrading ? { 
              scale: 1.02, 
              y: -2,
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
            } : {}}
            whileTap={canGrade && !isGrading ? { scale: 0.98 } : {}}
          >
            {isGrading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-6 h-6" />
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
        </motion.div>
      )}
    </motion.div>
  )
}

export default CodeEditor
