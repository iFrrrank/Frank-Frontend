import React from 'react'
import { useModel } from '@umijs/max'

interface Props {
  value: string | string[]
  children: React.ReactNode
}

export const useHasPermi = () => {
  const { initialState } = useModel('@@initialState')

  // NOTE: 请根据您后端的实际 User 数据解构出 permissions。
  // 在 RuoYi-Vue-Pro 系后端中，权限数组可能在 currentUser 对象的 permissions 属性中
  // 这里做一个宽容度较高的处理，兼顾 Array 和 Set。
  const permissions = (initialState?.currentUser as any)?.permissions || []
  const all_permission = '*:*:*'

  return (permission: string | string[]) => {
    const permArray = Array.isArray(permission) ? permission : [permission]

    // Set 处理
    if (permissions instanceof Set) {
      return permissions.has(all_permission) || permArray.some((p) => permissions.has(p))
    }
    // Array 处理
    if (Array.isArray(permissions)) {
      return permissions.includes(all_permission) || permArray.some((p) => permissions.includes(p))
    }
    return false
  }
}

/**
 * 权限控制组件
 * 使用示例: <HasPermi value={['sys:user:add', 'sys:user:edit']}><Button>创建用户</Button></HasPermi>
 */
const HasPermi: React.FC<Props> = ({ value, children }) => {
  const hasPermi = useHasPermi()
  if (value && value.length > 0) {
    if (hasPermi(value)) {
      return <>{children}</>
    }
  }
  return null
}

export default HasPermi
