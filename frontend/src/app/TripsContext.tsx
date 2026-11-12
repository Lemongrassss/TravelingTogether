import { createContext, useContext, useEffect, useState } from 'react'
import { demoTrips } from '@/entities/trip/demoData'
import type { Profile, Trip } from '@/entities/trip/model'

type AppData = {
  trips: Trip[]
  profile: Profile
  signedIn: boolean
  saveProfile: (profile: Profile) => void
  logout: () => void
  addTrip: (trip: Omit<Trip, 'id' | 'members' | 'joined' | 'plan' | 'expenses' | 'messages'>) => number
  updateTrip: (id: number, update: (trip: Trip) => Trip) => void
  deleteTrip: (id: number) => void
}

const Context = createContext<AppData | null>(null)
const initialProfile: Profile = {
  name: 'Анна', email: 'anna@example.com', phone: '', city: '', about: '', travelStyle: 'Спокойный отдых',
}

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem('travel-trips')
      return saved ? JSON.parse(saved) as Trip[] : demoTrips
    } catch {
      return demoTrips
    }
  })
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      return JSON.parse(localStorage.getItem('travel-profile') || 'null') || initialProfile
    } catch {
      return initialProfile
    }
  })
  const [signedIn, setSignedIn] = useState(() => localStorage.getItem('travel-signed-in') !== 'false')

  useEffect(() => localStorage.setItem('travel-trips', JSON.stringify(trips)), [trips])
  useEffect(() => localStorage.setItem('travel-profile', JSON.stringify(profile)), [profile])

  const addTrip: AppData['addTrip'] = (trip) => {
    const id = Date.now()
    setTrips((items) => [{ ...trip, id, members: 1, joined: true, plan: [], expenses: [], messages: [] }, ...items])
    return id
  }
  const saveProfile = (next: Profile) => {
    if (next.name !== profile.name) {
      setTrips((items) => items.map((trip) => ({
        ...trip,
        owner: trip.owner === profile.name ? next.name : trip.owner,
        expenses: trip.expenses.map((item) => ({ ...item, who: item.who === profile.name ? next.name : item.who })),
        messages: trip.messages.map((item) => ({ ...item, who: item.who === profile.name ? next.name : item.who })),
      })))
    }
    setProfile(next)
    setSignedIn(true)
    localStorage.setItem('travel-signed-in', 'true')
  }
  const logout = () => {
    setProfile({ name: 'Гость', email: '' })
    setSignedIn(false)
    localStorage.setItem('travel-signed-in', 'false')
  }

  return (
    <Context.Provider value={{ trips, profile, signedIn, saveProfile, logout, addTrip,
      updateTrip: (id, update) => setTrips((items) => items.map((trip) => trip.id === id ? update(trip) : trip)),
      deleteTrip: (id) => setTrips((items) => items.filter((trip) => trip.id !== id)) }}>
      {children}
    </Context.Provider>
  )
}

export function useTrips() {
  const value = useContext(Context)
  if (!value) throw new Error('useTrips должен использоваться внутри TripsProvider')
  return value
}
