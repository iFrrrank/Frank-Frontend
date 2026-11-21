import React, { useEffect, useMemo, useState } from 'react'
import { Card } from 'antd'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import StatFilter from '../components/StatFilter'
import { getPerformanceTargetSummary } from '@/api/crm/statistics/performanceTarget'

// 业绩目标完成情况：按月对比目标金额与完成金额，并给出完成率
// 目标口径由业绩目标配置（合同金额）决定，筛选沿用通用统计筛选的时间范围推导年份
const PerformanceTarget: React.FC = () => {
  const [queryParams, setQueryParams] = useState<any>({
    times: [
      dayjs().startOf('year').format('YYYY-MM-DD') + ' 00:00:00',
      dayjs().format('YYYY-MM-DD') + ' 23:59:59'
    ]
  })
  const [data, setData] = useState<API.CrmStatisticsPerformanceTargetRespVO[]>([])

  useEffect(() => {
    const load = async () => {
      // 接口按年份统计：从筛选时间范围的起始时间取年份
      const year = queryParams.times?.[0]
        ? dayjs(queryParams.times[0]).year()
        : dayjs().year()
      const resp = await getPerformanceTargetSummary({
        year,
        deptId: queryParams.deptId,
        userId: queryParams.userId
      })
      if (resp.code === 0) {
        setData(resp.data || [])
      }
    }
    load()
  }, [queryParams])

  const option = useMemo(
    () => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['目标金额', '完成金额'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.map((i) => `${i.month}月`)
      },
      yAxis: { type: 'value' },
      series: [
        { name: '目标金额', type: 'bar', data: data.map((i) => i.targetPrice) },
        { name: '完成金额', type: 'bar', data: data.map((i) => i.currentPrice) }
      ]
    }),
    [data]
  )

  const columns: ProColumns<API.CrmStatisticsPerformanceTargetRespVO>[] = [
    {
      title: '月份',
      dataIndex: 'month',
      align: 'center',
      render: (_, r) => `${r.month}月`
    },
    {
      title: '目标金额',
      dataIndex: 'targetPrice',
      align: 'center',
      render: (_, r) => `￥${(r.targetPrice || 0).toFixed(2)}`
    },
    {
      title: '完成金额',
      dataIndex: 'currentPrice',
      align: 'center',
      render: (_, r) => `￥${(r.currentPrice || 0).toFixed(2)}`
    },
    {
      title: '完成率',
      dataIndex: 'completionRate',
      align: 'center',
      render: (_, r) => `${(r.completionRate || 0).toFixed(2)}%`
    }
  ]

  return (
    <PageContainer header={{ title: false }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StatFilter onQuery={setQueryParams} />
        <Card title="业绩目标完成情况（按年）">
          <ReactECharts option={option} style={{ height: 340, marginBottom: 16 }} />
          <ProTable
            columns={columns}
            dataSource={data}
            rowKey="month"
            search={false}
            options={false}
            pagination={false}
          />
        </Card>
      </div>
    </PageContainer>
  )
}

export default PerformanceTarget
