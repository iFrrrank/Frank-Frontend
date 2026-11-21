import React from 'react'
import IframeMonitor from '../monitors/IframeMonitor'

// 接口文档（Knife4j 内嵌页，后端 /doc.html）
const SwaggerDoc: React.FC = () => (
  <IframeMonitor title="接口文档" defaultSrc="http://localhost:9001/doc.html" />
)

export default SwaggerDoc
