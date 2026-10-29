import { Button, Card, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  return (
    <Card title={isLogin ? 'Вход' : 'Регистрация'} style={{ maxWidth: 400, margin: '0 auto' }}>
      <Form layout="vertical" onFinish={() => navigate('/')}>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        {!isLogin && (
          <Form.Item name="name" label="Имя">
            <Input />
          </Form.Item>
        )}
        <Form.Item name="password" label="Пароль">
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Form>

      <p style={{ marginTop: 16 }}>
        {isLogin ? (
          <>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </>
        ) : (
          <>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </>
        )}
      </p>
    </Card>
  )
}
