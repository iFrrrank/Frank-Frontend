import React, { useEffect, useState } from 'react'
import { Button, Card, Result, Steps } from 'antd'
import { history } from '@umijs/max'
import { redirectBoundEmployeeFromOpeningGuide } from '../utils'

const HrmPortalOpeningGuidePage: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    redirectBoundEmployeeFromOpeningGuide().then((redirected) => {
      setVisible(!redirected)
    })
  }, [])

  if (!visible) return null

  return (
    <Card style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Result
        status="warning"
        title="当前账号尚未开通员工端"
        subTitle="请联系公司管理员在员工管理中创建员工档案，并将绑定用户设置为当前后台账号；保存后即可直接进入员工端工作台。"
        extra={[
          <Button type="primary" key="employee" onClick={() => history.push('/hrm/employee')}>
            前往员工档案
          </Button>,
          <Button key="home" onClick={() => history.push('/')}>
            返回首页
          </Button>
        ]}
      />

      <div
        style={{
          maxWidth: 720,
          margin: '32px auto',
          padding: '24px 32px',
          border: '1px solid #f0f0f0',
          borderRadius: 8
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 24
          }}
        >
          完成员工端开通步骤
        </div>
        <Steps
          current={0}
          items={[
            {
              title: '进入员工档案',
              description: '前往人事管理中的员工档案'
            },
            {
              title: '新增并绑定账号',
              description: '新增或编辑员工时绑定当前后台账号'
            },
            {
              title: '保存员工档案',
              description: '完善基本信息并保存后即可进入员工端'
            }
          ]}
        />
      </div>
    </Card>
  )
}

export default HrmPortalOpeningGuidePage
