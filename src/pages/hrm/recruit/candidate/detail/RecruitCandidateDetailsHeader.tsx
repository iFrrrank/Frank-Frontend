import React from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { RECRUIT_CANDIDATE_STATUS } from '@/utils/constantsValue'
import { formatDateTime } from '../../format'

interface RecruitCandidateDetailsHeaderProps {
  candidate: API.HrmRecruitCandidateRespVO
  loading: boolean
  children?: React.ReactNode
}

const RecruitCandidateDetailsHeader: React.FC<RecruitCandidateDetailsHeaderProps> = ({
  candidate,
  loading,
  children
}) => {
  const statusConfig =
    candidate.status !== undefined ? RECRUIT_CANDIDATE_STATUS[candidate.status] : undefined

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
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{candidate.name || '-'}</span>
            {statusConfig && <Tag color="blue">{statusConfig.text}</Tag>}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#8c8c8c' }}>
            候选人编号：{candidate.id || '-'}
          </div>
        </div>
        <div>{children}</div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 5 }} size="small">
        <Descriptions.Item label="应聘职位">{candidate.postName || '-'}</Descriptions.Item>
        <Descriptions.Item label="用人部门">{candidate.deptName || '-'}</Descriptions.Item>
        <Descriptions.Item label="招聘负责人">
          {candidate.ownerEmployeeName || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="招聘渠道">{candidate.channelName || '-'}</Descriptions.Item>
        <Descriptions.Item label="当前面试">
          {formatDateTime(candidate.interviewTime)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default RecruitCandidateDetailsHeader
