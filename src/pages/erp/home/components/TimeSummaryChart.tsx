import React, { useMemo } from 'react'
import { Card } from 'antd'
import ReactECharts from 'echarts-for-react'

interface TimeSummaryChartProps {
  title: string
  // 时段统计数据：time 为时间标签，price 为金额（元）
  value?: { time: string; price: number }[]
}

// 时段统计折线图：横轴为时间，纵轴为金额，带区域填充（与原图形式一致）
const TimeSummaryChart: React.FC<TimeSummaryChartProps> = ({ title, value }) => {
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (value || []).map((item) => item.time)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '金额',
          type: 'line',
          smooth: true,
          areaStyle: {},
          data: (value || []).map((item) => item.price)
        }
      ]
    }),
    [value]
  )

  return (
    <Card title={title} style={{ marginBottom: 16 }}>
      <ReactECharts option={option} style={{ height: 320 }} />
    </Card>
  )
}

export default TimeSummaryChart
