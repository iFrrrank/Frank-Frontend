import { history } from '@umijs/max'
import { Button, Card, Result } from 'antd'
import React from 'react'
import { textConst } from '@/locales/zh-CN'

const NoFoundPage: React.FC = () => (
  <Card variant="borderless">
    <Result
      status="404"
      title="404"
      subTitle={textConst.error.pageError}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {textConst.error.backHome}
        </Button>
      }
    />
  </Card>
)
export default NoFoundPage
