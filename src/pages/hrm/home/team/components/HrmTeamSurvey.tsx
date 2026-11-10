import React, { useMemo } from 'react'
import { Card, Empty, Grid } from 'antd'
import ReactECharts from 'echarts-for-react'
import { EMPLOYEE_STATUS, SEX_OPTIONS } from '@/utils/constantsValue'
import type { HrmTeamHomeAnalysisItemVO, HrmTeamHomeSurveyVO } from '../../api'
import { TEAM_AGE_RANGE_NAMES, TEAM_COMPANY_AGE_RANGE_NAMES } from '../../constants'
import { formatHrmAnalysisType } from '../../utils'

interface Props {
  survey?: HrmTeamHomeSurveyVO
}

// 员工状态、性别字典名称
const STATUS_NAMES: Record<number, string | undefined> = Object.fromEntries(
  Object.entries(EMPLOYEE_STATUS).map(([key, item]) => [key, item.text as string])
)
const SEX_NAMES: Record<number, string | undefined> = Object.fromEntries(
  SEX_OPTIONS.map((item) => [item.value, item.label])
)

/** 是否存在统计数据 */
const hasData = (data: HrmTeamHomeAnalysisItemVO[]) => data.some((item) => item.count > 0)

/** 构建团队概况饼图 */
function buildChartOptions(
  data: HrmTeamHomeAnalysisItemVO[],
  formatType: (type: number | null) => string
) {
  return {
    color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#00a6a6', '#7b61ff', '#d97706'],
    tooltip: { trigger: 'item', formatter: '{b}<br/>{c} 人（{d}%）' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '43%'],
        avoidLabelOverlap: true,
        label: { formatter: '{b}\n{c} 人' },
        data: data
          .filter((item) => item.count > 0)
          .map((item) => ({ name: formatType(item.type), value: item.count }))
      }
    ]
  }
}

const HrmTeamSurvey: React.FC<Props> = ({ survey }) => {
  const screens = Grid.useBreakpoint()
  const charts = useMemo(
    () => [
      {
        title: '员工状态占比',
        data: survey?.statusAnalysis || [],
        formatType: (type: number | null) => formatHrmAnalysisType(STATUS_NAMES, type)
      },
      {
        title: '男女性别占比',
        data: survey?.sexAnalysis || [],
        formatType: (type: number | null) => formatHrmAnalysisType(SEX_NAMES, type)
      },
      {
        title: '成员年龄占比',
        data: survey?.ageAnalysis || [],
        formatType: (type: number | null) => formatHrmAnalysisType(TEAM_AGE_RANGE_NAMES, type)
      },
      {
        title: '成员司龄占比',
        data: survey?.companyAgeAnalysis || [],
        formatType: (type: number | null) =>
          formatHrmAnalysisType(TEAM_COMPANY_AGE_RANGE_NAMES, type)
      }
    ],
    [survey]
  )

  return (
    <Card title="团队概况" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'grid',
          // 窄屏（< lg）单列
          gridTemplateColumns: `repeat(${screens.lg ? 2 : 1}, 1fr)`,
          columnGap: 16,
          rowGap: 8
        }}
      >
        {charts.map((chart) => (
          <div key={chart.title} style={{ minHeight: 260 }}>
            <div style={{ marginBottom: 4, textAlign: 'center', fontSize: 14 }}>{chart.title}</div>
            {hasData(chart.data) ? (
              <ReactECharts
                option={buildChartOptions(chart.data, chart.formatType)}
                style={{ height: 230 }}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default HrmTeamSurvey
