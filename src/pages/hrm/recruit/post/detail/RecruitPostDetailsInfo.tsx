import React from 'react'
import { Card, Collapse, Descriptions, Tag } from 'antd'
import { HrmRecruitPostStatusEnum } from '@/utils/constants'
import {
  RECRUIT_EMERGENCY_LEVEL,
  RECRUIT_JOB_NATURE,
  RECRUIT_POST_EDUCATION,
  RECRUIT_POST_STATUS,
  RECRUIT_WORK_TIME
} from '@/utils/constantsValue'
import { formatDateTime, formatRecruitPostAge, formatRecruitPostSalary } from '../../format'

interface RecruitPostDetailsInfoProps {
  post: API.HrmRecruitPostRespVO
}

const RecruitPostDetailsInfo: React.FC<RecruitPostDetailsInfoProps> = ({ post }) => {
  const isStopped = post.status === HrmRecruitPostStatusEnum.STOPPED.status
  const statusConfig = post.status !== undefined ? RECRUIT_POST_STATUS[post.status] : undefined

  return (
    <Collapse
      defaultActiveKey={['basicInfo', 'description']}
      items={[
        {
          key: 'basicInfo',
          label: <span style={{ fontWeight: 'bold' }}>基本信息</span>,
          children: (
            <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 4 }} bordered size="small">
              <Descriptions.Item label="职位名称">{post.postName || '-'}</Descriptions.Item>
              <Descriptions.Item label="用人部门">{post.deptName || '-'}</Descriptions.Item>
              <Descriptions.Item label="工作性质">
                {post.jobNature !== undefined
                  ? (RECRUIT_JOB_NATURE[post.jobNature]?.text as string) || '-'
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="工作城市">{post.areaName || '-'}</Descriptions.Item>

              <Descriptions.Item label="招聘人数">{post.recruitNum ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="已入职人数">{post.hasEntryNum ?? 0}</Descriptions.Item>
              <Descriptions.Item label="招聘原因" span={2}>
                {post.reason || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="工作经验">
                {post.workTime !== undefined
                  ? (RECRUIT_WORK_TIME[post.workTime]?.text as string) || '-'
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="学历要求">
                {post.educationRequire !== undefined
                  ? (RECRUIT_POST_EDUCATION[post.educationRequire]?.text as string) || '-'
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="薪资范围">
                {formatRecruitPostSalary(post)}
              </Descriptions.Item>
              <Descriptions.Item label="年龄要求">{formatRecruitPostAge(post)}</Descriptions.Item>

              <Descriptions.Item label="最迟到岗时间">
                {formatDateTime(post.latestEntryTime)}
              </Descriptions.Item>
              <Descriptions.Item label="紧急程度">
                {post.emergencyLevel !== undefined
                  ? (RECRUIT_EMERGENCY_LEVEL[post.emergencyLevel]?.text as string) || '-'
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="招聘负责人">
                {post.ownerEmployeeName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="职位类型">{post.postTypeName || '-'}</Descriptions.Item>

              <Descriptions.Item label="面试官" span={2}>
                {post.interviewEmployeeNames?.join('、') || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={isStopped ? 1 : 2}>
                {statusConfig ? (
                  <Tag color={post.status === 1 ? 'success' : 'error'}>{statusConfig.text}</Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              {isStopped && (
                <Descriptions.Item label="停止原因" span={2}>
                  {post.stopReason || '-'}
                </Descriptions.Item>
              )}

              <Descriptions.Item label="创建时间" span={4}>
                {formatDateTime(post.createTime)}
              </Descriptions.Item>
            </Descriptions>
          )
        },
        {
          key: 'description',
          label: <span style={{ fontWeight: 'bold' }}>职位描述</span>,
          children: (
            <div style={{ whiteSpace: 'pre-wrap', minHeight: 48, lineHeight: 1.8 }}>
              {post.description || '暂无职位描述'}
            </div>
          )
        }
      ]}
    />
  )
}

export default RecruitPostDetailsInfo
