import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { Maximize2, Minimize2, ArrowRight, Trash2, Loader2 } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  question?: string
  onGrade?: () => void
  onClear?: () => void
  canGrade?: boolean
  isGrading?: boolean
}

const CodeEditor = ({
  value,
  onChange,
  isLoading,
  question,
  onGrade,
  onClear,
  canGrade,
  isGrading,
}: CodeEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editorTheme, setEditorTheme] = useState('vs-dark')
  const { t, lang } = useLang()
  const isKo = lang === 'ko'

  const handleEditorChange = useCallback(
    (newValue: string | undefined) => {
      onChange(newValue || '')
    },
    [onChange]
  )

  const handleGradeAndMinimize = () => {
    if (onGrade && canGrade) {
      setIsFullscreen(false)
      setTimeout(() => onGrade(), 300)
    }
  }

  return (
    <motion.section
      className={`lab-card ${
        isFullscreen
          ? 'fixed inset-2 sm:inset-4 z-50 p-3 sm:p-5 overflow-hidden flex flex-col'
          : 'relative p-5 sm:p-7'
      }`}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="solution-heading"
    >
      {isFullscreen && question && (
        <motion.div
          className="mb-4 p-3 border border-ink-rule rounded-[2px] flex-shrink-0 bg-ink-raised"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="eyebrow eyebrow-gold">{t.editor.questionTag}</span>
            <div className="flex-1 h-px bg-ink-rule" />
          </div>
          <p
            className={`text-sm leading-relaxed text-ink-soft ${
              isKo ? 'font-kr' : 'font-mono'
            }`}
          >
            {question}
          </p>
        </motion.div>
      )}

      <header
        className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 ${
          isFullscreen ? 'mb-3' : 'mb-5'
        } flex-shrink-0`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <span className="section-tag">{t.editor.sectionTag}</span>
            <span className="eyebrow">{t.editor.sectionLabel}</span>
            {isFullscreen && (
              <span className="eyebrow text-ink-rule-strong">
                · {t.editor.fullscreenTag}
              </span>
            )}
          </div>
          <h2
            id="solution-heading"
            className={`mt-3 font-display font-light text-ink-pure ${
              isFullscreen ? 'text-xl' : 'text-2xl sm:text-3xl'
            } tracking-crisp ${isKo ? 'font-kr' : ''}`}
            style={!isKo ? { fontVariationSettings: '"SOFT" 80' } : undefined}
          >
            {t.editor.heading}
            <span className="text-gold">.py</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 eyebrow">
            <span className="hidden sm:inline">{t.editor.theme}</span>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="bg-transparent border border-ink-rule rounded-[2px] px-2 py-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-ink-soft hover:border-gold focus:outline-none focus:border-gold transition-colors"
            >
              <option value="vs-dark">{t.editor.themes.dark}</option>
              <option value="light">{t.editor.themes.light}</option>
              <option value="hc-black">{t.editor.themes.hc}</option>
            </select>
          </label>

          <motion.button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="lab-button px-2.5 py-2"
            aria-label={isFullscreen ? t.editor.collapse : t.editor.fullscreen}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            )}
          </motion.button>
        </div>
      </header>

      <motion.div
        className="relative flex-1 min-h-0"
        animate={{
          height: isFullscreen
            ? question
              ? 'calc(100vh - 320px)'
              : 'calc(100vh - 240px)'
            : '400px',
        }}
        transition={{ duration: 0.3 }}
      >
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-ink-bg/80 backdrop-blur-sm flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="loading-dots">
                <div className="loading-dot" />
                <div className="loading-dot" />
                <div className="loading-dot" />
              </div>
              <p
                className={`text-ink-soft text-sm ${
                  isKo ? 'font-kr' : 'font-mono'
                }`}
              >
                {t.editor.grading}
              </p>
            </div>
          </motion.div>
        )}

        <div className="border border-ink-rule rounded-[2px] overflow-hidden h-full">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme={editorTheme}
            value={value}
            onChange={handleEditorChange}
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
              fontLigatures: true,
              wordWrap: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              renderWhitespace: 'boundary',
              padding: { top: 16, bottom: 16 },
              lineNumbers: 'on',
              lineNumbersMinChars: 3,
              folding: true,
              bracketPairColorization: { enabled: true },
              guides: { indentation: true, bracketPairs: true },
            }}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="loading-dots">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
              </div>
            }
          />
        </div>
      </motion.div>

      {!isFullscreen && (
        <motion.div
          className="mt-5 space-y-4 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              onClick={onGrade}
              disabled={!canGrade || isGrading}
              className={`lab-button lab-button-primary flex-1 justify-center !py-4 !text-[13px]`}
              whileHover={canGrade && !isGrading ? { y: -2 } : undefined}
              whileTap={canGrade && !isGrading ? { scale: 0.98 } : undefined}
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                  <span>{t.editor.grading}</span>
                </>
              ) : (
                <>
                  <span>{t.editor.grade}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={onClear}
              className="lab-button lab-button-ghost !py-4 justify-center"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={t.editor.clear}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{t.editor.clear}</span>
            </motion.button>
          </div>

          <p
            className={`eyebrow text-ink-muted pt-3 border-t border-ink-rule ${
              isKo ? 'font-kr text-[11px] tracking-[0.08em]' : ''
            }`}
          >
            {t.editor.tip}
          </p>
        </motion.div>
      )}

      {isFullscreen && onGrade && (
        <motion.div
          className="flex-shrink-0 pt-4 border-t border-ink-rule"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              onClick={handleGradeAndMinimize}
              disabled={!canGrade || isGrading}
              className="lab-button lab-button-primary flex-1 justify-center !py-3.5 !text-[13px]"
              whileHover={canGrade && !isGrading ? { y: -2 } : undefined}
              whileTap={canGrade && !isGrading ? { scale: 0.98 } : undefined}
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.editor.grading}</span>
                </>
              ) : (
                <>
                  <span>{t.editor.grade}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={onClear}
              className="lab-button lab-button-ghost !py-3.5 justify-center"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{t.editor.clear}</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.section>
  )
}

export default CodeEditor
