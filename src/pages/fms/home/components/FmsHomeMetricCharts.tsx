import React, { useMemo } from 'react'
import { Col, Empty, Row, Spin } from 'antd'
import ReactECharts from 'echarts-for-react'
import { formatAmount } from '../../utils/format'

interface FmsHomeMetricChartsProps {
  home?: API.FmsHomeRespVO
  metricDetail?: API.FmsHomeMetricDetailRespVO
  selectedMetricKey?: string
  loading: boolean
}

const FMS_HOME_METRIC_COLORS = [
  '#409eff',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#36cfc9',
  '#9254de',
  '#ff85c0',
  '#597ef7'
]

/** 格式化坐标轴金额 */
function formatCompactAmount(amount: number) {
  const value = Number(amount || 0)
  if (Math.abs(value) >= 10000) return `${(value / 10000).toFixed(1)}万`
  return value.toFixed(0)
}

/**
 * 财务首页图表组件（财务指标趋势图 + 本期指标结构分析饼图）
 */
const FmsHomeMetricCharts: React.FC<FmsHomeMetricChartsProps> = ({
  home,
  metricDetail,
  selectedMetricKey,
  loading
}) => {
  /** 趋势图配置 */
  const trendChartOptions = useMemo(() => {
    const commonOptions = {
      color: FMS_HOME_METRIC_COLORS,
      grid: { left: 16, right: 24, top: 48, bottom: 12, containLabel: true },
      legend: { top: 0 },
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: number) => formatAmount(Number(value))
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (value: number) => formatCompactAmount(value) }
      }
    }

    if (metricDetail) {
      return {
        ...commonOptions,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: (metricDetail.trends || []).map((item) => item.month)
        },
        series: [
          {
            name: metricDetail.name,
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.12 },
            data: (metricDetail.trends || []).map((item: any) => Number(item.amount || 0))
          }
        ]
      }
    }

    return {
      ...commonOptions,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (home?.trends || []).map((item) => item.month)
      },
      series: (home?.metrics || []).map((metric) => ({
        name: metric.name,
        type: 'line',
        smooth: true,
        data: (home?.trends || []).map(
          (trend: any) =>
            (trend.metrics || []).find((item: any) => item.key === metric.key)?.amount || 0
        )
      }))
    }
  }, [home, metricDetail])

  /** 构建科目构成图数据 */
  const structureChartData = useMemo(() => {
    if (!metricDetail) {
      return (home?.metrics || [])
        .filter((metric) => Number(metric.amount) > 0)
        .map((metric) => ({
          name: metric.name,
          value: Number(metric.amount)
        }))
    }
    const structure = (metricDetail.structure || [])
      .filter((item) => Number(item.amount) > 0)
      .map((item) => ({
        name: `${item.subjectCode} ${item.subjectName}`,
        value: Number(item.amount)
      }))
    if (structure.length === 0) {
      const metric = (home?.metrics || []).find((item) => item.key === selectedMetricKey)
      return metric && Number(metric.amount) > 0
        ? [{ name: metric.name, value: Number(metric.amount) }]
        : []
    }
    const result = structure.slice(0, 5)
    if (structure.length > 5) {
      result.push({
        name: '其他',
        value: structure.slice(5).reduce((total, item) => total + item.value, 0)
      })
    }
    return result
  }, [home, metricDetail, selectedMetricKey])

  /** 科目构成图配置 */
  const structureChartOptions = useMemo(
    () => ({
      color: FMS_HOME_METRIC_COLORS,
      tooltip: {
        trigger: 'item',
        valueFormatter: (value: number) => formatAmount(Number(value))
      },
      legend: { bottom: 0 },
      series: [
        {
          name: '本期指标',
          type: 'pie',
          radius: ['46%', '72%'],
          center: ['50%', '44%'],
          label: { formatter: '{b}\n{d}%' },
          data: structureChartData
        }
      ]
    }),
    [structureChartData]
  )

  /** 格式化当前会计期间的月份文案 */
  const formatCurrentMonth = () => {
    const month = Number(home?.currentMonth?.slice(5, 7))
    return month ? `${month}月` : ''
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginTop: 28 }}>
        <Col xs={24} xl={15}>
          <div
            style={{
              marginBottom: 16,
              fontSize: 16,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.88)'
            }}
          >
            {metricDetail ? `${metricDetail.name}变化趋势（单位：元）` : '财务指标趋势（单位：元）'}
          </div>
          <ReactECharts
            option={trendChartOptions}
            style={{ height: 360, width: '100%' }}
            notMerge
          />
        </Col>
        <Col xs={24} xl={9}>
          <div
            style={{
              marginBottom: 16,
              fontSize: 16,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.88)'
            }}
          >
            {metricDetail
              ? `${formatCurrentMonth()} ${metricDetail.name}结构分析（单位：元）`
              : '本期指标结构（单位：元）'}
          </div>
          {structureChartData.length > 0 ? (
            <ReactECharts
              option={structureChartOptions}
              style={{ height: 360, width: '100%' }}
              notMerge
            />
          ) : (
            <div
              style={{
                height: 360,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Empty description="暂无科目构成数据" />
            </div>
          )}
        </Col>
      </Row>
    </Spin>
  )
}

export default FmsHomeMetricCharts
