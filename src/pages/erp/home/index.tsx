import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import SummaryCard from './components/SummaryCard'
import TimeSummaryChart from './components/TimeSummaryChart'
import { getPurchaseSummary, getPurchaseTimeSummary } from '@/api/erp/statistics/purchase'
import { getSaleSummary, getSaleTimeSummary } from '@/api/erp/statistics/sale'

// ERP 首页：上方 8 张销售/采购金额卡片，下方销售/采购时段统计图
const ErpHome: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [saleSummary, setSaleSummary] = useState<API.ErpSaleSummaryRespVO>()
  const [purchaseSummary, setPurchaseSummary] = useState<API.ErpPurchaseSummaryRespVO>()
  const [saleTimeSummary, setSaleTimeSummary] = useState<API.ErpSaleTimeSummaryRespVO[]>([])
  const [purchaseTimeSummary, setPurchaseTimeSummary] = useState<
    API.ErpPurchaseTimeSummaryRespVO[]
  >([])

  useEffect(() => {
    const load = async () => {
      try {
        // 销售与采购统计并行加载
        const [saleResp, saleTimeResp, purchaseResp, purchaseTimeResp] = await Promise.all([
          getSaleSummary(),
          getSaleTimeSummary({} as any),
          getPurchaseSummary(),
          getPurchaseTimeSummary({} as any)
        ])
        if (saleResp.code === 0) {
          setSaleSummary(saleResp.data)
        }
        if (saleTimeResp.code === 0) {
          setSaleTimeSummary(saleTimeResp.data || [])
        }
        if (purchaseResp.code === 0) {
          setPurchaseSummary(purchaseResp.data)
        }
        if (purchaseTimeResp.code === 0) {
          setPurchaseTimeSummary(purchaseTimeResp.data || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <PageContainer header={{ title: false }}>
      {/* 销售/采购的全局统计 */}
      <Row gutter={16}>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="今日销售" value={saleSummary?.todayPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="昨日销售" value={saleSummary?.yesterdayPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="今日采购" value={purchaseSummary?.todayPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="昨日采购" value={purchaseSummary?.yesterdayPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="本月销售" value={saleSummary?.monthPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="今年销售" value={saleSummary?.yearPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="本月采购" value={purchaseSummary?.monthPrice} loading={loading} />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <SummaryCard title="今年采购" value={purchaseSummary?.yearPrice} loading={loading} />
        </Col>
      </Row>
      {/* 销售/采购的时段统计 */}
      <Row gutter={16}>
        <Col md={12} sm={24} xs={24}>
          <TimeSummaryChart title="销售统计" value={saleTimeSummary} />
        </Col>
        <Col md={12} sm={24} xs={24}>
          <TimeSummaryChart title="采购统计" value={purchaseTimeSummary} />
        </Col>
      </Row>
    </PageContainer>
  )
}

export default ErpHome
