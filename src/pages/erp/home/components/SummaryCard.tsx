import React from 'react'
import { Card, Statistic } from 'antd'

interface SummaryCardProps {
  title: string
  value?: number
  loading?: boolean
}

// 统计卡片：展示某个口径的金额（今日/本月/今年等），金额单位为元
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, loading }) => {
  return (
    <Card loading={loading} style={{ marginBottom: 16 }}>
      <Statistic
        title={title}
        value={value || 0}
        precision={2}
        prefix="￥"
        valueStyle={{ color: '#cf1322' }}
      />
    </Card>
  )
}

export default SummaryCard
