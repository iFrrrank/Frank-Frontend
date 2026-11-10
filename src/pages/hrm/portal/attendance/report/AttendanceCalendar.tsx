import React, { useMemo } from 'react'
import { Badge, Calendar, Card, Space, Spin, Tag, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { HrmAttendanceDailyDetailVO } from '@/api/hrm/portal/attendance'

const { Text } = Typography

export interface AttendanceCalendarProps {
  selectedMonth: Dayjs
  loading: boolean
  dailyDetails?: HrmAttendanceDailyDetailVO[]
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  selectedMonth,
  loading,
  dailyDetails = []
}) => {
  const dailyDetailMap = useMemo(() => {
    const map = new Map<string, HrmAttendanceDailyDetailVO>()
    for (const detail of dailyDetails) {
      if (detail.attendanceTime) {
        map.set(dayjs(detail.attendanceTime).format('YYYY-MM-DD'), detail)
      }
    }
    return map
  }, [dailyDetails])

  const isAbnormal = (detail?: HrmAttendanceDailyDetailVO) => {
    if (!detail) return false
    return (
      (detail.lateCount || 0) > 0 ||
      (detail.earlyCount || 0) > 0 ||
      (detail.misscardCount || 0) > 0 ||
      detail.absenteeism === true
    )
  }

  const getDayBorderColor = (detail?: HrmAttendanceDailyDetailVO) => {
    if (!detail) return 'transparent'
    if (isAbnormal(detail)) return '#ff4d4f'
    if (detail.scheduled === false) return '#bfbfbf'
    return detail.clockList && detail.clockList.length > 0 ? '#52c41a' : 'transparent'
  }

  const getDayTagColor = (detail?: HrmAttendanceDailyDetailVO) => {
    if (isAbnormal(detail)) return 'error'
    if (detail?.scheduled === false) return 'default'
    return 'success'
  }

  const getClockStatusName = (status?: number) => {
    return ['正常', '迟到', '早退', '缺卡'][status ?? 0] || '未知'
  }

  const cellRender = (current: Dayjs, info: { type: string }) => {
    if (info.type !== 'date') return null

    const dateKey = current.format('YYYY-MM-DD')
    const isCurrentMonth = current.month() === selectedMonth.month()
    const detail = dailyDetailMap.get(dateKey)
    const borderColor = isCurrentMonth ? getDayBorderColor(detail) : 'transparent'

    return (
      <div
        style={{
          minHeight: 105,
          padding: '6px 8px',
          borderTop: `2px solid ${borderColor}`,
          background: isCurrentMonth ? undefined : '#fafafa',
          color: isCurrentMonth ? undefined : '#bfbfbf',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>{current.date()}</span>
          {isCurrentMonth && detail?.attendanceResult && (
            <Tag
              color={getDayTagColor(detail)}
              bordered={false}
              style={{ margin: 0, padding: '0 4px', fontSize: 11 }}
            >
              {detail.attendanceResult}
            </Tag>
          )}
        </div>

        {isCurrentMonth && (
          <div style={{ marginTop: 4 }}>
            {detail?.clockList && detail.clockList.length > 0 ? (
              detail.clockList.map((clock, idx) => {
                const isClockAbnormal = clock.status && clock.status > 0
                return (
                  <div
                    key={clock.id || `${clock.type}-${idx}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      marginTop: 2,
                      color: '#595959'
                    }}
                  >
                    <span>{clock.type === 2 ? '下班' : '上班'}</span>
                    <span style={{ fontWeight: 500, color: '#262626' }}>
                      {clock.clockTime ? dayjs(clock.clockTime).format('HH:mm') : '--:--'}
                    </span>
                    <span style={{ color: isClockAbnormal ? '#ff4d4f' : '#52c41a' }}>
                      {getClockStatusName(clock.status)}
                    </span>
                  </div>
                )
              })
            ) : detail ? (
              <div
                style={{
                  marginTop: 10,
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#bfbfbf'
                }}
              >
                暂无打卡
              </div>
            ) : null}

            {detail?.leaveDays && Number(detail.leaveDays) > 0 ? (
              <div style={{ marginTop: 4 }}>
                <Tag color="orange" style={{ fontSize: 11, margin: 0 }}>
                  请假 {detail.leaveDays} 天
                </Tag>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      title={`${selectedMonth.format('YYYY年MM月')}考勤明细`}
      extra={
        <Space size={16} style={{ fontSize: 13 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Badge status="success" />
            <Text type="secondary">正常</Text>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Badge status="error" />
            <Text type="secondary">异常</Text>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Badge status="default" />
            <Text type="secondary">休息</Text>
          </span>
        </Space>
      }
      styles={{ body: { padding: 0 } }}
    >
      <Spin spinning={loading}>
        <Calendar value={selectedMonth} headerRender={() => null} cellRender={cellRender} />
      </Spin>
    </Card>
  )
}

export default AttendanceCalendar
