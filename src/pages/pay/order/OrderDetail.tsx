import React, { useState } from 'react'
import { Descriptions, Drawer } from 'antd'
import { getOrderDetail } from '@/api/pay/order'
import { PAY_CHANNEL, PAY_ORDER_STATUS } from '@/utils/constantsValue'

export let handleOpenOrderDetail: (record: API.PayOrderPageItemRespVO) => void

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

// 支付订单详情：调 get-detail 接口，展示订单与支付通道回调内容
const OrderDetail: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  handleOpenOrderDetail = async (record: API.PayOrderPageItemRespVO) => {
    try {
      const resp = await getOrderDetail({ id: record.id } as any)
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

  const order = detailData || {}

  return (
    <Drawer
      title="支付订单详情"
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
          <Descriptions.Item label="商户单号">{order.merchantOrderId}</Descriptions.Item>
          <Descriptions.Item label="支付单号">{order.no}</Descriptions.Item>
          <Descriptions.Item label="应用编号">{order.appId}</Descriptions.Item>
          <Descriptions.Item label="应用名称">{order.appName}</Descriptions.Item>
          <Descriptions.Item label="支付状态">
            {PAY_ORDER_STATUS[order.status as keyof typeof PAY_ORDER_STATUS] || order.status}
          </Descriptions.Item>
          <Descriptions.Item label="支付金额">{fenToYuan(order.price)}</Descriptions.Item>
          <Descriptions.Item label="手续费">{fenToYuan(order.channelFeePrice)}</Descriptions.Item>
          <Descriptions.Item label="手续费比例">
            {order.channelFeeRate !== undefined ? `${order.channelFeeRate}%` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="支付时间">{order.successTime || '-'}</Descriptions.Item>
          <Descriptions.Item label="失效时间">{order.expireTime}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{order.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{order.updateTime}</Descriptions.Item>
          <Descriptions.Item label="商品标题">{order.subject}</Descriptions.Item>
          <Descriptions.Item label="商品描述">{order.body}</Descriptions.Item>
          <Descriptions.Item label="支付渠道">
            {PAY_CHANNEL[order.channelCode as keyof typeof PAY_CHANNEL] || order.channelCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="支付 IP">{order.userIp}</Descriptions.Item>
          <Descriptions.Item label="渠道单号">{order.channelOrderNo || '-'}</Descriptions.Item>
          <Descriptions.Item label="渠道用户">{order.channelUserId || '-'}</Descriptions.Item>
          <Descriptions.Item label="退款金额">{fenToYuan(order.refundPrice)}</Descriptions.Item>
          <Descriptions.Item label="通知 URL">{order.notifyUrl}</Descriptions.Item>
          <Descriptions.Item label="支付通道异步回调内容" span={2}>
            <span style={{ wordBreak: 'break-all' }}>
              {order.extension?.channelNotifyData || '-'}
            </span>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  )
}

export default OrderDetail
