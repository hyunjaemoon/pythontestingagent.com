import { useMutation } from '@tanstack/react-query'
import { generateQuestion } from '../services/api'

export const useGenerateQuestion = () => {
  return useMutation({
    mutationFn: generateQuestion,
    onError: (error) => {
      console.error('Error generating question:', error)
    },
  })
}
