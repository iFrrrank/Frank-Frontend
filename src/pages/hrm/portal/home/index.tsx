import React, { useEffect, useRef, useState } from 'react'
import { Col, Row, Spin } from 'antd'
import { getEmployee } from '@/api/hrm/portal/employee'
import type { HrmPortalEmployeeVO } from '@/api/hrm/portal/employee'
import { getEmployeeHomeCalendar } from '@/api/hrm/portal/home'
import { getUnreadSalarySlipSummary } from '@/api/hrm/portal/salary'
import type { SalarySlipUnreadSummaryVO } from '@/api/hrm/portal/salary'
import type { HrmHomeCalendarItemVO } from '@/pages/hrm/home/api'
import { HrmHomeCalendarItemType } from '@/pages/hrm/home/constants'
import HrmHomeCalendar, { HrmHomeCalendarRef } from '@/pages/hrm/home/components/HrmHomeCalendar'
import { checkHrmPortalAccess } from '../utils'
import EmployeeSurvey from './EmployeeSurvey'

const HrmPortalHomePage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [employee, setEmployee] = useState<HrmPortalEmployeeVO>()
  const [salarySlipSummary, setSalarySlipSummary] = useState<SalarySlipUnreadSummaryVO>()
  const calendarRef = useRef<HrmHomeCalendarRef>(null)

  const isCalendarItemTimeVisible = (item: HrmHomeCalendarItemVO) => {
    return item.type === HrmHomeCalendarItemType.NOTE
  }

  const refreshAll = async () => {
    setLoading(true)
    try {
      const [empResp, salaryResp] = await Promise.all([
        getEmployee(),
        getUnreadSalarySlipSummary(),
        calendarRef.current?.refresh()
      ])
      setEmployee(empResp.data)
      setSalarySlipSummary(salaryResp.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHrmPortalAccess().then((canAccess) => {
      setAccessible(canAccess)
      if (canAccess) {
        refreshAll()
      }
    })
  }, [])

  if (!accessible) return null

  return (
    <Spin spinning={loading}>
      <Row gutter={16}>
        <Col span={16}>
          <EmployeeSurvey employee={employee} salarySlipSummary={salarySlipSummary} />
        </Col>
        <Col span={8}>
          <HrmHomeCalendar
            ref={calendarRef}
            getCalendarItems={getEmployeeHomeCalendar}
            showItemTime={isCalendarItemTimeVisible}
          />
        </Col>
      </Row>
    </Spin>
  )
}

export default HrmPortalHomePage
