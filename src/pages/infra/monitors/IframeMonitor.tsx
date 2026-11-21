import React, { useState } from 'react'
import { Button, Card, Input, Space } from 'antd'

interface IframeMonitorProps {
  title: string
  // 默认地址（后端服务地址，可在页面上修改后重新加载）
  defaultSrc: string
}

// 通用监控外链页：地址可编辑，内容以内嵌框架展示（Druid/Swagger/服务监控/链路追踪共用）
const IframeMonitor: React.FC<IframeMonitorProps> = ({ title, defaultSrc }) => {
  const [url, setUrl] = useState(defaultSrc)
  const [src, setSrc] = useState(defaultSrc)

  return (
    <Card
      title={title}
      extra={
        <Space>
          <Input
            style={{ width: 420 }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="请输入访问地址"
          />
          <Button type="primary" onClick={() => setSrc(url)}>
            打开
          </Button>
        </Space>
      }
    >
      <iframe
        title={title}
        src={src}
        style={{ width: '100%', height: 'calc(100vh - 220px)', border: 'none' }}
      />
    </Card>
  )
}

export default IframeMonitor
