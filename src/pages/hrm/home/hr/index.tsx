import React, { useEffect, useState } from 'react'
import { Col, Row, Spin, theme } from 'antd'
import { history } from '@umijs/max'
import { getHrHomeCalendar, getHrHomeStatisticsSummary } from '../api'
import type { HrmHomeCalendarItemVO, HrmHrHomeStatisticsRespVO } from '../api'
import HrmHomeCalendar from '../components/HrmHomeCalendar'
import HrmHomeEmployeeSurvey from '../components/HrmHomeEmployeeSurvey'
import HrmHomeRecruitSurvey from '../components/HrmHomeRecruitSurvey'
import HrmHomeSalarySurvey from '../components/HrmHomeSalarySurvey'
import HrmHomeTodoSurvey from '../components/HrmHomeTodoSurvey'
import { HRM_HOME_ROUTES, HrmHomeCalendarItemType } from '../constants'

/** 日历事项是否支持跳转详情：备忘无详情 */
const isCalendarItemClickable = (item: HrmHomeCalendarItemVO) =>
  item.type !== HrmHomeCalendarItemType.NOTE && !!item.typeId

/** 打开日历事项详情：招聘面试进入候选人详情，其余进入员工档案 */
const openCalendarItem = (item: HrmHomeCalendarItemVO) => {
  if (!item.typeId) return
  const pathname =
    item.type === HrmHomeCalendarItemType.RECRUIT
      ? HRM_HOME_ROUTES.RECRUIT_CANDIDATE_DETAIL
      : HRM_HOME_ROUTES.EMPLOYEE_DETAIL
  history.push({ pathname, search: `?id=${item.typeId}` })
}

const getCalendarItems = async (params: { startDate: string; endDate: string }) =>
  (await getHrHomeCalendar(params)).data || []

const HrmHrHomePage: React.FC = () => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<HrmHrHomeStatisticsRespVO>()

  useEffect(() => {
    /** 获得首页统计汇总 */
    const getSummary = async () => {
      setLoading(true)
      try {
        const resp = await getHrHomeStatisticsSummary()
        setSummary(resp.data)
      } finally {
        setLoading(false)
      }
    }
    getSummary()
  }, [])

  return (
    <Spin spinning={loading}>
      <div style={{ marginBottom: 16, fontSize: 24, lineHeight: '28px', color: token.colorText }}>
        HR 工作台
      </div>
      <Row gutter={16} align="top">
        <Col span={16}>
          <HrmHomeEmployeeSurvey survey={summary?.employeeSurvey} />
          <HrmHomeRecruitSurvey survey={summary?.recruitSurvey} />
          <HrmHomeSalarySurvey survey={summary?.salarySurvey} />
        </Col>
        <Col span={8}>
          <HrmHomeTodoSurvey survey={summary?.todoSurvey} />
          <HrmHomeCalendar
            getCalendarItems={getCalendarItems}
            isItemClickable={isCalendarItemClickable}
            onItemClick={openCalendarItem}
          />
        </Col>
      </Row>
    </Spin>
  )
}

export default HrmHrHomePage
