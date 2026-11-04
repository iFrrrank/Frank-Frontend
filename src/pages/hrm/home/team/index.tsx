import React, { useEffect, useState } from 'react'
import { Col, Row, Spin, theme } from 'antd'
import { history } from '@umijs/max'
import { getTeamHomeCalendar, getTeamHomeStatisticsSummary } from '../api'
import type { HrmHomeCalendarItemVO, HrmTeamHomeStatisticsRespVO } from '../api'
import HrmHomeCalendar from '../components/HrmHomeCalendar'
import { HRM_HOME_ROUTES, HrmHomeCalendarItemType } from '../constants'
import HrmTeamOverview from './components/HrmTeamOverview'
import HrmTeamSurvey from './components/HrmTeamSurvey'

/** 团队日历中的员工事项支持跳转详情 */
const isCalendarItemClickable = (item: HrmHomeCalendarItemVO) =>
  item.type !== HrmHomeCalendarItemType.NOTE && !!item.typeId

/** 打开下属员工档案 */
const openCalendarItem = (item: HrmHomeCalendarItemVO) => {
  if (item.typeId) {
    history.push({ pathname: HRM_HOME_ROUTES.EMPLOYEE_DETAIL, search: `?id=${item.typeId}` })
  }
}

const getCalendarItems = async (params: { startDate: string; endDate: string }) =>
  (await getTeamHomeCalendar(params)).data || []

const HrmTeamHomePage: React.FC = () => {
  const { token } = theme.useToken()
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<HrmTeamHomeStatisticsRespVO>()

  useEffect(() => {
    /** 获得团队工作台统计 */
    const getSummary = async () => {
      setLoading(true)
      try {
        const resp = await getTeamHomeStatisticsSummary()
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
        团队工作台
      </div>
      <Row gutter={16} align="top">
        <Col lg={16} md={24} xs={24}>
          <HrmTeamOverview
            leaderEmployeeId={summary?.leaderEmployeeId}
            overview={summary?.teamOverview}
          />
          <HrmTeamSurvey survey={summary?.teamSurvey} />
        </Col>
        <Col lg={8} md={24} xs={24}>
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

export default HrmTeamHomePage
