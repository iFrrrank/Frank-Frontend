import React, { useCallback, useEffect, useState } from 'react'
import { Button, DatePicker, Form, Radio, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { fmsAccountSetGetAccountSet } from '@/api/fms/config/accountSet'
import { useFmsStore } from '@/pages/fms/store/fms'

export interface FmsReportPeriodQuery {
  startMonth: string
  endMonth: string
  label: string
}

interface FmsReportPeriodBarProps {
  onQuery: (query: FmsReportPeriodQuery) => void
  children?: React.ReactNode
}

const FmsReportPeriodBar: React.FC<FmsReportPeriodBarProps> = ({
  onQuery,
  children
}) => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId

  const [periodType, setPeriodType] = useState<'month' | 'quarter'>('month')
  const [reportMonth, setReportMonth] = useState(dayjs().format('YYYY-MM'))
  const [startMonth, setStartMonth] = useState(dayjs().format('YYYY-MM'))
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'))

  const emitQuery = useCallback(
    (type = periodType, targetMonth = reportMonth) => {
      const month = dayjs(`${targetMonth}-01`)
      if (type === 'month') {
        onQuery({
          startMonth: month.format('YYYY-MM'),
          endMonth: month.format('YYYY-MM'),
          label: month.format('YYYY年MM月')
        })
        return
      }
      const quarter = Math.floor(month.month() / 3) + 1
      const quarterStartMonth = month.month((quarter - 1) * 3)
      onQuery({
        startMonth: quarterStartMonth.format('YYYY-MM'),
        endMonth: quarterStartMonth.add(2, 'month').format('YYYY-MM'),
        label: `${month.year()}年第${quarter}季度`
      })
    },
    [onQuery, periodType, reportMonth]
  )

  useEffect(() => {
    const initializePeriod = async () => {
      if (!accountSetId) return
      const [currentMonthValue, accountSetResp] = await Promise.all([
        fmsStore.loadCurrentMonth(),
        fmsAccountSetGetAccountSet({ id: accountSetId })
      ])
      if (accountSetResp.code === 0 && accountSetResp.data?.startTime) {
        setStartMonth(dayjs(accountSetResp.data.startTime).format('YYYY-MM'))
      }
      const nextCurrentMonth = currentMonthValue || dayjs().format('YYYY-MM')
      setCurrentMonth(nextCurrentMonth)
      setReportMonth(nextCurrentMonth)
      emitQuery(periodType, nextCurrentMonth)
    }
    initializePeriod()
  }, [accountSetId])

  return (
    <Form layout="inline" style={{ rowGap: 16 }}>
      <Form.Item label="报表周期">
        <Radio.Group
          value={periodType}
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => {
            const nextType = e.target.value
            setPeriodType(nextType)
            emitQuery(nextType, reportMonth)
          }}
        >
          <Radio.Button value="month">月报</Radio.Button>
          <Radio.Button value="quarter">季报</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="会计期间">
        <DatePicker
          picker="month"
          allowClear={false}
          placeholder={periodType === 'month' ? '选择月份' : '选择季度内月份'}
          value={dayjs(`${reportMonth}-01`)}
          disabledDate={(date) => {
            const m = date.format('YYYY-MM')
            return m < startMonth || m > currentMonth
          }}
          onChange={(date) => {
            if (date) {
              const nextMonth = date.format('YYYY-MM')
              setReportMonth(nextMonth)
              emitQuery(periodType, nextMonth)
            }
          }}
        />
      </Form.Item>
      <Form.Item>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={() => emitQuery()}>
            刷新
          </Button>
          {children}
        </Space>
      </Form.Item>
    </Form>
  )
}

export default FmsReportPeriodBar
