import React, { useEffect, useState } from 'react'
import { TreeSelect } from 'antd'
import type { TreeDataNode } from 'antd'
import { getSimpleDeptList } from '@/api/system/dept'
import { buildTreeData } from '@/utils/tree'

interface DeptSelectProps {
  value?: number
  onChange?: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  style?: React.CSSProperties
}

// 部门单选树（对应 Vue 的 system/dept/components/DeptSelect 单选模式）
const DeptSelect: React.FC<DeptSelectProps> = ({
  value,
  onChange,
  placeholder = '请选择部门',
  disabled,
  allowClear = true,
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
      allowClear={allowClear}
      showSearch
      treeDefaultExpandAll
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

export default DeptSelect
