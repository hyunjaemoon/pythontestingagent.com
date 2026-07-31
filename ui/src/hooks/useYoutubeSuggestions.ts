import { useQuery } from '@tanstack/react-query'
import {
  fetchYoutubeSuggestions,
  GraderModel,
  YoutubeSuggestionsResponse,
} from '../services/api'
import { Lang } from '../i18n/translations'

export const useYoutubeSuggestions = (
  question: string | undefined,
  lang: Lang,
  model: GraderModel
) => {
  return useQuery<YoutubeSuggestionsResponse>({
    queryKey: ['youtube-suggestions', lang, model, question?.trim()],
    queryFn: () =>
      fetchYoutubeSuggestions({ question: question!.trim(), lang, model }),
    enabled: !!question?.trim(),
    staleTime: 1000 * 60 * 30, // 30 min — same question shouldn't re-fetch
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
