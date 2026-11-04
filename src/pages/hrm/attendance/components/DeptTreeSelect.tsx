import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'antd'
import type { TreeDataNode } from 'antd'
import { getSimpleDeptList } from '@/api/system/dept'
import { buildTreeData } from '@/utils/tree'

interface DeptTreeSelectProps {
  value?: number[]
  onChange?: (value: number[]) => void
  placeholder?: string
  disabled?: boolean
  style?: React.CSSProperties
}

// 部门多选树（对应 Vue 的 system/dept/components/DeptSelect，multiple 模式）
const DeptTreeSelect: React.FC<DeptTreeSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择部门',
  disabled,
  style
}) => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])

  useEffect(() => {
    getSimpleDeptList()
      .then((resp) => setTreeData(buildTreeData(resp.data || [])))
      .catch(() => setTreeData([]))
  }, [])

  return (
    <TreeSelect
      multiple
      allowClear
      showSearch
      treeDefaultExpandAll
      maxTagCount="responsive"
      treeNodeFilterProp="title"
      placeholder={placeholder}
      disabled={disabled}
      style={{ width: '100%', ...style }}
      value={value}
      onChange={onChange}
      treeData={treeData}
      fieldNames={{ label: 'title', value: 'key', children: 'children' }}
    />
  )
}

export default DeptTreeSelect
