import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Dot {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

const ParticleBackground = () => {
  const [dots, setDots] = useState<Dot[]>([])

  useEffect(() => {
    const next: Dot[] = []
    for (let i = 0; i < 22; i++) {
      next.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 14,
        duration: Math.random() * 26 + 28,
      })
    }
    setDots(next)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Engineering grid — extremely subtle */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '88px 88px',
          maskImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)',
        }}
      />

      {/* Drifting dots — like dust particles in a study */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-gold/40"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
          }}
          animate={{
            y: [0, -36, 0],
            x: [0, Math.sin(dot.id) * 22, 0],
            opacity: [0.1, 0.45, 0.1],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Faint warm glow top-right */}
      <motion.div
        className="absolute -top-32 -right-32 w-[42rem] h-[42rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(245,197,24,0.10) 0%, rgba(245,197,24,0.02) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Faint indigo glow bottom-left */}
      <motion.div
        className="absolute -bottom-32 -left-32 w-[36rem] h-[36rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(124,140,255,0.10) 0%, rgba(124,140,255,0.02) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Slow scanline */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(245,197,24,0.18), transparent)',
        }}
        initial={{ y: '-10%' }}
        animate={{ y: '110%' }}
        transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export default ParticleBackground
