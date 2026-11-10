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

/**
 * 构造树型结构数据
 * @param data 数据源
 * @param id id字段 默认 'id'
 * @param parentId 父节点字段 默认 'parentId'
 * @param children 孩子节点字段 默认 'children'
 */
export const handleTree = (
  data: any[],
  id: string = 'id',
  parentId: string = 'parentId',
  children: string = 'children'
): any[] => {
  if (!Array.isArray(data)) {
    return []
  }
  const childrenListMap: Record<string, any[]> = {}
  const nodeIds: Record<string, any> = {}
  const tree: any[] = []

  for (const d of data) {
    const pId = d[parentId]
    if (childrenListMap[pId] == null) {
      childrenListMap[pId] = []
    }
    nodeIds[d[id]] = d
    childrenListMap[pId].push(d)
  }

  for (const d of data) {
    const pId = d[parentId]
    if (nodeIds[pId] == null) {
      tree.push(d)
    }
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[id]] != null) {
      o[children] = childrenListMap[o[id]]
    }
    if (o[children]) {
      for (const c of o[children]) {
        adaptToChildrenList(c)
      }
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  return tree
}

/**
 * 将树结构拍平为数组
 */
export const treeToList = <T = any>(
  tree: any[],
  config: { id?: string; children?: string; pid?: string } = {}
): T => {
  const childrenKey = config.children || 'children'
  const result: any[] = Array.isArray(tree) ? [...tree] : []
  for (let i = 0; i < result.length; i++) {
    if (!result[i]?.[childrenKey]) continue
    result.splice(i + 1, 0, ...result[i][childrenKey])
  }
  return result as unknown as T
}

/**
 * 在树结构中查找符合条件的第一个节点
 */
export const findNode = <T = any>(
  tree: any[],
  func: (node: any) => boolean,
  config: { id?: string; children?: string; pid?: string } = {}
): T | null => {
  const childrenKey = config.children || 'children'
  const list: any[] = Array.isArray(tree) ? [...tree] : []
  for (const node of list) {
    if (func(node)) return node
    if (node?.[childrenKey]) {
      list.push(...node[childrenKey])
    }
  }
  return null
}
