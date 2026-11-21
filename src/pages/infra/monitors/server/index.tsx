import React from 'react'
import IframeMonitor from '../IframeMonitor'

// 服务监控（Spring Boot Admin 内嵌页）
const ServerMonitor: React.FC = () => (
  <IframeMonitor title="服务监控" defaultSrc="http://localhost:9001/admin/applications" />
)

export default ServerMonitor
