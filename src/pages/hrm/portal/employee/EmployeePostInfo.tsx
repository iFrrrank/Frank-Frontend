import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Card, Descriptions, Space, Spin, Tag } from 'antd'
import * as EmployeeApi from '@/api/hrm/portal/employee'
import {
  EMPLOYEE_ENTRY_STATUS_OPTIONS,
  EMPLOYEE_STATUS,
  EMPLOYEE_TYPE_OPTIONS
} from '@/utils/constantsValue'
import {
  formatEmployeeQuitReason,
  formatEmployeeQuitType,
  formatHrmDate,
  formatHrmDateTime
} from '@/pages/hrm/utils/format'

export interface EmployeePostInfoProps {
  employee: EmployeeApi.HrmPortalEmployeeVO
}

export interface EmployeePostInfoRef {
  getQuitInfo: () => Promise<void>
}

const EmployeePostInfo = forwardRef<EmployeePostInfoRef, EmployeePostInfoProps>(
  ({ employee }, ref) => {
    const [loading, setLoading] = useState(false)
    const [quitInfo, setQuitInfo] = useState<EmployeeApi.HrmEmployeeQuitInfoVO>()

    const getQuitInfo = async () => {
      setLoading(true)
      try {
        const resp = await EmployeeApi.getEmployeeQuitInfo()
        setQuitInfo(resp.data)
      } finally {
        setLoading(false)
      }
    }

    useImperativeHandle(ref, () => ({
      getQuitInfo
    }))

    useEffect(() => {
      getQuitInfo()
    }, [])

    const getEntryStatusLabel = (val?: number) => {
      if (val === undefined || val === null) return '-'
      const match = EMPLOYEE_ENTRY_STATUS_OPTIONS.find((item) => item.value === val)
      return match ? match.label : String(val)
    }

    const getEmployeeStatusLabel = (val?: number) => {
      if (val === undefined || val === null) return '-'
      return (EMPLOYEE_STATUS[val]?.text as string) || String(val)
    }

    const getEmployeeTypeLabel = (val?: number) => {
      if (val === undefined || val === null) return '-'
      const match = EMPLOYEE_TYPE_OPTIONS.find((item) => item.value === val)
      return match ? match.label : String(val)
    }

    return (
      <Spin spinning={loading}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card title="岗位信息">
            <Descriptions bordered column={4} size="small">
              <Descriptions.Item label="工号">{employee.jobNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="部门">{employee.deptName || '-'}</Descriptions.Item>
              <Descriptions.Item label="岗位">{employee.postName || '-'}</Descriptions.Item>
              <Descriptions.Item label="岗位职级">{employee.postLevel || '-'}</Descriptions.Item>
              <Descriptions.Item label="直属上级">
                {employee.leaderEmployeeName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="入职状态">
                {employee.entryStatus != null ? (
                  <Tag color="geekblue">{getEntryStatusLabel(employee.entryStatus)}</Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="员工状态">
                {employee.status != null ? (
                  <Tag color="green">{getEmployeeStatusLabel(employee.status)}</Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="聘用形式">
                {employee.type != null ? (
                  <Tag color="purple">{getEmployeeTypeLabel(employee.type)}</Tag>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="入职时间">
                {formatHrmDateTime(employee.entryTime)}
              </Descriptions.Item>
              <Descriptions.Item label="转正时间">
                {formatHrmDateTime(employee.regularTime)}
              </Descriptions.Item>
              <Descriptions.Item label="试用期">
                {employee.probation != null ? `${employee.probation} 个月` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="司龄">
                {employee.companyAge != null ? `${employee.companyAge} 年` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="工作城市">{employee.workCity || '-'}</Descriptions.Item>
              <Descriptions.Item label="工作地点">{employee.workAddress || '-'}</Descriptions.Item>
              <Descriptions.Item label="详细地址" span={2}>
                {employee.workDetailAddress || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {quitInfo && (
            <Card title="离职信息">
              <Descriptions bordered column={4} size="small">
                <Descriptions.Item label="计划离职时间">
                  {formatHrmDateTime(quitInfo.planQuitTime)}
                </Descriptions.Item>
                <Descriptions.Item label="申请离职日期">
                  {formatHrmDate(quitInfo.applyQuitTime)}
                </Descriptions.Item>
                <Descriptions.Item label="薪资结算日期">
                  {formatHrmDate(quitInfo.salarySettlementTime)}
                </Descriptions.Item>
                <Descriptions.Item label="离职类型">
                  {formatEmployeeQuitType(quitInfo.type)}
                </Descriptions.Item>
                <Descriptions.Item label="离职原因">
                  {formatEmployeeQuitReason(quitInfo.reason)}
                </Descriptions.Item>
                <Descriptions.Item label="备注" span={3}>
                  {quitInfo.remark || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Space>
      </Spin>
    )
  }
)

export default EmployeePostInfo
