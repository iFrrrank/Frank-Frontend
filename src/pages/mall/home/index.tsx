import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Row, Statistic } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import { getMemberSummary, getUserCountComparison } from '@/api/mall/statistics/member'
import { getWalletRechargePrice } from '@/api/mall/statistics/pay'
import {
  getOrderCount,
  getOrderCountTrendComparison,
  getTradeStatisticsSummary
} from '@/api/mall/statistics/trade'

// 金额（分）转元展示
const fenToYuan = (price?: number) => Number(((price || 0) / 100).toFixed(2))

// 对照涨跌幅文案：本期相对对照期的变化百分比
const comparisonText = (value?: number, reference?: number) => {
  if (!reference) {
    return '—'
  }
  const rate = (((value || 0) - reference) / reference) * 100
  const sign = rate > 0 ? '+' : ''
  return `${sign}${rate.toFixed(2)}%`
}

// 商城首页：交易/会员对照卡片、订单量趋势、运营待办与快捷入口、会员概况
const MallHome: React.FC = () => {
  const [tradeSummary, setTradeSummary] = useState<API.StatisticsComparison<API.TradeSummaryRespVO>>()
  const [userComparison, setUserComparison] =
    useState<API.StatisticsComparison<API.MemberCountRespVO>>()
  const [memberSummary, setMemberSummary] = useState<API.MemberSummaryRespVO>()
  const [rechargePrice, setRechargePrice] = useState<number>()
  const [orderCount, setOrderCount] = useState<API.TradeOrderCountRespVO>()
  const [trend, setTrend] = useState<API.StatisticsComparison<API.TradeOrderTrendRespVO>[]>([])

  useEffect(() => {
    const load = async () => {
      const [tradeResp, userResp, memberResp, payResp, countResp, trendResp] = await Promise.all([
        getTradeStatisticsSummary(),
        getUserCountComparison(),
        getMemberSummary(),
        getWalletRechargePrice(),
        getOrderCount(),
        // 订单量趋势：近 30 天（type=1 按日统计），与前 30 天对照
        getOrderCountTrendComparison({
          type: 1,
          beginTime: dayjs().subtract(29, 'day').format('YYYY-MM-DD') + ' 00:00:00',
          endTime: dayjs().format('YYYY-MM-DD') + ' 23:59:59'
        })
      ])
      if (tradeResp.code === 0) setTradeSummary(tradeResp.data)
      if (userResp.code === 0) setUserComparison(userResp.data)
      if (memberResp.code === 0) setMemberSummary(memberResp.data)
      if (payResp.code === 0) setRechargePrice(payResp.data?.rechargePrice)
      if (countResp.code === 0) setOrderCount(countResp.data)
      if (trendResp.code === 0) setTrend(trendResp.data || [])
    }
    load()
  }, [])

  const trendOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: { data: ['订单数量', '对照期订单数量'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trend.map((item) => item.value?.date)
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '订单数量',
          type: 'line',
          smooth: true,
          data: trend.map((item) => item.value?.orderPayCount || 0)
        },
        {
          name: '对照期订单数量',
          type: 'line',
          smooth: true,
          data: trend.map((item) => item.reference?.orderPayCount || 0)
        }
      ]
    }),
    [trend]
  )

  const shortcuts: { name: string; path: string }[] = [
    { name: '商品列表', path: '/mall/product/spu' },
    { name: '订单列表', path: '/mall/trade/order' },
    { name: '售后退款', path: '/mall/trade/after-sale' },
    { name: '优惠券', path: '/mall/promotion/coupon/template' },
    { name: '秒杀活动', path: '/mall/promotion/seckill/activity' },
    { name: '积分商城', path: '/mall/promotion/point/activity' }
  ]

  return (
    <PageContainer header={{ title: false }}>
      {/* 对照卡片：本期值 + 与对照期的涨跌 */}
      <Row gutter={16}>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="昨日订单量"
              value={tradeSummary?.value?.yesterdayOrderCount || 0}
              suffix={
                <span style={{ fontSize: 12, color: '#888' }}>
                  对照 {comparisonText(
                    tradeSummary?.value?.yesterdayOrderCount,
                    tradeSummary?.reference?.yesterdayOrderCount
                  )}
                </span>
              }
            />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="本月订单量"
              value={tradeSummary?.value?.monthOrderCount || 0}
              suffix={
                <span style={{ fontSize: 12, color: '#888' }}>
                  对照 {comparisonText(
                    tradeSummary?.value?.monthOrderCount,
                    tradeSummary?.reference?.monthOrderCount
                  )}
                </span>
              }
            />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="昨日支付金额"
              value={fenToYuan(tradeSummary?.value?.yesterdayPayPrice)}
              precision={2}
              prefix="￥"
            />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="本月支付金额"
              value={fenToYuan(tradeSummary?.value?.monthPayPrice)}
              precision={2}
              prefix="￥"
            />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic
              title="今日访问用户"
              value={Number(userComparison?.value?.visitUserCount || 0)}
              suffix={
                <span style={{ fontSize: 12, color: '#888' }}>
                  对照 {comparisonText(
                    Number(userComparison?.value?.visitUserCount || 0),
                    Number(userComparison?.reference?.visitUserCount || 0)
                  )}
                </span>
              }
            />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic title="今日注册用户" value={userComparison?.value?.registerUserCount || 0} />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic title="钱包充值总额" value={fenToYuan(rechargePrice)} precision={2} prefix="￥" />
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{ marginBottom: 16 }}>
            <Statistic title="会员总数" value={memberSummary?.userCount || 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col md={16} sm={24} xs={24}>
          <Card title="订单量趋势（近 30 天）" style={{ marginBottom: 16 }}>
            <ReactECharts option={trendOption} style={{ height: 320 }} />
          </Card>
        </Col>
        <Col md={8} sm={24} xs={24}>
          <Card title="运营待办" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="待发货" value={orderCount?.undelivered || 0} />
              </Col>
              <Col span={12}>
                <Statistic title="待核销" value={orderCount?.pickUp || 0} />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic title="退款中" value={orderCount?.afterSaleApply || 0} />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic title="提现待审核" value={orderCount?.auditingWithdraw || 0} />
              </Col>
            </Row>
          </Card>
          <Card title="会员概况" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="充值用户" value={memberSummary?.rechargeUserCount || 0} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="充值金额"
                  value={fenToYuan(memberSummary?.rechargePrice)}
                  precision={2}
                  prefix="￥"
                />
              </Col>
              <Col span={12} style={{ marginTop: 16 }}>
                <Statistic
                  title="消费金额"
                  value={fenToYuan(memberSummary?.expensePrice)}
                  precision={2}
                  prefix="￥"
                />
              </Col>
            </Row>
          </Card>
          <Card title="快捷入口">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {shortcuts.map((item) => (
                <Button key={item.path} onClick={() => history.push(item.path)}>
                  {item.name}
                </Button>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}

export default MallHome
