import React, { useEffect, useState } from 'react'
import { Descriptions, Table } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getBusiness } from '@/api/crm/business'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'
import { RelatedContactTable, RelatedContractTable } from '../../components/RelatedTables'

// 商机详情：基本信息（含产品明细）、跟进记录、关联联系人与合同
const BusinessDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [business, setBusiness] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getBusiness({ id } as any)
      if (resp.code === 0) {
        setBusiness(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const info = (
    <>
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="商机名称">{business?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="客户名称">{business?.customerName || '-'}</Descriptions.Item>
        <Descriptions.Item label="负责人">{business?.ownerUserName || '-'}</Descriptions.Item>
        <Descriptions.Item label="商机阶段">{business?.statusName || '-'}</Descriptions.Item>
        <Descriptions.Item label="预计成交日期">{business?.dealTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="商机金额">
          ￥{(business?.totalPrice || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="产品总金额">
          ￥{(business?.totalProductPrice || 0).toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="整单折扣">
          {business?.discountPercent !== undefined ? `${business.discountPercent}%` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="跟进状态">
          {business?.followUpStatus ? '已跟进' : '待跟进'}
        </Descriptions.Item>
        <Descriptions.Item label="最后跟进时间">
          {business?.contactLastTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="下次联系时间">
          {business?.contactNextTime || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="结束状态">
          {business?.endStatusName || (business?.endStatus ? business.endStatus : '未结束')}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {business?.remark || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{business?.createTime || '-'}</Descriptions.Item>
      </Descriptions>
      <Table
        rowKey={(r: any) => `${r.productId}-${r.id || ''}`}
        dataSource={business?.products || []}
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
          {
            title: '商机价格',
            dataIndex: 'businessPrice',
            align: 'center',
            render: (v: number) => (v !== undefined ? `￥${Number(v).toFixed(2)}` : '-')
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
      title={business?.name || '商机详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.BUSINESS} bizId={id} />
        },
        {
          key: 'contact',
          label: '联系人',
          children: <RelatedContactTable businessId={id} />
        },
        {
          key: 'contract',
          label: '合同',
          children: <RelatedContractTable businessId={id} />
        }
      ]}
    />
  )
}

export default BusinessDetail
