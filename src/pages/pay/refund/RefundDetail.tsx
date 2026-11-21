import React, { useState } from 'react'
import { Descriptions, Drawer } from 'antd'
import { getRefund1 } from '@/api/pay/refund'
import { PAY_CHANNEL, PAY_REFUND_STATUS } from '@/utils/constantsValue'

export let handleOpenRefundDetail: (record: any) => void

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 退款订单详情
const RefundDetail: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  handleOpenRefundDetail = async (record: any) => {
    try {
      const resp = await getRefund1({ id: record.id } as any)
      if (resp.code === 0 && resp.data) {
        setDetailData(resp.data)
      } else {
        setDetailData(record)
      }
    } catch {
      setDetailData(record)
    }
    setDrawerVisible(true)
  }

  const refund = detailData || {}

  return (
    <Drawer
      title="退款订单详情"
      placement="right"
      width={720}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false)
        setDetailData(null)
      }}
      destroyOnHidden
    >
      {detailData && (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="商户退款单号">{refund.merchantRefundId}</Descriptions.Item>
          <Descriptions.Item label="渠道退款单号">{refund.channelRefundNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="商户支付单号">{refund.merchantOrderId}</Descriptions.Item>
          <Descriptions.Item label="渠道支付单号">{refund.channelOrderNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="应用编号">{refund.appId}</Descriptions.Item>
          <Descriptions.Item label="应用名称">{refund.appName}</Descriptions.Item>
          <Descriptions.Item label="支付金额">{fenToYuan(refund.payPrice)}</Descriptions.Item>
          <Descriptions.Item label="退款金额">{fenToYuan(refund.refundPrice)}</Descriptions.Item>
          <Descriptions.Item label="退款状态">
            {PAY_REFUND_STATUS[refund.status as keyof typeof PAY_REFUND_STATUS] || refund.status}
          </Descriptions.Item>
          <Descriptions.Item label="退款时间">{refund.successTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{refund.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{refund.updateTime}</Descriptions.Item>
          <Descriptions.Item label="退款渠道">
            {PAY_CHANNEL[refund.channelCode as keyof typeof PAY_CHANNEL] || refund.channelCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="退款原因">{refund.reason}</Descriptions.Item>
          <Descriptions.Item label="退款 IP">{refund.userIp}</Descriptions.Item>
          <Descriptions.Item label="通知 URL">{refund.notifyUrl}</Descriptions.Item>
          <Descriptions.Item label="渠道错误码">{refund.channelErrorCode || '-'}</Descriptions.Item>
          <Descriptions.Item label="渠道错误码描述">
            {refund.channelErrorMsg || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="支付通道异步回调内容" span={2}>
            <span style={{ wordBreak: 'break-all' }}>{refund.channelNotifyData || '-'}</span>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  )
}

export default RefundDetail
