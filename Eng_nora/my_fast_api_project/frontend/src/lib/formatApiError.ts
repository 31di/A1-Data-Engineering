export function formatApiError(error: unknown) {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error

  if (typeof error === 'object') {
    const err = error as {
      status?: unknown
      data?: unknown
      error?: unknown
      message?: unknown
    }

    if (err.status != null) {
      const status = String(err.status)
      const data = err.data
      const fallbackText = typeof err.error === 'string' ? err.error : ''

      if (typeof data === 'string' && data.trim()) return `API error ${status}: ${data}`
      if (
        data &&
        typeof data === 'object' &&
        'detail' in data &&
        typeof (data as { detail?: unknown }).detail === 'string'
      ) {
        return `API error ${status}: ${(data as { detail: string }).detail}`
      }

      return `API error ${status}${fallbackText ? `: ${fallbackText}` : ''}`
    }

    if (typeof err.message === 'string' && err.message.trim()) return err.message
  }

  return 'Unknown error'
}
