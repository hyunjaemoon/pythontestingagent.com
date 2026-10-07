import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// Grading asks a Gemini model for long-form markdown feedback and routinely
// takes 15-30+ seconds (longer on the Pro grader); match the server's
// gunicorn --timeout 60 ceiling instead of the default 30s budget shared by
// the quick endpoints.
const GRADE_TIMEOUT_MS = 60000

// Grader models the learner can pick between. Must stay in sync with
// GRADER_MODELS in agent.py — the server re-validates and silently falls back
// to the default for anything it doesn't recognize.
export const GRADER_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-pro-preview',
  'gemini-3.5-flash-lite',
] as const

export type GraderModel = (typeof GRADER_MODELS)[number]

export const DEFAULT_GRADER_MODEL: GraderModel = 'gemini-3.8-flash'

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
  model?: GraderModel
}

export interface GradeResponse {
  grade: number
  feedback: string
  model?: string
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
  const response = await api.post<{ grade: GradeResponse }>('/grade', data, {
    timeout: GRADE_TIMEOUT_MS,
  })
  
  // Handle both nested and flat response formats
  if (response.data.grade && typeof response.data.grade === 'object') {
    return {
      grade: response.data.grade.grade || 0,
      feedback: response.data.grade.feedback || 'No feedback provided.',
      model: response.data.grade.model
    }
  }

  return {
    grade: (response.data as any).grade || 0,
    feedback: (response.data as any).feedback || 'No feedback provided.',
    model: (response.data as any).model
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
  model?: GraderModel
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
