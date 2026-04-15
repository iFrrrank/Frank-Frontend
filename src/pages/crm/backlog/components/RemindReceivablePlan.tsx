import React, { useRef } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getReceivablePlanPage } from '@/api/crm/receivablePlan'
import { RECEIVABLE_STATUS } from '@/utils/constantsValue'

const RemindReceivablePlan: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.CrmReceivablePlanRespVO>[] = [
    {
      title: '回款类型',
      dataIndex: 'remindType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: RECEIVABLE_STATUS,
      align: 'center',
      fieldProps: {
        placeholder: '请选择回款类型'
      }
    },
    {
      title: '期数',
      dataIndex: 'period',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '计划回款金额（元）',
      dataIndex: 'price',
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '计划回款方式',
      dataIndex: 'returnType',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '计划回款日期',
      dataIndex: 'returnTime',
      valueType: 'date',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '提醒日期',
      dataIndex: 'remindTime',
      valueType: 'date',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '操作',
      valueType: 'option',
      hideInSearch: true,
      align: 'center',
      render: () => {
        return [<a key="create">添加回款</a>, <a key="detail">详情</a>]
      }
    }
  ]

  return (
    <ProTable<API.CrmReceivablePlanRespVO>
      columns={columns}
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        span: 6
      }}
      form={{ colon: false }}
      options={false}
      headerTitle="待回款提醒"
      request={async (params) => {
        const { current, pageSize, remindType, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          remindType: remindType ? Number(remindType) : undefined,
          ...rest
        }
        const res = await getReceivablePlanPage({ pageReqVO: req })
        return {
          data: res.data?.list || [],
          success: res.code === 0,
          total: res.data?.total || 0
        }
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true
      }}
    />
  )
}

export default RemindReceivablePlan
