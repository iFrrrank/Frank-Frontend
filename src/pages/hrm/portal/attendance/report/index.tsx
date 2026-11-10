import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, DatePicker, Row, Space, Typography, message } from 'antd'
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import dayjs, { type Dayjs } from 'dayjs'
import download from '@/utils/download'
import * as AttendanceApi from '@/api/hrm/portal/attendance'
import { formatHrmDays } from '@/pages/hrm/utils/format'
import { checkHrmPortalAccess } from '@/pages/hrm/portal/utils'
import AttendanceCalendar from './AttendanceCalendar'
import AttendanceLeaveList, { type AttendanceLeaveListRef } from './AttendanceLeaveList'

const { Text } = Typography

const HrmPortalAttendanceReportPage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs().startOf('month'))
  const [monthDetail, setMonthDetail] = useState<AttendanceApi.AttendanceMonthDetailVO>()

  const leaveListRef = useRef<AttendanceLeaveListRef>(null)

  const attendanceCycleText = `考勤周期（${selectedMonth.format('MM')}月01日~${selectedMonth.format(
    'MM'
  )}月${selectedMonth.endOf('month').format('DD')}日）`

  const disabledFutureDate = (current: Dayjs) => {
    return current.startOf('month').isAfter(dayjs().startOf('month'))
  }

  const loadData = async (monthDate = selectedMonth) => {
    setLoading(true)
    try {
      const resp = await AttendanceApi.getAttendanceMonthDetail(
        monthDate.year(),
        monthDate.month() + 1
      )
      setMonthDetail(resp.data)
    } finally {
      setLoading(false)
    }
  }

  const handleMonthChange = (date: Dayjs | null) => {
    if (!date) return
    const newMonth = date.startOf('month')
    setSelectedMonth(newMonth)
    loadData(newMonth)
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const resp: any = await AttendanceApi.exportAttendanceMonthDetail(
        selectedMonth.year(),
        selectedMonth.month() + 1
      )
      download.excel(resp, `${selectedMonth.format('YYYY年MM月')}个人考勤日报.xls`)
      message.success('导出成功')
    } catch (err: any) {
      message.error(err?.message || '导出失败')
    } finally {
      setExportLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      const ok = await checkHrmPortalAccess()
      if (!ok) return
      setAccessible(true)
      await Promise.all([loadData(), leaveListRef.current?.refresh()])
    }
    init()
  }, [])

  if (!accessible) {
    return null
  }

  const summaryItems = [
    {
      label: '应出勤天数',
      value: monthDetail?.summary?.attendDays ?? 0,
      unit: '天'
    },
    {
      label: '实际出勤天数',
      value: formatHrmDays(monthDetail?.summary?.actualDays),
      unit: '天'
    },
    {
      label: '迟到',
      value: monthDetail?.summary?.lateCount ?? 0,
      unit: '次'
    },
    {
      label: '早退',
      value: monthDetail?.summary?.earlyCount ?? 0,
      unit: '次'
    },
    {
      label: '缺卡',
      value: monthDetail?.summary?.misscardCount ?? 0,
      unit: '次'
    }
  ]

  return (
    <PageContainer header={{ title: '考勤报表' }}>
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16
          }}
        >
          <Space size={12} align="center">
            <DatePicker
              picker="month"
              format="YYYY年MM月"
              allowClear={false}
              value={selectedMonth}
              disabledDate={disabledFutureDate}
              onChange={handleMonthChange}
            />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {attendanceCycleText}
            </Text>
          </Space>

          <Space size={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => leaveListRef.current?.openCreate()}
            >
              请假申请
            </Button>
            <Button icon={<DownloadOutlined />} loading={exportLoading} onClick={handleExport}>
              导出考勤
            </Button>
          </Space>
        </div>

        <Row
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 6,
            marginBottom: 20
          }}
        >
          {summaryItems.map((item, index) => (
            <Col
              key={item.label}
              xs={12}
              sm={8}
              md={24 / 5}
              style={{
                padding: '16px 20px',
                borderRight: index < summaryItems.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 4 }}>{item.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: '#262626',
                    marginRight: 4
                  }}
                >
                  {item.value}
                </span>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>{item.unit}</span>
              </div>
            </Col>
          ))}
        </Row>

        <AttendanceCalendar
          selectedMonth={selectedMonth}
          loading={loading}
          dailyDetails={monthDetail?.dailyDetails}
        />

        <AttendanceLeaveList ref={leaveListRef} onChanged={loadData} />
      </Card>
    </PageContainer>
  )
}

export default HrmPortalAttendanceReportPage
