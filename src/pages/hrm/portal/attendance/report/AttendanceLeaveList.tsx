import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, Card, Modal, Input, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { history } from '@umijs/max'
import * as AttendanceLeaveApi from '@/api/hrm/portal/attendance'
import { formatHrmDateTime } from '@/pages/hrm/utils/format'
import {
  BPM_STATUS_MAP,
  getLeaveTypeOptions,
  type LeaveTypeOption
} from '@/pages/hrm/attendance/utils'
import AttendanceLeaveForm from '../leave/AttendanceLeaveForm'

export interface AttendanceLeaveListProps {
  onChanged: () => void
}

export interface AttendanceLeaveListRef {
  refresh: () => Promise<void>
  openCreate: () => void
}

const AttendanceLeaveList = forwardRef<AttendanceLeaveListRef, AttendanceLeaveListProps>(
  ({ onChanged }, ref) => {
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState<AttendanceLeaveApi.HrmAttendanceLeaveVO[]>([])
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([])
    const [createOpen, setCreateOpen] = useState(false)

    // 取消弹窗状态
    const [cancelModalVisible, setCancelModalVisible] = useState(false)
    const [cancelRecordId, setCancelRecordId] = useState<number>()
    const [cancelReason, setCancelReason] = useState('')
    const [cancelLoading, setCancelLoading] = useState(false)

    const getLeaveTypeLabel = (val?: string | number) => {
      if (val === undefined || val === null) return '-'
      const strVal = String(val)
      const match = leaveTypes.find((item) => item.value === strVal)
      return match ? match.label : strVal
    }

    const getList = async () => {
      setLoading(true)
      try {
        const resp = await AttendanceLeaveApi.getMyAttendanceLeaveList()
        setList(resp.data || [])
      } finally {
        setLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      refresh: getList,
      openCreate: () => setCreateOpen(true)
    }))

    useEffect(() => {
      getLeaveTypeOptions().then((opts) => setLeaveTypes(opts || []))
      getList()
    }, [])

    const handleOpenCancel = (id: number) => {
      setCancelRecordId(id)
      setCancelReason('')
      setCancelModalVisible(true)
    }

    const handleConfirmCancel = async () => {
      if (!cancelReason.trim()) {
        message.warning('请输入取消原因')
        return
      }
      if (!cancelRecordId) return

      setCancelLoading(true)
      try {
        await AttendanceLeaveApi.cancelMyAttendanceLeave(cancelRecordId, cancelReason.trim())
        message.success('请假申请已取消')
        setCancelModalVisible(false)
        await getList()
        onChanged()
      } catch (err: any) {
        message.error(err?.message || '取消失败')
      } finally {
        setCancelLoading(false)
      }
    }

    const columns: ColumnsType<AttendanceLeaveApi.HrmAttendanceLeaveVO> = [
      {
        title: '请假类型',
        dataIndex: 'type',
        align: 'center',
        width: 110,
        render: (val) => <Tag color="blue">{getLeaveTypeLabel(val)}</Tag>
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        align: 'center',
        width: 170,
        render: (val) => formatHrmDateTime(val)
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        align: 'center',
        width: 170,
        render: (val) => formatHrmDateTime(val)
      },
      {
        title: '请假天数',
        dataIndex: 'day',
        align: 'center',
        width: 100,
        render: (val) => `${val ?? 0} 天`
      },
      {
        title: '请假事由',
        dataIndex: 'reason',
        minWidth: 160,
        ellipsis: true
      },
      {
        title: '审批状态',
        dataIndex: 'approvalStatus',
        align: 'center',
        width: 110,
        render: (val?: number) => {
          if (val === undefined || val === null) return '-'
          const statusConfig = BPM_STATUS_MAP[val]
          return (
            <Tag color={statusConfig?.color || 'default'}>{statusConfig?.text || String(val)}</Tag>
          )
        }
      },
      {
        title: '操作',
        align: 'center',
        width: 160,
        fixed: 'right',
        render: (_, record) => (
          <Space size={8}>
            {record.processInstanceId && (
              <Button
                type="link"
                size="small"
                onClick={() =>
                  history.push(`/bpm/process-instance/detail?id=${record.processInstanceId}`)
                }
              >
                审批进度
              </Button>
            )}
            {record.approvalStatus === 1 && record.id && (
              <Button type="link" danger size="small" onClick={() => handleOpenCancel(record.id!)}>
                取消
              </Button>
            )}
          </Space>
        )
      }
    ]

    return (
      <Card title="我的请假申请" style={{ marginTop: 24 }}>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={list}
          columns={columns}
          pagination={false}
          size="small"
          bordered
        />

        <AttendanceLeaveForm
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSuccess={() => {
            getList()
            onChanged()
          }}
        />

        <Modal
          title="取消请假申请"
          open={cancelModalVisible}
          onOk={handleConfirmCancel}
          onCancel={() => setCancelModalVisible(false)}
          confirmLoading={cancelLoading}
          destroyOnClose
        >
          <div style={{ marginBottom: 12 }}>请输入取消原因：</div>
          <Input.TextArea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="请输入取消原因"
            maxLength={200}
            showCount
          />
        </Modal>
      </Card>
    )
  }
)

export default AttendanceLeaveList
