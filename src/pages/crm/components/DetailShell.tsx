import React from 'react'
import { Button, Card, Spin, Tabs } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { history } from '@umijs/max'

interface DetailShellProps {
  // 页头标题（一般为业务对象名称）
  title: string
  loading?: boolean
  tabItems: { key: string; label: string; children: React.ReactNode }[]
}

// CRM 详情页外壳：返回按钮 + 标题 + Tab 区，各实体详情页共用
const DetailShell: React.FC<DetailShellProps> = ({ title, loading, tabItems }) => {
  return (
    <PageContainer
      header={{
        title,
        onBack: () => history.back(),
        backIcon: <ArrowLeftOutlined />
      }}
    >
      <Spin spinning={!!loading}>
        <Card>
          <Tabs items={tabItems} destroyInactiveTabPane />
        </Card>
      </Spin>
      <Button type="link" onClick={() => history.back()} style={{ marginTop: 8 }}>
        返回列表
      </Button>
    </PageContainer>
  )
}

export default DetailShell
