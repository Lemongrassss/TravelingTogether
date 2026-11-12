export type PlanItem = { id: number; day: string; title: string; note: string }
export type Expense = { id: number; title: string; amount: number; who: string }
export type TripMessage = { id: number; who: string; text: string }

export type Trip = {
  id: number
  title: string
  destination: string
  startDate: string
  endDate: string
  members: number
  maxPeople: number
  description: string
  owner: string
  joined: boolean
  plan: PlanItem[]
  expenses: Expense[]
  messages: TripMessage[]
}

export type Profile = {
  name: string
  email: string
  phone?: string
  city?: string
  about?: string
  travelStyle?: string
}
