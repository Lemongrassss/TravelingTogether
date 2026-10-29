import { ConfigProvider } from 'antd'
import ru from 'antd/locale/ru_RU'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import './index.css'

dayjs.locale('ru')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={ru} theme={{ token: { colorPrimary: '#0f766e' } }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
