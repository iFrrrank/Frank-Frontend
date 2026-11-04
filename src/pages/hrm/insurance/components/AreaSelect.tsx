import React, { useEffect, useMemo, useState } from 'react'
import { Cascader } from 'antd'
import { getAreaTree } from '@/api/system/area'

interface AreaOption {
  value: number
  label: string
  children?: AreaOption[]
}

export interface AreaSelectProps {
  value?: number
  onChange?: (value?: number) => void
  disabled?: boolean
  placeholder?: string
  /** 允许选中的层级（1 为省），不传则全部可选；不可选层级仍可展开 */
  selectableLevels?: number[]
  style?: React.CSSProperties
}

let areaTreeCache: AreaOption[] | null = null

const convertAreaTree = (nodes: any[]): AreaOption[] =>
  nodes.map((node) => ({
    value: node.id,
    label: node.name,
    children: node.children?.length ? convertAreaTree(node.children) : undefined
  }))

/** 找到目标地区从根到自身的路径（级联选择器需要完整路径作为 value） */
const findPath = (options: AreaOption[], target: number, path: number[] = []): number[] | null => {
  for (const option of options) {
    const current = [...path, option.value]
    if (option.value === target) {
      return current
    }
    if (option.children) {
      const result = findPath(option.children, target, current)
      if (result) {
        return result
      }
    }
  }
  return null
}

/** 地区选择器：对应 Vue 的 system/area/components/AreaSelect（checkStrictly + selectableLevels） */
const AreaSelect: React.FC<AreaSelectProps> = ({
  value,
  onChange,
  disabled,
  placeholder = '请选择地区',
  selectableLevels,
  style
}) => {
  const [options, setOptions] = useState<AreaOption[]>(areaTreeCache || [])
  const [loading, setLoading] = useState<boolean>(!areaTreeCache)

  useEffect(() => {
    if (areaTreeCache) {
      return
    }
    getAreaTree()
      .then((resp) => {
        areaTreeCache = convertAreaTree(resp.data || [])
        setOptions(areaTreeCache)
      })
      .finally(() => setLoading(false))
  }, [])

  const path = useMemo(
    () => (value !== undefined && value !== null ? findPath(options, value) : null),
    [options, value]
  )

  return (
    <Cascader
      style={{ width: '100%', ...style }}
      loading={loading}
      options={options}
      value={path || undefined}
      disabled={disabled}
      placeholder={placeholder}
      changeOnSelect
      showSearch
      allowClear
      onChange={(selected) => {
        if (!selected || selected.length === 0) {
          onChange?.(undefined)
          return
        }
        // 层级即路径长度；不在可选层级内时忽略本次选择，仅展开子级
        if (selectableLevels && !selectableLevels.includes(selected.length)) {
          return
        }
        onChange?.(selected[selected.length - 1] as number)
      }}
    />
  )
}

export default AreaSelect
