import React, { useRef, useState } from 'react'
import { Button, message, Modal, Switch } from 'antd'
import { ActionType, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components'
import * as AntdIcons from '@ant-design/icons'
import { ExclamationCircleOutlined, PlusOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'

import { deleteMenu, getMenuList, updateMenu } from '@/api/system/menu' // 将扁平菜单数据转换为树形结构
import { textConstants } from '@/locales/zh-CN'
import SaveMenuForm, { handleCreateMenu, handleEditMenu } from './SaveMenuForm'
import { handleTreeData } from '@/utils/tree'

// 动态渲染图标
const IconFont = ({ type }: { type?: string }) => {
  if (!type) return null
  // 简单处理一些常见内置图标的展示机制
  // 注意：真实项目中可能使用自定义 SVG 或者是 antd 的动态引入
  const IconComponent =
    (AntdIcons as any)[type] ||
    (AntdIcons as any)[type + 'Outlined'] ||
    (AntdIcons as any)[type.charAt(0).toUpperCase() + type.slice(1) + 'Outlined']
  if (IconComponent) return <IconComponent />
  return <span>{type}</span>
}

const MenuManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // 树表格展开控制
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])

  // 全量扁平数据（用于在新增弹窗里选择父级）
  const [flatMenuData, setFlatMenuData] = useState<any[]>([])

  // 展开折叠切换
  const handleToggleExpandAll = () => {
    const nextState = !isExpandAll
    setIsExpandAll(nextState)
    if (nextState) {
      setExpandedRowKeys(allKeys)
    } else {
      setExpandedRowKeys([])
    }
  }

  // ===== 基础操作 =====
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: textConstants.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: textConstants.common.ok,
      cancelText: textConstants.common.cancel,
      onOk: async () => {
        try {
          await deleteMenu({ id: record.id })
          message.success(textConstants.msg.delSuccess)
          actionRef.current?.reload()
        } catch {
          message.error(textConstants.msg.delError)
        }
      }
    })
  }

  // 状态切换 (Mock 快捷切换，调用 Update)
  const handleStatusChange = async (checked: boolean, record: any) => {
    try {
      const newStatus = checked ? 0 : 1
      await updateMenu({ ...record, status: newStatus })
      message.success('状态更新成功')
      actionRef.current?.reload()
    } catch {
      message.error('状态更新失败')
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      width: 250,
      fieldProps: {
        placeholder: `${textConstants.common.inputText}菜单名称`
      }
    },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (_, record) => <IconFont type={record.icon} />
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      hideInSearch: true,
      ellipsis: true,
      width: 200
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      hideInSearch: true,
      ellipsis: true,
      width: 200
    },
    {
      title: '组件名称',
      dataIndex: 'componentName',
      hideInSearch: true,
      ellipsis: true,
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '开启', status: 'Success' },
        1: { text: '关闭', status: 'Error' }
      },
      fieldProps: {
        placeholder: 'textConstants.common.selectText菜单状态'
      },
      render: (_, record) => (
        <Switch
          checked={record.status === 0}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      )
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a onClick={() => handleEditMenu(record)}>修改</a>
          <a onClick={() => handleCreateMenu(record.id)}>新增</a>
          <a style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  return (
    <>
      <ProTable<any>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        form={{ colon: false }}
        cardBordered
        pagination={false} // 树形菜单通常不分页
        rowKey="id"
        // 控制展开和折叠状态
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => {
            setExpandedRowKeys(keys)
            if (keys.length === 0) setIsExpandAll(false)
          }
        }}
        request={async (params) => {
          const { name, status } = params
          // getMenuList 会返回包含所有项的数据
          const resp = await getMenuList({
            ...(name ? { name } : {}),
            ...(status !== undefined && status !== '' ? { status: String(status) } : {})
          } as any)

          if (resp.code === 0 && resp.data) {
            const list = resp.data || []
            setFlatMenuData(list)

            // 提取所有父节点 id 用于全部展开
            const parentKeys = list
              .filter((item) => list.some((child) => child.parentId === item.id))
              .map((item) => item.id)
            setAllKeys(parentKeys)

            // 构建树形数据
            const treeData = handleTreeData(list, 0)
            return {
              data: treeData,
              success: true
            }
          }
          return { data: [], success: true }
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        options={false}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateMenu()}
          >
            新增
          </Button>,
          <Button
            key="expand"
            icon={<SwapOutlined rotate={90} />}
            style={{ color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }}
            onClick={handleToggleExpandAll}
          >
            展开/折叠
          </Button>,
          <Button
            key="refresh"
            icon={<SyncOutlined />}
            onClick={() => message.success('刷新菜单缓存成功')} // Mock 本地缓存刷新行为
          >
            刷新菜单缓存
          </Button>
        ]}
      />

      <SaveMenuForm onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default MenuManagement
