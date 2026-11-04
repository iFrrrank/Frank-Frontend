import React, { useState } from 'react'
import { Card, Tabs } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import AttendanceClockOverview from './AttendanceClockOverview'
import AttendanceClockRecordList from './AttendanceClockRecordList'

const HrmAttendanceClockPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabItems = [
    {
      key: 'overview',
      label: '打卡概况',
      children: <AttendanceClockOverview />
    },
    {
      key: 'record',
      label: '打卡明细',
      children: <AttendanceClockRecordList />
    }
  ]

  return (
    <PageContainer header={{ title: '考勤打卡管理' }}>
      <Card styles={{ body: { padding: '12px 24px' } }} style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          destroyInactiveTabPane={false}
        />
      </Card>
    </PageContainer>
  )
}

export default HrmAttendanceClockPage

