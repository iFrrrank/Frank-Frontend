import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Spin, Tag } from 'antd'
import * as AttendanceLeaveApi from '@/api/hrm/attendance/leave'
import { formatHrmDateTime } from '@/pages/hrm/utils/format'
import {
  BPM_STATUS_MAP,
  getLeaveTypeOptions,
  type LeaveTypeOption
} from '@/pages/hrm/attendance/utils'

export interface AttendanceLeaveProcessDetailProps {
  id: string | number
}

const AttendanceLeaveProcessDetail: React.FC<AttendanceLeaveProcessDetailProps> = ({ id }) => {
  const [loading, setLoading] = useState(false)
  const [leave, setLeave] = useState<API.HrmAttendanceLeaveRespVO>()
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([])

  useEffect(() => {
    getLeaveTypeOptions().then((opts) => setLeaveTypes(opts || []))
  }, [])

  useEffect(() => {
    const numericId = Number(id)
    if (!numericId) return

    setLoading(true)
    AttendanceLeaveApi.getAttendanceLeave({ id: numericId })
      .then((resp) => setLeave(resp.data))
      .finally(() => setLoading(false))
  }, [id])

  const getLeaveTypeLabel = (val?: string) => {
    if (!val) return '-'
    const match = leaveTypes.find((item) => item.value === String(val))
    return match ? match.label : String(val)
  }

  return (
    <Card title="员工请假申请" size="small">
      <Spin spinning={loading}>
        {leave ? (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="员工姓名">{leave.employeeName || '-'}</Descriptions.Item>
            <Descriptions.Item label="请假类型">
              <Tag color="blue">{getLeaveTypeLabel(leave.type)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">
              {formatHrmDateTime(leave.startTime)}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {formatHrmDateTime(leave.endTime)}
            </Descriptions.Item>
            <Descriptions.Item label="请假天数">{leave.day ?? 0} 天</Descriptions.Item>
            <Descriptions.Item label="审批状态">
              {leave.approvalStatus !== undefined ? (
                <Tag color={BPM_STATUS_MAP[leave.approvalStatus]?.color || 'default'}>
                  {BPM_STATUS_MAP[leave.approvalStatus]?.text || leave.approvalStatus}
                </Tag>
              ) : (
                '-'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="请假事由" span={2}>
              {leave.reason || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {leave.remark || '-'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: '#bfbfbf' }}>暂无请假信息</div>
        )}
      </Spin>
    </Card>
  )
}

export default AttendanceLeaveProcessDetail
