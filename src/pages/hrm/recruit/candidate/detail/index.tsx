import React, { useEffect, useState } from 'react'
import { Button, Card, Tabs, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import { getRecruitCandidate } from '@/api/hrm/recruit/candidate'
import { getRecruitInterviewListByCandidate } from '@/api/hrm/recruit/interview'
import { getOperateLogPage } from '@/api/hrm/operateLog'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { formatDateTime } from '../../format'
import RecruitCandidateDetailsHeader from './RecruitCandidateDetailsHeader'
import RecruitCandidateDetailsInfo from './RecruitCandidateDetailsInfo'
import RecruitCandidateInterviewList from './RecruitCandidateInterviewList'
import RecruitCandidateMaterialFiles from './RecruitCandidateMaterialFiles'
import CandidateForm from '../CandidateForm'

const RecruitCandidateDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const candidateId = Number(searchParams.get('id'))

  const [loading, setLoading] = useState(true)
  const [candidate, setCandidate] = useState<API.HrmRecruitCandidateRespVO>({})
  const [interviewList, setInterviewList] = useState<API.HrmRecruitInterviewRespVO[]>([])
  const [formVisible, setFormVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('detail')

  const fetchCandidate = async () => {
    if (!candidateId) {
      message.error('参数错误，招聘候选人编号不能为空')
      history.push('/hrm/recruit/candidate')
      return
    }
    setLoading(true)
    try {
      const [candResp, interviewResp] = await Promise.all([
        getRecruitCandidate({ id: candidateId }),
        getRecruitInterviewListByCandidate({ candidateId })
      ])
      if (!candResp.data) {
        message.warning('招聘候选人不存在')
        history.push('/hrm/recruit/candidate')
        return
      }
      setCandidate(candResp.data)
      setInterviewList(interviewResp.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidate()
  }, [candidateId])

  const logColumns: ProColumns<API.HrmOperateLogRespVO>[] = [
    {
      title: '操作人',
      dataIndex: 'userNickname',
      align: 'center',
      width: 120
    },
    {
      title: '操作内容',
      dataIndex: 'content',
      align: 'center',
      minWidth: 200
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      render: (_, record) => formatDateTime(record.createTime)
    }
  ]

  return (
    <div>
      <RecruitCandidateDetailsHeader candidate={candidate} loading={loading}>
        <Button
          type="primary"
          icon={<EditOutlined />}
          disabled={!candidate.id}
          onClick={() => setFormVisible(true)}
        >
          编辑
        </Button>
      </RecruitCandidateDetailsHeader>

      <Card variant="borderless">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'detail',
              label: '详细资料',
              children: <RecruitCandidateDetailsInfo candidate={candidate} />
            },
            {
              key: 'file',
              label: '材料附件',
              children: <RecruitCandidateMaterialFiles candidate={candidate} />
            },
            {
              key: 'interview',
              label: '面试记录',
              children: <RecruitCandidateInterviewList interviewList={interviewList} />
            },
            {
              key: 'operateLog',
              label: '操作记录',
              children: (
                <ProTable<API.HrmOperateLogRespVO>
                  rowKey="id"
                  columns={logColumns}
                  search={false}
                  options={false}
                  pagination={{ pageSize: 10, align: 'center' }}
                  request={async (params) => {
                    const { current, pageSize } = params
                    try {
                      // HrmBizType.RECRUIT_CANDIDATE = 12 (对应招聘候选人业务日志)
                      const resp = await getOperateLogPage({
                        pageReqVO: {
                          pageNo: current || 1,
                          pageSize: pageSize || 10,
                          bizType: 12,
                          bizId: candidateId
                        }
                      } as any)
                      return {
                        data: resp.data?.list || [],
                        success: resp.code === 0,
                        total: resp.data?.total || 0
                      }
                    } catch {
                      return { data: [], success: false, total: 0 }
                    }
                  }}
                />
              )
            }
          ]}
        />
      </Card>

      <CandidateForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={candidateId}
        onSuccess={() => {
          setFormVisible(false)
          fetchCandidate()
        }}
      />
    </div>
  )
}

export default RecruitCandidateDetailPage
