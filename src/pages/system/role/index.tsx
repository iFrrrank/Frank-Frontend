import React, { useRef, useState } from 'react'
import { Button, message, Modal, Space, Switch, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import {
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { createRole, deleteRole, exportUsingGet, getRolePage, updateRole } from '@/api/system/role'
import { assignRoleDataScope, assignRoleMenu, getRoleMenuList } from '@/api/system/permission'
import { getSimpleMenuList } from '@/api/system/menu' // 将扁平菜单数据转换为树形结构

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

const Role: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // ===== 基础增删改查弹窗 =====
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<API.SystemRoleRespVO | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // ===== 菜单权限分配弹窗 =====
  const [menuModalVisible, setMenuModalVisible] = useState(false)
  const [currentRole, setCurrentRole] = useState<API.SystemRoleRespVO | null>(null)
  const [menuTreeData, setMenuTreeData] = useState<DataNode[]>([])
  const [allMenuKeys, setAllMenuKeys] = useState<React.Key[]>([])
  const [checkedMenuKeys, setCheckedMenuKeys] = useState<React.Key[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [menuSubmitLoading, setMenuSubmitLoading] = useState(false)

  // ===== 数据权限分配弹窗 =====
  const [dataScopeVisible, setDataScopeVisible] = useState(false)
  const [dataScopeRole, setDataScopeRole] = useState<API.SystemRoleRespVO | null>(null)

  // 数据列定义
  const columns: ProColumns<API.SystemRoleRespVO>[] = [
    {
      title: '角色 ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
      width: 80
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
      width: 120,
      fieldProps: {
        placeholder: '请输入角色名称'
      }
    },
    {
      title: '角色类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        return record.type === 1 ? (
          <span
            style={{
              color: '#ff4d4f',
              background: '#fff1f0',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            内置
          </span>
        ) : (
          <span
            style={{
              color: '#1890ff',
              background: '#e6f7ff',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            自定义
          </span>
        )
      }
    },
    {
      title: '角色标识',
      dataIndex: 'code',
      align: 'center',
      width: 120,
      fieldProps: {
        placeholder: '请输入角色标识'
      }
    },
    {
      title: '显示顺序',
      dataIndex: 'sort',
      align: 'center',
      width: 85,
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 150,
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '开启',
          status: 'Success'
        },
        1: {
          text: '关闭',
          status: 'Error'
        }
      },
      fieldProps: {
        placeholder: '请选择状态'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      align: 'center',
      width: 180,
      fieldProps: {
        placeholder: ['开始日期', '结束日期']
      },
      render: (_, record) => <span>{record.createTime as any}</span>
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 260,
      key: 'option',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a key="edit" onClick={() => handleEdit(record)}>
            修改
          </a>
          <a key="menu" onClick={() => handleOpenMenuAssign(record)}>
            菜单权限
          </a>
          <a key="data" onClick={() => handleOpenDataScope(record)}>
            数据权限
          </a>
          <a key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  // ===== 删除角色 =====
  const handleDelete = (record: API.SystemRoleRespVO) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否删除所选中数据？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteRole({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '是否删除所选中数据?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteRole({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // ===== 导出角色 =====
  const handleExport = () => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要导出角色数据吗？',
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          // 处理时间范围
          if (formValues.createTime && formValues.createTime.length === 2) {
            formValues.beginTime = formValues.createTime[0] + ' 00:00:00'
            formValues.endTime = formValues.createTime[1] + ' 23:59:59'
            delete formValues.createTime
          }
          const resp = await exportUsingGet({
            exportReqVO: formValues
          })
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '角色数据.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success('导出成功')
        } catch {
          message.error('导出失败')
        }
      }
    })
  }

  // ===== 编辑角色 =====
  const handleEdit = (record: API.SystemRoleRespVO) => {
    setEditingRole(record)
    setCreateModalVisible(true)
  }

  // ===== 菜单权限分配 =====
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

  const handleOpenMenuAssign = async (record: API.SystemRoleRespVO) => {
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

  // ===== 数据权限分配 =====
  const handleOpenDataScope = (record: API.SystemRoleRespVO) => {
    setDataScopeRole(record)
    setDataScopeVisible(true)
  }

  return (
    <>
      <ProTable<API.SystemRoleRespVO>
        columns={columns}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        formRef={formRef}
        cardBordered
        request={async (params: Record<string, any>) => {
          const { current, pageSize, name, code, status, createTime, ...rest } = params
          let beginTime, endTime
          if (createTime && createTime.length === 2) {
            beginTime = createTime[0] + ' 00:00:00'
            endTime = createTime[1] + ' 23:59:59'
          }
          const resp = await getRolePage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...(name ? { name } : {}),
            ...(code ? { code } : {}),
            ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
            ...(beginTime ? { beginTime } : {}),
            ...(endTime ? { endTime } : {}),
            ...rest
          } as any)
          return {
            data: resp.data?.list,
            success: true,
            total: resp.data?.total
          }
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        options={false}
        pagination={{
          align: 'center',
          showSizeChanger: true
        }}
        headerTitle={false}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRole(null)
              setCreateModalVisible(true)
            }}
            type="primary"
          >
            新增
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ color: '#52c41a', borderColor: '#b7eb8f', background: '#f6ffed' }}
          >
            导出
          </Button>,
          <Button
            key="batchDelete"
            icon={<DeleteOutlined />}
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
            style={
              selectedRowKeys.length > 0
                ? { color: '#ff4d4f', borderColor: '#ffccc7', background: '#fff2f0' }
                : {}
            }
          >
            批量删除
          </Button>
        ]}
      />

      {/* ========== 新增/编辑角色弹窗 ========== */}
      <ModalForm<API.SystemRoleSaveReqVO>
        title={editingRole ? '修改' : '新增'}
        width={500}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingRole(null)
          }
        }}
        initialValues={
          editingRole
            ? {
                id: editingRole.id,
                name: editingRole.name,
                code: editingRole.code,
                sort: editingRole.sort,
                status: editingRole.status,
                remark: editingRole.remark
              }
            : { sort: 0, status: 0 }
        }
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingRole) {
              resp = await updateRole({ ...values, id: editingRole.id })
            } else {
              resp = await createRole(values)
            }
            if (resp.code === 0) {
              message.success(editingRole ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingRole ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingRole ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="角色名称"
          colProps={{ span: 24 }}
          placeholder="请输入角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        />
        <ProFormText
          name="code"
          label="角色标识"
          colProps={{ span: 24 }}
          placeholder="请输入角色标识"
          rules={[{ required: true, message: '请输入角色标识' }]}
        />
        <ProFormDigit
          name="sort"
          label="显示顺序"
          colProps={{ span: 24 }}
          placeholder="请输入显示顺序"
          rules={[{ required: true, message: '请输入显示顺序' }]}
          fieldProps={{ min: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          colProps={{ span: 24 }}
          placeholder="请选择状态"
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          colProps={{ span: 24 }}
          placeholder="请输入备注内容"
        />
      </ModalForm>

      {/* ========== 菜单权限弹窗 ========== */}
      <Modal
        title="菜单权限"
        open={menuModalVisible}
        width={600}
        onCancel={() => setMenuModalVisible(false)}
        onOk={handleMenuSubmit}
        confirmLoading={menuSubmitLoading}
        okText="确定"
        cancelText="取消"
        bodyStyle={{ paddingTop: 16 }}
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

      {/* ========== 数据权限弹窗 ========== */}
      <ModalForm
        title="数据权限"
        width={500}
        open={dataScopeVisible}
        onOpenChange={(visible) => {
          setDataScopeVisible(visible)
          if (!visible) setDataScopeRole(null)
        }}
        initialValues={{ dataScope: 1 }} // 默认全部数据权限
        modalProps={{
          destroyOnClose: true
        }}
        onFinish={async (values) => {
          try {
            if (dataScopeRole) {
              const resp = await assignRoleDataScope({
                roleId: dataScopeRole.id,
                dataScope: values.dataScope,
                dataScopeDeptIds: [] // TODO: 处理自定义部门
              })
              if (resp.code === 0) {
                message.success('数据权限分配成功')
                return true
              }
              message.error(resp.msg || '数据权限分配失败')
            }
            return false
          } catch {
            message.error('数据权限分配失败')
            return false
          }
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Space size={32}>
            <div>
              <span style={{ color: '#555', marginRight: 16 }}>角色名称</span>
              <span
                style={{
                  color: '#1890ff',
                  background: '#e6f7ff',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                {dataScopeRole?.name}
              </span>
            </div>
            <div style={{ marginTop: 12 }}>
              <span style={{ color: '#555', marginRight: 16 }}>角色标识</span>
              <span
                style={{
                  color: '#1890ff',
                  background: '#e6f7ff',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                {dataScopeRole?.code}
              </span>
            </div>
          </Space>
        </div>
        <ProFormSelect
          name="dataScope"
          label="权限范围"
          placeholder="请选择权限范围"
          options={[
            { label: '全部数据权限', value: 1 },
            { label: '自定数据权限', value: 2 },
            { label: '本部门数据权限', value: 3 },
            { label: '本部门及以下数据权限', value: 4 },
            { label: '仅本人数据权限', value: 5 }
          ]}
        />
      </ModalForm>
    </>
  )
}

export default Role
