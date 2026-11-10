import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Spin, Tabs } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import * as EmployeeApi from '@/api/hrm/portal/employee'
import { checkHrmPortalAccess } from '@/pages/hrm/portal/utils'
import EmployeeBaseInfo, { type EmployeeBaseInfoRef } from './EmployeeBaseInfo'
import EmployeePostInfo, { type EmployeePostInfoRef } from './EmployeePostInfo'
import EmployeeForm from './EmployeeForm'

const HrmPortalEmployeePage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('base')
  const [employee, setEmployee] = useState<EmployeeApi.HrmPortalEmployeeVO>(
    {} as EmployeeApi.HrmPortalEmployeeVO
  )
  const [fieldConfigList, setFieldConfigList] = useState<EmployeeApi.HrmEmployeeFieldConfigVO[]>([])
  const [formOpen, setFormOpen] = useState(false)

  const baseInfoRef = useRef<EmployeeBaseInfoRef>(null)
  const postInfoRef = useRef<EmployeePostInfoRef>(null)

  const getEmployeeData = async () => {
    setLoading(true)
    try {
      const [employeeResp, fieldsResp] = await Promise.all([
        EmployeeApi.getEmployee(),
        EmployeeApi.getEmployeeFieldConfigList()
      ])
      setEmployee(employeeResp.data || ({} as EmployeeApi.HrmPortalEmployeeVO))
      setFieldConfigList(fieldsResp.data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await getEmployeeData()
    if (activeTab === 'base') {
      await baseInfoRef.current?.getList()
    } else {
      await postInfoRef.current?.getQuitInfo()
    }
  }

  useEffect(() => {
    const init = async () => {
      const ok = await checkHrmPortalAccess()
      if (!ok) return
      setAccessible(true)
      await getEmployeeData()
    }
    init()
  }, [])

  if (!accessible) {
    return null
  }

  const tabItems = [
    {
      key: 'base',
      label: '基本信息',
      children: (
        <EmployeeBaseInfo
          ref={baseInfoRef}
          employee={employee}
          fieldConfigList={fieldConfigList}
          onEdit={() => setFormOpen(true)}
        />
      )
    },
    {
      key: 'post',
      label: '岗位信息',
      children: <EmployeePostInfo ref={postInfoRef} employee={employee} />
    }
  ]

  return (
    <PageContainer
      header={{
        title: '我的档案',
        extra: [
          <Button key="refresh" icon={<ReloadOutlined />} onClick={handleRefresh}>
            刷新
          </Button>
        ]
      }}
    >
      <Card>
        <Spin spinning={loading}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            destroyInactiveTabPane={false}
          />
        </Spin>
      </Card>

      <EmployeeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={getEmployeeData}
        employee={employee}
        fieldConfigList={fieldConfigList}
      />
    </PageContainer>
  )
}

export default HrmPortalEmployeePage
