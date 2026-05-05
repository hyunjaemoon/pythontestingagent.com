import { motion } from 'framer-motion'
import { useServerStatus } from '../hooks/useServerStatus'

const StatusIndicator = () => {
  const { data: status, isLoading } = useServerStatus()

  const isOnline = status?.status === 'healthy'

  const label = isLoading ? 'Checking' : isOnline ? 'Online' : 'Offline'
  const dotColor = isLoading
    ? 'bg-yellow-400'
    : isOnline
    ? 'bg-green-400'
    : 'bg-red-400'

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-secondary-300"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        {isOnline && !isLoading && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-green-400/50"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      <span className="font-medium tracking-wide">{label}</span>
    </div>
  )
}

export default StatusIndicator
