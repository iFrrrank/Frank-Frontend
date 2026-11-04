import React, { useRef, useState } from 'react'
import { Button, Card, Tabs } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import EmployeeCreateFieldConfig, {
  EmployeeCreateFieldConfigRef
} from './EmployeeCreateFieldConfig'
import EmployeeArchiveFieldConfig, {
  EmployeeArchiveFieldConfigRef
} from './EmployeeArchiveFieldConfig'

const EmployeeConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [saving, setSaving] = useState(false)

  const createFieldConfigRef = useRef<EmployeeCreateFieldConfigRef>(null)
  const archiveFieldConfigRef = useRef<EmployeeArchiveFieldConfigRef>(null)

  /** 保存字段配置 */
  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (activeTab === 'create') {
        await createFieldConfigRef.current?.submitForm()
      } else {
        await archiveFieldConfigRef.current?.submitForm()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer>
      <Card bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Button type="primary" icon={<CheckOutlined />} loading={saving} onClick={handleSubmit}>
              保存
            </Button>
          }
          items={[
            {
              key: 'create',
              label: '新建员工字段设置',
              children: <EmployeeCreateFieldConfig ref={createFieldConfigRef} />
            },
            {
              key: 'archive',
              label: '员工档案设置',
              children: <EmployeeArchiveFieldConfig ref={archiveFieldConfigRef} />
            }
          ]}
        />
      </Card>
    </PageContainer>
  )
}

export default EmployeeConfigPage
