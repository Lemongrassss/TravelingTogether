import type { Trip } from '@/entities/trip/model'

export const demoTrips: Trip[] = [
  {
    id: 1,
    title: 'Выходные в Карелии',
    destination: 'Карелия',
    startDate: '2026-12-12',
    endDate: '2026-12-14',
    members: 3,
    maxPeople: 5,
    description: 'Едем на машине, ночуем в домиках у озера. Нужны ещё двое попутчиков.',
    owner: 'Анна',
    joined: true,
    plan: [
      { id: 1, day: '2026-12-12', title: 'Выезд из города', note: 'Встречаемся в 7:00 у вокзала' },
      { id: 2, day: '2026-12-13', title: 'Прогулка к водопаду', note: 'Взять тёплую одежду' },
    ],
    expenses: [
      { id: 1, title: 'Аренда домика', amount: 18000, who: 'Анна' },
      { id: 2, title: 'Бензин', amount: 4500, who: 'Иван' },
    ],
    messages: [
      { id: 1, who: 'Анна', text: 'Всем привет! Кто берёт палатку?' },
      { id: 2, who: 'Иван', text: 'Я возьму, и ещё печку.' },
    ],
  },
  {
    id: 2,
    title: 'Неделя в Стамбуле',
    destination: 'Стамбул',
    startDate: '2027-03-03',
    endDate: '2027-03-10',
    members: 1,
    maxPeople: 4,
    description: 'Смотрим город, ходим по музеям и рынкам. Жильё снимем одно на всех.',
    owner: 'Иван', joined: false, plan: [], expenses: [], messages: [],
  },
  {
    id: 3,
    title: 'Поход по Хибинам',
    destination: 'Хибины',
    startDate: '2027-07-20',
    endDate: '2027-07-25',
    members: 2,
    maxPeople: 6,
    description: 'Пять дней с палатками. Нужен базовый опыт походов.',
    owner: 'Анна', joined: false, plan: [], expenses: [], messages: [],
  },
]
