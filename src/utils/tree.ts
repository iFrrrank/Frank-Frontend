import type { TreeDataNode } from 'antd'

// 将后端返回的扁平数据转换为树形结构
export const buildTreeData = (
  list: { id: number; name: string; parentId: number }[]
): TreeDataNode[] => {
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

// 将扁平菜单数据转换为树形结构
export const handleTreeData = (data: any[], parentId: number = 0): any[] => {
  const tree: any[] = []
  data.forEach((item) => {
    if (item.parentId === parentId) {
      const children = handleTreeData(data, item.id)
      if (children.length > 0) {
        item.children = children
      }
      tree.push(item)
    }
  })
  return tree.sort((a, b) => a.sort - b.sort) // 排序
}

// 递归查找父节点的 key
export const getParentKey = (key: React.Key, tree: TreeDataNode[]): React.Key => {
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
