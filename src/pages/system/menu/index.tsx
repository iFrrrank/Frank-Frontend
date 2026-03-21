import React, { useRef, useState } from 'react'
import { Button, message, Modal, Switch } from 'antd'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
  ProTable
} from '@ant-design/pro-components'
import * as AntdIcons from '@ant-design/icons'
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  SwapOutlined,
  SyncOutlined
} from '@ant-design/icons'

import { createMenu, deleteMenu, getMenuList, updateMenu } from '@/api/system/menu' // 将扁平菜单数据转换为树形结构

// 将扁平菜单数据转换为树形结构
const handleTreeData = (data: any[], parentId: number = 0): any[] => {
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

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingMenu, setEditingMenu] = useState<any>(null)

  // 树表格展开控制
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])

  // 全量扁平数据（用于在新建弹窗里选择父级）
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
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否确认删除选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteMenu({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  const handleEdit = (record: any) => {
    setEditingMenu(record)
    setCreateModalVisible(true)
  }

  const handleCreateSub = (record: any) => {
    setEditingMenu({ parentId: record.id })
    setCreateModalVisible(true)
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
        placeholder: '请输入菜单名称'
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
        placeholder: '请选择菜单状态'
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
          <a onClick={() => handleEdit(record)}>修改</a>
          <a onClick={() => handleCreateSub(record)}>新增</a>
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
        actionRef={actionRef}
        formRef={formRef}
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
            onClick={() => {
              setEditingMenu(null)
              setCreateModalVisible(true)
            }}
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

      {/* ========== 新增/编辑菜单弹窗 ========== */}
      <ModalForm
        title={editingMenu?.id ? '修改菜单' : '新增菜单'}
        width={680}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) setEditingMenu(null)
        }}
        // 处理回显数据
        initialValues={
          editingMenu?.id
            ? {
                ...editingMenu
              }
            : {
                parentId: editingMenu?.parentId || 0,
                type: 1, // 默认菜单
                sort: 0,
                status: 0,
                visible: true,
                alwaysShow: true,
                keepAlive: true
              }
        }
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        grid={true}
        rowProps={{ gutter: [16, 0] }}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        colon={false}
        onFinish={async (values) => {
          try {
            let resp
            if (editingMenu?.id) {
              resp = await updateMenu({ ...values, id: editingMenu.id } as any)
            } else {
              resp = await createMenu(values as any)
            }

            if (resp.code === 0) {
              message.success(editingMenu?.id ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingMenu?.id ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingMenu?.id ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormTreeSelect
          name="parentId"
          label="上级菜单"
          colProps={{ span: 24 }}
          placeholder="请选择上级菜单"
          request={async () => {
            // 根节点选项
            const tree = handleTreeData(flatMenuData, 0)
            return [{ value: 0, title: '主类目', children: tree }]
          }}
          fieldProps={{
            fieldNames: { label: 'name', value: 'id' },
            treeDefaultExpandAll: true
          }}
          rules={[{ required: true, message: '请选择上级菜单' }]}
        />

        <ProFormText
          name="name"
          label="菜单名称"
          colProps={{ span: 24 }}
          placeholder="请输入菜单名称"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        />

        <ProFormRadio.Group
          name="type"
          label="菜单类型"
          colProps={{ span: 24 }}
          radioType="button"
          options={[
            { label: '目录', value: 0 },
            { label: '菜单', value: 1 },
            { label: '按钮', value: 2 }
          ]}
        />

        <ProFormDependency name={['type']}>
          {({ type }) => {
            return (
              <>
                {/* === 目录 & 菜单 共有的 === */}
                {(type === 0 || type === 1) && (
                  <ProFormText
                    name="icon"
                    label="菜单图标"
                    colProps={{ span: 24 }}
                    placeholder="请输入菜单图标"
                    fieldProps={{
                      addonAfter: <AntdIcons.UserOutlined /> // 示意性图标后置
                    }}
                  />
                )}

                {(type === 0 || type === 1) && (
                  <ProFormText
                    name="path"
                    label="路由地址"
                    colProps={{ span: 24 }}
                    placeholder="请输入路由地址"
                    tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以 `http(s)://` 开头"
                    rules={[{ required: true, message: '请输入路由地址' }]}
                  />
                )}

                {/* === 菜单独有的 === */}
                {type === 1 && (
                  <>
                    <ProFormText
                      name="component"
                      label="组件地址"
                      colProps={{ span: 24 }}
                      placeholder="请输入组件地址"
                    />
                    <ProFormText
                      name="componentName"
                      label="组件名字"
                      colProps={{ span: 24 }}
                      placeholder="请输入组件名字"
                    />
                  </>
                )}

                {/* === 菜单 & 按钮 共有的 === */}
                {(type === 1 || type === 2) && (
                  <ProFormText
                    name="permission"
                    label="权限标识"
                    colProps={{ span: 24 }}
                    placeholder="请输入权限标识"
                    tooltip="控制器中定义的权限字符，如：`system:user:list`"
                  />
                )}

                {/* === 所有的类型共有 === */}
                <ProFormDigit
                  name="sort"
                  label="显示排序"
                  colProps={{ span: 24 }}
                  placeholder="请输入排序"
                  rules={[{ required: true, message: '请输入显示排序' }]}
                  fieldProps={{ min: 0 }}
                />

                <ProFormRadio.Group
                  name="status"
                  label="菜单状态"
                  colProps={{ span: 24 }}
                  options={[
                    { label: '开启', value: 0 },
                    { label: '关闭', value: 1 }
                  ]}
                />

                {/* === 目录 & 菜单 共有状态 === */}
                {(type === 0 || type === 1) && (
                  <>
                    <ProFormRadio.Group
                      name="visible"
                      label="显示状态"
                      colProps={{ span: 24 }}
                      tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                      options={[
                        { label: '显示', value: true },
                        { label: '隐藏', value: false }
                      ]}
                    />
                    <ProFormRadio.Group
                      name="alwaysShow"
                      label="总是显示"
                      colProps={{ span: 24 }}
                      tooltip="选择不是则当该菜单只有一个子菜单时，不显示自己，直接显示子菜单"
                      options={[
                        { label: '总是', value: true },
                        { label: '不是', value: false }
                      ]}
                    />
                  </>
                )}

                {/* === 菜单独有的状态 === */}
                {type === 1 && (
                  <ProFormRadio.Group
                    name="keepAlive"
                    label="缓存状态"
                    colProps={{ span: 24 }}
                    tooltip="选择缓存则该路由会被 `<keep-alive>` 缓存"
                    options={[
                      { label: '缓存', value: true },
                      { label: '不缓存', value: false }
                    ]}
                  />
                )}
              </>
            )
          }}
        </ProFormDependency>
      </ModalForm>
    </>
  )
}

export default MenuManagement
