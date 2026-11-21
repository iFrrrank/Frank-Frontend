import React from 'react'
import Demo03StudentPage from '../components/Demo03StudentPage'

// 示例学生（内嵌风格：子表随学生一并提交）
const Demo03StudentInner: React.FC = () => (
  <Demo03StudentPage variant="inner" title="示例学生（内嵌）" />
)

export default Demo03StudentInner
