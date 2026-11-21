import React, { useEffect, useState } from 'react'
import { Card, Col, DatePicker, Row, Statistic } from 'antd'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { getTradeStatisticsAnalyse, getTradeStatisticsList } from '@/api/mall/statistics/trade'

// 金额（分）转元展示
const fenToYuan = (price?: number) => Number(((price || 0) / 100).toFixed(2))

// 环比涨跌幅
const rateText = (value?: number, reference?: number) => {
  if (!reference) {
    return '—'
  }
  const rate = (((value || 0) - reference) / reference) * 100
  return `${rate > 0 ? '+' : ''}${rate.toFixed(2)}%`
}

// 交易统计：上方为所选时段的交易状况（与对照期环比），下方为按天明细
const TradeStatistics: React.FC = () => {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(29, 'day'), dayjs()])
  const [analyse, setAnalyse] = useState<API.StatisticsComparison<API.TradeTrendSummaryRespVO>>()
  const [list, setList] = useState<API.TradeTrendSummaryRespVO[]>([])

  const load = async (times: [Dayjs, Dayjs]) => {
    const params = {
      times: [
        times[0].format('YYYY-MM-DD') + ' 00:00:00',
        times[1].format('YYYY-MM-DD') + ' 23:59:59'
      ]
    }
    const [analyseResp, listResp] = await Promise.all([
      getTradeStatisticsAnalyse(params),
      getTradeStatisticsList(params)
    ])
    if (analyseResp.code === 0) {
      setAnalyse(analyseResp.data)
    }
    if (listResp.code === 0) {
      setList(listResp.data || [])
    }
  }

  useEffect(() => {
    load(range)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const metrics: { title: string; field: keyof API.TradeTrendSummaryRespVO; money?: boolean }[] = [
    { title: '营业额', field: 'turnoverPrice', money: true },
    { title: '订单支付金额', field: 'orderPayPrice', money: true },
    { title: '充值金额', field: 'rechargePrice', money: true },
    { title: '支出金额', field: 'expensePrice', money: true },
    { title: '钱包支付金额', field: 'walletPayPrice', money: true },
    { title: '佣金结算金额', field: 'brokerageSettlementPrice', money: true },
    { title: '售后退款金额', field: 'afterSaleRefundPrice', money: true }
  ]

  const columns: ProColumns<API.TradeTrendSummaryRespVO>[] = [
    { title: '日期', dataIndex: 'time', align: 'center', width: 120 },
    {
      title: '营业额',
      dataIndex: 'turnoverPrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.turnoverPrice).toFixed(2)}`
    },
    {
      title: '订单支付金额',
      dataIndex: 'orderPayPrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.orderPayPrice).toFixed(2)}`
    },
    {
      title: '充值金额',
      dataIndex: 'rechargePrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.rechargePrice).toFixed(2)}`
    },
    {
      title: '支出金额',
      dataIndex: 'expensePrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.expensePrice).toFixed(2)}`
    },
    {
      title: '钱包支付金额',
      dataIndex: 'walletPayPrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.walletPayPrice).toFixed(2)}`
    },
    {
      title: '佣金结算金额',
      dataIndex: 'brokerageSettlementPrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.brokerageSettlementPrice).toFixed(2)}`
    },
    {
      title: '售后退款金额',
      dataIndex: 'afterSaleRefundPrice',
      align: 'center',
      render: (_, r) => `￥${fenToYuan(r.afterSaleRefundPrice).toFixed(2)}`
    }
  ]

  return (
    <PageContainer header={{ title: false }}>
      <Card style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          value={range}
          onChange={(values) => {
            if (values && values[0] && values[1]) {
              const next: [Dayjs, Dayjs] = [values[0], values[1]]
              setRange(next)
              load(next)
            }
          }}
          allowClear={false}
        />
      </Card>

      <Row gutter={16}>
        {metrics.map((metric) => (
          <Col md={6} sm={12} xs={24} key={metric.field} style={{ marginBottom: 16 }}>
            <Card>
              <Statistic
                title={metric.title}
                value={
                  metric.money
                    ? fenToYuan(analyse?.value?.[metric.field] as number)
                    : (analyse?.value?.[metric.field] as number) || 0
                }
                precision={metric.money ? 2 : 0}
                prefix={metric.money ? '￥' : undefined}
                suffix={
                  <span style={{ fontSize: 12, color: '#888' }}>
                    环比 {rateText(
                      analyse?.value?.[metric.field] as number,
                      analyse?.reference?.[metric.field] as number
                    )}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <ProTable<API.TradeTrendSummaryRespVO>
        headerTitle="交易状况明细"
        columns={columns}
        dataSource={list}
        rowKey="time"
        search={false}
        options={false}
        pagination={false}
      />
    </PageContainer>
  )
}

export default TradeStatistics
