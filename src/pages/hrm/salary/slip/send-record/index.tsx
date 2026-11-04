import React, { useRef } from 'react'
import { Modal, Space, message } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import {
  deleteSalarySlipSendRecord,
  getSalarySlipSendRecordPage
} from '@/api/hrm/salary/slipSendRecord'
import { textConst } from '@/locales/zh-CN'
import { formatHrmYearMonth } from '@/pages/hrm/utils/format'
import { formatDateTime } from '@/pages/hrm/recruit/format'

const SalarySlipSendRecordPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const handleDelete = (id?: number) => {
    if (!id) return
    Modal.confirm({
      title: '确认删除',
      content: '删除后，本次发放的工资条将同时删除，是否继续？',
      onOk: async () => {
        await deleteSalarySlipSendRecord({ id })
        message.success(textConst.msg.delSuccess)
        actionRef.current?.reload()
      }
    })
  }

  const columns: ProColumns<API.HrmSalarySlipSendRecordRespVO>[] = [
    {
      title: '工资月份',
      dataIndex: 'month',
      valueType: 'dateMonth',
      hideInTable: true,
      initialValue: dayjs().format('YYYY-MM')
    },
    {
      title: '工资月份',
      key: 'monthDisplay',
      align: 'center',
      width: 130,
      search: false,
      render: (_, record) => (
        <a onClick={() => history.push(`/hrm/salary/slip/send-record/detail?id=${record.id}`)}>
          {formatHrmYearMonth(record.year, record.month)}
        </a>
      )
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
      align: 'center',
      minWidth: 120,
      search: false,
      render: (_, record) => record.creatorName || '-'
    },
    {
      title: '发放时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 170,
      search: false,
      render: (_, record) => formatDateTime(record.createTime)
    },
    {
      title: '工资表总人数',
      dataIndex: 'employeeCount',
      align: 'center',
      width: 120,
      search: false,
      render: (_, record) => record.employeeCount ?? 0
    },
    {
      title: '发放人数',
      dataIndex: 'sendEmployeeCount',
      align: 'center',
      width: 110,
      search: false,
      render: (_, record) => record.sendEmployeeCount ?? 0
    },
    {
      title: '已查看人数',
      dataIndex: 'readCount',
      align: 'center',
      width: 110,
      search: false,
      render: (_, record) => record.readCount ?? 0
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => history.push(`/hrm/salary/slip/send-record/detail?id=${record.id}`)}
        >
          详情
        </a>,
        <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record.id)}>
          删除
        </a>
      ]
    }
  ]

  return (
    <ProTable<API.HrmSalarySlipSendRecordRespVO>
      headerTitle="工资条发放记录"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false
      }}
      request={async (params) => {
        const { current, pageSize, month } = params
        let year: number | undefined
        let monthVal: number | undefined
        if (month) {
          const parts = (month as string).split('-').map(Number)
          year = parts[0]
          monthVal = parts[1]
        }
        const resp = await getSalarySlipSendRecordPage({
          pageNo: current,
          pageSize,
          year,
          month: monthVal
        } as any)
        return {
          data: resp.data?.list || [],
          total: resp.data?.total || 0,
          success: true
        }
      }}
      columns={columns}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true
      }}
    />
  )
}

export default SalarySlipSendRecordPage
