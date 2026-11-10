import React from 'react'
import { Table, Tag } from 'antd'
import { RECRUIT_INTERVIEW_RESULT, RECRUIT_INTERVIEW_TYPE } from '@/utils/constantsValue'
import { formatDateTime } from '../../format'

interface RecruitCandidateInterviewListProps {
  interviewList: API.HrmRecruitInterviewRespVO[]
}

const RecruitCandidateInterviewList: React.FC<RecruitCandidateInterviewListProps> = ({
  interviewList
}) => {
  const columns = [
    {
      title: '面试轮次',
      dataIndex: 'stageNumber',
      align: 'center' as const,
      width: 100
    },
    {
      title: '面试方式',
      dataIndex: 'type',
      align: 'center' as const,
      width: 110,
      render: (type: number) =>
        type !== undefined ? (RECRUIT_INTERVIEW_TYPE[type]?.text as string) || '-' : '-'
    },
    {
      title: '主面试官',
      dataIndex: 'interviewEmployeeName',
      align: 'center' as const,
      minWidth: 120
    },
    {
      title: '其他面试官',
      dataIndex: 'otherInterviewEmployeeNames',
      align: 'center' as const,
      minWidth: 160,
      render: (names: string[]) => names?.join('、') || '-'
    },
    {
      title: '面试时间',
      dataIndex: 'interviewTime',
      align: 'center' as const,
      width: 180,
      render: (time: any) => formatDateTime(time)
    },
    {
      title: '面试地址',
      dataIndex: 'address',
      align: 'center' as const,
      minWidth: 160
    },
    {
      title: '面试结果',
      dataIndex: 'result',
      align: 'center' as const,
      width: 110,
      render: (result: number) => {
        if (result === undefined) return '-'
        const config = RECRUIT_INTERVIEW_RESULT[result]
        return config ? <Tag>{config.text}</Tag> : '-'
      }
    },
    {
      title: '面试评价',
      dataIndex: 'evaluate',
      align: 'center' as const,
      minWidth: 180
    },
    {
      title: '取消原因',
      dataIndex: 'cancelReason',
      align: 'center' as const,
      minWidth: 160
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center' as const,
      minWidth: 160
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={interviewList}
      rowKey="id"
      pagination={false}
      bordered
      size="small"
    />
  )
}

export default RecruitCandidateInterviewList
