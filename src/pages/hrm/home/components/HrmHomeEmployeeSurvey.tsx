import React, { useMemo } from 'react'
import { Card, Grid } from 'antd'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { useHasPermi } from '@/directives/permission/HasPermi'
import type { HrmHrHomeEmployeeSurveyVO } from '../api'
import {
  HRM_HOME_PERMISSIONS,
  HRM_HOME_ROUTES,
  HrmEmployeeStatusTab,
  HrmEmployeeSurveyType
} from '../constants'
import SurveyStat from './SurveyStat'

interface Props {
  survey?: HrmHrHomeEmployeeSurveyVO
}

const HrmHomeEmployeeSurvey: React.FC<Props> = ({ survey }) => {
  const hasPermi = useHasPermi()
  const screens = Grid.useBreakpoint()
  const canQueryEmployee = hasPermi(HRM_HOME_PERMISSIONS.EMPLOYEE_QUERY)
  const currentMonthRange = useMemo(
    () => `${dayjs().startOf('month').format('YYYY.MM.DD')}-${dayjs().endOf('month').format('YYYY.MM.DD')}`,
    []
  )

  const surveyItems = [
    { label: '在职', value: survey?.activeCount || 0, surveyType: undefined },
    { label: '入职', value: survey?.entryThisMonthCount || 0, surveyType: HrmEmployeeSurveyType.ENTRY },
    {
      label: '待入职',
      value: survey?.pendingEntryThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.PENDING_ENTRY
    },
    { label: '离职', value: survey?.leaveThisMonthCount || 0, surveyType: HrmEmployeeSurveyType.LEAVE },
    {
      label: '待离职',
      value: survey?.pendingLeaveThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.PENDING_LEAVE
    },
    {
      label: '转正',
      value: survey?.regularThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.REGULAR
    },
    {
      label: '调岗',
      value: survey?.transferThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.TRANSFER
    }
  ]

  // 窄屏（< xl）时每行 4 项，与 Vue 版 lt-xl:grid-cols-4 一致
  const wide = !!screens.xl

  /** 打开人事概况对应的员工列表 */
  const goEmployeeSurvey = (surveyType?: number) => {
    if (!canQueryEmployee) return
    if (surveyType === undefined) {
      history.push({
        pathname: HRM_HOME_ROUTES.EMPLOYEE,
        search: `?statusCategory=${HrmEmployeeStatusTab.ACTIVE}`
      })
      return
    }
    history.push({ pathname: HRM_HOME_ROUTES.EMPLOYEE, search: `?surveyType=${surveyType}` })
  }

  return (
    <Card title={`人事概况（${currentMonthRange}）`} style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${wide ? 7 : 4}, 1fr)` }}>
        {surveyItems.map((item, index) => (
          <SurveyStat
            key={item.label}
            label={item.label}
            value={item.value}
            disabled={!canQueryEmployee}
            divider={index < surveyItems.length - 1}
            strongDivider={index === 0}
            marginRight={index === 0 && wide ? 24 : undefined}
            onClick={() => goEmployeeSurvey(item.surveyType)}
          />
        ))}
      </div>
    </Card>
  )
}

export default HrmHomeEmployeeSurvey
