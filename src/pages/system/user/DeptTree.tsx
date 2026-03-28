import React, { useEffect, useMemo, useState } from 'react'
import type { TreeDataNode } from 'antd'
import { Input, message, Tree } from 'antd'
import { getSimpleDeptList } from '@/api/system/dept'

const { Search } = Input

interface DeptTreeProps {
  onSelect?: (deptId: number | undefined) => void
}

// 将后端返回的扁平数据转换为树形结构
const buildTreeData = (list: { id: number; name: string; parentId: number }[]): TreeDataNode[] => {
  const map = new Map<number, TreeDataNode>()
  const tree: TreeDataNode[] = []

  list.forEach((item) => {
    const node: TreeDataNode = { key: item.id, title: item.name, children: [] }
    map.set(item.id, node)
  })

  list.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === 0) {
      tree.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    }
  })

  return tree
}

const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
  let parentKey: React.Key
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey!
}

const DeptTree: React.FC<DeptTreeProps> = ({ onSelect }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [defaultData, setDefaultData] = useState<TreeDataNode[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [dataList, setDataList] = useState<{ key: React.Key; title: string }[]>([])

  useEffect(() => {
    async function fetchData() {
      const resp = await getSimpleDeptList()
      if (resp.code === 0) {
        const treeData = buildTreeData(resp.data || [])
        setDefaultData(treeData)
        const list: { key: React.Key; title: string }[] = []
        resp.data?.forEach((item: { id: number; name: string }) => {
          list.push({ key: item.id, title: item.name })
        })
        setDataList(list)
        // 数据加载后，默认展开所有节点
        setExpandedKeys(list.map((item) => item.key))
      } else {
        message.error('获取部门数据失败')
      }
    }

    fetchData()
  }, [])

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys)
    setAutoExpandParent(false)
  }

  // 点击部门树节点时，通知父组件
  const handleSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys)
    if (keys.length > 0) {
      onSelect?.(Number(keys[0]))
    } else {
      // 取消选中时，清除部门筛选
      onSelect?.(undefined)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      // 搜索框清空时，恢复全部展开
      setSearchValue('')
      setExpandedKeys(dataList.map((item) => item.key))
      setSelectedKeys([])
      onSelect?.(undefined)
      return
    }

    // 收集匹配节点自身的 key 以及它们整条祖先链上的所有 key
    const expandKeySet = new Set<React.Key>()
    dataList.forEach((item) => {
      if (item.title.includes(value)) {
        // 添加匹配节点自己的 key
        expandKeySet.add(item.key)
        // 递归向上查找所有父级 key
        let parentKey = getParentKey(item.key, defaultData)
        while (parentKey) {
          expandKeySet.add(parentKey)
          parentKey = getParentKey(parentKey, defaultData)
        }
      }
    })
    setExpandedKeys(Array.from(expandKeySet))
    setSearchValue(value)
    setAutoExpandParent(true)

    // 搜索时，自动选中匹配到的第一个部门节点
    const matchedItem = dataList.find((item) => item.title.includes(value))
    if (matchedItem) {
      setSelectedKeys([matchedItem.key])
      onSelect?.(Number(matchedItem.key))
    }
  }

  const treeData = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = String(item.title || '')
        const index = strTitle.indexOf(searchValue)
        const beforeStr = strTitle.substring(0, index)
        const afterStr = strTitle.slice(index + searchValue.length)
        const title =
          index > -1 ? (
            <span key={item.key}>
              {beforeStr}
              <span style={{ color: '#f5521b' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span key={item.key}>{strTitle}</span>
          )
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) }
        }

        return {
          title,
          key: item.key
        }
      })

    return loop(defaultData)
  }, [searchValue, defaultData])

  return (
    <div>
      <Search
        style={{ marginBottom: 8, marginRight: 8 }}
        placeholder="请输入部门名称"
        onChange={onChange}
        allowClear
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        selectedKeys={selectedKeys}
        onSelect={handleSelect}
        defaultExpandAll={true}
      />
    </div>
  )
}

export default DeptTree
