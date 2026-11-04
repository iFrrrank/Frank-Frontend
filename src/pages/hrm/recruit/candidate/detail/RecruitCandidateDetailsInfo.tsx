import React from 'react'
import { Collapse, Descriptions, Tag } from 'antd'
import {
  RECRUIT_CANDIDATE_EDUCATION,
  RECRUIT_CANDIDATE_STATUS,
  SEX_OPTIONS
} from '@/utils/constantsValue'
import { formatDateTime } from '../../format'

interface RecruitCandidateDetailsInfoProps {
  candidate: API.HrmRecruitCandidateRespVO
}

const RecruitCandidateDetailsInfo: React.FC<RecruitCandidateDetailsInfoProps> = ({ candidate }) => {
  const sexLabel = SEX_OPTIONS.find((s) => s.value === candidate.sex)?.label || '-'
  const statusConfig =
    candidate.status !== undefined ? RECRUIT_CANDIDATE_STATUS[candidate.status] : undefined

  return (
    <Collapse
      defaultActiveKey={['candidateInfo', 'recruitInfo']}
      items={[
        {
          key: 'candidateInfo',
          label: <span style={{ fontWeight: 'bold' }}>候选人信息</span>,
          children: (
            <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} bordered size="small">
              <Descriptions.Item label="候选人姓名">{candidate.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="手机号码">{candidate.mobile || '-'}</Descriptions.Item>
              <Descriptions.Item label="性别">{sexLabel}</Descriptions.Item>
              <Descriptions.Item label="年龄">{candidate.age ?? '-'}</Descriptions.Item>

              <Descriptions.Item label="邮箱">{candidate.email || '-'}</Descriptions.Item>
              <Descriptions.Item label="工作年限">
                {candidate.workTime != null ? `${candidate.workTime} 年` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学历">
                {candidate.education !== undefined
                  ? (RECRUIT_CANDIDATE_EDUCATION[candidate.education]?.text as string) || '-'
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="毕业院校">
                {candidate.graduateSchool || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="最近工作单位" span={2}>
                {candidate.latestWorkPlace || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>
                {candidate.remark || '-'}
              </Descriptions.Item>
            </Descriptions>
          )
        },
        {
          key: 'recruitInfo',
          label: <span style={{ fontWeight: 'bold' }}>招聘信息</span>,
          children: (
            <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} bordered size="small">
              <Descriptions.Item label="应聘职位">{candidate.postName || '-'}</Descriptions.Item>
              <Descriptions.Item label="用人部门">{candidate.deptName || '-'}</Descriptions.Item>
              <Descriptions.Item label="招聘负责人">
                {candidate.ownerEmployeeName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="招聘渠道">{candidate.channelName || '-'}</Descriptions.Item>

              <Descriptions.Item label="候选人状态">
                {statusConfig ? <Tag color="blue">{statusConfig.text}</Tag> : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="面试轮次">{candidate.stageNumber ?? 0}</Descriptions.Item>
              <Descriptions.Item label="状态更新时间">
                {formatDateTime(candidate.statusUpdateTime)}
              </Descriptions.Item>
              <Descriptions.Item label="入职时间">
                {formatDateTime(candidate.entryTime)}
              </Descriptions.Item>

              <Descriptions.Item label="淘汰原因" span={2}>
                {candidate.eliminate || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建人">{candidate.creatorName || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDateTime(candidate.createTime)}
              </Descriptions.Item>
            </Descriptions>
          )
        }
      ]}
    />
  )
}

export default RecruitCandidateDetailsInfo
