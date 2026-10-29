export const trips = [
  {
    id: 1,
    title: 'Выходные в Карелии',
    destination: 'Карелия',
    dates: '12.12.2026 – 14.12.2026',
    members: 3,
    maxPeople: 5,
    description: 'Едем на машине, ночуем в домиках у озера. Нужны ещё двое попутчиков.',
  },
  {
    id: 2,
    title: 'Неделя в Стамбуле',
    destination: 'Стамбул',
    dates: '03.03.2027 – 10.03.2027',
    members: 1,
    maxPeople: 4,
    description: 'Смотрим город, ходим по музеям и рынкам. Жильё снимем одно на всех.',
  },
  {
    id: 3,
    title: 'Поход по Хибинам',
    destination: 'Хибины',
    dates: '20.07.2027 – 25.07.2027',
    members: 2,
    maxPeople: 6,
    description: 'Пять дней с палатками. Нужен базовый опыт походов.',
  },
]

export const plan = [
  { id: 1, day: '12.12.2026', title: 'Выезд из города', note: 'Встречаемся в 7:00 у вокзала' },
  { id: 2, day: '13.12.2026', title: 'Прогулка к водопаду', note: 'Взять тёплую одежду' },
]

export const expenses = [
  { id: 1, title: 'Аренда домика', amount: 18000, who: 'Анна' },
  { id: 2, title: 'Бензин', amount: 4500, who: 'Иван' },
]

export const messages = [
  { id: 1, who: 'Анна', text: 'Всем привет! Кто берёт палатку?' },
  { id: 2, who: 'Иван', text: 'Я возьму, и ещё печку.' },
]
