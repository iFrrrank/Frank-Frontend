import React, { useRef } from 'react'
import { Card, Tag } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import { getEmployeePage } from '@/api/hrm/employee'
import { HrmEmployeeStatusTabEnum } from '@/utils/constants'
import { EMPLOYEE_TYPE } from '@/utils/constantsValue'
import { formatDateTime } from '@/pages/hrm/recruit/format'

interface DeptEmployeeListProps {
  deptId: number
}

const DeptEmployeeList: React.FC<DeptEmployeeListProps> = ({ deptId }) => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.HrmEmployeeRespVO>[] = [
    {
      title: '员工姓名',
      dataIndex: 'name',
      align: 'center',
      minWidth: 120,
      render: (_, record) => (
        <a onClick={() => history.push(`/hrm/employee/detail?id=${record.id}`)}>{record.name}</a>
      )
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      align: 'center',
      minWidth: 120,
      hideInSearch: true,
      render: (_, record) => record.jobNumber || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      align: 'center',
      minWidth: 140,
      hideInSearch: true,
      render: (_, record) => record.deptName || '-'
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
      minWidth: 140,
      hideInSearch: true,
      render: (_, record) => record.postName || '-'
    },
    {
      title: '聘用形式',
      dataIndex: 'type',
      align: 'center',
      width: 110,
      hideInSearch: true,
      valueType: 'select',
      valueEnum: EMPLOYEE_TYPE
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => formatDateTime(record.entryTime, 'YYYY-MM-DD')
    },
    {
      title: '员工搜索',
      dataIndex: 'search',
      hideInTable: true,
      fieldProps: {
        placeholder: '请输入员工姓名、工号或手机号'
      }
    }
  ]

  return (
    <Card variant="borderless">
      <ProTable<API.HrmEmployeeRespVO>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        cardBordered={false}
        form={{ colon: false }}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        options={false}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10, align: 'center', showSizeChanger: true }}
        request={async (params) => {
          const { current, pageSize, search } = params
          try {
            const resp = await getEmployeePage({
              pageReqVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                deptId,
                statusCategory: HrmEmployeeStatusTabEnum.ACTIVE.statusCategory,
                ...(search ? { search } : {})
              }
            } as any)
            return {
              data: resp.data?.list || [],
              success: resp.code === 0,
              total: resp.data?.total || 0
            }
          } catch {
            return { data: [], success: false, total: 0 }
          }
        }}
      />
    </Card>
  )
}

export default DeptEmployeeList
