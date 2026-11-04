import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Descriptions, Modal, Spin, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as AttendanceStatisticsApi from '@/api/hrm/attendance/statistics'
import { ATTENDANCE_CLOCK_STATUS, ATTENDANCE_CLOCK_TYPE } from '@/utils/constantsValue'
import { formatHrmDate, formatHrmDateTime } from '@/pages/hrm/utils/format'

export interface AttendanceClockDailyDetailRef {
  open: (employeeId: number, attendanceDate: string) => Promise<void>
}

const AttendanceClockDailyDetail = forwardRef<AttendanceClockDailyDetailRef>((_, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detailData, setDetailData] = useState<API.HrmAttendanceDailyDetailRespVO>()

  useImperativeHandle(ref, () => ({
    open: async (employeeId: number, attendanceDate: string) => {
      setOpen(true)
      setLoading(true)
      setDetailData(undefined)
      try {
        const resp = await AttendanceStatisticsApi.getAttendanceDailyDetail({
          employeeId,
          attendanceTime: formatHrmDateTime(attendanceDate)
        } as any)
        setDetailData(resp.data)
      } finally {
        setLoading(false)
      }
    }
  }))

  const title = detailData
    ? `${detailData.employeeName || ''} ${formatHrmDate(detailData.attendanceTime)} 每日考勤详情`
    : '每日考勤详情'

  const columns: ColumnsType<any> = [
    {
      title: '打卡类型',
      dataIndex: 'type',
      width: 110,
      render: (val) => {
        const typeInfo = ATTENDANCE_CLOCK_TYPE[val]
        return <Tag color="blue">{typeInfo?.text || '-'}</Tag>
      }
    },
    {
      title: '应打卡时间',
      dataIndex: 'attendanceTime',
      width: 170,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '打卡时间',
      dataIndex: 'clockTime',
      width: 170,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (val) => {
        const statusInfo = ATTENDANCE_CLOCK_STATUS[val]
        const color = val === 1 ? 'success' : val ? 'error' : 'default'
        return <Tag color={color}>{statusInfo?.text || '-'}</Tag>
      }
    },
    {
      title: '地点',
      dataIndex: 'address',
      minWidth: 140,
      ellipsis: true,
      render: (val) => val || '-'
    }
  ]

  return (
    <Modal
      title={title}
      width={820}
      open={open}
      onCancel={() => setOpen(false)}
      destroyOnClose
      footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
    >
      <Spin spinning={loading}>
        {detailData && (
          <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="班次">{detailData.shiftName || '-'}</Descriptions.Item>
            <Descriptions.Item label="考勤结果">
              {detailData.attendanceResult || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="应打卡次数">
              {detailData.requiredClockCount || 0}
            </Descriptions.Item>
            <Descriptions.Item label="实际打卡次数">
              {detailData.clockList?.length || 0}
            </Descriptions.Item>
          </Descriptions>
        )}

        <Table
          rowKey={(r, idx) => r.id || `${r.type}-${idx}`}
          dataSource={detailData?.clockList || []}
          columns={columns}
          pagination={false}
          size="small"
          bordered
        />
      </Spin>
    </Modal>
  )
})

export default AttendanceClockDailyDetail
