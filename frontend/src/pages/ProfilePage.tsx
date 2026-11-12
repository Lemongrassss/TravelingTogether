import { Avatar, Button, Card, Col, Descriptions, Empty, Form, Input, List, Row, Select, Space, Statistic, Tabs, Typography, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useTrips } from '@/app/TripsContext'
import type { Profile } from '@/entities/trip/model'

export default function ProfilePage() {
  const { profile, saveProfile, logout, signedIn, trips } = useTrips()
  const navigate = useNavigate()
  const myTrips = trips.filter((trip) => trip.owner === profile.name)
  const joinedTrips = trips.filter((trip) => trip.joined)
  const myExpenses = joinedTrips.flatMap((trip) => trip.expenses).filter((expense) => expense.who === profile.name)
  const myMessages = joinedTrips.flatMap((trip) => trip.messages).filter((item) => item.who === profile.name).length
  const save = (values: Profile) => {
    saveProfile({ ...values, name: values.name.trim(), email: values.email.trim() })
    message.success('Профиль сохранён')
  }
  const renderTrips = (items: typeof trips, emptyText: string) => items.length ? (
    <List dataSource={items} renderItem={(trip) => <List.Item actions={[
      <Link key="open" to={`/trips/${trip.id}`}>Открыть</Link>,
    ]}>
      <List.Item.Meta title={trip.title} description={`${trip.destination} · ${trip.startDate} — ${trip.endDate}`} />
    </List.Item>} />
  ) : <Empty description={emptyText} />

  if (!signedIn) return <Card style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
    <Typography.Title level={3}>Вы вышли из профиля</Typography.Title>
    <Typography.Paragraph>Чтобы продолжить, войдите снова.</Typography.Paragraph>
    <Link to="/login"><Button type="primary">Перейти ко входу</Button></Link>
  </Card>

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Typography.Title level={2}>Личный кабинет</Typography.Title>
      <Card style={{ marginBottom: 20 }}>
        <Row align="middle" gutter={[20, 16]}>
          <Col><Avatar size={76} style={{ background: '#0f766e', fontSize: 30 }}>{profile.name.charAt(0).toUpperCase()}</Avatar></Col>
          <Col flex="auto">
            <Typography.Title level={3} style={{ margin: 0 }}>{profile.name}</Typography.Title>
            <Typography.Text type="secondary">{profile.email}</Typography.Text>
            <div><Typography.Text>{profile.city || 'Город не указан'}</Typography.Text></div>
          </Col>
          <Col><Space size="small"><Link to="/"><Button>К поездкам</Button></Link>
            <Button danger onClick={() => { logout(); navigate('/login') }}>Выйти из профиля</Button></Space></Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} md={6}><Card><Statistic title="Мои поездки" value={myTrips.length} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Участвую" value={joinedTrips.length} /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Мои расходы" value={myExpenses.reduce((sum, item) => sum + item.amount, 0)} suffix="₽" /></Card></Col>
        <Col xs={12} md={6}><Card><Statistic title="Сообщения" value={myMessages} /></Card></Col>
      </Row>

      <Tabs items={[
        { key: 'profile', label: 'Мои данные', children: <Card>
          <Typography.Title level={4}>Информация о пользователе</Typography.Title>
          <Form layout="vertical" initialValues={profile} onFinish={save}>
            <Row gutter={16}>
              <Col xs={24} md={12}><Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}><Input maxLength={50} /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Проверьте формат email' }]}><Input /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item name="phone" label="Телефон"><Input placeholder="Например, +7 900 000-00-00" /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item name="city" label="Город"><Input placeholder="Ваш город" /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item name="travelStyle" label="Предпочтения в поездках"><Select options={[
                { value: 'Спокойный отдых', label: 'Спокойный отдых' },
                { value: 'Экскурсии и города', label: 'Экскурсии и города' },
                { value: 'Активный отдых', label: 'Активный отдых' },
                { value: 'Походы и природа', label: 'Походы и природа' },
              ]} /></Form.Item></Col>
              <Col span={24}><Form.Item name="about" label="О себе"><Input.TextArea rows={3} maxLength={300} showCount placeholder="Расскажите о себе и о том, какие поездки вам нравятся" /></Form.Item></Col>
            </Row>
            <Button type="primary" htmlType="submit">Сохранить изменения</Button>
          </Form>
          <Descriptions size="small" style={{ marginTop: 24 }} items={[
            { key: 'style', label: 'Стиль путешествий', children: profile.travelStyle || 'Не указан' },
            { key: 'phone', label: 'Телефон', children: profile.phone || 'Не указан' },
          ]} />
        </Card> },
        { key: 'created', label: 'Организую', children: <Card>{renderTrips(myTrips, 'Вы пока не создали поездки')}</Card> },
        { key: 'joined', label: 'Участвую', children: <Card>{renderTrips(joinedTrips, 'Вы пока не присоединились к поездкам')}</Card> },
      ]} />
    </div>
  )
}
