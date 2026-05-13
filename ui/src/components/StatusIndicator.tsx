import { motion } from 'framer-motion'
import { useServerStatus } from '../hooks/useServerStatus'
import { useLang } from '../i18n/LanguageContext'

const StatusIndicator = () => {
  const { data: status, isLoading } = useServerStatus()
  const { t } = useLang()

  const isOnline = status?.status === 'healthy'
  const label = isLoading
    ? t.siteNav.status.checking
    : isOnline
    ? t.siteNav.status.online
    : t.siteNav.status.offline

  const dotClass = isLoading
    ? 'bg-amber-300'
    : isOnline
    ? 'bg-mint-glow'
    : 'bg-coral-glow'

  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1.5 border border-ink-rule rounded-[2px] eyebrow"
      role="status"
      aria-live="polite"
    >
      <span className="relative inline-flex h-1.5 w-1.5">
        {isOnline && !isLoading && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-mint-glow/60"
            animate={{ scale: [1, 2], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotClass}`} />
      </span>
      <span className="text-ink-soft">// {label}</span>
    </div>
  )
}

export default StatusIndicator
