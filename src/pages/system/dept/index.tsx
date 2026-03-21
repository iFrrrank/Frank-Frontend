import React, { useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable
} from '@ant-design/pro-components'
import {
  CaretDownOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SwapOutlined
} from '@ant-design/icons'

import {
  createDept,
  deleteDept,
  getDeptList,
  getSimpleDeptList,
  updateDept
} from '@/api/system/dept'

import { getSimpleUserList } from '@/api/system/user'

// 将扁平部门数据转换为树形结构
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

// 供 TreeSelect 使用的节点转换
const buildDeptTreeSelectData = (data: any[]): any[] => {
  return data.map((item) => {
    const node: any = {
      title: item.name,
      value: item.id
    }
    if (item.children && item.children.length > 0) {
      node.children = buildDeptTreeSelectData(item.children)
    }
    return node
  })
}

const DeptManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingDept, setEditingDept] = useState<any>(null)

  // 树表格展开控制
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])
  const [hasInitExpanded, setHasInitExpanded] = useState(false)

  // 全量扁平数据（用于在新建弹窗里选择父级）
  const [flatDeptData, setFlatDeptData] = useState<any[]>([])

  // 用户选项缓存，用于匹配表格的负责人显示
  const [userList, setUserList] = useState<any[]>([])

  // 批量删除
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

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

  // ===== 基本操作 API 调用 =====
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: '确认删除该部门？（若存在子部门则不允许删除）',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteDept({ id: record.id } as any)
          message.success('删除成功')
          actionRef.current?.reload() // 重新加载数据
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `是否确认删除勾选的 ${selectedRowKeys.length} 项数据？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // Promise.all or an Array deletion API if provided
          // Mock sequential deletions since we don't know the exact batch API
          await Promise.all(selectedRowKeys.map((id) => deleteDept({ id } as any)))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('部分或全部数据删除失败，请检查是否包含子级')
        }
      }
    })
  }

  const handleEdit = (record: any) => {
    setEditingDept(record)
    setCreateModalVisible(true)
  }

  // 获取用户列表（负责人字典）
  const fetchUserList = async () => {
    if (userList.length > 0) return userList
    try {
      const resp = await getSimpleUserList()
      if (resp.code === 0 && resp.data) {
        setUserList(resp.data)
        return resp.data
      }
    } catch {}
    return []
  }

  const columns: ProColumns<any>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      width: 250,
      fieldProps: {
        placeholder: '请输入部门名称'
      }
    },
    {
      title: '负责人',
      dataIndex: 'leaderUserId',
      hideInSearch: true,
      width: 150,
      render: (_, record) => {
        // 如果后端有直接返回 leaderName 就直接使用，或者根据 ID 到 userList 里查询
        const leader = userList.find((u) => u.id === record.leaderUserId)
        return <span>{leader?.nickname || record.leader || ''}</span>
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true,
      width: 100
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
        placeholder: '请选择部门状态'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      width: 180,
      valueType: 'dateTime'
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <a onClick={() => handleEdit(record)}>修改</a>
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
        pagination={false} // 树形不分页
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys)
          }
        }}
        // 控制展开和折叠状态
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => {
            setExpandedRowKeys(keys)
            if (keys.length === 0) setIsExpandAll(false)
          },
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.children && record.children.length > 0) {
              return expanded ? (
                <CaretDownOutlined
                  style={{ marginRight: 8, cursor: 'pointer', color: '#666' }}
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <CaretRightOutlined
                  style={{ marginRight: 8, cursor: 'pointer', color: '#666' }}
                  onClick={(e) => onExpand(record, e)}
                />
              )
            }
            return <span style={{ display: 'inline-block', width: 22 }} />
          }
        }}
        request={async (params) => {
          // 初始化加载一下户列表以供映射渲染
          await fetchUserList()

          const { name, status } = params
          // getDeptList params
          const resp = await getDeptList({
            ...(name ? { name } : {}),
            ...(status !== undefined && status !== '' ? { status: String(status) } : {})
          } as any)

          if (resp.code === 0 && resp.data) {
            const list = resp.data || []
            setFlatDeptData(list)

            // 提取所有父节点 id 用于全部展开
            const parentKeys: React.Key[] = list
              .filter((item) => list.some((child) => child.parentId === item.id))
              .map((item) => item.id as number)
            setAllKeys(parentKeys)

            if (!hasInitExpanded && list.length > 0) {
              setExpandedRowKeys(parentKeys)
              setIsExpandAll(true)
              setHasInitExpanded(true)
            }

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
              setEditingDept(null)
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
            key="batch-delete"
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

      {/* ========== 新增/编辑部门弹窗 ========== */}
      <ModalForm
        title={editingDept?.id ? '修改部门' : '新增部门'}
        width={500}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) setEditingDept(null)
        }}
        // 处理回显数据
        initialValues={
          editingDept?.id
            ? {
                ...editingDept
              }
            : {
                parentId: editingDept?.parentId || 0,
                sort: 0,
                status: 0
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
            if (editingDept?.id) {
              resp = await updateDept({ ...values, id: editingDept.id } as any)
            } else {
              resp = await createDept(values as any)
            }

            if (resp.code === 0) {
              message.success(editingDept?.id ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingDept?.id ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingDept?.id ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormTreeSelect
          name="parentId"
          label="上级部门"
          colProps={{ span: 24 }}
          placeholder="请选择上级部门"
          request={async () => {
            // 拉取精简的树形部门数据作为上级选择
            const resp = await getSimpleDeptList()
            const list = resp.code === 0 ? resp.data || [] : []
            const tree = buildDeptTreeSelectData(handleTreeData(list, 0))
            return [{ value: 0, title: '顶级部门', children: tree }]
          }}
          fieldProps={{
            fieldNames: { label: 'title', value: 'value' },
            treeDefaultExpandAll: true
          }}
          rules={[{ required: true, message: '请选择上级部门' }]}
        />

        <ProFormText
          name="name"
          label="部门名称"
          colProps={{ span: 24 }}
          placeholder="请输入部门名称"
          rules={[{ required: true, message: '请输入部门名称' }]}
        />

        <ProFormDigit
          name="sort"
          label="显示排序"
          colProps={{ span: 24 }}
          placeholder="请输入显示排序"
          rules={[{ required: true, message: '请输入显示排序' }]}
          fieldProps={{ min: 0 }}
        />

        <ProFormSelect
          name="leaderUserId"
          label="负责人"
          colProps={{ span: 24 }}
          placeholder="请选择负责人"
          showSearch
          request={async () => {
            const list = await fetchUserList()
            return list.map((item: any) => ({
              label: item.nickname,
              value: item.id
            }))
          }}
        />

        <ProFormText
          name="phone"
          label="联系电话"
          colProps={{ span: 24 }}
          placeholder="请输入联系电话"
        />

        <ProFormText
          name="email"
          label="邮箱"
          colProps={{ span: 24 }}
          placeholder="请输入邮箱"
          rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
        />

        <ProFormSelect
          name="status"
          label="状态"
          colProps={{ span: 24 }}
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
          allowClear
        />
      </ModalForm>
    </>
  )
}

export default DeptManagement
