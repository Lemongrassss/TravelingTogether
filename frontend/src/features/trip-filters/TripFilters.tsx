import { Input, Select, Space } from 'antd'

type Props = {
  query: string
  owner: string
  setQuery: (value: string) => void
  setOwner: (value: string) => void
}

export default function TripFilters({ query, owner, setQuery, setOwner }: Props) {
  return (
    <Space wrap style={{ marginBottom: 20 }}>
      <Input.Search allowClear placeholder="Поиск по поездкам" value={query}
        onChange={(event) => setQuery(event.target.value)} style={{ width: 260 }} />
      <Select value={owner} onChange={setOwner} style={{ width: 160 }} options={[
        { value: 'all', label: 'Все поездки' },
        { value: 'mine', label: 'Мои поездки' },
      ]} />
    </Space>
  )
}
