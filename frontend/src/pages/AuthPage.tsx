import { useState } from 'react'
import { Button, Card, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'

type Values = { email: string; name?: string; password: string }

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [saving, setSaving] = useState(false)
  const isLogin = mode === 'login'

  const submit = async (values: Values) => {
    setSaving(true)
    try {
      if (isLogin) await login(values.email, values.password)
      else await register(values.name!.trim(), values.email, values.password)
      message.success(isLogin ? 'Вы вошли в аккаунт' : 'Аккаунт создан')
      navigate('/')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Не удалось выполнить вход')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title={isLogin ? 'Вход' : 'Регистрация'} style={{ maxWidth: 400, margin: '0 auto' }}>
      <Form layout="vertical" onFinish={submit}>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Проверьте формат email' }]}>
          <Input autoComplete="email" />
        </Form.Item>
        {!isLogin && <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }, { min: 2, message: 'Минимум 2 символа' }]}>
          <Input maxLength={50} autoComplete="name" />
        </Form.Item>}
        <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, ...(!isLogin ? [{ min: 8, message: 'Минимум 8 символов' }] : [])]}>
          <Input.Password autoComplete={isLogin ? 'current-password' : 'new-password'} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={saving}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Form>
      <p style={{ marginTop: 16 }}>{isLogin ? <>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></> : <>Уже есть аккаунт? <Link to="/login">Войти</Link></>}</p>
    </Card>
  )
}
