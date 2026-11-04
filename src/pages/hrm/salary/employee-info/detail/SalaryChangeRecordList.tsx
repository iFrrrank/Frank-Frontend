import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, Modal, Table, Tag, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  cancelSalaryChangeRecord,
  deleteSalaryChangeRecord,
  getSalaryChangeRecordList
} from '@/api/hrm/salary/changeRecord'
import { textConst } from '@/locales/zh-CN'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { formatDateTime } from '@/pages/hrm/recruit/format'

export interface SalaryChangeRecordListRef {
  getList: () => Promise<void>
}

interface SalaryChangeRecordListProps {
  employeeId: number
  onEdit: (record: API.HrmSalaryChangeRecordRespVO) => void
  onChange: () => void
}

const CHANGE_REASON_MAP: Record<number, string> = {
  0: '入职定薪',
  1: '入职核定',
  2: '转正',
  3: '晋升',
  4: '调动',
  5: '年中调薪',
  6: '年度调薪',
  7: '特别调薪',
  8: '其他'
}

const RECORD_STATUS_MAP: Record<number, { text: string; color: string }> = {
  0: { text: '待生效', color: 'warning' },
  1: { text: '已生效', color: 'success' },
  2: { text: '已取消', color: 'default' }
}

const SalaryChangeRecordList = forwardRef<SalaryChangeRecordListRef, SalaryChangeRecordListProps>(
  ({ employeeId, onEdit, onChange }, ref) => {
    const [loading, setLoading] = useState(false)
    const [recordList, setRecordList] = useState<API.HrmSalaryChangeRecordRespVO[]>([])

    const getList = async () => {
      setLoading(true)
      try {
        const resp = await getSalaryChangeRecordList({ employeeId })
        setRecordList(resp.data || [])
      } finally {
        setLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      getList
    }))

    useEffect(() => {
      getList()
    }, [employeeId])

    const canEditRecord = (record: API.HrmSalaryChangeRecordRespVO) => {
      if (record.recordType !== 1) {
        return record.status !== 1 // 非已生效
      }
      return !recordList.some((item) => item.recordType === 2 && item.status !== 2)
    }

    const handleCancel = (record: API.HrmSalaryChangeRecordRespVO) => {
      Modal.confirm({
        title: textConst.msg.confirmTitle,
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: '确认取消该待生效的薪资调整吗？',
        okText: textConst.common.ok,
        cancelText: textConst.common.cancel,
        onOk: async () => {
          try {
            await cancelSalaryChangeRecord({ id: record.id! })
            message.success(textConst.msg.updateSuccess)
            await getList()
            onChange()
          } catch {
            message.error(textConst.msg.updateError)
          }
        }
      })
    }

    const handleDelete = (record: API.HrmSalaryChangeRecordRespVO) => {
      Modal.confirm({
        title: textConst.msg.confirmTitle,
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: '确认删除该调薪记录吗？',
        okText: textConst.common.ok,
        cancelText: textConst.common.cancel,
        onOk: async () => {
          try {
            await deleteSalaryChangeRecord({ id: record.id! })
            message.success(textConst.msg.delSuccess)
            await getList()
            onChange()
          } catch {
            message.error(textConst.msg.delError)
          }
        }
      })
    }

    const columns = [
      {
        title: '类型',
        dataIndex: 'recordType',
        align: 'center' as const,
        width: 90,
        render: (type: number) => (type === 1 ? '定薪' : '调薪')
      },
      {
        title: '调整原因',
        dataIndex: 'changeReason',
        align: 'center' as const,
        width: 120,
        render: (reason: number) => (reason != null ? CHANGE_REASON_MAP[reason] || '-' : '-')
      },
      {
        title: '生效日期',
        dataIndex: 'effectTime',
        align: 'center' as const,
        width: 120,
        render: (time: any) => formatDateTime(time, 'YYYY-MM-DD')
      },
      {
        title: '正式调整前',
        dataIndex: 'beforeTotal',
        align: 'right' as const,
        width: 120,
        render: (val: number) => formatHrmMoney(val)
      },
      {
        title: '正式调整后',
        dataIndex: 'afterTotal',
        align: 'right' as const,
        width: 120,
        render: (val: number) => formatHrmMoney(val)
      },
      {
        title: '试用调整前',
        dataIndex: 'probationBeforeTotal',
        align: 'right' as const,
        width: 120,
        render: (val: number) => formatHrmMoney(val)
      },
      {
        title: '试用调整后',
        dataIndex: 'probationAfterTotal',
        align: 'right' as const,
        width: 120,
        render: (val: number) => formatHrmMoney(val)
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center' as const,
        width: 110,
        render: (status: number) => {
          const config = RECORD_STATUS_MAP[status]
          return config ? <Tag color={config.color}>{config.text}</Tag> : '-'
        }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        minWidth: 160,
        render: (text: string) => text || '-'
      },
      {
        title: textConst.table.action,
        key: 'action',
        align: 'center' as const,
        fixed: 'right' as const,
        width: 160,
        render: (_: any, record: API.HrmSalaryChangeRecordRespVO) => (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {canEditRecord(record) && (
              <a onClick={() => onEdit(record)}>{textConst.action.update}</a>
            )}
            {record.status === 0 && (
              <a style={{ color: '#faad14' }} onClick={() => handleCancel(record)}>
                取消
              </a>
            )}
            {record.status !== 1 && (
              <a style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
                {textConst.action.delete}
              </a>
            )}
          </div>
        )
      }
    ]

    return (
      <Table
        columns={columns}
        dataSource={recordList}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    )
  }
)

export default SalaryChangeRecordList

