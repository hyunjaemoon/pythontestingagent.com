import { useQuery } from '@tanstack/react-query'
import { fetchYoutubeSuggestions, YoutubeSuggestionsResponse } from '../services/api'
import { Lang } from '../i18n/translations'

export const useYoutubeSuggestions = (question: string | undefined, lang: Lang) => {
  return useQuery<YoutubeSuggestionsResponse>({
    queryKey: ['youtube-suggestions', lang, question?.trim()],
    queryFn: () =>
      fetchYoutubeSuggestions({ question: question!.trim(), lang }),
    enabled: !!question?.trim(),
    staleTime: 1000 * 60 * 30, // 30 min — same question shouldn't re-fetch
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
