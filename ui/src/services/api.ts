import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface GradeRequest {
  question: string
  code: string
  lang?: 'en' | 'ko'
}

export interface GradeResponse {
  grade: number
  feedback: string
}

export interface GenerateQuestionRequest {
  topic: string
  lang?: 'en' | 'ko'
}

export interface GenerateQuestionResponse {
  question: string
}

export interface ServerStatusResponse {
  status: string
}

export const gradeCode = async (data: GradeRequest): Promise<GradeResponse> => {
  const response = await api.post<{ grade: GradeResponse }>('/grade', data)
  
  // Handle both nested and flat response formats
  if (response.data.grade && typeof response.data.grade === 'object') {
    return {
      grade: response.data.grade.grade || 0,
      feedback: response.data.grade.feedback || 'No feedback provided.'
    }
  }
  
  return {
    grade: (response.data as any).grade || 0,
    feedback: (response.data as any).feedback || 'No feedback provided.'
  }
}

export const generateQuestion = async (data: GenerateQuestionRequest): Promise<GenerateQuestionResponse> => {
  const response = await api.post<GenerateQuestionResponse>('/generate-question', data)
  return response.data
}

export const checkServerStatus = async (): Promise<ServerStatusResponse> => {
  const response = await api.get<ServerStatusResponse>('/health')
  return response.data
}

export type YoutubeAngle = 'tutorial' | 'concept' | 'walkthrough'

export interface YoutubeSuggestion {
  angle: YoutubeAngle
  query: string
}

export interface YoutubeSuggestionsResponse {
  topic: string
  suggestions: YoutubeSuggestion[]
}

export interface YoutubeSuggestionsRequest {
  question: string
  lang: 'en' | 'ko'
}

export const fetchYoutubeSuggestions = async (
  data: YoutubeSuggestionsRequest
): Promise<YoutubeSuggestionsResponse> => {
  const response = await api.post<YoutubeSuggestionsResponse>(
    '/youtube-suggestions',
    data
  )
  return response.data
}

export default api
