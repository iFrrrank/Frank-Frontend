import React, { useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  CaretDownOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SwapOutlined
} from '@ant-design/icons'
import { deleteDept, getDeptList } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import SaveDeptModal, { handleCreateDept, handleEditDept } from './SaveDeptModal'
import { handleTreeData } from '@/utils/tree'

const DeptManagement: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)

  // 树表格展开控制
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [allKeys, setAllKeys] = useState<React.Key[]>([])
  const [hasInitExpanded, setHasInitExpanded] = useState(false)

  // 全量扁平数据（用于在新增弹窗里选择父级）
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
          <a onClick={() => handleEditDept(record)}>修改</a>
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
            onClick={() => handleCreateDept()}
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

      <SaveDeptModal onSuccess={() => actionRef.current?.reload()} />
    </>
  )
}

export default DeptManagement
