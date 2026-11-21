import React, { useEffect, useState } from 'react'
import { Descriptions, Tag } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getReceivable } from '@/api/crm/receivable'
import DetailShell from '../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../components/FollowUpPanel'

// 回款方式
const RETURN_TYPE: Record<number, string> = {
  1: '现金',
  2: '银行转账',
  3: '支付宝',
  4: '微信',
  5: '其他'
}

const AUDIT_STATUS: Record<number, { text: string; color: string }> = {
  0: { text: '未提交', color: 'default' },
  10: { text: '审批中', color: 'processing' },
  20: { text: '审批通过', color: 'success' },
  30: { text: '审批不通过', color: 'error' }
}

// 回款详情：基本信息与跟进记录
const ReceivableDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [receivable, setReceivable] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getReceivable({ id } as any)
      if (resp.code === 0) {
        setReceivable(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const audit = AUDIT_STATUS[receivable?.auditStatus] || { text: '-', color: 'default' }

  const info = (
    <Descriptions column={2} bordered size="small">
      <Descriptions.Item label="回款编号">{receivable?.no || '-'}</Descriptions.Item>
      <Descriptions.Item label="负责人">{receivable?.ownerUserName || '-'}</Descriptions.Item>
      <Descriptions.Item label="客户名称">{receivable?.customerName || '-'}</Descriptions.Item>
      <Descriptions.Item label="合同编号">{receivable?.contractNo || '-'}</Descriptions.Item>
      <Descriptions.Item label="回款期数">
        {receivable?.period ? `第 ${receivable.period} 期` : '-'}
      </Descriptions.Item>
      <Descriptions.Item label="审批状态">
        <Tag color={audit.color}>{audit.text}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="回款金额">
        ￥{(receivable?.price || 0).toFixed(2)}
      </Descriptions.Item>
      <Descriptions.Item label="回款日期">{receivable?.returnTime || '-'}</Descriptions.Item>
      <Descriptions.Item label="回款方式">
        {RETURN_TYPE[receivable?.returnType] || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="备注" span={2}>
        {receivable?.remark || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{receivable?.createTime || '-'}</Descriptions.Item>
    </Descriptions>
  )

  return (
    <DetailShell
      title={receivable?.no || '回款详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.RECEIVABLE} bizId={id} />
        }
      ]}
    />
  )
}

export default ReceivableDetail
