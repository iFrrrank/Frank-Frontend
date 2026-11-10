import React, { useRef } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { getMonthRecordPage } from '@/api/hrm/salary/monthRecord'
import { formatHrmMoney, formatHrmYearMonth } from '@/pages/hrm/utils/format'
import { HrmSalaryMonthStatus } from '../../constants'

const SalaryMonthRecordHistoryPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.HrmSalaryMonthRecordRespVO>[] = [
    {
      title: '年份',
      dataIndex: 'year',
      valueType: 'dateYear',
      hideInTable: true,
      initialValue: dayjs().format('YYYY')
    },
    {
      title: '工资表',
      dataIndex: 'title',
      align: 'center',
      minWidth: 180,
      search: false,
      render: (_, record) => (
        <a onClick={() => history.push(`/hrm/salary/month-record/detail?id=${record.id}`)}>
          {record.title || '-'}
        </a>
      )
    },
    {
      title: '月份',
      key: 'monthDisplay',
      align: 'center',
      width: 120,
      search: false,
      render: (_, record) => formatHrmYearMonth(record.year, record.month)
    },
    {
      title: '计薪人数',
      dataIndex: 'employeeCount',
      align: 'center',
      width: 110,
      search: false,
      render: (_, record) => record.employeeCount ?? 0
    },
    {
      title: '应发工资',
      dataIndex: 'expectedPaySalary',
      align: 'right',
      width: 140,
      search: false,
      render: (_, record) => formatHrmMoney(record.expectedPaySalary)
    },
    {
      title: '实发工资',
      dataIndex: 'realPaySalary',
      align: 'right',
      width: 140,
      search: false,
      render: (_, record) => formatHrmMoney(record.realPaySalary)
    },
    {
      title: '个税总额',
      dataIndex: 'personalTax',
      align: 'right',
      width: 140,
      search: false,
      render: (_, record) => formatHrmMoney(record.personalTax)
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => history.push(`/hrm/salary/month-record/detail?id=${record.id}`)}
        >
          详情
        </a>
      ]
    }
  ]

  return (
    <ProTable<API.HrmSalaryMonthRecordRespVO>
      headerTitle="历史工资表"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false
      }}
      request={async (params) => {
        const { current, pageSize, year } = params
        const yearVal = year ? Number(dayjs(year as any).format('YYYY')) : undefined
        const resp = await getMonthRecordPage({
          pageNo: current,
          pageSize,
          year: yearVal,
          status: HrmSalaryMonthStatus.HISTORY
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

export default SalaryMonthRecordHistoryPage
