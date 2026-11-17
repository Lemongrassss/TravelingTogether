import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '@/shared/api'
import { useAuth } from '@/app/AuthContext'
import type { Profile, Trip } from '@/entities/trip/model'

type TripInput = { title: string; destination: string; description: string; start_date: string; end_date: string; max_people: number }
type MemberDto = { user: { id: number; name: string } }
type TripDto = TripInput & { id: number; owner_id: number; members: MemberDto[] }
type AppData = {
  trips: Trip[]; profile: Profile; loading: boolean; error: string
  reload: () => Promise<void>; saveProfile: (profile: Profile) => void
  addTrip: (trip: TripInput) => Promise<number>; updateTrip: (id: number, trip: TripInput) => Promise<void>
  deleteTrip: (id: number) => Promise<void>; joinTrip: (id: number) => Promise<void>; leaveTrip: (id: number) => Promise<void>
}
const Context = createContext<AppData | null>(null)
const emptyProfile: Profile = { name: '', email: '', phone: '', city: '', about: '', travelStyle: '' }

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<Profile>(() => {
    try { return JSON.parse(localStorage.getItem('travel-profile') || 'null') || emptyProfile }
    catch { return emptyProfile }
  })
  const reload = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const data = await api<TripDto[]>('/trips')
      setTrips(data.map((item) => ({ id: item.id, title: item.title, destination: item.destination,
        startDate: item.start_date, endDate: item.end_date, maxPeople: item.max_people,
        description: item.description || '', ownerId: item.owner_id,
        owner: item.members.find((member) => member.user.id === item.owner_id)?.user.name || 'Организатор',
        memberIds: item.members.map((member) => member.user.id), members: item.members.length,
        joined: item.members.some((member) => member.user.id === user?.id), plan: [], expenses: [], messages: [] })))
    } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось загрузить поездки') }
    finally { setLoading(false) }
  }, [user?.id])
  useEffect(() => { if (!authLoading) void reload() }, [authLoading, reload])
  const saveProfile = (next: Profile) => { setProfile(next); localStorage.setItem('travel-profile', JSON.stringify(next)) }
  const addTrip = async (trip: TripInput) => { const result = await api<{ id: number }>('/trips', { method: 'POST', body: JSON.stringify(trip) }); await reload(); return result.id }
  const updateTrip = async (id: number, trip: TripInput) => { await api(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(trip) }); await reload() }
  const deleteTrip = async (id: number) => { await api(`/trips/${id}`, { method: 'DELETE' }); await reload() }
  const joinTrip = async (id: number) => { await api(`/trips/${id}/join`, { method: 'POST' }); await reload() }
  const leaveTrip = async (id: number) => { await api(`/trips/${id}/leave`, { method: 'DELETE' }); await reload() }
  return <Context.Provider value={{ trips, profile, loading, error, reload, saveProfile, addTrip, updateTrip, deleteTrip, joinTrip, leaveTrip }}>{children}</Context.Provider>
}
export function useTrips() {
  const value = useContext(Context)
  if (!value) throw new Error('useTrips должен использоваться внутри TripsProvider')
  return value
}
