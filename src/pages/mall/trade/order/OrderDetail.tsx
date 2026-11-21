import React, { useState } from 'react'
import { Descriptions, Divider, Drawer, Table, Timeline } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getOrderDetail } from '@/api/mall/trade/order'
import {
  AFTER_SALE_STATUS,
  DELIVERY_TYPE,
  PAY_CHANNEL,
  TRADE_ORDER_STATUS,
  TRADE_ORDER_TYPE
} from '@/utils/constantsValue'

export let handleOpenOrderDetail: (record: any) => void

// 金额（分）转元展示
const fenToYuan = (price?: number) => `￥${((price || 0) / 100).toFixed(2)}`

const enumText = (map: Record<string, any>, value: any) =>
  value === undefined || value === null ? '-' : map[value] || value

// 订单详情抽屉：订单信息、收货信息、商品清单、操作日志、物流信息
const OrderDetail: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)

  handleOpenOrderDetail = async (record: any) => {
    try {
      const resp = await getOrderDetail({ id: record.id } as any)
      setDetailData(resp.code === 0 && resp.data ? resp.data : record)
    } catch {
      setDetailData(record)
    }
    setDrawerVisible(true)
  }

  const order = detailData || {}
  const items: any[] = order.items || []
  const logs: any[] = order.logs || []

  const itemColumns: ColumnsType<any> = [
    {
      title: '商品',
      dataIndex: 'spuName',
      ellipsis: true
    },
    {
      title: '规格',
      dataIndex: 'properties',
      width: 140,
      render: (_, record) =>
        (record.properties || []).map((p: any) => `${p.propertyName}：${p.valueName}`).join(' ') ||
        '-'
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: 90,
      align: 'center',
      render: (_, record) => fenToYuan(record.price)
    },
    {
      title: '数量',
      dataIndex: 'count',
      width: 60,
      align: 'center'
    },
    {
      title: '小计',
      width: 90,
      align: 'center',
      render: (_, record) => fenToYuan((record.price || 0) * (record.count || 0))
    },
    {
      title: '售后状态',
      dataIndex: 'afterSaleStatus',
      width: 90,
      align: 'center',
      render: (_, record) => enumText(AFTER_SALE_STATUS, record.afterSaleStatus)
    }
  ]

  return (
    <Drawer
      title={`订单详情（${order.no || ''}）`}
      placement="right"
      width={860}
      open={drawerVisible}
      onClose={() => {
        setDrawerVisible(false)
        setDetailData(null)
      }}
      destroyOnHidden
    >
      {detailData && (
        <>
          <Descriptions title="订单信息" column={2} bordered size="small">
            <Descriptions.Item label="订单单号">{order.no}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
              {enumText(TRADE_ORDER_STATUS, order.status)}
            </Descriptions.Item>
            <Descriptions.Item label="订单类型">
              {enumText(TRADE_ORDER_TYPE, order.type)}
            </Descriptions.Item>
            <Descriptions.Item label="配送方式">
              {enumText(DELIVERY_TYPE, order.deliveryType)}
            </Descriptions.Item>
            <Descriptions.Item label="支付单号">{order.payOrderId || '-'}</Descriptions.Item>
            <Descriptions.Item label="支付方式">
              {enumText(PAY_CHANNEL, order.payChannelCode)}
            </Descriptions.Item>
            <Descriptions.Item label="支付时间">{order.payTime || '-'}</Descriptions.Item>
            <Descriptions.Item label="买家编号">{order.userId}</Descriptions.Item>
            <Descriptions.Item label="商品总额">{fenToYuan(order.totalPrice)}</Descriptions.Item>
            <Descriptions.Item label="运费">{fenToYuan(order.deliveryPrice)}</Descriptions.Item>
            <Descriptions.Item label="优惠金额">
              {fenToYuan((order.couponPrice || 0) + (order.discountPrice || 0))}
            </Descriptions.Item>
            <Descriptions.Item label="实付金额">{fenToYuan(order.payPrice)}</Descriptions.Item>
            <Descriptions.Item label="买家留言">{order.userRemark || '-'}</Descriptions.Item>
            <Descriptions.Item label="商家备注">{order.remark || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{order.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{order.updateTime}</Descriptions.Item>
          </Descriptions>

          <Divider />
          <Descriptions title="收货信息" column={2} bordered size="small">
            <Descriptions.Item label="收货人">{order.receiverName || '-'}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{order.receiverMobile || '-'}</Descriptions.Item>
            <Descriptions.Item label="收货地址" span={2}>
              {order.receiverDetailAddress || order.pickUpStoreId || '-'}
            </Descriptions.Item>
            {order.logisticsId !== undefined && order.logisticsId !== null && (
              <>
                <Descriptions.Item label="物流单号">{order.logisticsNo || '-'}</Descriptions.Item>
                <Descriptions.Item label="发货时间">{order.deliveryTime || '-'}</Descriptions.Item>
              </>
            )}
          </Descriptions>

          <Divider />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>商品清单</div>
          <Table
            columns={itemColumns}
            dataSource={items}
            rowKey="id"
            size="small"
            pagination={false}
          />

          {logs.length > 0 && (
            <>
              <Divider />
              <div style={{ fontWeight: 600, marginBottom: 12 }}>订单操作日志</div>
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

export default OrderDetail
