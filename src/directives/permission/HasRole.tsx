import React from 'react'
import { useModel } from '@umijs/max'

interface Props {
  value: string | string[]
  children: React.ReactNode
}

export const useHasRole = () => {
  const { initialState } = useModel('@@initialState')

  // NOTE: 请根据您后端的实际 User 数据解构出 roles。
  // 在 RuoYi-Vue-Pro 系后端中，角色数组可能在 currentUser 对象的 roles 属性中
  const roles = (initialState?.currentUser as any)?.roles || []
  const super_admin = 'super_admin'

  return (roleFlag: string | string[]) => {
    const roleArray = Array.isArray(roleFlag) ? roleFlag : [roleFlag]

    // Set 处理
    if (roles instanceof Set) {
      return roles.has(super_admin) || roleArray.some((role) => roles.has(role))
    }
    // Array 处理
    if (Array.isArray(roles)) {
      return roles.includes(super_admin) || roleArray.some((role) => roles.includes(role))
    }
    return false
  }
}

/**
 * 角色控制组件
 * 使用示例: <HasRole value={['admin', 'common']}><Button>管理功能</Button></HasRole>
 */
const HasRole: React.FC<Props> = ({ value, children }) => {
  const hasRole = useHasRole()
  if (value && value.length > 0) {
    if (hasRole(value)) {
      return <>{children}</>
    }
  }
  return null
}

export default HasRole
