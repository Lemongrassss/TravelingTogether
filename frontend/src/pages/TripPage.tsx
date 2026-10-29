import { Button, Input, List, Space, Tabs, Tag, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { expenses, messages, plan, trips } from '../shared/demoData'

export default function TripPage() {
  const { id } = useParams()
  const trip = trips.find((t) => t.id === Number(id))

  if (!trip) return <Typography.Title level={3}>Поездка не найдена</Typography.Title>

  return (
    <>
      <Typography.Title level={2}>{trip.title}</Typography.Title>
      <Space wrap style={{ marginBottom: 16 }}>
        <Tag color="cyan">{trip.destination}</Tag>
        <Tag>{trip.dates}</Tag>
        <Tag>
          Участников: {trip.members} из {trip.maxPeople}
        </Tag>
      </Space>
      <Typography.Paragraph>{trip.description}</Typography.Paragraph>
      <Button type="primary" style={{ marginBottom: 24 }}>
        Присоединиться
      </Button>

      <Tabs
        items={[
          {
            key: 'plan',
            label: 'План',
            children: (
              <List
                dataSource={plan}
                renderItem={(p) => (
                  <List.Item>
                    <List.Item.Meta title={`${p.day}: ${p.title}`} description={p.note} />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'budget',
            label: 'Бюджет',
            children: (
              <List
                dataSource={expenses}
                renderItem={(e) => (
                  <List.Item>
                    {e.title}: {e.amount} ({e.who})
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'chat',
            label: 'Чат',
            children: (
              <>
                <List
                  dataSource={messages}
                  renderItem={(m) => (
                    <List.Item>
                      <b>{m.who}:</b>&nbsp;{m.text}
                    </List.Item>
                  )}
                />
                <Input placeholder="Сообщение" />
              </>
            ),
          },
        ]}
      />
    </>
  )
}
