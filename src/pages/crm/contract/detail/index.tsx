import React, { useEffect, useState } from 'react'
import { Descriptions, Table, Tag } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getContract } from '@/api/crm/contract'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'
import {
  RelatedReceivablePlanTable,
  RelatedReceivableTable
} from '../../components/RelatedTables'

// 合同审批状态
const AUDIT_STATUS: Record<number, { text: string; color: string }> = {
  0: { text: '未提交', color: 'default' },
  10: { text: '审批中', color: 'processing' },
  20: { text: '审批通过', color: 'success' },
  30: { text: '审批不通过', color: 'error' }
}

// 合同详情：基本信息（含产品明细）、跟进记录、回款计划与回款
const ContractDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [contract, setContract] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getContract({ id } as any)
      if (resp.code === 0) {
        setContract(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const audit = AUDIT_STATUS[contract?.auditStatus] || { text: '-', color: 'default' }

  const info = (
    <>
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="合同名称">{contract?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="合同编号">{contract?.no || '-'}</Descriptions.Item>
        <Descriptions.Item label="客户名称">{contract?.customerName || '-'}</Descriptions.Item>
        <Descriptions.Item label="商机名称">{contract?.businessName || '-'}</Descriptions.Item>
        <Descriptions.Item label="负责人">{contract?.ownerUserName || '-'}</Descriptions.Item>
        <Descriptions.Item label="审批状态">
          <Tag color={audit.color}>{audit.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="下单日期">{contract?.orderDate || '-'}</Descriptions.Item>
        <Descriptions.Item label="开始时间">{contract?.startTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{contract?.endTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="签约联系人">{contract?.signContactName || '-'}</Descriptions.Item>
        <Descriptions.Item label="公司签约人">{contract?.signUserName || '-'}</Descriptions.Item>
        <Descriptions.Item label="合同金额">
          ￥{(contract?.totalPrice || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="折扣后金额">
          ￥{(contract?.discountPercent !== undefined
            ? (contract.totalPrice || 0) * (1 - (contract.discountPercent || 0) / 100)
            : contract?.totalPrice || 0
          ).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="已回款金额">
          ￥{(contract?.totalReceivablePrice || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {contract?.remark || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{contract?.createTime || '-'}</Descriptions.Item>
      </Descriptions>
      {/* 合同产品明细 */}
      <Table
        rowKey={(r: any) => `${r.productId}-${r.id || ''}`}
        dataSource={contract?.products || []}
        pagination={false}
        size="small"
        title={() => '产品明细'}
        columns={[
          { title: '产品名称', dataIndex: 'productName' },
          {
            title: '产品单价',
            dataIndex: 'productPrice',
            align: 'center',
            render: (v: number) => `￥${(v || 0).toFixed(2)}`
          },
          { title: '数量', dataIndex: 'count', align: 'center' },
          {
            title: '小计',
            dataIndex: 'totalPrice',
            align: 'center',
            render: (v: number) => `￥${(v || 0).toFixed(2)}`
          }
        ]}
      />
    </>
  )

  return (
    <DetailShell
      title={contract?.name || '合同详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.CONTRACT} bizId={id} />
        },
        {
          key: 'plan',
          label: '回款计划',
          children: <RelatedReceivablePlanTable contractId={id} />
        },
        {
          key: 'receivable',
          label: '回款',
          children: <RelatedReceivableTable contractId={id} />
        }
      ]}
    />
  )
}

export default ContractDetail
