import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, DatePicker, Empty, Form, Input, InputNumber, List, message, Popconfirm, Select, Space, Spin, Tabs, Tag, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useAuth } from '@/app/AuthContext'
import { useTrips } from '@/app/TripsContext'
import { api } from '@/shared/api'

type Plan = { id: number; day: string; title: string; note: string }
type Expense = { id: number; title: string; amount: number; paid_by: number; payer: { name: string } }
type ChatMessage = { id: number; text: string; user: { name: string } }
type PlanValues = { day: Dayjs; title: string; note?: string }
type ExpenseValues = { title: string; amount: number }

export default function TripPage() {
  const { id } = useParams()
  const tripId = Number(id)
  const { trips, loading, error: tripsError, reload, joinTrip, leaveTrip, deleteTrip } = useTrips()
  const { user } = useAuth()
  const navigate = useNavigate()
  const trip = trips.find((item) => item.id === tripId)
  const [plan, setPlan] = useState<Plan[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState('')
  const [chatText, setChatText] = useState('')
  const [planQuery, setPlanQuery] = useState('')
  const [planDay, setPlanDay] = useState('all')
  const [expenseQuery, setExpenseQuery] = useState('')
  const [payer, setPayer] = useState('all')
  const [chatQuery, setChatQuery] = useState('')
  const isOwner = Boolean(user && trip?.ownerId === user.id)
  const isJoined = Boolean(user && trip?.memberIds?.includes(user.id))

  const loadDetails = useCallback(async () => {
    if (!trip || !isJoined) { setError(''); setPlan([]); setExpenses([]); setChat([]); return }
    setError('')
    setDetailsLoading(true)
    try {
      const [p, e, c] = await Promise.all([
        api<Plan[]>(`/trips/${tripId}/plan`), api<Expense[]>(`/trips/${tripId}/expenses`), api<ChatMessage[]>(`/trips/${tripId}/messages`),
      ])
      setPlan(p); setExpenses(e); setChat(c)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Не удалось загрузить данные поездки') }
    finally { setDetailsLoading(false) }
  }, [tripId, Boolean(trip), isJoined])
  useEffect(() => { void loadDetails() }, [loadDetails])

  const act = async (work: () => Promise<unknown>) => {
    try { await work(); await loadDetails(); await reload() }
    catch (reason) { message.error(reason instanceof Error ? reason.message : 'Не удалось выполнить действие') }
  }
  const addPlan = (values: PlanValues) => act(() => api(`/trips/${tripId}/plan`, { method: 'POST', body: JSON.stringify({
    day: values.day.format('YYYY-MM-DD'), title: values.title.trim(), note: values.note?.trim() || '',
  }) }))
  const addExpense = (values: ExpenseValues) => act(() => api(`/trips/${tripId}/expenses`, { method: 'POST', body: JSON.stringify(values) }))
  const sendMessage = () => {
    if (!chatText.trim()) return
    void act(() => api(`/trips/${tripId}/messages`, { method: 'POST', body: JSON.stringify({ text: chatText.trim() }) }))
    setChatText('')
  }
  const visiblePlan = useMemo(() => plan.filter((item) =>
    `${item.title} ${item.note}`.toLowerCase().includes(planQuery.toLowerCase()) && (planDay === 'all' || item.day === planDay)), [plan, planQuery, planDay])
  const payers = Array.from(new Set(expenses.map((item) => item.payer.name)))
  const visibleExpenses = expenses.filter((item) => item.title.toLowerCase().includes(expenseQuery.toLowerCase()) && (payer === 'all' || payer === item.payer.name))
  const visibleMessages = chat.filter((item) => `${item.user.name} ${item.text}`.toLowerCase().includes(chatQuery.toLowerCase()))

  if (loading && !trip) return <Spin style={{ display: 'block', margin: 60 }} />
  if (!trip) return <Alert type="error" showIcon message={tripsError || 'Поездка не найдена'} action={<Button onClick={() => void reload()}>Повторить</Button>} />
  const privateNotice = !isJoined ? <Alert type="info" showIcon message="План, бюджет и чат доступны участникам поездки." />
    : detailsLoading ? <Spin style={{ display: 'block', margin: 20 }} /> : null

  return <div className="fade-in">
    <Typography.Title level={2}>{trip.title}</Typography.Title>
    <Space wrap style={{ marginBottom: 16 }}><Tag color="cyan">{trip.destination}</Tag><Tag>{trip.startDate} — {trip.endDate}</Tag>
      <Tag>Участников: {trip.members} из {trip.maxPeople}</Tag><Tag>Организатор: {trip.owner}</Tag></Space>
    <Typography.Paragraph>{trip.description}</Typography.Paragraph>
    {error && <Alert type="error" showIcon message={error} action={<Button onClick={() => void loadDetails()}>Повторить</Button>} style={{ marginBottom: 12 }} />}
    <Space style={{ marginBottom: 20 }}>
      {isOwner ? <><Tag color="green">Вы организатор</Tag><Link to={`/trips/${trip.id}/edit`}><Button>Редактировать</Button></Link>
        <Popconfirm title="Удалить поездку?" okText="Удалить" cancelText="Отмена" okButtonProps={{ danger: true }}
          onConfirm={() => void act(async () => { await deleteTrip(trip.id); navigate('/') })}><Button danger>Удалить поездку</Button></Popconfirm></>
        : isJoined ? <Button danger onClick={() => void act(() => leaveTrip(trip.id))}>Выйти из поездки</Button>
          : user ? <Button type="primary" onClick={() => void act(() => joinTrip(trip.id))}>Присоединиться</Button>
            : <Link to="/login"><Button type="primary">Войти, чтобы участвовать</Button></Link>}
    </Space>
    <Tabs items={[
      { key: 'plan', label: 'План', children: <>
        {privateNotice}<Space wrap style={{ margin: '16px 0' }}><Input.Search allowClear placeholder="Поиск в плане" value={planQuery} onChange={(e) => setPlanQuery(e.target.value)} style={{ width: 240 }} />
          <Select value={planDay} onChange={setPlanDay} style={{ width: 180 }} options={[{ value: 'all', label: 'Все дни' }, ...Array.from(new Set(plan.map((x) => x.day))).map((day) => ({ value: day, label: day }))]} /></Space>
        {isJoined && (visiblePlan.length ? <List dataSource={visiblePlan} renderItem={(item) => <List.Item actions={[
          <Button key="edit" onClick={() => { const title = window.prompt('Название пункта', item.title); if (title) void act(() => api(`/trips/${tripId}/plan/${item.id}`, { method: 'PUT', body: JSON.stringify({ day: item.day, title, note: item.note }) })) }}>Изменить</Button>,
          <Popconfirm key="del" title="Удалить пункт?" onConfirm={() => void act(() => api(`/trips/${tripId}/plan/${item.id}`, { method: 'DELETE' }))}><Button danger>Удалить</Button></Popconfirm>,
        ]}><List.Item.Meta title={`${item.day}: ${item.title}`} description={item.note} /></List.Item>} /> : <Empty description={plan.length ? 'По фильтрам ничего не найдено' : 'План пока пуст'} />)}
        {isJoined && <Form layout="inline" onFinish={addPlan} style={{ marginTop: 16 }}><Form.Item name="day" rules={[{ required: true }]}><DatePicker placeholder="День" /></Form.Item>
          <Form.Item name="title" rules={[{ required: true, min: 2 }]}><Input placeholder="Что делаем?" /></Form.Item><Form.Item name="note"><Input placeholder="Примечание" /></Form.Item><Button htmlType="submit" type="primary">Добавить</Button></Form>}
      </> },
      { key: 'budget', label: 'Бюджет', children: <>
        {privateNotice}<Space wrap style={{ margin: '16px 0' }}><Input.Search allowClear placeholder="Поиск расхода" value={expenseQuery} onChange={(e) => setExpenseQuery(e.target.value)} style={{ width: 240 }} />
          <Select value={payer} onChange={setPayer} style={{ width: 180 }} options={[{ value: 'all', label: 'Все участники' }, ...payers.map((name) => ({ value: name, label: name }))]} /></Space>
        {isJoined && (visibleExpenses.length ? <><List dataSource={visibleExpenses} renderItem={(item) => <List.Item actions={item.paid_by === user?.id ? [
          <Button key="edit" onClick={() => { const amount = window.prompt('Новая сумма', String(item.amount)); if (amount && Number(amount) > 0) void act(() => api(`/trips/${tripId}/expenses/${item.id}`, { method: 'PUT', body: JSON.stringify({ title: item.title, amount: Number(amount) }) })) }}>Изменить</Button>,
          <Popconfirm key="del" title="Удалить расход?" onConfirm={() => void act(() => api(`/trips/${tripId}/expenses/${item.id}`, { method: 'DELETE' }))}><Button danger>Удалить</Button></Popconfirm>,
        ] : []}>{item.title}: {item.amount.toLocaleString('ru-RU')} ₽ — {item.payer.name}</List.Item>} />
          <Typography.Text strong>Всего: {expenses.reduce((sum, item) => sum + item.amount, 0).toLocaleString('ru-RU')} ₽</Typography.Text></> : <Empty description={expenses.length ? 'По фильтрам ничего не найдено' : 'Расходов пока нет'} />)}
        {isJoined && <Form layout="inline" onFinish={addExpense} style={{ marginTop: 16 }}><Form.Item name="title" rules={[{ required: true, min: 2 }]}><Input placeholder="На что потратили" /></Form.Item>
          <Form.Item name="amount" rules={[{ required: true }]}><InputNumber min={1} placeholder="Сумма, ₽" /></Form.Item><Button htmlType="submit" type="primary">Добавить</Button></Form>}
      </> },
      { key: 'chat', label: 'Чат', children: <>
        {privateNotice}<Input.Search allowClear placeholder="Поиск по автору или сообщению" value={chatQuery} onChange={(e) => setChatQuery(e.target.value)} style={{ maxWidth: 360, margin: '16px 0' }} />
        {isJoined && (visibleMessages.length ? <List dataSource={visibleMessages} renderItem={(item) => <List.Item><b>{item.user.name}:</b>&nbsp;{item.text}</List.Item>} /> : <Empty description={chat.length ? 'По фильтрам ничего не найдено' : 'Сообщений пока нет'} />)}
        {isJoined && <Space.Compact style={{ width: '100%', marginTop: 12 }}><Input value={chatText} maxLength={500} placeholder="Сообщение" onChange={(e) => setChatText(e.target.value)} onPressEnter={sendMessage} /><Button type="primary" onClick={sendMessage}>Отправить</Button></Space.Compact>}
      </> },
    ]} />
  </div>
}
