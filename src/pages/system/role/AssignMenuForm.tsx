import React, { useState } from 'react'
import { message, Modal, Space, Switch, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { assignRoleMenu, getRoleMenuList } from '@/api/system/permission'
import { getSimpleMenuList } from '@/api/system/menu'
import { textConst } from '@/locales/zh-CN'

export let handleOpenMenuAssign: (record: API.SystemRoleRespVO) => void

// 将扁平菜单数据转换为树形结构
const buildMenuTreeData = (list: { id: number; name: string; parentId: number }[]): DataNode[] => {
  const map = new Map<number, any>()
  const tree: DataNode[] = []
  list.forEach((item) => {
    map.set(item.id, { title: item.name, key: item.id, children: [] })
  })
  list.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === 0) {
      tree.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })
  return tree
}

const AssignMenuForm: React.FC = () => {
  const [menuModalVisible, setMenuModalVisible] = useState(false)
  const [currentRole, setCurrentRole] = useState<API.SystemRoleRespVO | null>(null)
  const [menuTreeData, setMenuTreeData] = useState<DataNode[]>([])
  const [allMenuKeys, setAllMenuKeys] = useState<React.Key[]>([])
  const [checkedMenuKeys, setCheckedMenuKeys] = useState<React.Key[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [menuSubmitLoading, setMenuSubmitLoading] = useState(false)

  const loadMenuData = async () => {
    try {
      const resp = await getSimpleMenuList()
      if (resp.code === 0 && resp.data) {
        const list = resp.data as any[]
        const tree = buildMenuTreeData(list)
        setMenuTreeData(tree)
        setAllMenuKeys(list.map((item) => item.id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  handleOpenMenuAssign = async (record: API.SystemRoleRespVO) => {
    setCurrentRole(record)
    setMenuModalVisible(true)
    setIsSelectAll(false)
    setIsExpandAll(false)
    setExpandedKeys([])
    setCheckedMenuKeys([])

    // 加载全部菜单
    if (menuTreeData.length === 0) {
      await loadMenuData()
    }

    // 获取当前角色已有菜单
    try {
      const resp = await getRoleMenuList({ roleId: record.id })
      if (resp.code === 0 && resp.data) {
        setCheckedMenuKeys(resp.data as number[])
      }
    } catch {
      message.error('获取角色菜单权限失败')
    }
  }

  const handleMenuSubmit = async () => {
    if (!currentRole) return
    setMenuSubmitLoading(true)
    try {
      const resp = await assignRoleMenu({
        roleId: currentRole.id,
        menuIds: checkedMenuKeys as number[]
      })
      if (resp.code === 0) {
        message.success('菜单权限分配成功')
        setMenuModalVisible(false)
      } else {
        message.error(resp.msg || '分配失败')
      }
    } catch {
      message.error('分配失败')
    } finally {
      setMenuSubmitLoading(false)
    }
  }

  // 全选/全不选
  const handleSelectAllChange = (checked: boolean) => {
    setIsSelectAll(checked)
    if (checked) {
      setCheckedMenuKeys(allMenuKeys)
    } else {
      setCheckedMenuKeys([])
    }
  }

  // 展开/折叠
  const handleExpandAllChange = (checked: boolean) => {
    setIsExpandAll(checked)
    if (checked) {
      setExpandedKeys(allMenuKeys)
    } else {
      setExpandedKeys([])
    }
  }

  return (
    <Modal
      title="菜单权限"
      open={menuModalVisible}
      width={600}
      onCancel={() => setMenuModalVisible(false)}
      onOk={handleMenuSubmit}
      confirmLoading={menuSubmitLoading}
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
      styles={{ body: { paddingTop: 16 } }}
    >
      <div style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0', marginBottom: 16 }}>
        <Space size={32}>
          <div>
            <span style={{ color: '#888', marginRight: 8 }}>角色名称</span>
            <span
              style={{
                color: '#1890ff',
                background: '#e6f7ff',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              {currentRole?.name}
            </span>
          </div>
          <div>
            <span style={{ color: '#888', marginRight: 8 }}>角色标识</span>
            <span
              style={{
                color: '#1890ff',
                background: '#e6f7ff',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              {currentRole?.code}
            </span>
          </div>
        </Space>
      </div>
      <div>
        <Space style={{ marginBottom: 16 }}>
          <span>全选/全不选：</span>
          <Switch checked={isSelectAll} onChange={handleSelectAllChange} size="small" />
          <span style={{ marginLeft: 16 }}>全部展开/折叠：</span>
          <Switch checked={isExpandAll} onChange={handleExpandAllChange} size="small" />
        </Space>
        <div
          style={{
            height: 350,
            overflowY: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: 8
          }}
        >
          <Tree
            checkable
            checkedKeys={checkedMenuKeys}
            onCheck={(checkedKeysValue) => setCheckedMenuKeys(checkedKeysValue as React.Key[])}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys)}
            treeData={menuTreeData}
          />
        </div>
      </div>
    </Modal>
  )
}

export default AssignMenuForm
