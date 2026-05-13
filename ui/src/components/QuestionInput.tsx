import { motion, AnimatePresence } from 'framer-motion'
import { Dices, Loader2 } from 'lucide-react'
import { forwardRef } from 'react'
import { useLang } from '../i18n/LanguageContext'

interface QuestionInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isGenerating?: boolean
}

const QuestionInput = forwardRef<HTMLDivElement, QuestionInputProps>(
  ({ value, onChange, onGenerate, isGenerating }, ref) => {
    const { t, lang } = useLang()
    const isKo = lang === 'ko'

    return (
      <motion.section
        ref={ref}
        className="lab-card p-5 sm:p-7"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-labelledby="prompt-heading"
      >
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="section-tag">{t.question.sectionTag}</span>
              <span className="eyebrow">{t.question.sectionLabel}</span>
            </div>
            <h2
              id="prompt-heading"
              className={`mt-3 font-display font-light text-ink-pure text-2xl sm:text-3xl tracking-crisp ${
                isKo ? 'font-kr' : ''
              }`}
              style={!isKo ? { fontVariationSettings: '"SOFT" 80' } : undefined}
            >
              {t.question.heading}
            </h2>
            <p className={`mt-1 text-sm text-ink-muted ${isKo ? 'font-kr' : 'font-mono'}`}>
              {t.question.subheading}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="lab-button self-start sm:self-auto"
            whileHover={!isGenerating ? { y: -2 } : undefined}
            whileTap={!isGenerating ? { scale: 0.97 } : undefined}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                <span>{t.question.generating}</span>
              </>
            ) : (
              <>
                <Dices className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{t.question.generate}</span>
              </>
            )}
          </motion.button>
        </header>

        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isGenerating}
            placeholder={t.question.placeholder}
            className={`lab-input w-full h-72 sm:h-96 px-4 py-3.5 placeholder-ink-rule-strong resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-relaxed ${
              isKo ? 'font-kr text-[15px]' : ''
            }`}
            spellCheck={false}
          />

          <div className="absolute bottom-3 right-3 eyebrow text-ink-rule-strong">
            {t.question.counter(value.length)}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!value.trim() && (
            <motion.div
              key="quick-starters"
              className="mt-5 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="eyebrow">{t.question.templatesLabel}</div>
                <div className="flex-1 h-px bg-ink-rule" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {t.question.templates.map((template, index) => (
                  <motion.button
                    key={template}
                    type="button"
                    onClick={() => !isGenerating && onChange(template)}
                    disabled={isGenerating}
                    className={`group text-left text-xs leading-relaxed px-3 py-2.5 border border-ink-rule rounded-[2px] text-ink-soft hover:text-ink-pure hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isKo ? 'font-kr text-[13px]' : 'font-mono'
                    }`}
                    whileHover={!isGenerating ? { x: 2 } : undefined}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04 }}
                  >
                    <span className="eyebrow text-gold mr-2 group-hover:eyebrow-gold">
                      0{index + 1}
                    </span>
                    {template}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    )
  }
)

QuestionInput.displayName = 'QuestionInput'

export default QuestionInput
