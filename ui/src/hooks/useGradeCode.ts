import { useMutation } from '@tanstack/react-query'
import { gradeCode } from '../services/api'

export const useGradeCode = () => {
  return useMutation({
    mutationFn: gradeCode,
    onError: (error) => {
      console.error('Error grading code:', error)
    },
  })
}
