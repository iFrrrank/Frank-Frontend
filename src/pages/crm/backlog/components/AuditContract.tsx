import React, { useRef } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getContractPage } from '@/api/crm/contract'
import { AUDIT_STATUS } from '@/utils/constantsValue'

const AuditContract: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.CrmContractRespVO>[] = [
    {
      title: '合同状态',
      dataIndex: 'auditStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: AUDIT_STATUS,
      fieldProps: {
        placeholder: '请选择合同状态'
      },
      align: 'center'
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
      title: '商机名称',
      dataIndex: 'businessName',
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
      title: '下单时间',
      dataIndex: 'orderDate',
      valueType: 'date',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: () => {
        return [<a key="audit">审批</a>, <a key="detail">详情</a>]
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
        span: 6
      }}
      options={false}
      form={{ colon: false }}
      headerTitle="待审核合同"
      request={async (params) => {
        const { current, pageSize, auditStatus, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          auditStatus: auditStatus ? Number(auditStatus) : undefined,
          ...rest
        }
        const res = await getContractPage({ pageVO: req })
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

export default AuditContract
