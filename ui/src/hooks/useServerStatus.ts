import { useQuery } from '@tanstack/react-query'
import { checkServerStatus } from '../services/api'

export const useServerStatus = () => {
  return useQuery({
    queryKey: ['serverStatus'],
    queryFn: checkServerStatus,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
    retryDelay: 1000,
  })
}
