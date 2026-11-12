import { Alert, Button, Card, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useTrips } from '@/app/TripsContext'

type Values = { email: string; name?: string }

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const { saveProfile } = useTrips()
  const isLogin = mode === 'login'
  const submit = (values: Values) => {
    saveProfile({ email: values.email, name: values.name?.trim() || values.email.split('@')[0] })
    navigate('/profile')
  }

  return (
    <Card title={isLogin ? 'Вход' : 'Регистрация'} style={{ maxWidth: 400, margin: '0 auto' }}>
      <Alert type="info" showIcon message="Демо-режим: данные не проверяются сервером." style={{ marginBottom: 16 }} />
      <Form layout="vertical" onFinish={submit}>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Проверьте формат email' }]}>
          <Input />
        </Form.Item>
        {!isLogin && <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}>
          <Input maxLength={50} />
        </Form.Item>}
        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>{isLogin ? 'Войти' : 'Зарегистрироваться'}</Button>
      </Form>
      <p style={{ marginTop: 16 }}>{isLogin ? <>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></> : <>Уже есть аккаунт? <Link to="/login">Войти</Link></>}</p>
    </Card>
  )
}
