import React, { useEffect, useState } from 'react'
import { Button, Card, Space, Spin, Typography, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import { getMonthRecord } from '@/api/hrm/salary/monthRecord'
import { HrmSalaryMonthStatus } from '../../constants'
import SalaryMonthRecordDetailsInfo from './SalaryMonthRecordDetailsInfo'
import SalaryMonthEmployeeRecordList from './SalaryMonthEmployeeRecordList'

const SalaryMonthRecordDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const idStr = searchParams.get('id')
  const recordId = idStr ? Number(idStr) : undefined

  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<API.HrmSalaryMonthRecordRespVO>()

  useEffect(() => {
    if (!recordId) {
      message.warning('参数错误，工资表编号不能为空')
      history.back()
      return
    }

    setLoading(true)
    getMonthRecord({ id: recordId })
      .then((resp) => {
        const data = resp.data
        if (!data || data.status !== HrmSalaryMonthStatus.HISTORY) {
          message.warning('历史工资表不存在')
          history.back()
          return
        }
        setRecord(data)
      })
      .finally(() => setLoading(false))
  }, [recordId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card bodyStyle={{ padding: '12px 24px' }}>
        <Space size="middle">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()} />
          <Typography.Title level={4} style={{ margin: 0 }}>
            {record?.title || '历史工资表详情'}
          </Typography.Title>
        </Space>
      </Card>

      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SalaryMonthRecordDetailsInfo record={record} loading={loading} />
          {record?.id && <SalaryMonthEmployeeRecordList record={record} />}
        </div>
      </Spin>
    </div>
  )
}

export default SalaryMonthRecordDetailPage
