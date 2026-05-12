import { motion } from 'framer-motion'

const SignatureIcon = () => {
  return (
    <motion.a
      href="https://moonai.kr"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit MoonAI — production AI for businesses"
      title="Built by MoonAI"
      className="signature-icon inline-flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden border border-white/10 opacity-70"
      whileHover={{
        opacity: 1,
        rotate: -6,
        scale: 1.05,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
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
