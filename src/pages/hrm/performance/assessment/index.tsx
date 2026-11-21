import React, { useRef, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import { textConst } from '@/locales/zh-CN'
import {
  deletePerformanceArchiveEmployeeRecords,
  getPerformanceArchiveEmployeePage
} from '@/api/hrm/performance/assessment'

// 绩效档案：按员工汇总历次考核（最近计划/评分/等级/次数），可进入员工考核记录
const PerformanceAssessmentArchive: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const columns: ProColumns<any>[] = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      width: 130,
      hideInSearch: true,
      render: (_, record) => (
        <a
          onClick={() =>
            history.push(`/hrm/performance/assessment/employee?employeeId=${record.employeeId}`)
          }
        >
          {record.employeeName}
        </a>
      )
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{record.jobNumber || '-'}</span>
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      width: 140,
      hideInSearch: true,
      render: (_, record) => <span>{record.deptName || '-'}</span>
    },
    {
      title: '职位',
      dataIndex: 'postName',
      width: 140,
      hideInSearch: true,
      render: (_, record) => <span>{record.postName || '-'}</span>
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 130,
      hideInSearch: true,
      render: (_, record) => <span>{record.mobile || '-'}</span>
    },
    {
      title: '最近考核计划',
      dataIndex: 'latestPlanName',
      hideInSearch: true,
      render: (_, record) => <span>{record.latestPlanName || record.latestName || '-'}</span>
    },
    {
      title: '最近绩效评分',
      dataIndex: 'latestScore',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{record.latestScore ?? '-'}</span>
    },
    {
      title: '最近绩效等级',
      dataIndex: 'latestResultLevel',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => <span>{record.latestResultLevel || '-'}</span>
    },
    {
      title: '考核次数',
      dataIndex: 'assessmentCount',
      align: 'center',
      width: 100,
      hideInSearch: true
    },
    {
      title: '员工关键字',
      dataIndex: 'search',
      hideInTable: true,
      fieldProps: { placeholder: '姓名 / 工号 / 手机号' }
    }
  ]

  return (
    <ProTable<any>
      headerTitle="绩效档案"
      actionRef={actionRef}
      rowKey="employeeId"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      request={async (params: Record<string, any>) => {
        const { current, pageSize, ...rest } = params
        const resp = await getPerformanceArchiveEmployeePage({
          pageNo: current || 1,
          pageSize: pageSize || 10,
          ...rest
        } as any)
        return {
          data: resp.data?.list || [],
          success: true,
          total: resp.data?.total || 0
        }
      }}
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys)
      }}
      scroll={{ x: 'max-content' }}
      toolBarRender={() => [
        <Button
          key="delete"
          danger
          disabled={selectedRowKeys.length === 0}
          onClick={() =>
            Modal.confirm({
              title: textConst.msg.confirmTitle,
              content: '确认删除所选员工的全部绩效档案吗？',
              onOk: async () => {
                await deletePerformanceArchiveEmployeeRecords({
                  employeeIds: selectedRowKeys.map(Number)
                } as any)
                message.success(textConst.msg.batchDelSuccess)
                setSelectedRowKeys([])
                actionRef.current?.reload()
              }
            })
          }
        >
          删除档案
        </Button>
      ]}
      pagination={{ align: 'center', showSizeChanger: true }}
    />
  )
}

export default PerformanceAssessmentArchive
