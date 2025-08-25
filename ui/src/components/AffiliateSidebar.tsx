import { motion } from 'framer-motion'
import { GraduationCap, Info, ExternalLink } from 'lucide-react'

const AffiliateSidebar = () => {
  const affiliateBooks = [
    {
      title: "Build a Large Language Model (From Scratch)",
      url: "https://www.amazon.com/dp/1633437167?tag=pythontesting-20",
      icon: "🐍"
    },
    {
      title: "Python Crash Course",
      url: "https://www.amazon.com/dp/1718502702?tag=pythontesting-20",
      icon: "🐍"
    },
    {
      title: "Learning Python",
      url: "https://www.amazon.com/dp/1098171306?tag=pythontesting-20",
      icon: "📚"
    },
    {
      title: "Automate the Boring Stuff",
      url: "https://www.amazon.com/dp/1718503407?tag=pythontesting-20",
      icon: "🤖"
    },
    {
      title: "Python for Data Analysis",
      url: "https://www.amazon.com/dp/109810403X?tag=pythontesting-20",
      icon: "📊"
    },
    {
      title: "Fluent Python",
      url: "https://www.amazon.com/dp/1492056359?tag=pythontesting-20",
      icon: "🧠"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <motion.div
      className="w-full flex-shrink-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="glass-card p-6"
        variants={itemVariants}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="flex items-center space-x-3 mb-6"
          variants={itemVariants}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <GraduationCap className="w-7 h-7 text-primary-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">Learning Resources</h3>
        </motion.div>

        <motion.div
          className="flex items-start space-x-2 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          variants={itemVariants}
        >
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-300 italic">
            Please disable AdBlock to see all learning opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
          {affiliateBooks.map((book, index) => (
            <motion.a
              key={book.title}
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white p-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent-500/25 relative overflow-hidden">
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <div className="relative z-10 flex items-center space-x-3">
                  <span className="text-2xl">{book.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm leading-tight">
                      {book.title}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          className="mt-6 pt-4 border-t border-white/10"
          variants={itemVariants}
        >
          <p className="text-xs text-secondary-400 text-center">
            Support this project by purchasing through these affiliate links
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default AffiliateSidebar
