import React, { useMemo } from 'react'
import { Card, Grid } from 'antd'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { useHasPermi } from '@/directives/permission/HasPermi'
import type { HrmTeamHomeOverviewVO } from '../../api'
import {
  HRM_HOME_PERMISSIONS,
  HRM_HOME_ROUTES,
  HrmEmployeeStatusTab,
  HrmEmployeeSurveyType
} from '../../constants'
import SurveyStat from '../../components/SurveyStat'

interface Props {
  leaderEmployeeId?: number
  overview?: HrmTeamHomeOverviewVO
}

const HrmTeamOverview: React.FC<Props> = ({ leaderEmployeeId, overview }) => {
  const hasPermi = useHasPermi()
  const screens = Grid.useBreakpoint()
  const canOpenEmployeeList = !!leaderEmployeeId && hasPermi(HRM_HOME_PERMISSIONS.EMPLOYEE_QUERY)
  const currentMonthRange = useMemo(
    () => `${dayjs().startOf('month').format('YYYY.MM.DD')}-${dayjs().endOf('month').format('YYYY.MM.DD')}`,
    []
  )
  // 窄屏（< md）每行 2 项
  const wide = !!screens.md

  const overviewItems = [
    { label: '团队人数', value: overview?.employeeCount || 0, surveyType: undefined },
    {
      label: '本月入职',
      value: overview?.entryThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.ENTRY
    },
    {
      label: '本月离职',
      value: overview?.leaveThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.LEAVE
    },
    {
      label: '本月转正',
      value: overview?.regularThisMonthCount || 0,
      surveyType: HrmEmployeeSurveyType.REGULAR
    }
  ]

  /** 打开当前直属团队对应的员工列表 */
  const openEmployeeList = (surveyType?: number) => {
    if (!canOpenEmployeeList) return
    const query = new URLSearchParams({ leaderEmployeeId: String(leaderEmployeeId) })
    if (surveyType === undefined) {
      query.set('statusCategory', String(HrmEmployeeStatusTab.ACTIVE))
    } else {
      query.set('surveyType', String(surveyType))
    }
    history.push({ pathname: HRM_HOME_ROUTES.EMPLOYEE, search: `?${query.toString()}` })
  }

  return (
    <Card title={`我的团队（${currentMonthRange}）`} style={{ marginBottom: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${wide ? 4 : 2}, 1fr)` }}>
        {overviewItems.map((item, index) => (
          <SurveyStat
            key={item.label}
            label={item.label}
            value={item.value}
            disabled={!canOpenEmployeeList}
            divider={index < overviewItems.length - 1}
            strongDivider={index === 0}
            marginRight={index === 0 && wide ? 24 : undefined}
            onClick={() => openEmployeeList(item.surveyType)}
          />
        ))}
      </div>
    </Card>
  )
}

export default HrmTeamOverview
