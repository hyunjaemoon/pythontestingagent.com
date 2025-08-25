import { motion } from 'framer-motion'
import { Wifi, WifiOff, Activity } from 'lucide-react'
import { useServerStatus } from '../hooks/useServerStatus'

const StatusIndicator = () => {
  const { data: status, isLoading } = useServerStatus()

  const isOnline = status?.status === 'healthy'

  return (
    <motion.div
      className="fixed top-6 left-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        className={`glass-card px-4 py-2 flex items-center space-x-3 ${
          isOnline ? 'border-green-500/30' : 'border-red-500/30'
        }`}
        whileHover={{ scale: 1.05 }}
        animate={isOnline ? { 
          boxShadow: ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 30px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.3)']
        } : {}}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.div
          animate={isLoading ? { rotate: 360 } : {}}
          transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          {isLoading ? (
            <Activity className="w-5 h-5 text-yellow-400" />
          ) : isOnline ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-400" />
          )}
        </motion.div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {isLoading ? 'Checking...' : isOnline ? 'Online' : 'Offline'}
          </span>
          <span className="text-xs text-secondary-400">
            Server Status
          </span>
        </div>
        
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isLoading ? 'bg-yellow-400' : isOnline ? 'bg-green-400' : 'bg-red-400'
          }`}
          animate={isOnline && !isLoading ? {
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default StatusIndicator
