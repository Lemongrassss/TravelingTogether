import { useMemo, useState } from 'react'
import { Button, Card, Col, Empty, Row, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import TripFilters from '@/features/trip-filters/TripFilters'
import { useTrips } from '@/app/TripsContext'

export default function TripsPage() {
  const { trips, profile } = useTrips()
  const [query, setQuery] = useState('')
  const [owner, setOwner] = useState('all')
  const visibleTrips = useMemo(() => trips.filter((trip) => {
    const matchesText = `${trip.title} ${trip.destination}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (owner === 'all' || trip.owner === profile.name)
  }), [trips, query, owner, profile.name])

  return (
    <>
      <Typography.Title level={2}>Идеи поездок</Typography.Title>
      <TripFilters query={query} owner={owner} setQuery={setQuery} setOwner={setOwner} />
      {visibleTrips.length === 0 ? <Empty description="Поездки не найдены" /> : (
        <Row gutter={[16, 16]}>
          {visibleTrips.map((trip) => (
            <Col xs={24} md={12} lg={8} key={trip.id}>
              <Card title={trip.title} extra={<Tag color="cyan">{trip.destination}</Tag>}>
                <p>{trip.startDate} — {trip.endDate}</p>
                <p>Организатор: {trip.owner}</p>
                <p>Участников: {trip.members} из {trip.maxPeople}</p>
                <Link to={`/trips/${trip.id}`}><Button type="primary">Подробнее</Button></Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
