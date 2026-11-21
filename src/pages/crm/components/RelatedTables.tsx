import React from 'react'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { getContactPage } from '@/api/crm/contact'
import { getBusinessPage } from '@/api/crm/business'
import { getContractPage } from '@/api/crm/contract'
import { getReceivablePage } from '@/api/crm/receivable'
import { getReceivablePlanPage } from '@/api/crm/receivablePlan'

// 详情页关联列表：按外键过滤的只读小表，供各详情页的 Tab 复用

const baseTableProps = {
  search: false,
  options: false,
  pagination: { pageSize: 10, align: 'center' as const }
}

const pageRequest =
  (loader: (params: any) => Promise<any>, fixedParams: Record<string, any>) =>
  async (params: Record<string, any>) => {
    const resp = await loader({
      pageNo: params.current || 1,
      pageSize: params.pageSize || 10,
      ...fixedParams
    })
    return {
      data: resp.data?.list || [],
      success: true,
      total: resp.data?.total || 0
    }
  }

// 关联联系人
export const RelatedContactTable: React.FC<{ customerId?: number; businessId?: number }> = ({
  customerId,
  businessId
}) => {
  const columns: ProColumns<any>[] = [
    { title: '姓名', dataIndex: 'name', width: 120 },
    { title: '手机号', dataIndex: 'mobile', align: 'center', width: 130 },
    { title: '电话', dataIndex: 'telephone', align: 'center', width: 130 },
    { title: '邮箱', dataIndex: 'email', align: 'center', width: 160 },
    { title: '微信', dataIndex: 'wechat', align: 'center', width: 130 },
    {
      title: '是否关键决策人',
      dataIndex: 'master',
      align: 'center',
      width: 120,
      render: (_, r) => (r.master ? '是' : '否')
    }
  ]
  return (
    <ProTable<any>
      {...baseTableProps}
      rowKey="id"
      columns={columns}
      request={pageRequest(getContactPage as any, { customerId, businessId })}
    />
  )
}

// 关联商机
export const RelatedBusinessTable: React.FC<{ customerId?: number }> = ({ customerId }) => {
  const columns: ProColumns<any>[] = [
    { title: '商机名称', dataIndex: 'name', width: 180 },
    {
      title: '商机金额',
      dataIndex: 'totalPrice',
      align: 'center',
      width: 120,
      render: (_, r) => `￥${(r.totalPrice || 0).toFixed(2)}`
    },
    { title: '客户名称', dataIndex: 'customerName', width: 140 },
    {
      title: '预计成交日期',
      dataIndex: 'dealTime',
      align: 'center',
      width: 130,
      render: (_, r) => <span>{r.dealTime || '-'}</span>
    },
    { title: '负责人', dataIndex: 'ownerUserName', align: 'center', width: 100 }
  ]
  return (
    <ProTable<any>
      {...baseTableProps}
      rowKey="id"
      columns={columns}
      request={pageRequest(getBusinessPage as any, { customerId })}
    />
  )
}

// 关联合同
export const RelatedContractTable: React.FC<{ customerId?: number; businessId?: number }> = ({
  customerId,
  businessId
}) => {
  const columns: ProColumns<any>[] = [
    { title: '合同名称', dataIndex: 'name', width: 180 },
    { title: '合同编号', dataIndex: 'no', align: 'center', width: 140 },
    {
      title: '合同金额',
      dataIndex: 'totalPrice',
      align: 'center',
      width: 120,
      render: (_, r) => `￥${(r.totalPrice || 0).toFixed(2)}`
    },
    {
      title: '已回款',
      dataIndex: 'totalReceivablePrice',
      align: 'center',
      width: 110,
      render: (_, r) => `￥${(r.totalReceivablePrice || 0).toFixed(2)}`
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      align: 'center',
      width: 120,
      render: (_, r) => <span>{r.startTime || '-'}</span>
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      align: 'center',
      width: 120,
      render: (_, r) => <span>{r.endTime || '-'}</span>
    },
    { title: '负责人', dataIndex: 'ownerUserName', align: 'center', width: 100 }
  ]
  return (
    <ProTable<any>
      {...baseTableProps}
      rowKey="id"
      columns={columns}
      request={pageRequest(getContractPage as any, { customerId, businessId })}
    />
  )
}

// 关联回款计划
export const RelatedReceivablePlanTable: React.FC<{
  customerId?: number
  contractId?: number
}> = ({ customerId, contractId }) => {
  const columns: ProColumns<any>[] = [
    { title: '期数', dataIndex: 'period', align: 'center', width: 70 },
    {
      title: '计划回款金额',
      dataIndex: 'price',
      align: 'center',
      width: 130,
      render: (_, r) => `￥${(r.price || 0).toFixed(2)}`
    },
    {
      title: '计划回款日期',
      dataIndex: 'returnTime',
      align: 'center',
      width: 130,
      render: (_, r) => <span>{r.returnTime || '-'}</span>
    },
    {
      title: '实际回款金额',
      dataIndex: 'receivablePrice',
      align: 'center',
      width: 130,
      render: (_, r) =>
        r.receivablePrice !== undefined ? `￥${Number(r.receivablePrice).toFixed(2)}` : '-'
    },
    { title: '客户名称', dataIndex: 'customerName', width: 140 },
    { title: '合同编号', dataIndex: 'contractNo', align: 'center', width: 140 },
    { title: '负责人', dataIndex: 'ownerUserName', align: 'center', width: 100 }
  ]
  return (
    <ProTable<any>
      {...baseTableProps}
      rowKey="id"
      columns={columns}
      request={pageRequest(getReceivablePlanPage as any, { customerId, contractId })}
    />
  )
}

// 关联回款
export const RelatedReceivableTable: React.FC<{ customerId?: number; contractId?: number }> = ({
  customerId,
  contractId
}) => {
  const columns: ProColumns<any>[] = [
    { title: '回款编号', dataIndex: 'no', align: 'center', width: 150 },
    {
      title: '回款金额',
      dataIndex: 'price',
      align: 'center',
      width: 120,
      render: (_, r) => `￥${(r.price || 0).toFixed(2)}`
    },
    {
      title: '回款日期',
      dataIndex: 'returnTime',
      align: 'center',
      width: 130,
      render: (_, r) => <span>{r.returnTime || '-'}</span>
    },
    { title: '客户名称', dataIndex: 'customerName', width: 140 },
    { title: '合同编号', dataIndex: 'contractNo', align: 'center', width: 140 },
    { title: '负责人', dataIndex: 'ownerUserName', align: 'center', width: 100 }
  ]
  return (
    <ProTable<any>
      {...baseTableProps}
      rowKey="id"
      columns={columns}
      request={pageRequest(getReceivablePage as any, { customerId, contractId })}
    />
  )
}
