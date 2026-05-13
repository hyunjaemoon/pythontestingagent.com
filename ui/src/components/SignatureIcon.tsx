import { motion } from 'framer-motion'

const SignatureIcon = () => {
  return (
    <motion.a
      href="https://moonai.kr"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit MoonAI — production AI for businesses"
      title="Built by MoonAI"
      className="inline-flex items-center justify-center w-8 h-8 rounded-[2px] overflow-hidden border border-ink-rule"
      whileHover={{ scale: 1.06, borderColor: 'rgba(245,197,24,0.8)', rotate: -3 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <img
        src="/portfolio_icon.png"
        alt=""
        className="w-full h-full object-cover"
      />
    </motion.a>
  )
}

export default SignatureIcon
