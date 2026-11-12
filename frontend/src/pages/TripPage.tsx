import { useState } from 'react'
import { Alert, Button, DatePicker, Empty, Form, Input, InputNumber, List, message, Popconfirm, Select, Space, Tabs, Tag, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'
import { useTrips } from '@/app/TripsContext'
import type { Trip } from '@/entities/trip/model'

type PlanValues = { day: import('dayjs').Dayjs; title: string; note?: string }
type ExpenseValues = { title: string; amount: number }

export default function TripPage() {
  const { id } = useParams()
  const { trips, profile, updateTrip, deleteTrip } = useTrips()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chatText, setChatText] = useState('')
  const [planQuery, setPlanQuery] = useState('')
  const [planDay, setPlanDay] = useState('all')
  const [expenseQuery, setExpenseQuery] = useState('')
  const [payer, setPayer] = useState('all')
  const [chatQuery, setChatQuery] = useState('')
  const trip = trips.find((item) => item.id === Number(id))

  if (!trip) return <Alert type="error" showIcon message="Поездка не найдена" />

  const change = (update: (current: Trip) => Trip) => updateTrip(trip.id, update)
  const actorName = user?.name || profile.name
  const isOwner = Boolean(user && trip.owner === user.name)
  const isJoined = Boolean(user && (trip.joined || isOwner))
  const join = () => {
    if (isJoined) return
    if (trip.members >= trip.maxPeople) return message.error('Свободных мест нет')
    change((item) => ({ ...item, members: item.members + 1, joined: true }))
  }
  const leave = () => {
    if (!trip.joined || isOwner) return
    change((item) => ({ ...item, members: Math.max(0, item.members - 1), joined: false }))
    message.success('Вы вышли из поездки')
  }
  const addPlan = (values: PlanValues) => change((item) => ({ ...item, plan: [...item.plan, {
    id: Date.now(), day: values.day.format('YYYY-MM-DD'), title: values.title.trim(), note: values.note?.trim() || '',
  }] }))
  const addExpense = (values: ExpenseValues) => change((item) => ({ ...item, expenses: [...item.expenses, {
    id: Date.now(), title: values.title.trim(), amount: values.amount, who: actorName,
  }] }))
  const sendMessage = () => {
    if (!chatText.trim()) return
    change((item) => ({ ...item, messages: [...item.messages, { id: Date.now(), who: actorName, text: chatText.trim() }] }))
    setChatText('')
  }
  const visiblePlan = trip.plan.filter((item) =>
    `${item.title} ${item.note}`.toLowerCase().includes(planQuery.toLowerCase()) &&
    (planDay === 'all' || item.day === planDay))
  const payers = Array.from(new Set(trip.expenses.map((item) => item.who)))
  const visibleExpenses = trip.expenses.filter((item) =>
    item.title.toLowerCase().includes(expenseQuery.toLowerCase()) &&
    (payer === 'all' || item.who === payer))
  const visibleMessages = trip.messages.filter((item) =>
    `${item.who} ${item.text}`.toLowerCase().includes(chatQuery.toLowerCase()))

  return (
    <div className="fade-in">
      <Typography.Title level={2}>{trip.title}</Typography.Title>
      <Space wrap style={{ marginBottom: 16 }}>
        <Tag color="cyan">{trip.destination}</Tag>
        <Tag>{trip.startDate} — {trip.endDate}</Tag>
        <Tag>Участников: {trip.members} из {trip.maxPeople}</Tag>
        <Tag>Организатор: {trip.owner}</Tag>
      </Space>
      <Typography.Paragraph>{trip.description}</Typography.Paragraph>
      <Space style={{ marginBottom: 24 }}>
        {isOwner ? <>
          <Tag color="green">Вы организатор</Tag>
          <Popconfirm title="Удалить поездку?" description="План, расходы и сообщения этой поездки тоже будут удалены."
            okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}
            onConfirm={() => { deleteTrip(trip.id); navigate('/') }}>
            <Button danger>Удалить поездку</Button>
          </Popconfirm>
        </> : isJoined ? <Button danger onClick={leave}>Выйти из поездки</Button>
          : user ? <Button type="primary" onClick={join}>Присоединиться</Button>
            : <Link to="/login"><Button type="primary">Войти, чтобы участвовать</Button></Link>}
      </Space>

      <Tabs items={[
        { key: 'plan', label: 'План', children: <>
          <Space wrap style={{ marginBottom: 16 }}>
            <Input.Search allowClear placeholder="Поиск в плане" value={planQuery}
              onChange={(event) => setPlanQuery(event.target.value)} style={{ width: 240 }} />
            <Select value={planDay} onChange={setPlanDay} style={{ width: 180 }} options={[
              { value: 'all', label: 'Все дни' }, ...Array.from(new Set(trip.plan.map((item) => item.day)))
                .map((day) => ({ value: day, label: day })),
            ]} />
          </Space>
          {visiblePlan.length ? <List dataSource={visiblePlan} renderItem={(item) => <List.Item>
            <List.Item.Meta title={`${item.day}: ${item.title}`} description={item.note} />
          </List.Item>} /> : <Empty description={trip.plan.length ? 'По фильтрам ничего не найдено' : 'План пока пуст'} />}
          {isJoined && <Form layout="inline" onFinish={addPlan} style={{ marginTop: 16 }}>
            <Form.Item name="day" rules={[{ required: true, message: 'Выберите день' }]}><DatePicker placeholder="День" /></Form.Item>
            <Form.Item name="title" rules={[{ required: true, min: 2, message: 'Введите название (от 2 символов)' }]}><Input placeholder="Что делаем?" /></Form.Item>
            <Form.Item name="note"><Input placeholder="Примечание" /></Form.Item>
            <Button htmlType="submit" type="primary">Добавить</Button>
          </Form>}
        </> },
        { key: 'budget', label: 'Бюджет', children: <>
          <Space wrap style={{ marginBottom: 16 }}>
            <Input.Search allowClear placeholder="Поиск расхода" value={expenseQuery}
              onChange={(event) => setExpenseQuery(event.target.value)} style={{ width: 240 }} />
            <Select value={payer} onChange={setPayer} style={{ width: 180 }} options={[
              { value: 'all', label: 'Все участники' }, ...payers.map((name) => ({ value: name, label: name })),
            ]} />
          </Space>
          {visibleExpenses.length ? <>
            <List dataSource={visibleExpenses} renderItem={(item) => <List.Item>
              {item.title}: {item.amount.toLocaleString('ru-RU')} ₽ — {item.who}
            </List.Item>} />
            <Typography.Text strong>Всего: {trip.expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString('ru-RU')} ₽</Typography.Text>
          </> : <Empty description={trip.expenses.length ? 'По фильтрам ничего не найдено' : 'Расходов пока нет'} />}
          {isJoined && <Form layout="inline" onFinish={addExpense} style={{ marginTop: 16 }}>
            <Form.Item name="title" rules={[{ required: true, min: 2, message: 'Введите название траты' }]}><Input placeholder="На что потратили" /></Form.Item>
            <Form.Item name="amount" rules={[{ required: true, message: 'Введите сумму' }]}><InputNumber min={1} placeholder="Сумма, ₽" /></Form.Item>
            <Button htmlType="submit" type="primary">Добавить</Button>
          </Form>}
        </> },
        { key: 'chat', label: 'Чат', children: <>
          <Input.Search allowClear placeholder="Поиск по автору или сообщению" value={chatQuery}
            onChange={(event) => setChatQuery(event.target.value)} style={{ maxWidth: 360, marginBottom: 16 }} />
          {visibleMessages.length ? <List dataSource={visibleMessages} renderItem={(item) => <List.Item>
            <b>{item.who}:</b>&nbsp;{item.text}
          </List.Item>} /> : <Empty description={trip.messages.length ? 'По фильтрам ничего не найдено' : 'Сообщений пока нет'} />}
          {isJoined && <Space.Compact style={{ width: '100%', marginTop: 12 }}>
            <Input value={chatText} maxLength={500} placeholder="Сообщение" onChange={(event) => setChatText(event.target.value)}
              onPressEnter={sendMessage} />
            <Button type="primary" onClick={sendMessage}>Отправить</Button>
          </Space.Compact>}
        </> },
      ]} />
    </div>
  )
}
