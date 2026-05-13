import { motion } from 'framer-motion'
import { RotateCcw, Shuffle, ArrowUpRight, Play, Youtube } from 'lucide-react'
import { GradeData } from '../App'
import MarkdownViewer from './MarkdownViewer'
import { useEffect, useRef, RefObject } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useYoutubeSuggestions } from '../hooks/useYoutubeSuggestions'
import { YoutubeAngle } from '../services/api'

interface GradeResultProps {
  data: GradeData
  question?: string
  onRetry?: () => void
  onNewQuestion?: () => void
  questionInputRef?: RefObject<HTMLDivElement>
}

const buildYoutubeSearchUrl = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`

const sanitizeQuestionForQuery = (q: string) => {
  // Strip markdown fences, normalize whitespace, cap length for a clean YT query.
  const cleaned = q
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.length > 80 ? cleaned.slice(0, 80).trim() : cleaned
}

const GradeResult = ({
  data,
  question,
  onRetry,
  onNewQuestion,
  questionInputRef,
}: GradeResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null)
  const { t, lang } = useLang()
  const isKo = lang === 'ko'

  // Ask Gemini (via /api/youtube-suggestions) for concept-aware queries.
  // Falls back to client-side templating below if the call fails or while loading.
  const youtube = useYoutubeSuggestions(question, lang)
  const liveSuggestions =
    youtube.data?.suggestions && youtube.data.suggestions.length > 0
      ? youtube.data.suggestions
      : null
  const fallbackSuggestions = t.result.learn.angles.map((a) => ({
    angle: a.angle as YoutubeAngle,
    query: `${sanitizeQuestionForQuery(question || '')} ${a.suffix}`.trim(),
  }))
  const effectiveSuggestions = liveSuggestions ?? fallbackSuggestions
  const usingLive = !!liveSuggestions

  useEffect(() => {
    if (resultRef.current) {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [])

  const scrollToQuestion = () => {
    questionInputRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleRetry = () => {
    scrollToQuestion()
    if (onRetry) setTimeout(() => onRetry(), 500)
  }

  const handleNewQuestion = () => {
    scrollToQuestion()
    if (onNewQuestion) setTimeout(() => onNewQuestion(), 500)
  }

  const getGradeAccent = (grade: number) => {
    if (grade >= 90) return { color: '#6FE8B0', bar: '#6FE8B0', label: t.result.levels.excellent }
    if (grade >= 85) return { color: '#7C8CFF', bar: '#7C8CFF', label: t.result.levels.veryGood }
    if (grade >= 80) return { color: '#7C8CFF', bar: '#7C8CFF', label: t.result.levels.good }
    if (grade >= 75) return { color: '#F5C518', bar: '#F5C518', label: t.result.levels.aboveAverage }
    if (grade >= 70) return { color: '#F5C518', bar: '#F5C518', label: t.result.levels.average }
    if (grade >= 60) return { color: '#FFB055', bar: '#FFB055', label: t.result.levels.belowAverage }
    return { color: '#FF7A7A', bar: '#FF7A7A', label: t.result.levels.needsWork }
  }

  const getLevelLabel = (grade: number) => {
    if (grade >= 95) return t.result.levels.exceptional
    return getGradeAccent(grade).label
  }

  const getMotivationalMessage = (grade: number) => {
    if (grade >= 90) return t.result.messages.ninety
    if (grade >= 80) return t.result.messages.eighty
    if (grade >= 70) return t.result.messages.seventy
    if (grade >= 60) return t.result.messages.sixty
    return t.result.messages.below
  }

  const accent = getGradeAccent(data.grade)
  const level = getLevelLabel(data.grade)
  const padded = String(data.grade).padStart(3, '0')

  return (
    <motion.section
      ref={resultRef}
      className="lab-card p-5 sm:p-8 lg:p-12 relative overflow-hidden"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="report-heading"
    >
      <div className="paper-grain" aria-hidden />

      <div className="relative">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="section-tag">{t.result.sectionTag}</span>
              <span className="eyebrow">{t.result.sectionLabel}</span>
            </div>
            <h2
              id="report-heading"
              className={`mt-3 font-display font-light text-ink-pure text-2xl sm:text-3xl tracking-crisp ${
                isKo ? 'font-kr' : ''
              }`}
              style={!isKo ? { fontVariationSettings: '"SOFT" 80' } : undefined}
            >
              {t.result.feedbackHeading}
            </h2>
          </div>
          <div className="eyebrow text-right">
            <div>{t.result.scoreLabel}</div>
            <div className="mt-1 text-ink-rule-strong">
              {new Intl.DateTimeFormat(isKo ? 'ko-KR' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date())}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 sm:gap-8 mb-10">
          <motion.div
            className="col-span-12 md:col-span-7 lg:col-span-8"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="font-display font-light leading-none tracking-tightest text-[clamp(5rem,18vw,12rem)]"
                style={{
                  color: accent.color,
                  fontVariationSettings: '"SOFT" 100, "WONK" 1',
                }}
              >
                {padded}
              </span>
              <span
                className="font-display font-light text-ink-rule-strong text-2xl sm:text-3xl"
                aria-hidden
              >
                {t.result.outOf}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <span className="eyebrow eyebrow-gold">{level}</span>
              <span className="flex-1 h-px bg-ink-rule" />
            </div>

            <p
              className={`mt-4 text-ink-soft italic max-w-md ${
                isKo ? 'font-kr not-italic' : 'font-display'
              }`}
              style={
                !isKo
                  ? { fontVariationSettings: '"SOFT" 100', fontStyle: 'italic' }
                  : undefined
              }
            >
              “{getMotivationalMessage(data.grade)}”
            </p>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="eyebrow mb-3 flex items-center justify-between">
              <span>{t.result.progressLabel}</span>
              <span style={{ color: accent.color }}>{data.grade}%</span>
            </div>
            <div className="relative h-[2px] bg-ink-rule overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ backgroundColor: accent.color }}
                initial={{ width: 0 }}
                animate={{ width: `${data.grade}%` }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              />
            </div>

            <div className="mt-4 grid grid-cols-10 gap-[2px]">
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = data.grade / 10 > i
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.04 }}
                    className="h-2"
                    style={{
                      backgroundColor: filled ? accent.color : 'var(--ink-rule)',
                    }}
                  />
                )
              })}
            </div>
            <div className="mt-2 flex justify-between eyebrow text-ink-rule-strong">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </motion.div>
        </div>

        <hr className="dashed-rule mb-8" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="eyebrow eyebrow-gold">// notes</span>
            <div className="flex-1 h-px bg-ink-rule" />
          </div>

          <div className="relative">
            <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-px bg-ink-rule" />
            <div className="md:pl-6">
              <MarkdownViewer content={data.feedback} className="text-ink-soft" />
            </div>
          </div>
        </motion.div>

        {question?.trim() && (
          <motion.section
            className="mt-10 pt-8 border-t border-ink-rule"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            aria-labelledby="learn-heading"
          >
            <header className="mb-5">
              <div className="flex items-center gap-2.5">
                <span className="section-tag">{t.result.learn.sectionTag}</span>
                <span className="eyebrow">{t.result.learn.sectionLabel}</span>
                <div className="flex-1 h-px bg-ink-rule" />
                {youtube.isFetching && (
                  <span className="eyebrow text-ink-muted">
                    <span className="loading-dots">
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                    </span>
                  </span>
                )}
                <Youtube
                  className="w-4 h-4 text-coral-glow"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
              <h3
                id="learn-heading"
                className={`mt-3 font-display font-light text-ink-pure text-xl sm:text-2xl tracking-crisp ${
                  isKo ? 'font-kr' : ''
                }`}
                style={!isKo ? { fontVariationSettings: '"SOFT" 80' } : undefined}
              >
                {t.result.learn.heading}
              </h3>
              <p
                className={`mt-1 text-sm text-ink-muted ${
                  isKo ? 'font-kr' : 'font-mono'
                }`}
              >
                {youtube.isFetching && !liveSuggestions
                  ? t.result.learn.loading
                  : t.result.learn.subheading}
              </p>
              {usingLive && youtube.data?.topic && (
                <p
                  className={`mt-2 eyebrow eyebrow-gold ${
                    isKo ? 'font-kr tracking-normal text-[12px]' : ''
                  }`}
                >
                  {t.result.learn.topicPrefix}: {youtube.data.topic}
                </p>
              )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {effectiveSuggestions.map((s, i) => {
                const angleLabel =
                  t.result.learn.angleLabels[s.angle] ?? s.angle
                const href = buildYoutubeSearchUrl(s.query)
                return (
                  <motion.a
                    key={`${s.angle}-${i}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group lab-card-raised p-4 sm:p-5 flex flex-col gap-3 hover:border-gold transition-colors"
                    whileHover={{ y: -3 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="eyebrow eyebrow-gold">
                        0{i + 1} · {angleLabel}
                      </span>
                      <Play
                        className="w-3.5 h-3.5 text-ink-muted group-hover:text-gold transition-colors"
                        strokeWidth={1.75}
                        fill="currentColor"
                      />
                    </div>
                    <p
                      className={`text-sm leading-relaxed text-ink-text line-clamp-3 ${
                        isKo ? 'font-kr' : 'font-mono'
                      }`}
                    >
                      {s.query}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-ink-rule pt-3">
                      <span className="eyebrow text-ink-muted group-hover:text-gold transition-colors">
                        {t.result.learn.cardCta}
                      </span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 text-ink-muted group-hover:text-gold transition-colors"
                        strokeWidth={1.75}
                      />
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </motion.section>
        )}

        <motion.footer
          className="mt-10 pt-6 border-t border-ink-rule flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            type="button"
            onClick={handleRetry}
            className="lab-button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{t.result.retry}</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleNewQuestion}
            className="lab-button lab-button-primary"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <Shuffle className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{t.result.newQuestion}</span>
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </motion.button>
        </motion.footer>
      </div>
    </motion.section>
  )
}

export default GradeResult
