import React from 'react'
import { Card, Tag } from 'antd'

interface ClosingStatusCardProps {
  title: string
  value: string
  tagType: 'success' | 'warning' | 'danger' | 'info'
  tagLabel: string
}

const tagColorMap: Record<ClosingStatusCardProps['tagType'], string> = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
  info: 'default'
}

const ClosingStatusCard: React.FC<ClosingStatusCardProps> = ({
  title,
  value,
  tagType,
  tagLabel
}) => {
  return (
    <Card style={{ marginBottom: 16, minHeight: 132 }}>
      <div style={{ color: '#909399' }}>{title}</div>
      <div style={{ margin: '12px 0', fontSize: 22, fontWeight: 600 }}>{value}</div>
      <Tag color={tagColorMap[tagType]}>{tagLabel}</Tag>
    </Card>
  )
}

export default ClosingStatusCard
