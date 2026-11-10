import React, { useEffect, useMemo, useState } from 'react'
import { TreeSelect } from 'antd'
import type { TreeSelectProps } from 'antd'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import { handleTree, treeToList } from '@/utils/tree'
import { useFmsStore } from '../../../store/fms'

export type SubjectNode = API.FmsSubjectRespVO & {
  children?: SubjectNode[]
}

export interface FmsSubjectSelectProps
  extends Omit<TreeSelectProps<number>, 'treeData' | 'onChange'> {
  value?: number
  onChange?: (value?: number, option?: SubjectNode) => void
  options?: SubjectNode[]
  checkStrictly?: boolean
  onlyLeaf?: boolean
}

/**
 * 会计科目树形下拉选择器组件
 */
const FmsSubjectSelect: React.FC<FmsSubjectSelectProps> = ({
  value,
  onChange,
  options,
  checkStrictly = true,
  onlyLeaf = false,
  placeholder = '请选择科目',
  allowClear = false,
  ...restProps
}) => {
  const fmsStore = useFmsStore()
  const [innerTree, setInnerTree] = useState<SubjectNode[]>([])

  useEffect(() => {
    if (options !== undefined) return
    if (!fmsStore.accountSetId) {
      setInnerTree([])
      return
    }
    fmsSubjectGetSubjectSimpleList({ accountSetId: String(fmsStore.accountSetId) }).then((resp) => {
      if (resp.code === 0) {
        setInnerTree(handleTree(resp.data || []))
      }
    })
  }, [options, fmsStore.accountSetId])

  const treeData = useMemo(() => {
    const raw = options ?? innerTree
    // 兼容传入平铺科目数组或树形科目数组
    const isAlreadyTree = raw.some((item) => Array.isArray(item.children) && item.children.length)
    const normalizedTree: SubjectNode[] =
      isAlreadyTree || raw.every((item) => !item.parentId) ? raw : handleTree([...raw])

    const mapNodes = (nodes: SubjectNode[]): any[] =>
      nodes.map((node) => {
        const hasChildren = Boolean(node.children && node.children.length > 0)
        return {
          title: `${node.code} ${node.name}`,
          value: node.id,
          key: node.id,
          disabled: onlyLeaf && !checkStrictly && hasChildren,
          selectable: checkStrictly || !hasChildren,
          children: hasChildren ? mapNodes(node.children!) : undefined,
          raw: node
        }
      })

    return mapNodes(normalizedTree)
  }, [options, innerTree, checkStrictly, onlyLeaf])

  const flatNodes = useMemo(() => {
    const raw = options ?? innerTree
    return treeToList([...raw]) as SubjectNode[]
  }, [options, innerTree])

  return (
    <TreeSelect
      value={value}
      allowClear={allowClear}
      showSearch
      treeDefaultExpandAll
      treeNodeFilterProp="title"
      placeholder={placeholder}
      treeData={treeData}
      popupMatchSelectWidth={false}
      styles={{ popup: { root: { minWidth: 280, maxHeight: 400, overflow: 'auto' } } }}
      onChange={(nextVal) => {
        if (!onChange) return
        const selected = flatNodes.find((item) => item.id === nextVal)
        onChange(nextVal, selected)
      }}
      {...restProps}
    />
  )
}

export default FmsSubjectSelect

