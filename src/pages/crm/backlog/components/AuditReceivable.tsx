import React, { useRef } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getReceivablePage } from '@/api/crm/receivable'
import { AUDIT_STATUS } from '@/utils/constantsValue'

const AuditReceivable: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<API.CrmReceivableRespVO>[] = [
    {
      title: '审批状态',
      dataIndex: 'auditStatus',
      hideInTable: true,
      valueType: 'select',
      valueEnum: AUDIT_STATUS,
      align: 'center',
      fieldProps: {
        placeholder: '请选择合同状态'
      }
    },
    {
      title: '回款编号',
      dataIndex: 'no',
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
      dataIndex: 'contractId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '回款金额（元）',
      dataIndex: 'price',
      valueType: 'money',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '回款方式',
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
      title: '操作',
      valueType: 'option',
      align: 'center',
      hideInSearch: true,
      render: () => {
        return [<a key="audit">审批</a>, <a key="detail">详情</a>]
      }
    }
  ]

  return (
    <ProTable<API.CrmReceivableRespVO>
      columns={columns}
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        span: 6
      }}
      options={false}
      form={{ colon: false }}
      headerTitle="待审核回款"
      request={async (params) => {
        const { current, pageSize, auditStatus, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          auditStatus: auditStatus ? Number(auditStatus) : undefined,
          ...rest
        }
        const res = await getReceivablePage({ pageReqVO: req })
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

export default AuditReceivable
