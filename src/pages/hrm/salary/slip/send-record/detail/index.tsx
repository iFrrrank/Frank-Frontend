import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Spin, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import { getSalarySlipSendRecord } from '@/api/hrm/salary/slipSendRecord'
import { formatHrmYearMonth } from '@/pages/hrm/utils/format'
import SalarySlipList from './SalarySlipList'

const SalarySlipSendRecordDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const idStr = searchParams.get('id')
  const recordId = idStr ? Number(idStr) : undefined

  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<API.HrmSalarySlipSendRecordRespVO>()

  useEffect(() => {
    if (!recordId) return
    setLoading(true)
    getSalarySlipSendRecord({ id: recordId })
      .then((resp) => {
        setRecord(resp.data)
      })
      .finally(() => setLoading(false))
  }, [recordId])

  const title = record
    ? `${formatHrmYearMonth(record.year, record.month)} 工资条发放详情`
    : '工资条发放详情'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bodyStyle={{ padding: '12px 24px' }}>
        <Space size="middle">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
        </Space>
      </Card>

      <Spin spinning={loading}>{recordId && <SalarySlipList sendRecordId={recordId} />}</Spin>
    </div>
  )
}

export default SalarySlipSendRecordDetailPage
