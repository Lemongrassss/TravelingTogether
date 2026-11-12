import { Spin } from 'antd'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />
  return user ? <>{children}</> : <Navigate to="/login" replace />
}
