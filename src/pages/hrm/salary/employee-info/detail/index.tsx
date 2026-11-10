import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Tabs, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import { getEmployee } from '@/api/hrm/employee'
import { getSalaryEmployeeInfo } from '@/api/hrm/salary/employeeInfo'
import EmployeeDetailsHeader from '@/pages/hrm/employee/components/EmployeeDetailsHeader'
import SalaryEmployeeInfoDetails from './SalaryEmployeeInfoDetails'
import SalaryChangeRecordList from './SalaryChangeRecordList'
import type { SalaryChangeRecordListRef } from './SalaryChangeRecordList'
import SalaryEmployeeInfoForm from '../SalaryEmployeeInfoForm'

const SalaryEmployeeInfoDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const employeeId = Number(searchParams.get('id'))

  const [loading, setLoading] = useState(false)
  const [employee, setEmployee] = useState<API.HrmEmployeeRespVO>({} as API.HrmEmployeeRespVO)
  const [salaryEmployee, setSalaryEmployee] = useState<API.HrmSalaryEmployeeInfoRespVO>({})
  const [activeTab, setActiveTab] = useState('salaryEmployee')

  const [formVisible, setFormVisible] = useState(false)
  const [currentRecordId, setCurrentRecordId] = useState<number>()
  const recordListRef = useRef<SalaryChangeRecordListRef>(null)

  const getData = async () => {
    if (!employeeId) {
      message.error('员工编号不能为空')
      history.push('/hrm/salary/employee-info')
      return
    }

    setLoading(true)
    try {
      const [empResp, salaryResp] = await Promise.all([
        getEmployee({ id: employeeId }),
        getSalaryEmployeeInfo({ employeeId })
      ])

      if (!empResp.data) {
        message.warning('员工档案不存在')
        history.push('/hrm/salary/employee-info')
        return
      }

      setEmployee(empResp.data)
      setSalaryEmployee(salaryResp.data || {})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [employeeId])

  const openSetSalary = (recordId?: number) => {
    setCurrentRecordId(recordId)
    setFormVisible(true)
  }

  const handleSalaryUpdated = async () => {
    await getData()
    await recordListRef.current?.getList()
  }

  return (
    <div>
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/hrm/salary/employee-info')}
        >
          返回薪资档案
        </Button>
      </Card>

      <EmployeeDetailsHeader employee={employee} loading={loading}>
        <Button
          type="primary"
          icon={<EditOutlined />}
          disabled={!employee.id}
          onClick={() => openSetSalary()}
        >
          {salaryEmployee.id ? '调薪' : '定薪'}
        </Button>
      </EmployeeDetailsHeader>

      <Card variant="borderless">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'salaryEmployee',
              label: '薪资档案',
              children: <SalaryEmployeeInfoDetails salaryEmployee={salaryEmployee} />
            },
            {
              key: 'records',
              label: '调薪记录',
              children: (
                <SalaryChangeRecordList
                  ref={recordListRef}
                  employeeId={employeeId}
                  onEdit={(record) => openSetSalary(record.id)}
                  onChange={getData}
                />
              )
            }
          ]}
        />
      </Card>

      <SalaryEmployeeInfoForm
        visible={formVisible}
        setVisible={setFormVisible}
        employeeId={employeeId}
        recordId={currentRecordId}
        onSuccess={handleSalaryUpdated}
      />
    </div>
  )
}

export default SalaryEmployeeInfoDetailPage
