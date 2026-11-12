import { Button, Layout as AntLayout, Space } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'

const { Header, Content } = AntLayout

export default function Layout() {
  const { user, loading, logout } = useAuth()
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <Link to="/" className="logo">
          Попутчики
        </Link>
        <Space wrap>
          {user && <Link to="/trips/new"><Button type="primary">Новая поездка</Button></Link>}
          {!loading && (user ? <>
            <Link to="/profile"><Button>Личный кабинет · {user.name}</Button></Link>
            <Button onClick={() => void logout()}>Выйти</Button>
          </> : <>
            <Link to="/login"><Button>Войти</Button></Link>
            <Link to="/register"><Button>Регистрация</Button></Link>
          </>)}
        </Space>
      </Header>
      <Content className="content">
        <Outlet />
      </Content>
    </AntLayout>
  )
}
