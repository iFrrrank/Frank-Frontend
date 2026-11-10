import React from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { RECRUIT_JOB_NATURE, RECRUIT_POST_STATUS } from '@/utils/constantsValue'
import { formatRecruitPostProgress } from '../../format'

interface RecruitPostDetailsHeaderProps {
  post: API.HrmRecruitPostRespVO
  loading: boolean
  children?: React.ReactNode
}

const RecruitPostDetailsHeader: React.FC<RecruitPostDetailsHeaderProps> = ({
  post,
  loading,
  children
}) => {
  const statusConfig = post.status !== undefined ? RECRUIT_POST_STATUS[post.status] : undefined

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
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{post.postName || '-'}</span>
            {statusConfig && (
              <Tag color={post.status === 1 ? 'success' : 'error'}>{statusConfig.text}</Tag>
            )}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#8c8c8c' }}>
            职位编号：{post.id || '-'}
          </div>
        </div>
        <div>{children}</div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 5 }} size="small">
        <Descriptions.Item label="用人部门">{post.deptName || '-'}</Descriptions.Item>
        <Descriptions.Item label="工作性质">
          {post.jobNature !== undefined
            ? (RECRUIT_JOB_NATURE[post.jobNature]?.text as string) || '-'
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="工作城市">{post.areaName || '-'}</Descriptions.Item>
        <Descriptions.Item label="招聘负责人">{post.ownerEmployeeName || '-'}</Descriptions.Item>
        <Descriptions.Item label="招聘进度">{formatRecruitPostProgress(post)}</Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default RecruitPostDetailsHeader
