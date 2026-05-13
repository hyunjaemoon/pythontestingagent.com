import { motion } from 'framer-motion'
import SignatureIcon from './SignatureIcon'
import StatusIndicator from './StatusIndicator'
import { useLang } from '../i18n/LanguageContext'

const SiteNav = () => {
  const { lang, setLang, t } = useLang()

  const isEn = lang === 'en'
  const today = new Intl.DateTimeFormat(isEn ? 'en-US' : 'ko-KR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
    .format(new Date())
    .toUpperCase()

  return (
    <nav
      aria-label="Site"
      className="border-b border-ink-rule"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <SignatureIcon />
          <div className="hidden sm:flex items-center gap-3 eyebrow">
            <span>PTA / LAB</span>
            <span className="text-ink-rule">·</span>
            <span>{today}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            role="group"
            aria-label={t.siteNav.langLabel}
            className="flex items-center text-[11px] font-mono uppercase tracking-[0.18em] border border-ink-rule rounded-[2px] overflow-hidden"
          >
            {(['en', 'ko'] as const).map((code) => {
              const active = lang === code
              return (
                <motion.button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={active}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-2.5 py-1.5 transition-colors ${
                    active
                      ? 'text-[#0a0910] bg-gold'
                      : 'text-ink-muted hover:text-ink-text'
                  }`}
                >
                  {code === 'en' ? 'EN' : '한'}
                </motion.button>
              )
            })}
          </div>
          <StatusIndicator />
        </div>
      </div>
    </nav>
  )
}

export default SiteNav
