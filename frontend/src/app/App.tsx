import { Route, Routes } from 'react-router-dom'
import AuthPage from '@/pages/AuthPage'
import ProfilePage from '@/pages/ProfilePage'
import TripFormPage from '@/pages/TripFormPage'
import TripPage from '@/pages/TripPage'
import TripsPage from '@/pages/TripsPage'
import Layout from '@/app/Layout'
import RequireAuth from '@/features/auth/RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TripsPage />} />
        <Route path="/trips/new" element={<RequireAuth><TripFormPage /></RequireAuth>} />
        <Route path="/trips/:id" element={<TripPage />} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Route>
    </Routes>
  )
}
