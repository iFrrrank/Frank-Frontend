import React from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { COMMON_STATUS } from '@/utils/constantsValue'

interface DeptDetailsHeaderProps {
  dept?: API.SystemDeptRespVO
  parentDeptName?: string
  leaderUserName?: string
  statistics: {
    activeCount: number
    fullTimeCount: number
    nonFullTimeCount: number
  }
  loading: boolean
  children?: React.ReactNode
}

const DeptDetailsHeader: React.FC<DeptDetailsHeaderProps> = ({
  dept = {},
  parentDeptName,
  leaderUserName,
  statistics,
  loading,
  children
}) => {
  const statusConfig =
    dept.status !== undefined ? COMMON_STATUS[dept.status] : undefined

  return (
    <Card loading={loading} variant="borderless" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>
              {dept.name || '-'}
            </span>
            {statusConfig && (
              <Tag color={dept.status === 0 ? 'success' : 'error'}>
                {statusConfig.text}
              </Tag>
            )}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#8c8c8c' }}>
            部门编号：{dept.id || '-'}
          </div>
        </div>
        <div>{children}</div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small">
        <Descriptions.Item label="在职人数">
          {statistics.activeCount}
        </Descriptions.Item>
        <Descriptions.Item label="全职人数">
          {statistics.fullTimeCount}
        </Descriptions.Item>
        <Descriptions.Item label="兼职/实习人数">
          {statistics.nonFullTimeCount}
        </Descriptions.Item>
        <Descriptions.Item label="负责人">
          {leaderUserName || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default DeptDetailsHeader
