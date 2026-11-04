import React from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { EMPLOYEE_ENTRY_STATUS, EMPLOYEE_STATUS } from '@/utils/constantsValue'

interface EmployeeDetailsHeaderProps {
  employee: API.HrmEmployeeRespVO
  loading: boolean
  children?: React.ReactNode
}

/** 员工详情通用头部卡片 */
const EmployeeDetailsHeader: React.FC<EmployeeDetailsHeaderProps> = ({
  employee,
  loading,
  children
}) => {
  const entryStatusConfig =
    employee.entryStatus !== undefined
      ? EMPLOYEE_ENTRY_STATUS[employee.entryStatus]
      : undefined
  const statusConfig =
    employee.status !== undefined ? EMPLOYEE_STATUS[employee.status] : undefined

  return (
    <Card loading={loading} variant="borderless" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 'bold' }}>{employee.name || '-'}</span>
            {entryStatusConfig && <Tag color="blue">{entryStatusConfig.text}</Tag>}
            {statusConfig && <Tag color="cyan">{statusConfig.text}</Tag>}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: '#8c8c8c' }}>
            员工编号：{employee.id || '-'}
          </div>
        </div>
        <div>{children}</div>
      </div>

      <Descriptions column={{ xs: 1, sm: 2, md: 3, lg: 5 }} size="small">
        <Descriptions.Item label="所属部门">{employee.deptName || '-'}</Descriptions.Item>
        <Descriptions.Item label="岗位">{employee.postName || '-'}</Descriptions.Item>
        <Descriptions.Item label="工号">{employee.jobNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{employee.mobile || '-'}</Descriptions.Item>
        <Descriptions.Item label="直属上级">
          {employee.leaderEmployeeName || '-'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default EmployeeDetailsHeader

