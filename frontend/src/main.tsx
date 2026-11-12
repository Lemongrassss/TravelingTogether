import { ConfigProvider } from 'antd'
import ru from 'antd/locale/ru_RU'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import { AuthProvider } from '@/app/AuthContext'
import { TripsProvider } from '@/app/TripsContext'
import '@/index.css'

dayjs.locale('ru')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={ru} theme={{ token: { colorPrimary: '#0f766e' } }}>
      <BrowserRouter>
        <TripsProvider><AuthProvider><App /></AuthProvider></TripsProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
