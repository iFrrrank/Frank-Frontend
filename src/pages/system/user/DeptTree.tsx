import React, { useMemo, useState, useEffect } from 'react'
import { Input, Tree, message } from 'antd'
import type { TreeDataNode } from 'antd'
import { getSimpleDeptList } from '@/api/system/dept'

const { Search } = Input
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

const dataList: { key: React.Key; title: string }[] = []

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

const DeptTree: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [defaultData, setDefaultData] = useState<TreeDataNode[]>([])

  useEffect(() => {
    async function fetchData() {
      const resp = await getSimpleDeptList()
      if (resp.code === 0) {
        const treeData = buildTreeData(resp.data || [])
        setDefaultData(treeData)
        resp.data?.forEach((item: { id: number; name: string }) => {
          dataList.push({ key: item.id, title: item.name })
        })
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.includes(value)) {
          return getParentKey(item.key, defaultData)
        }
        return null
      })
      .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i))
    setExpandedKeys(newExpandedKeys)
    setSearchValue(value)
    setAutoExpandParent(true)
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
              <span className="site-tree-search-value">{searchValue}</span>
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

  const styleObj = {
    marginBottom: 8,
    marginRight: 8
  }

  return (
    <div>
      <Search style={styleObj} placeholder="搜索" onChange={onChange} />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        defaultExpandAll={true}
      />
    </div>
  )
}

export default DeptTree
