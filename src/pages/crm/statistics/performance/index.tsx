import React, { useEffect, useMemo, useState } from 'react'
import { Card, Tabs } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import StatFilter from '../components/StatFilter'
import {
  getContractCountPerformance,
  getContractPriceStaffPerformance,
  getReceivablePriceStaffPerformance
} from '@/api/crm/statistics/performance'

// 默认统计本年（业绩按月对比本月/上月/去年同期）
const defaultParams = () => ({
  times: [
    dayjs().startOf('year').format('YYYY-MM-DD') + ' 00:00:00',
    dayjs().format('YYYY-MM-DD') + ' 23:59:59'
  ]
})

interface PerformancePanelProps {
  queryParams: any
  // 数据加载函数（三种业绩口径共用同一面板）
  loader: (params: any) => Promise<any>
  countLabel: string
}

// 业绩面板：按月展示本期、上月、去年同期的对比柱状图与明细表
const PerformancePanel: React.FC<PerformancePanelProps> = ({ queryParams, loader, countLabel }) => {
  const [data, setData] = useState<API.CrmStatisticsPerformanceRespVO[]>([])

  useEffect(() => {
    const load = async () => {
      const resp = await loader({ reqVO: queryParams })
      if (resp.code === 0) {
        setData(resp.data || [])
      }
    }
    load()
  }, [queryParams, loader])

  const option = useMemo(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['本期', '上月', '去年同期'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: data.map((i) => i.time) },
      yAxis: { type: 'value' },
      series: [
        { name: '本期', type: 'bar', data: data.map((i) => i.currentMonthCount) },
        { name: '上月', type: 'bar', data: data.map((i) => i.lastMonthCount) },
        { name: '去年同期', type: 'bar', data: data.map((i) => i.lastYearCount) }
      ]
    }),
    [data]
  )

  const columns: ProColumns<API.CrmStatisticsPerformanceRespVO>[] = [
    { title: '时间', dataIndex: 'time', align: 'center' },
    { title: `本期${countLabel}`, dataIndex: 'currentMonthCount', align: 'center' },
    { title: `上月${countLabel}`, dataIndex: 'lastMonthCount', align: 'center' },
    { title: `去年同期${countLabel}`, dataIndex: 'lastYearCount', align: 'center' }
  ]

  return (
    <>
      <ReactECharts option={option} style={{ height: 340, marginBottom: 16 }} />
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="time"
        search={false}
        options={false}
        pagination={false}
      />
    </>
  )
}

// 员工业绩分析：合同数量、合同金额、回款金额三种口径
const PerformanceAnalysis: React.FC = () => {
  const [queryParams, setQueryParams] = useState<any>(defaultParams())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <StatFilter onQuery={setQueryParams} />
      <Card>
        <Tabs
          destroyInactiveTabPane
          items={[
            {
              key: 'contractCount',
              label: '合同数量业绩',
              children: (
                <PerformancePanel
                  queryParams={queryParams}
                  loader={getContractCountPerformance}
                  countLabel="合同数"
                />
              )
            },
            {
              key: 'contractPrice',
              label: '合同金额业绩',
              children: (
                <PerformancePanel
                  queryParams={queryParams}
                  loader={getContractPriceStaffPerformance}
                  countLabel="合同金额"
                />
              )
            },
            {
              key: 'receivablePrice',
              label: '回款金额业绩',
              children: (
                <PerformancePanel
                  queryParams={queryParams}
                  loader={getReceivablePriceStaffPerformance}
                  countLabel="回款金额"
                />
              )
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default PerformanceAnalysis
