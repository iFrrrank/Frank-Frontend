import React from 'react'
import { Card, Descriptions } from 'antd'
import dayjs from 'dayjs'

interface EmployeeDetailsInfoProps {
  employee: API.HrmEmployeeRespVO
}

const fmtDate = (value?: string | number) =>
  value ? dayjs(value as any).format('YYYY-MM-DD') : '-'

// 员工基础资料（基本信息页签顶部）
const EmployeeDetailsInfo: React.FC<EmployeeDetailsInfoProps> = ({ employee }) => {
  return (
    <Card title="基础资料" style={{ marginBottom: 16 }}>
      <Descriptions column={3}>
        <Descriptions.Item label="姓名">{employee.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="工号">{employee.jobNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{employee.mobile || '-'}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{employee.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="性别">
          {employee.sex === 1 ? '男' : employee.sex === 2 ? '女' : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="出生日期">{fmtDate(employee.birthday)}</Descriptions.Item>
        <Descriptions.Item label="年龄">
          {employee.age !== undefined ? employee.age : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="证件类型">{employee.idType || '-'}</Descriptions.Item>
        <Descriptions.Item label="证件号码">{employee.idNumber || '-'}</Descriptions.Item>
        <Descriptions.Item label="民族">{employee.nation || '-'}</Descriptions.Item>
        <Descriptions.Item label="籍贯">{employee.nativePlace || '-'}</Descriptions.Item>
        <Descriptions.Item label="最高学历">{employee.highestEducation || '-'}</Descriptions.Item>
        <Descriptions.Item label="现居住地址">{employee.address || '-'}</Descriptions.Item>
        <Descriptions.Item label="备注">{employee.remark || '-'}</Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default EmployeeDetailsInfo
