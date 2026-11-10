import React from 'react'
import { Card, Descriptions } from 'antd'
import { formatHrmMoney, formatHrmYearMonth } from '@/pages/hrm/utils/format'

interface SalaryMonthRecordDetailsInfoProps {
  record?: API.HrmSalaryMonthRecordRespVO
  loading?: boolean
}

const SalaryMonthRecordDetailsInfo: React.FC<SalaryMonthRecordDetailsInfoProps> = ({
  record = {},
  loading = false
}) => {
  return (
    <Card loading={loading} bodyStyle={{ padding: 16 }}>
      <Descriptions bordered column={3} size="small">
        <Descriptions.Item label="月份">
          {formatHrmYearMonth(record.year, record.month)}
        </Descriptions.Item>
        <Descriptions.Item label="计薪人数">{record.employeeCount ?? 0}</Descriptions.Item>
        <Descriptions.Item label="应发工资">
          {formatHrmMoney(record.expectedPaySalary)}
        </Descriptions.Item>
        <Descriptions.Item label="实发工资">
          {formatHrmMoney(record.realPaySalary)}
        </Descriptions.Item>
        <Descriptions.Item label="个人社保">
          {formatHrmMoney(record.personalInsuranceAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="个人公积金">
          {formatHrmMoney(record.personalProvidentFundAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="个人所得税">
          {formatHrmMoney(record.personalTax)}
        </Descriptions.Item>
        <Descriptions.Item label="公司社保">
          {formatHrmMoney(record.corporateInsuranceAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="公司公积金">
          {formatHrmMoney(record.corporateProvidentFundAmount)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default SalaryMonthRecordDetailsInfo
