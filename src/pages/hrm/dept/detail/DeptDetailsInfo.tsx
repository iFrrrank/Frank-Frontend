import React from 'react'
import { Collapse, Descriptions, Tag } from 'antd'
import { COMMON_STATUS } from '@/utils/constantsValue'
import { formatDateTime } from '@/pages/hrm/recruit/format'

interface DeptDetailsInfoProps {
  dept: API.SystemDeptRespVO
  parentDeptName?: string
  leaderUserName?: string
}

const DeptDetailsInfo: React.FC<DeptDetailsInfoProps> = ({
  dept,
  parentDeptName,
  leaderUserName
}) => {
  const statusConfig = dept.status !== undefined ? COMMON_STATUS[dept.status] : undefined

  return (
    <Collapse
      defaultActiveKey={['basicInfo']}
      items={[
        {
          key: 'basicInfo',
          label: <span style={{ fontWeight: 'bold' }}>基本信息</span>,
          children: (
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
              <Descriptions.Item label="部门名称">{dept.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="上级部门">{parentDeptName || '-'}</Descriptions.Item>
              <Descriptions.Item label="部门负责人">{leaderUserName || '-'}</Descriptions.Item>
              <Descriptions.Item label="显示排序">{dept.sort ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{dept.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{dept.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {statusConfig ? (
                  <Tag color={dept.status === 0 ? 'success' : 'error'}>{statusConfig.text}</Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {formatDateTime(dept.createTime)}
              </Descriptions.Item>
            </Descriptions>
          )
        }
      ]}
    />
  )
}

export default DeptDetailsInfo
