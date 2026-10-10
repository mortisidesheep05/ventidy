import { useCallback, useEffect, useState } from 'react'

/**
 * Generic async-fetch hook. Pass a service function reference and its args;
 * re-runs whenever deps change. Designed to work against the real REST API
 * once VITE_API_BASE_URL points at the Express backend.
 */
export function useFetch(fetcher, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(immediate)

  const run = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      run().catch(() => {})
    }
  }, [immediate]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, loading, refetch: run }
}
