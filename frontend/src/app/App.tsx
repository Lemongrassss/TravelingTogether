import { Route, Routes } from 'react-router-dom'
import AuthPage from '@/pages/AuthPage'
import ProfilePage from '@/pages/ProfilePage'
import TripFormPage from '@/pages/TripFormPage'
import TripPage from '@/pages/TripPage'
import TripsPage from '@/pages/TripsPage'
import Layout from '@/app/Layout'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TripsPage />} />
        <Route path="/trips/new" element={<TripFormPage />} />
        <Route path="/trips/:id" element={<TripPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Route>
    </Routes>
  )
}
