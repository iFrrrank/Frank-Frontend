import React from 'react'
import { Table, Tag } from 'antd'
import { formatHrmDate } from '@/pages/hrm/utils/format'

interface SalaryPayrollReadinessEmployeeListProps {
  list?: API.Employee[]
}

const EMPLOYEE_STATUS_TAGS: Record<number, { text: string; color: string }> = {
  1: { text: '试用期', color: 'processing' },
  2: { text: '正式', color: 'success' },
  3: { text: '待离职', color: 'warning' },
  4: { text: '已离职', color: 'default' }
}

const SalaryPayrollReadinessEmployeeList: React.FC<SalaryPayrollReadinessEmployeeListProps> = ({
  list = []
}) => {
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 130
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width: 120
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 140
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      key: 'postName',
      width: 140
    },
    {
      title: '员工状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: 110,
      render: (status: number) => {
        const item = EMPLOYEE_STATUS_TAGS[status]
        return item ? <Tag color={item.color}>{item.text}</Tag> : '-'
      }
    },
    {
      title: '入职日期',
      dataIndex: 'entryTime',
      key: 'entryTime',
      align: 'center' as const,
      width: 120,
      render: (val: any) => formatHrmDate(val)
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={list}
      rowKey="employeeId"
      pagination={false}
      size="small"
      scroll={{ y: 400 }}
      bordered
    />
  )
}

export default SalaryPayrollReadinessEmployeeList
