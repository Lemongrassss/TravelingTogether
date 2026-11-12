import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { API_URL } from '@/shared/api'

export type AuthUser = { id: number; name: string; email: string }
type TokenPair = { access_token: string; refresh_token: string; user: AuthUser }
type AuthData = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const Context = createContext<AuthData | null>(null)
const ACCESS = 'travel-access-token'
const REFRESH = 'travel-refresh-token'

async function errorText(response: Response) {
  const body = await response.json().catch(() => ({}))
  return typeof body.detail === 'string' ? body.detail : 'Не удалось выполнить запрос'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const started = useRef(false)

  const saveTokens = (data: TokenPair) => {
    localStorage.setItem(ACCESS, data.access_token)
    localStorage.setItem(REFRESH, data.refresh_token)
    setUser(data.user)
  }
  const clearTokens = () => {
    localStorage.removeItem(ACCESS)
    localStorage.removeItem(REFRESH)
    setUser(null)
  }
  const refreshAccess = async (): Promise<string | null> => {
    const refresh = localStorage.getItem(REFRESH)
    if (!refresh) return null
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!response.ok) return null
    const data: TokenPair = await response.json()
    saveTokens(data)
    return data.access_token
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    const restore = async () => {
      try {
        let access = localStorage.getItem(ACCESS)
        let response = access ? await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${access}` },
        }) : null
        if (!response?.ok) {
          access = await refreshAccess()
          response = access ? await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${access}` },
          }) : null
        }
        if (response?.ok) setUser(await response.json())
        else clearTokens()
      } catch {
        clearTokens()
      } finally {
        setLoading(false)
      }
    }
    void restore()
  }, [])

  const authenticate = async (path: string, body: object) => {
    const response = await fetch(`${API_URL}/auth/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(await errorText(response))
    saveTokens(await response.json())
  }
  const login = (email: string, password: string) => authenticate('login', { email, password })
  const register = (name: string, email: string, password: string) =>
    authenticate('register', { name, email, password })
  const logout = async () => {
    const refresh = localStorage.getItem(REFRESH)
    try {
      if (refresh) await fetch(`${API_URL}/auth/logout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      })
    } catch {
      // Local session must still be cleared when the API is unreachable.
    } finally {
      clearTokens()
    }
  }

  return <Context.Provider value={{ user, loading, login, register, logout }}>{children}</Context.Provider>
}

export function useAuth() {
  const value = useContext(Context)
  if (!value) throw new Error('useAuth должен использоваться внутри AuthProvider')
  return value
}
