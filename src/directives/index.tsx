export { default as HasPermi, useHasPermi } from './permission/HasPermi'
export { default as HasRole, useHasRole } from './permission/HasRole'

// ------------------------------------------------------------
// 对于原先名为 v-mountedFocus 的指令：
// React 中由于没有指令系统，而是通过 Hook 实现。
// 引入并在组件中使用：const inputRef = useMountedFocus<HTMLInputElement>(); <input ref={inputRef} />
// ------------------------------------------------------------
import { useEffect, useRef } from 'react'

export const useMountedFocus = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  return ref
}
