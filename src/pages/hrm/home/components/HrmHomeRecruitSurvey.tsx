import React, { useMemo } from 'react'
import { Card } from 'antd'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { useHasPermi } from '@/directives/permission/HasPermi'
import type { HrmHrHomeRecruitSurveyVO } from '../api'
import { HRM_HOME_PERMISSIONS, HRM_HOME_ROUTES, HrmRecruitCandidateStatus } from '../constants'
import SurveyStat from './SurveyStat'

type RecruitAction = 'post' | 'pending-entry' | 'joined'

interface Props {
  survey?: HrmHrHomeRecruitSurveyVO
}

const HrmHomeRecruitSurvey: React.FC<Props> = ({ survey }) => {
  const hasPermi = useHasPermi()
  const canQueryRecruitPost = hasPermi(HRM_HOME_PERMISSIONS.RECRUIT_POST_QUERY)
  const canQueryRecruitCandidate = hasPermi(HRM_HOME_PERMISSIONS.RECRUIT_CANDIDATE_QUERY)
  // 招聘动态统计近 6 个月
  const recruitRange = useMemo(
    () => `${dayjs().subtract(6, 'month').format('YYYY.MM.DD')}-${dayjs().format('YYYY.MM.DD')}`,
    []
  )

  const surveyItems: {
    label: string
    value: number
    action?: RecruitAction
    disabled: boolean
  }[] = [
    {
      label: '正在招聘职位',
      value: survey?.recruitingPostCount || 0,
      action: 'post',
      disabled: !canQueryRecruitPost
    },
    { label: '评选中', value: survey?.candidateInProcessCount || 0, disabled: true },
    {
      label: '待入职',
      value: survey?.pendingEntryCount || 0,
      action: 'pending-entry',
      disabled: !canQueryRecruitCandidate
    },
    {
      label: '已入职',
      value: survey?.joinedCount || 0,
      action: 'joined',
      disabled: !canQueryRecruitCandidate
    }
  ]

  /** 打开招聘动态对应的列表 */
  const goRecruitSurvey = (action?: RecruitAction) => {
    if (action === 'post' && canQueryRecruitPost) {
      history.push(HRM_HOME_ROUTES.RECRUIT_POST)
    } else if (action === 'pending-entry' && canQueryRecruitCandidate) {
      history.push({
        pathname: HRM_HOME_ROUTES.RECRUIT_CANDIDATE,
        search: `?status=${HrmRecruitCandidateStatus.PENDING_ENTRY}`
      })
    } else if (action === 'joined' && canQueryRecruitCandidate) {
      history.push({
        pathname: HRM_HOME_ROUTES.RECRUIT_CANDIDATE,
        search: `?status=${HrmRecruitCandidateStatus.JOINED}`
      })
    }
  }

  return (
    <Card title={`招聘动态（${recruitRange}）`} style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {surveyItems.map((item, index) => (
          <SurveyStat
            key={item.label}
            label={item.label}
            value={item.value}
            disabled={item.disabled}
            divider={index < surveyItems.length - 1}
            onClick={() => goRecruitSurvey(item.action)}
          />
        ))}
      </div>
    </Card>
  )
}

export default HrmHomeRecruitSurvey
