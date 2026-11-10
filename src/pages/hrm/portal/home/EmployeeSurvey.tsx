import React from 'react'
import { Avatar, Button, Card, Empty, Space, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import type { HrmPortalEmployeeVO } from '@/api/hrm/portal/employee'
import type { SalarySlipUnreadSummaryVO } from '@/api/hrm/portal/salary'
import { formatHrmDate } from '@/pages/hrm/utils/format'

interface EmployeeSurveyProps {
  employee?: HrmPortalEmployeeVO
  salarySlipSummary?: SalarySlipUnreadSummaryVO
}

const EmployeeSurvey: React.FC<EmployeeSurveyProps> = ({ employee, salarySlipSummary }) => {
  if (!employee) {
    return (
      <Card>
        <Empty description="当前账号未绑定员工档案" />
      </Card>
    )
  }

  const showRegularDate = employee.regularTime
    ? dayjs().isBefore(dayjs(employee.regularTime))
    : false

  return (
    <Card bodyStyle={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        <Avatar
          size={64}
          src={employee.avatar}
          icon={!employee.avatar && <UserOutlined />}
          style={{ backgroundColor: '#1890ff', fontSize: 24 }}
        >
          {employee.name?.slice(0, 1)}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
            Hi，{employee.name}
          </Typography.Title>

          <div style={{ color: '#595959', fontSize: 14, marginBottom: 12 }}>
            这是你在{employee.deptName || '公司'}的第{' '}
            <strong style={{ color: '#1890ff', fontSize: 18 }}>{employee.entryDay || 0}</strong> 天
          </div>

          <div
            style={{
              color: '#595959',
              fontSize: 14,
              lineHeight: '26px'
            }}
          >
            <span>
              部门：
              <strong style={{ color: '#262626' }}>{employee.deptName || '未设置'}</strong>，
            </span>
            <span>
              岗位：
              <strong style={{ color: '#262626' }}>{employee.postName || '未设置'}</strong>，
            </span>
            <span>
              工号：
              <strong style={{ color: '#262626' }}>{employee.jobNumber || '未设置'}</strong>，
            </span>
            {employee.entryTime && (
              <span>
                <strong style={{ color: '#262626' }}>{formatHrmDate(employee.entryTime)}</strong>{' '}
                入职
              </span>
            )}
            {showRegularDate && (
              <span>
                ，将于{' '}
                <strong style={{ color: '#262626' }}>{formatHrmDate(employee.regularTime)}</strong>{' '}
                转正
              </span>
            )}
          </div>

          {salarySlipSummary?.reminder && (
            <div style={{ marginTop: 12 }}>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => history.push('/hrm/portal/salary/slip')}
              >
                {salarySlipSummary.reminder} &gt;&gt;
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default EmployeeSurvey
