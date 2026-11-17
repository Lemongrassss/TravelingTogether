export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const send = (token?: string) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  let response = await send(localStorage.getItem('travel-access-token') || undefined)
  if (response.status === 401) {
    const refresh = localStorage.getItem('travel-refresh-token')
    if (refresh) {
      const renewed = await fetch(`${API_URL}/auth/refresh`, { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refresh }) })
      if (renewed.ok) {
        const tokens = await renewed.json()
        localStorage.setItem('travel-access-token', tokens.access_token)
        localStorage.setItem('travel-refresh-token', tokens.refresh_token)
        response = await send(tokens.access_token)
      }
    }
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const detail = body.detail
    throw new Error(Array.isArray(detail) ? detail.map((item: { msg: string }) => item.msg).join(', ')
      : detail || `Ошибка запроса (${response.status})`)
  }
  return response.status === 204 ? undefined as T : response.json()
}
