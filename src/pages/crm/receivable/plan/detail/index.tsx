import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd'
import { useSearchParams } from '@umijs/max'
import { getReceivablePlan } from '@/api/crm/receivablePlan'
import { getReceivablePage } from '@/api/crm/receivable'
import DetailShell from '../../../components/DetailShell'
import FollowUpPanel, { CRM_BIZ_TYPE } from '../../../components/FollowUpPanel'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'

// 提醒类型
const REMIND_TYPE: Record<number, string> = {
  0: '不提醒',
  1: '一天前',
  2: '三天前',
  3: '五天前',
  4: '七天前'
}

// 回款计划详情：基本信息、本计划的回款记录、跟进记录
const ReceivablePlanDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const id = Number(searchParams.get('id'))
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<any>()

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const resp = await getReceivablePlan({ id } as any)
      if (resp.code === 0) {
        setPlan(resp.data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const info = (
    <Descriptions column={2} bordered size="small">
      <Descriptions.Item label="期数">
        {plan?.period ? `第 ${plan.period} 期` : '-'}
      </Descriptions.Item>
      <Descriptions.Item label="负责人">{plan?.ownerUserName || '-'}</Descriptions.Item>
      <Descriptions.Item label="客户名称">{plan?.customerName || '-'}</Descriptions.Item>
      <Descriptions.Item label="合同编号">{plan?.contractNo || '-'}</Descriptions.Item>
      <Descriptions.Item label="计划回款金额">￥{(plan?.price || 0).toFixed(2)}</Descriptions.Item>
      <Descriptions.Item label="计划回款日期">{plan?.returnTime || '-'}</Descriptions.Item>
      <Descriptions.Item label="实际回款金额">
        {plan?.receivablePrice !== undefined ? `￥${Number(plan.receivablePrice).toFixed(2)}` : '-'}
      </Descriptions.Item>
      <Descriptions.Item label="提前提醒">
        {plan?.remindDays !== undefined
          ? `提前 ${plan.remindDays} 天`
          : REMIND_TYPE[plan?.remindType] || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="提醒日期">{plan?.remindTime || '-'}</Descriptions.Item>
      <Descriptions.Item label="备注" span={2}>
        {plan?.remark || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">{plan?.createTime || '-'}</Descriptions.Item>
    </Descriptions>
  )

  // 本计划下的回款记录（按 planId 过滤）
  const planReceivableColumns: ProColumns<any>[] = [
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
    { title: '负责人', dataIndex: 'ownerUserName', align: 'center', width: 100 }
  ]

  return (
    <DetailShell
      title={plan ? `回款计划（第 ${plan.period} 期）` : '回款计划详情'}
      loading={loading}
      tabItems={[
        { key: 'info', label: '详细信息', children: info },
        {
          key: 'receivable',
          label: '回款记录',
          children: (
            <ProTable<any>
              rowKey="id"
              columns={planReceivableColumns}
              search={false}
              options={false}
              request={async (params) => {
                const resp = await getReceivablePage({
                  pageNo: params.current || 1,
                  pageSize: params.pageSize || 10,
                  planId: id
                } as any)
                return {
                  data: resp.data?.list || [],
                  success: true,
                  total: resp.data?.total || 0
                }
              }}
              pagination={{ pageSize: 10, align: 'center' }}
            />
          )
        },
        {
          key: 'followup',
          label: '跟进记录',
          children: <FollowUpPanel bizType={CRM_BIZ_TYPE.RECEIVABLE_PLAN} bizId={id} />
        }
      ]}
    />
  )
}

export default ReceivablePlanDetail
