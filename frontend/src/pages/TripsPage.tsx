import { Button, Card, Col, Row, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { trips } from '../shared/demoData'

export default function TripsPage() {
  return (
    <>
      <Typography.Title level={2}>Идеи поездок</Typography.Title>
      <Row gutter={[16, 16]}>
        {trips.map((t) => (
          <Col xs={24} md={12} lg={8} key={t.id}>
            <Card title={t.title} extra={<Tag color="cyan">{t.destination}</Tag>}>
              <p>{t.dates}</p>
              <p>
                Участников: {t.members} из {t.maxPeople}
              </p>
              <Link to={`/trips/${t.id}`}>
                <Button type="primary">Подробнее</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
