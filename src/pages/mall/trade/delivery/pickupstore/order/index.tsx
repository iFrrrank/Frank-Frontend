import React, { useRef, useState, useEffect } from 'react'
import { Card, Row, Col, Button, message } from 'antd'
import {
  FileTextOutlined,
  PayCircleOutlined,
  ContainerOutlined,
  TransactionOutlined,
  DisconnectOutlined,
  CheckOutlined,
  ApiOutlined
} from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { tableActionStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { getOrderPage, getOrderSummary } from '@/api/mall/trade/order'
import { CompositeSearch } from '@/components/CompositeSearch'
import { rootStyle, innerStyles, iconBaseStyle, combinateRecordNumber } from '@/styles/common.style'
import { PAY_ORDER_STATUS, TRADE_ORDER_STATUS } from '@/utils/constantsValue'

const OrderPickUpManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [summaryData, setSummaryData] = useState({
    orderCount: 0,
    orderPayPrice: 0.0,
    afterSaleCount: 0,
    afterSalePrice: 0.0
  })

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getOrderSummary({ deliveryType: 3 } as any)
        if (res.code === 0 && res.data) {
          setSummaryData({
            orderCount: res.data.orderCount || 0,
            orderPayPrice: res.data.orderPayPrice || 0.0,
            afterSaleCount: res.data.afterSaleCount || 0,
            afterSalePrice: res.data.afterSalePrice || 0.0
          })
        }
      } catch (error) {
        console.error('获取统计数据失败', error)
      }
    }
    fetchSummary()
  }, [])

  const summaryCards = [
    {
      title: '订单数量',
      value: summaryData.orderCount,
      icon: <FileTextOutlined />,
      bgColor: '#e6f7ff',
      iconColor: '#1890ff'
    },
    {
      title: '订单金额',
      value: `￥ ${(summaryData.orderPayPrice / 100).toFixed(2)}`,
      icon: <PayCircleOutlined />,
      bgColor: '#f9f0ff',
      iconColor: '#b37feb'
    },
    {
      title: '退款单数',
      value: summaryData.afterSaleCount,
      icon: <ContainerOutlined />,
      bgColor: '#fffbe6',
      iconColor: '#faad14'
    },
    {
      title: '退款金额',
      value: `￥ ${(summaryData.afterSalePrice / 100).toFixed(2)}`,
      icon: <TransactionOutlined />,
      bgColor: '#f6ffed',
      iconColor: '#52c41a'
    }
  ]

  const columns: ProColumns<API.TradeOrderPageItemRespVO>[] = [
    {
      title: '聚合搜索',
      dataIndex: 'searchKeyword',
      hideInTable: true,
      initialValue: { type: 'orderNo' },
      renderFormItem: () => <CompositeSearch />
    },
    {
      title: '自提门店',
      dataIndex: 'pickUpStoreId',
      valueType: 'select',
      hideInTable: true,
      fieldProps: { placeholder: '请选择自提门店' },
      request: async () => {
        return []
      }
    },
    {
      title: '订单号',
      dataIndex: 'no',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '商品信息',
      dataIndex: 'items',
      align: 'center',
      hideInSearch: true,
      width: 200
    },
    {
      title: '用户信息',
      dataIndex: 'user',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <div>
          <div>{record.user?.nickname}</div>
          <div>{record.receiverMobile}</div>
        </div>
      )
    },
    {
      title: '推荐人信息',
      dataIndex: 'brokerageUser',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.brokerageUser?.nickname || '-'
    },
    {
      title: '实付金额(元)',
      dataIndex: 'payPrice',
      valueType: 'money',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: (val) => (val / 100).toFixed(2)
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueEnum: PAY_ORDER_STATUS
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      hideInSearch: true,
      valueEnum: TRADE_ORDER_STATUS
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 120,
      hideInSearch: true
    },
    {
      title: '核销员',
      dataIndex: 'pickUpVerifyUserId',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.brokerageUserId || '-'
    },
    {
      title: '核销门店',
      dataIndex: 'pickUpStoreId',
      align: 'center',
      width: 120,
      hideInSearch: true,
      render: (_, record) => record.pickUpStoreId || '-'
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a onClick={() => message.info('跳转订单详情')}>{textConst.action.detail}</a>
        </div>
      )
    }
  ]

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {summaryCards.map((item, index) => (
          <Col span={6} key={index}>
            <Card title={item.title} style={rootStyle} styles={innerStyles} variant="borderless">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{ ...iconBaseStyle, backgroundColor: item.bgColor, color: item.iconColor }}
                >
                  {item.icon}
                </div>
                <div style={combinateRecordNumber}>{item.value}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <ProTable<API.TradeOrderPageItemRespVO>
        headerTitle="核销订单"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={{
          labelWidth: 'auto',
          span: 6
        }}
        toolBarRender={() => [
          <Button
            key="verify"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => message.info('打开核销弹窗')}
          >
            核销
          </Button>,
          <Button
            key="connect"
            type="primary"
            color="green"
            variant="filled"
            icon={<ApiOutlined />}
          >
            连接扫描枪
          </Button>,
          <Button
            key="disconnect"
            type="primary"
            color="volcano"
            variant="filled"
            icon={<DisconnectOutlined />}
          >
            断开扫描枪
          </Button>
        ]}
        request={async (params) => {
          const { current, pageSize, createTime, searchKeyword, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            startTime: createTime?.[0] ? createTime[0] + ' 00:00:00' : undefined,
            endTime: createTime?.[1] ? createTime[1] + ' 23:59:59' : undefined,
            searchType: searchKeyword?.type || undefined,
            searchValue: searchKeyword?.keyword || undefined,
            deliveryType: 3,
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
    </>
  )
}

export default OrderPickUpManagement
