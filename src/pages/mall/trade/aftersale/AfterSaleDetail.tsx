import React, { useState } from 'react'
import { Descriptions, Divider, Drawer, Timeline } from 'antd'
import { getOrderDetail1 } from '@/api/mall/trade/afterSale'

export let handleOpenAfterSaleDetail: (record: any) => void

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 售后状态文案（与列表页口径一致）
const AFTER_SALE_STATUS_TEXT: Record<number, string> = {
  10: '待审核',
  20: '待退货',
  30: '待收货',
  40: '待退款',
  50: '已退款',
  60: '已拒绝',
  61: '买家取消',
  62: '已关闭'
}

// 售后详情抽屉：售后信息 + 关联订单信息 + 处理日志
const AfterSaleDetail: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  handleOpenAfterSaleDetail = async (record: any) => {
    try {
      const resp = await getOrderDetail1({ id: record.id } as any)
      setDetailData(resp.code === 0 && resp.data ? resp.data : record)
    } catch {
      setDetailData(record)
    }
    setDrawerVisible(true)
  }

  const detail = detailData || {}
  // 详情接口返回结构：{ ...售后字段, order: 关联订单, logs: 处理日志 }
  const order = detail.order || {}
  const logs: any[] = detail.logs || []

  return (
    <Drawer
      title={`售后详情（编号：${detail.id || ''}）`}
      placement="right"
      width={760}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false)
        setDetailData(null)
      }}
      destroyOnHidden
    >
      {detailData && (
        <>
          <Descriptions title="售后信息" column={2} bordered size="small">
            <Descriptions.Item label="售后编号">{detail.id}</Descriptions.Item>
            <Descriptions.Item label="售后状态">
              {AFTER_SALE_STATUS_TEXT[detail.status] || detail.status}
            </Descriptions.Item>
            <Descriptions.Item label="售后类型">
              {detail.type === 10 ? '仅退款' : detail.type === 20 ? '退货退款' : detail.type}
            </Descriptions.Item>
            <Descriptions.Item label="退款金额">{fenToYuan(detail.refundPrice)}</Descriptions.Item>
            <Descriptions.Item label="申请原因">{detail.applyReason || '-'}</Descriptions.Item>
            <Descriptions.Item label="申请说明">{detail.applyDescription || '-'}</Descriptions.Item>
            <Descriptions.Item label="审批备注">{detail.auditReason || '-'}</Descriptions.Item>
            <Descriptions.Item label="退货物流">
              {detail.logisticsNo ? `${detail.logisticsId || ''} ${detail.logisticsNo}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="退款时间">{detail.refundTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{detail.createTime}</Descriptions.Item>
          </Descriptions>

          <Divider />
          <Descriptions title="关联订单" column={2} bordered size="small">
            <Descriptions.Item label="订单单号">{order.no || detail.orderId}</Descriptions.Item>
            <Descriptions.Item label="商品">{detail.spuName || order.items?.[0]?.spuName || '-'}</Descriptions.Item>
            <Descriptions.Item label="订单实付">{fenToYuan(order.payPrice)}</Descriptions.Item>
            <Descriptions.Item label="买家编号">{detail.userId || order.userId}</Descriptions.Item>
          </Descriptions>

          {logs.length > 0 && (
            <>
              <Divider />
              <div style={{ fontWeight: 600, marginBottom: 12 }}>处理日志</div>
              <Timeline
                items={logs.map((log: any) => ({
                  children: (
                    <span>
                      <span style={{ color: '#888' }}>{log.createTime}</span>
                      {'  '}
                      {log.content}
                    </span>
                  )
                }))}
              />
            </>
          )}
        </>
      )}
    </Drawer>
  )
}

export default AfterSaleDetail
