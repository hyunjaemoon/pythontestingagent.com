import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

const Header = () => {
  const { t, lang } = useLang()
  const isKo = lang === 'ko'

  return (
    <motion.header
      role="banner"
      className="relative pt-12 sm:pt-20 pb-10 sm:pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="paper-grain" aria-hidden />

      <div className="relative grid grid-cols-12 gap-y-6 sm:gap-y-10">
        <motion.div
          className="col-span-12 flex items-center gap-3 eyebrow"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.5 }}
        >
          <span className="eyebrow-gold">●</span>
          <span>{t.header.eyebrow}</span>
          <span className="flex-1 h-px bg-ink-rule" aria-hidden />
          <span className="hidden sm:inline">{t.header.metaLabel}</span>
          <span className="hidden sm:inline text-ink-rule">·</span>
          <span className="hidden sm:inline">{t.header.metaIssue}</span>
        </motion.div>

        <motion.h1
          className="col-span-12 font-display font-light text-ink-pure leading-[0.92] tracking-tightest"
          style={{
            fontVariationSettings: '"SOFT" 60, "WONK" 1',
            fontSize: 'clamp(2.5rem, 9vw, 7rem)',
          }}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block">
            {t.header.titleA}
            <span className="text-gold">.</span>
          </span>
          <span
            className="block"
            style={{ paddingLeft: 'clamp(0.5rem, 7vw, 6rem)' }}
          >
            {t.header.titleB}
            <em
              className="not-italic text-ink-soft"
              style={{ fontStyle: 'italic', fontFamily: 'Fraunces', fontVariationSettings: '"WONK" 1' }}
            >
              {' '}—{' '}
              <span className="italic text-gold-warm">{t.header.titleItalic}</span>
            </em>
          </span>
          <span
            className="block"
            style={{ paddingLeft: 'clamp(1rem, 14vw, 12rem)' }}
          >
            {t.header.titleC}
            <span className="caret" aria-hidden />
          </span>
        </motion.h1>

        <motion.div
          className="col-span-12 grid grid-cols-12 gap-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="col-span-12 md:col-span-7 md:col-start-2">
            <p
              className={`text-ink-soft leading-relaxed text-base sm:text-lg ${
                isKo ? 'font-kr' : 'font-mono'
              }`}
            >
              {t.header.tagline}
            </p>
          </div>
          <div className="hidden md:flex md:col-span-3 md:col-start-10 items-end justify-end">
            <div className="eyebrow text-right">
              <div className="text-gold">↓</div>
              <div className="mt-1">{isKo ? '아래로 스크롤' : 'scroll to grade'}</div>
            </div>
          </div>
        </motion.div>

        <motion.hr
          className="col-span-12 dashed-rule mt-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      <div className="sr-only">
        <h2>Free AI-Powered Python Code Grading Tool</h2>
        <p>Get instant feedback on your Python programming assignments with our advanced AI grading system.</p>
      </div>
    </motion.header>
  )
}

export default Header
