import React, { useRef } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getContractPage } from '@/api/crm/contract'
import { CONTRACT_EXPIRY_STATUS } from '@/utils/constantsValue'

const ExpiringContract: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.CrmContractRespVO>[] = [
    {
      title: '到期状态',
      dataIndex: 'expiryType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: CONTRACT_EXPIRY_STATUS,
      align: 'center',
      fieldProps: {
        placeholder: '请选择到期状态'
      }
    },
    {
      title: '合同编号',
      dataIndex: 'no',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '合同名称',
      dataIndex: 'name',
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
      title: '合同金额（元）',
      dataIndex: 'totalPrice',
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'date',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'date',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      align: 'center',
      hideInSearch: true,
      valueType: 'option',
      render: () => {
        return [
          <a key="detail">详情</a>
        ]
      }
    }
  ]

  return (
    <ProTable<API.CrmContractRespVO>
      columns={columns}
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{ colon: false }}
      options={false}
      headerTitle="即将到期的合同"
      request={async (params) => {
        const { current, pageSize, expiryType, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          expiryType: expiryType ? Number(expiryType) : undefined,
          ...rest
        }
        const res = await getContractPage({ pageVO: req })
        return {
          data: res.data?.list || [],
          success: res.code === 0,
          total: res.data?.total || 0,
        }
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
    />
  )
}

export default ExpiringContract
