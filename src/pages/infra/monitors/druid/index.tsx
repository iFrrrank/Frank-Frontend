import React from 'react'
import IframeMonitor from '../IframeMonitor'

// Druid 数据库监控（后端 /druid 内嵌页）
const DruidMonitor: React.FC = () => (
  <IframeMonitor title="Druid 监控" defaultSrc="http://localhost:9001/druid/index.html" />
)

export default DruidMonitor
