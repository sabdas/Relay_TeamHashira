import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(
  fetchFn: () => Promise<{ data: T }>,
  deps: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      setData(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}

export function useMutation<TInput, TOutput>(
  mutateFn: (input: TInput) => Promise<{ data: TOutput }>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (input: TInput): Promise<TOutput | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await mutateFn(input)
        return res.data
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail || err.message)
        } else {
          setError('An unexpected error occurred')
        }
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [mutateFn]
  )

  return { mutate, isLoading, error }
}
