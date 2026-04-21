import React, { useRef } from 'react'
import { message } from 'antd'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { getOrderPage } from '@/api/mall/trade/order'
import {
  TRADE_ORDER_STATUS,
  PAY_CHANNEL,
  ORDER_SOURCE,
  TRADE_ORDER_TYPE,
  DELIVERY_TYPE,
  AFTER_SALE_STATUS
} from '@/utils/constantsValue'
import { CompositeSearch } from '@/components/CompositeSearch'

const OrderManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)

  const columns: ProColumns<any>[] = [
    {
      title: '聚合搜索',
      dataIndex: 'searchKeyword',
      hideInTable: true,
      initialValue: { type: 'orderNo' },
      renderFormItem: () => <CompositeSearch />
    },
    {
      title: '商品信息',
      dataIndex: 'items',
      hideInSearch: true,
      align: 'center',
      width: 150,
      render: (_, record) => {
        const items = record.items || []
        if (items.length === 0) return '-'
      }
    },
    {
      title: '单价(元)/数量',
      dataIndex: 'priceInfo',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => {
        const items = record.items || []
        if (items.length === 0) return '-'
        return (
          <div>
            <div>￥{(items[0].price / 100).toFixed(2)}</div>
            <div style={{ color: '#999' }}>x {items[0].count}</div>
          </div>
        )
      }
    },
    {
      title: '实付金额(元)',
      dataIndex: 'payPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '买家/收货人',
      dataIndex: 'receiver',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>{record.receiverName}</div>
          <div style={{ color: '#999' }}>{record.receiverMobile}</div>
        </div>
      )
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: '全部' },
      valueEnum: TRADE_ORDER_STATUS
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: { placeholder: '全部' },
      valueEnum: TRADE_ORDER_TYPE
    },
    {
      title: '订单来源',
      dataIndex: 'terminal',
      valueType: 'select',
      align: 'center',
      width: 100,
      hideInTable: true,
      fieldProps: { placeholder: '全部' },
      valueEnum: ORDER_SOURCE
    },
    {
      title: '支付方式',
      dataIndex: 'payChannelCode',
      width: 100,
      align: 'center',
      valueType: 'select',
      valueEnum: PAY_CHANNEL,
      fieldProps: { placeholder: '全部' }
    },
    {
      title: '配送方式',
      dataIndex: 'deliveryType',
      align: 'center',
      width: 100,
      valueType: 'select',
      fieldProps: { placeholder: '全部' },
      valueEnum: DELIVERY_TYPE
    },
    {
      title: '售后状态',
      dataIndex: 'refundStatus',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: AFTER_SALE_STATUS
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 100,
      fieldProps: { placeholder: ['开始日期', '结束日期'] }
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a onClick={() => message.info('跳转详情页逻辑')}>详情</a>
          {record.status === 10 && <a onClick={() => message.info('触发发货弹窗')}>发货</a>}
        </div>
      )
    }
  ]

  return (
    <ProTable<any>
      headerTitle="订单列表"
      actionRef={actionRef}
      rowKey="id"
      form={{ colon: false }}
      columns={columns}
      search={{ labelWidth: 'auto', span: 6 }}
      request={async (params) => {
        const { current, pageSize, createTime, searchKeyword, ...rest } = params
        const req = {
          pageNo: current || 1,
          pageSize: pageSize || 10,
          startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
          endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
          searchType: searchKeyword?.type || undefined,
          searchValue: searchKeyword?.keyword || undefined,
          ...rest
        }
        try {
          const res = await getOrderPage(req as any)
          return {
            data: res.data?.list || [],
            success: res.code === 0,
            total: res.data?.total || 0
          }
        } catch (error) {
          return { data: [], success: false, total: 0 }
        }
      }}
      pagination={{ align: 'center', showSizeChanger: true }}
    />
  )
}

export default OrderManagement
