import type { Dayjs } from 'dayjs'
import { Alert, Button, Card, DatePicker, Form, Input, InputNumber, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTrips } from '@/app/TripsContext'
import dayjs from 'dayjs'

type FormValues = { title: string; destination: string; dates: [Dayjs, Dayjs]; max_people: number; description?: string }

export default function TripFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addTrip, updateTrip, trips } = useTrips()
  const [form] = Form.useForm<FormValues>()
  const [error, setError] = useState('')
  const trip = trips.find((item) => item.id === Number(id))
  useEffect(() => { if (trip) form.setFieldsValue({ title: trip.title, destination: trip.destination,
    dates: [dayjs(trip.startDate), dayjs(trip.endDate)], max_people: trip.maxPeople, description: trip.description }) }, [trip, form])
  const save = async (values: FormValues) => {
    const data = { title: values.title.trim(), destination: values.destination.trim(),
      start_date: values.dates[0].format('YYYY-MM-DD'), end_date: values.dates[1].format('YYYY-MM-DD'),
      max_people: values.max_people, description: values.description?.trim() || '' }
    try {
      if (id) { await updateTrip(Number(id), data); navigate(`/trips/${id}`) }
      else { const newId = await addTrip(data); navigate(`/trips/${newId}`) }
    } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось сохранить поездку') }
  }

  return (
    <Card className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Typography.Title level={3}>{id ? 'Редактировать поездку' : 'Новая поездка'}</Typography.Title>
      {error && <Alert type="error" showIcon message={error} />}
      <Form form={form} layout="vertical" initialValues={{ max_people: 4 }} onFinish={save}>
        <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }, { min: 3, message: 'Минимум 3 символа' }]}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item name="destination" label="Куда едем" rules={[{ required: true, message: 'Укажите направление' }, { min: 2, message: 'Минимум 2 символа' }]}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item name="dates" label="Даты поездки" rules={[{ required: true, message: 'Выберите даты поездки' }]}>
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="max_people" label="Сколько человек нужно" rules={[{ required: true, message: 'Укажите число участников' }]}>
          <InputNumber min={2} max={50} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="description" label="Описание" rules={[{ max: 1000, message: 'Максимум 1000 символов' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Сохранить</Button>
      </Form>
    </Card>
  )
}
