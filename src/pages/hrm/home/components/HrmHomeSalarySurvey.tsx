import React, { useMemo } from 'react'
import { Card, Empty } from 'antd'
import { history } from '@umijs/max'
import ReactECharts from 'echarts-for-react'
import { useHasPermi } from '@/directives/permission/HasPermi'
import type { HrmHrHomeSalarySurveyVO } from '../api'
import { HRM_HOME_PERMISSIONS, HRM_HOME_ROUTES } from '../constants'
import { formatHrmMoneyWithThousands } from '../utils'
import SurveyStat from './SurveyStat'

interface Props {
  survey?: HrmHrHomeSalarySurveyVO
}

const HrmHomeSalarySurvey: React.FC<Props> = ({ survey }) => {
  const hasPermi = useHasPermi()
  const canQuerySalary = hasPermi(HRM_HOME_PERMISSIONS.SALARY_MONTH_RECORD_QUERY)
  const canOpenSalary = canQuerySalary && !!survey?.monthRecordId

  const surveyItems = [
    { label: '计薪人员', value: survey?.employeeCount || 0 },
    { label: '实发工资（元）', value: formatHrmMoneyWithThousands(survey?.realPaySalary) }
  ]

  /** 部门薪资占比图表 */
  const chartOptions = useMemo(
    () => ({
      title: {
        text: '部门薪资占比',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
      legend: { type: 'scroll', bottom: 0, left: 'center' },
      series: [
        {
          type: 'pie',
          radius: '48%',
          center: ['50%', '46%'],
          stillShowZeroSum: false,
          data: (survey?.deptProportions || []).map((item) => ({
            name: item.deptName,
            value: Number((item.proportion * 100).toFixed(2))
          }))
        }
      ]
    }),
    [survey]
  )

  /** 打开上月工资表详情 */
  const goSalaryRecord = () => {
    if (!canOpenSalary) return
    history.push({
      pathname: HRM_HOME_ROUTES.SALARY_HISTORY_DETAIL,
      search: `?id=${survey?.monthRecordId}`
    })
  }

  return (
    <Card title="上月薪资概况" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div
          style={{
            width: '34%',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'center'
          }}
        >
          {surveyItems.map((item, index) => (
            <SurveyStat
              key={item.label}
              label={item.label}
              value={item.value}
              disabled={!canOpenSalary}
              divider={index < surveyItems.length - 1}
              onClick={goSalaryRecord}
            />
          ))}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          {survey?.deptProportions?.length ? (
            <ReactECharts option={chartOptions} style={{ height: 220 }} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
          )}
        </div>
      </div>
    </Card>
  )
}

export default HrmHomeSalarySurvey
