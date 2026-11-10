import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Empty, Table } from 'antd'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { formatDateTime } from '@/pages/hrm/recruit/format'

interface SalaryEmployeeInfoDetailsProps {
  salaryEmployee: API.HrmSalaryEmployeeInfoRespVO
}

const CHANGE_REASON_MAP: Record<number, string> = {
  0: '入职定薪',
  1: '入职核定',
  2: '转正',
  3: '晋升',
  4: '调动',
  5: '年中调薪',
  6: '年度调薪',
  7: '特别调薪',
  8: '其他'
}

const SalaryEmployeeInfoDetails: React.FC<SalaryEmployeeInfoDetailsProps> = ({
  salaryEmployee
}) => {
  if (!salaryEmployee.id) {
    return <Empty description="该员工尚未定薪" style={{ padding: '40px 0' }} />
  }

  const columns = [
    {
      title: '薪资项',
      dataIndex: 'name',
      key: 'name',
      minWidth: 160
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      align: 'center' as const,
      width: 110
    },
    {
      title: '金额',
      dataIndex: 'value',
      key: 'value',
      align: 'right' as const,
      width: 130,
      render: (val: number) => formatHrmMoney(val)
    }
  ]

  return (
    <div>
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered size="small">
          <Descriptions.Item label="正式工资">
            {formatHrmMoney(salaryEmployee.regularSalary)}
          </Descriptions.Item>
          <Descriptions.Item label="试用期工资">
            {formatHrmMoney(salaryEmployee.probationSalary)}
          </Descriptions.Item>
          <Descriptions.Item label="生效日期">
            {formatDateTime(salaryEmployee.effectTime, 'YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="调整原因">
            {salaryEmployee.changeReason != null
              ? CHANGE_REASON_MAP[salaryEmployee.changeReason] || '-'
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="档案状态">
            {salaryEmployee.changeType != null
              ? salaryEmployee.changeType === 1
                ? '定薪'
                : '调薪'
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="备注">{salaryEmployee.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="正式工资明细" variant="borderless" size="small">
          <Table
            columns={columns}
            dataSource={salaryEmployee.salaryOptions || []}
            rowKey="code"
            pagination={false}
            size="small"
          />
        </Card>
        <Card title="试用期工资明细" variant="borderless" size="small">
          <Table
            columns={columns}
            dataSource={salaryEmployee.probationSalaryOptions || []}
            rowKey="code"
            pagination={false}
            size="small"
          />
        </Card>
      </div>
    </div>
  )
}

export default SalaryEmployeeInfoDetails
