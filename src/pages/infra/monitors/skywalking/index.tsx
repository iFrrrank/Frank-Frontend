import React from 'react'
import IframeMonitor from '../IframeMonitor'

// SkyWalking 链路追踪（独立部署的 UI 地址，可在页面上修改）
const SkyWalkingMonitor: React.FC = () => (
  <IframeMonitor title="链路追踪" defaultSrc="http://localhost:8080" />
)

export default SkyWalkingMonitor
