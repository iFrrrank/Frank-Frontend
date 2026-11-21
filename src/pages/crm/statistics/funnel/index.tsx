import React, { useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Statistic, Tabs } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import StatFilter from '../components/StatFilter'
import {
  getBusinessInversionRateSummaryByDate,
  getBusinessSummaryByDate,
  getBusinessSummaryByEndStatus,
  getFunnelSummary
} from '@/api/crm/statistics/funnel'

// 默认统计本月
const defaultParams = () => ({
  times: [
    dayjs().startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59'
  ],
  interval: 1
})

// 商机结束状态文案
const END_STATUS_TEXT: Record<number, string> = {
  0: '未结束',
  1: '赢单',
  2: '输单',
  3: '无效'
}

// 销售漏斗分析：漏斗汇总（客户→商机→赢单）、新增商机趋势、转化率趋势、结束状态分布
const FunnelAnalysis: React.FC = () => {
  const [queryParams, setQueryParams] = useState<any>(defaultParams())
  const [funnel, setFunnel] = useState<API.CrmStatisticFunnelSummaryRespVO>()
  const [summaryByDate, setSummaryByDate] = useState<any[]>([])
  const [inversionByDate, setInversionByDate] = useState<any[]>([])
  const [endStatusList, setEndStatusList] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const [funnelResp, summaryResp, inversionResp, endStatusResp] = await Promise.all([
        getFunnelSummary({ reqVO: queryParams } as any),
        getBusinessSummaryByDate({ reqVO: queryParams } as any),
        getBusinessInversionRateSummaryByDate({ reqVO: queryParams } as any),
        getBusinessSummaryByEndStatus({ reqVO: queryParams } as any)
      ])
      if (funnelResp.code === 0) setFunnel(funnelResp.data)
      if (summaryResp.code === 0) setSummaryByDate(summaryResp.data || [])
      if (inversionResp.code === 0) setInversionByDate(inversionResp.data || [])
      if (endStatusResp.code === 0) setEndStatusList(endStatusResp.data || [])
    }
    load()
  }, [queryParams])

  // 漏斗图：客户数 → 商机数 → 赢单数
  const funnelOption = useMemo(
    () => ({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'funnel',
          left: '10%',
          width: '80%',
          label: { show: true, position: 'inside' },
          data: [
            { value: funnel?.customerCount || 0, name: '客户数' },
            { value: funnel?.businessCount || 0, name: '商机数' },
            { value: funnel?.businessWinCount || 0, name: '赢单数' }
          ]
        }
      ]
    }),
    [funnel]
  )

  const summaryOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: { data: ['新增商机数', '新增商机金额'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: summaryByDate.map((i) => i.time) },
      yAxis: [{ type: 'value' }, { type: 'value' }],
      series: [
        {
          name: '新增商机数',
          type: 'bar',
          data: summaryByDate.map((i) => i.businessCreateCount)
        },
        {
          name: '新增商机金额',
          type: 'line',
          yAxisIndex: 1,
          data: summaryByDate.map((i) => i.totalPrice)
        }
      ]
    }),
    [summaryByDate]
  )

  const inversionOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis' },
      legend: { data: ['商机数', '赢单数', '转化率(%)'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: inversionByDate.map((i) => i.time) },
      yAxis: [{ type: 'value' }, { type: 'value' }],
      series: [
        { name: '商机数', type: 'bar', data: inversionByDate.map((i) => i.businessCount) },
        { name: '赢单数', type: 'bar', data: inversionByDate.map((i) => i.businessWinCount) },
        {
          name: '转化率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: inversionByDate.map((i) =>
            i.businessCount ? Number(((i.businessWinCount / i.businessCount) * 100).toFixed(2)) : 0
          )
        }
      ]
    }),
    [inversionByDate]
  )

  const endStatusColumns: ProColumns<any>[] = [
    {
      title: '结束状态',
      dataIndex: 'endStatus',
      align: 'center',
      render: (_, r) => END_STATUS_TEXT[r.endStatus] || r.endStatus
    },
    { title: '商机数', dataIndex: 'businessCount', align: 'center' },
    {
      title: '商机总金额',
      dataIndex: 'totalPrice',
      align: 'center',
      render: (_, r) => `￥${(r.totalPrice || 0).toFixed(2)}`
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatFilter onQuery={setQueryParams} />
      <Card>
        <Tabs
          items={[
            {
              key: 'funnel',
              label: '销售漏斗',
              children: (
                <>
                  <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                      <Statistic title="客户数" value={funnel?.customerCount || 0} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="商机数" value={funnel?.businessCount || 0} />
                    </Col>
                    <Col span={8}>
                      <Statistic title="赢单数" value={funnel?.businessWinCount || 0} />
                    </Col>
                  </Row>
                  <ReactECharts option={funnelOption} style={{ height: 360 }} />
                </>
              )
            },
            {
              key: 'summary',
              label: '新增商机分析',
              children: <ReactECharts option={summaryOption} style={{ height: 380 }} />
            },
            {
              key: 'inversion',
              label: '商机转化率分析',
              children: <ReactECharts option={inversionOption} style={{ height: 380 }} />
            },
            {
              key: 'endStatus',
              label: '商机结束状态分析',
              children: (
                <ProTable
                  columns={endStatusColumns}
                  dataSource={endStatusList}
                  rowKey="endStatus"
                  search={false}
                  options={false}
                  pagination={false}
                />
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default FunnelAnalysis
