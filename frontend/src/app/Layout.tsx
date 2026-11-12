import { Button, Layout as AntLayout, Space } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import { useTrips } from '@/app/TripsContext'

const { Header, Content } = AntLayout

export default function Layout() {
  const { profile, signedIn } = useTrips()
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <Link to="/" className="logo">
          Попутчики
        </Link>
        <Space wrap>
          <Link to="/trips/new">
            <Button type="primary">Новая поездка</Button>
          </Link>
          {signedIn ? <Link to="/profile"><Button>Личный кабинет · {profile.name}</Button></Link> : <>
            <Link to="/login"><Button>Войти</Button></Link>
            <Link to="/register"><Button>Регистрация</Button></Link>
          </>}
        </Space>
      </Header>
      <Content className="content">
        <Outlet />
      </Content>
    </AntLayout>
  )
}
