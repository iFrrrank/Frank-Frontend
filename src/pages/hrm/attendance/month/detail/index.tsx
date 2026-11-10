import React, { useEffect, useMemo, useState } from 'react'
import { Card, Descriptions, Radio, Select, Space, Spin, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PageContainer } from '@ant-design/pro-components'
import { useSearchParams } from '@umijs/max'
import dayjs from 'dayjs'
import * as AttendanceStatisticsApi from '@/api/hrm/attendance/statistics'
import {
  EMPLOYEE_STATUS,
  ATTENDANCE_CLOCK_STATUS,
  ATTENDANCE_CLOCK_TYPE
} from '@/utils/constantsValue'
import { formatHrmDateTime, formatHrmDays, formatHrmMoney } from '@/pages/hrm/utils/format'
import { getLeaveTypeOptions, type LeaveTypeOption } from '@/pages/hrm/attendance/utils'

const { Text } = Typography

const dailyStatusOptions = [
  { label: '全部', value: 'all' },
  { label: '实际出勤', value: 'attendance' },
  { label: '迟到', value: 'late' },
  { label: '早退', value: 'early' },
  { label: '旷工', value: 'absenteeism' },
  { label: '缺卡', value: 'misscard' }
]

const weekDayHeaders = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const HrmAttendanceMonthDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const employeeId = Number(searchParams.get('employeeId'))
  const year = Number(searchParams.get('year')) || dayjs().year()
  const month = Number(searchParams.get('month')) || dayjs().month() + 1

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`

  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<API.HrmAttendanceMonthDetailRespVO>()
  const [dailyStatusFilter, setDailyStatusFilter] = useState('all')
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>()
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([])

  useEffect(() => {
    getLeaveTypeOptions().then((opts) => setLeaveTypes(opts || []))
  }, [])

  useEffect(() => {
    if (!employeeId) return

    setLoading(true)
    AttendanceStatisticsApi.getAttendanceMonthDetail({
      employeeId,
      year,
      month
    } as any)
      .then((resp) => setDetail(resp.data))
      .finally(() => setLoading(false))
  }, [employeeId, year, month])

  const dailyDetailMap = useMemo(() => {
    const map = new Map<string, any>()
    for (const item of detail?.dailyDetails || []) {
      if (item.attendanceTime) {
        map.set(dayjs(item.attendanceTime).format('YYYY-MM-DD'), item)
      }
    }
    return map
  }, [detail?.dailyDetails])

  const filteredLeaveList = useMemo(() => {
    return (detail?.leaves || []).filter(
      (item) => !leaveTypeFilter || item.type === leaveTypeFilter
    )
  }, [detail?.leaves, leaveTypeFilter])

  const calendarDays = useMemo(() => {
    const monthStart = dayjs(`${yearMonth}-01`)
    const mondayOffset = (monthStart.day() + 6) % 7
    const calendarStart = monthStart.subtract(mondayOffset, 'day')

    return Array.from({ length: 42 }, (_, index) => {
      const date = calendarStart.add(index, 'day')
      const dateValue = date.format('YYYY-MM-DD')
      return {
        date: dateValue,
        day: date.date(),
        currentMonth: date.format('YYYY-MM') === yearMonth,
        detail: dailyDetailMap.get(dateValue)
      }
    })
  }, [yearMonth, dailyDetailMap])

  const isDailyDetailVisible = (item?: any) => {
    if (!item) return false
    switch (dailyStatusFilter) {
      case 'attendance':
        return item.clockList && item.clockList.length > 0
      case 'late':
        return (item.lateCount || 0) > 0
      case 'early':
        return (item.earlyCount || 0) > 0
      case 'absenteeism':
        return item.absenteeism === true
      case 'misscard':
        return (item.misscardCount || 0) > 0
      default:
        return true
    }
  }

  const getAttendanceResultColor = (result?: string) => {
    if (!result) return 'default'
    if (result === '正常') return 'success'
    if (result.includes('旷工')) return 'error'
    if (result.includes('缺卡') || result.includes('迟到') || result.includes('早退'))
      return 'warning'
    return 'default'
  }

  const getLeaveTypeLabel = (val?: string) => {
    if (!val) return '-'
    const match = leaveTypes.find((item) => item.value === String(val))
    return match ? match.label : String(val)
  }

  const leaveColumns: ColumnsType<any> = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (val) => <Tag color="blue">{getLeaveTypeLabel(val)}</Tag>
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 180,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '时长',
      dataIndex: 'day',
      width: 100,
      render: (val) => `${formatHrmDays(val)} 天`
    },
    {
      title: '事由',
      dataIndex: 'reason',
      minWidth: 180,
      render: (val) => val || '-'
    }
  ]

  const summary = detail?.summary

  return (
    <PageContainer
      header={{
        title: summary ? `${summary.employeeName || ''} - 月度考勤详情` : '月度考勤详情'
      }}
    >
      <Spin spinning={loading}>
        {summary && (
          <Card style={{ marginBottom: 16 }}>
            <Descriptions bordered size="small" column={4}>
              <Descriptions.Item label="员工">{summary.employeeName || '-'}</Descriptions.Item>
              <Descriptions.Item label="工号">{summary.jobNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="部门">{summary.deptName || '-'}</Descriptions.Item>
              <Descriptions.Item label="岗位">{summary.postName || '-'}</Descriptions.Item>
              <Descriptions.Item label="考勤组">
                {summary.attendanceGroupName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="入职时间">
                {formatHrmDateTime(summary.entryTime)}
              </Descriptions.Item>
              <Descriptions.Item label="员工状态">
                {summary.employeeStatus !== undefined ? (
                  <Tag color="green">
                    {(EMPLOYEE_STATUS[summary.employeeStatus]?.text as string) ||
                      summary.employeeStatus}
                  </Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="工作城市">{summary.workCity || '-'}</Descriptions.Item>
              <Descriptions.Item label="月份">{yearMonth}</Descriptions.Item>
              <Descriptions.Item label="应出勤">{summary.attendDays || 0} 天</Descriptions.Item>
              <Descriptions.Item label="实际出勤">
                {formatHrmDays(summary.actualDays)} 天
              </Descriptions.Item>
              <Descriptions.Item label="是否全勤">
                {summary.fullAttendance ? '是' : '否'}
              </Descriptions.Item>
              <Descriptions.Item label="迟到">
                {summary.lateCount || 0} 次 / {summary.lateMinute || 0} 分钟
              </Descriptions.Item>
              <Descriptions.Item label="早退">
                {summary.earlyCount || 0} 次 / {summary.earlyMinute || 0} 分钟
              </Descriptions.Item>
              <Descriptions.Item label="缺卡">{summary.missCardCount || 0} 次</Descriptions.Item>
              <Descriptions.Item label="旷工">
                {formatHrmDays(summary.absenteeismDays)} 天
              </Descriptions.Item>
              <Descriptions.Item label="请假">
                {formatHrmDays(summary.leaveDays)} 天
              </Descriptions.Item>
              <Descriptions.Item label="考勤扣款">
                {formatHrmMoney(summary.attendanceDeductAmount)} 元
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        <Card style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              {dayjs(`${yearMonth}-01`).format('YYYY 年 MM 月')} 每日考勤
            </span>
            <Radio.Group
              value={dailyStatusFilter}
              onChange={(e) => setDailyStatusFilter(e.target.value)}
              buttonStyle="solid"
            >
              {dailyStatusOptions.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div
              style={{
                minWidth: 980,
                border: '1px solid #f0f0f0',
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                {weekDayHeaders.map((head, idx) => (
                  <div
                    key={head}
                    style={{
                      padding: '10px 0',
                      textAlign: 'center',
                      fontWeight: 600,
                      borderRight: idx < 6 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    {head}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)'
                }}
              >
                {calendarDays.map((day, idx) => {
                  const borderRight = (idx + 1) % 7 !== 0 ? '1px solid #f0f0f0' : 'none'
                  const borderBottom = idx < 35 ? '1px solid #f0f0f0' : 'none'
                  const showDetail =
                    day.currentMonth && day.detail && isDailyDetailVisible(day.detail)

                  return (
                    <div
                      key={day.date}
                      style={{
                        minHeight: 140,
                        padding: 8,
                        borderRight,
                        borderBottom,
                        backgroundColor: day.currentMonth ? '#fff' : '#fcfcfc'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 6
                        }}
                      >
                        <span
                          style={{
                            fontWeight: day.currentMonth ? 600 : 400,
                            color: day.currentMonth ? '#262626' : '#bfbfbf'
                          }}
                        >
                          {day.day}
                        </span>
                        {day.detail?.attendanceResult && (
                          <Tag
                            color={getAttendanceResultColor(day.detail.attendanceResult)}
                            bordered={false}
                            style={{ margin: 0, fontSize: 11, padding: '0 4px' }}
                          >
                            {day.detail.attendanceResult}
                          </Tag>
                        )}
                      </div>

                      {showDetail && (
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: '#8c8c8c',
                              marginBottom: 4
                            }}
                          >
                            {day.detail.shiftName || '未排班'}
                          </div>
                          {day.detail.clockList?.map((clock: any, cIdx: number) => (
                            <div
                              key={clock.id || `${clock.clockTime}-${cIdx}`}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: 12,
                                marginBottom: 2
                              }}
                            >
                              <span style={{ color: '#595959' }}>
                                {ATTENDANCE_CLOCK_TYPE[clock.type]?.text || '打卡'}
                              </span>
                              <span style={{ color: '#262626', fontWeight: 500 }}>
                                {clock.clockTime ? dayjs(clock.clockTime).format('HH:mm') : '-'}
                              </span>
                              <span
                                style={{
                                  color: clock.status === 1 ? '#52c41a' : '#ff4d4f'
                                }}
                              >
                                {ATTENDANCE_CLOCK_STATUS[clock.status]?.text || ''}
                              </span>
                            </div>
                          ))}
                          {day.detail.leaveMinutes && day.detail.leaveMinutes > 0 ? (
                            <div style={{ fontSize: 12, color: '#faad14', marginTop: 4 }}>
                              请假 {formatHrmDays(day.detail.leaveDays)} 天
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>

        <Card title="请假记录">
          <div style={{ marginBottom: 16 }}>
            <Select
              placeholder="请选择请假类型"
              value={leaveTypeFilter}
              onChange={setLeaveTypeFilter}
              allowClear
              options={leaveTypes}
              style={{ width: 200 }}
            />
          </div>
          <Table
            rowKey={(r, idx) => r.id || idx}
            dataSource={filteredLeaveList}
            columns={leaveColumns}
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </Spin>
    </PageContainer>
  )
}

export default HrmAttendanceMonthDetailPage