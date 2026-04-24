import React, { useState } from 'react'
import { Layout, Menu, Card } from 'antd'
import TodayCustomer from './components/TodayCustomer'
import FollowClue from './components/FollowClue'
import FollowCustomer from './components/FollowCustomer'
import PoolCustomer from './components/PoolCustomer'
import AuditContract from './components/AuditContract'
import AuditReceivable from './components/AuditReceivable'
import RemindReceivablePlan from './components/RemindReceivablePlan'
import ExpiringContract from './components/ExpiringContract'
import { layoutStyle, siderStyle } from '@/styles/common.style'
import { BACKLOG_MENU_LIST } from '@/utils/constantsValue'

const { Sider, Content } = Layout

const Backlog: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('todayCustomer')

  const renderContent = () => {
    switch (activeKey) {
      case 'todayCustomer':
        return <TodayCustomer />
      case 'followClue':
        return <FollowClue />
      case 'followCustomer':
        return <FollowCustomer />
      case 'poolCustomer':
        return <PoolCustomer />
      case 'auditContract':
        return <AuditContract />
      case 'auditReceivable':
        return <AuditReceivable />
      case 'remindReceivablePlan':
        return <RemindReceivablePlan />
      case 'expiringContract':
        return <ExpiringContract />
      default:
        return null
    }
  }

  return (
    <Layout style={layoutStyle}>
      <Sider width={170} theme="light" style={siderStyle}>
        <Card variant="borderless" styles={{ body: { padding: 0 } }}>
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            onSelect={({ key }) => setActiveKey(key)}
            items={BACKLOG_MENU_LIST}
          />
        </Card>
      </Sider>
      <Content>
        <Card variant="borderless" styles={{ body: { padding: 0 } }}>
          {renderContent()}
        </Card>
      </Content>
    </Layout>
  )
}

export default Backlog
