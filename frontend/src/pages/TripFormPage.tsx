import type { Dayjs } from 'dayjs'
import { Button, Card, DatePicker, Form, Input, InputNumber, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '@/app/TripsContext'

type FormValues = { title: string; destination: string; dates: [Dayjs, Dayjs]; max_people: number; description?: string }

export default function TripFormPage() {
  const navigate = useNavigate()
  const { addTrip, profile } = useTrips()
  const save = (values: FormValues) => {
    const id = addTrip({
      title: values.title.trim(), destination: values.destination.trim(),
      startDate: values.dates[0].format('YYYY-MM-DD'), endDate: values.dates[1].format('YYYY-MM-DD'),
      maxPeople: values.max_people, description: values.description?.trim() || '', owner: profile.name,
    })
    navigate(`/trips/${id}`)
  }

  return (
    <Card className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Typography.Title level={3}>Новая поездка</Typography.Title>
      <Form layout="vertical" initialValues={{ max_people: 4 }} onFinish={save}>
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
