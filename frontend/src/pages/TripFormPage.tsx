import { Button, Card, DatePicker, Form, Input, InputNumber, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function TripFormPage() {
  const navigate = useNavigate()

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto' }}>
      <Typography.Title level={3}>Новая поездка</Typography.Title>
      <Form layout="vertical" initialValues={{ max_people: 4 }} onFinish={() => navigate('/')}>
        <Form.Item name="title" label="Название">
          <Input />
        </Form.Item>
        <Form.Item name="destination" label="Куда едем">
          <Input />
        </Form.Item>
        <Form.Item name="dates" label="Даты поездки">
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="max_people" label="Сколько человек нужно">
          <InputNumber min={2} max={50} />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Сохранить
        </Button>
      </Form>
    </Card>
  )
}
