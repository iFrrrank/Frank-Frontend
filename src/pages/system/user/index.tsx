import React, { useRef, useState } from 'react'
import type { MenuProps } from 'antd'
import { Button, Col, Dropdown, message, Modal, Row } from 'antd'
import {
  DeleteOutlined,
  DoubleRightOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  KeyOutlined,
  PlusOutlined,
  UploadOutlined,
  UserSwitchOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { deleteUser, exportUserList, getUser, getUserPage } from '@/api/system/user'
import DeptTree from '@/pages/system/user/DeptTree'
import { COMMON_STATUS_VALUE_ENUM } from '@/utils/constantsValue'
import ResetPwdModal, { handleResetPwd } from '@/pages/system/user/ResetPwdModal'
import AssignRoleModal, { handleAssignRole } from '@/pages/system/user/AssignRoleModal'
import ImportUserModal, { handleImportUser } from '@/pages/system/user/ImportUserModal'
import SaveUserModal, { handleEditUser, handleCreateUser } from '@/pages/system/user/SaveUserModal'

const SystemUser: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined)
  // 批量删除相关
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 列定义
  const columns: ProColumns<API.SystemUserRespVO>[] = [
    {
      title: '员工 ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入员工 ID'
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
      width: 120,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入用户名'
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      width: 200,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入邮箱'
      }
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      width: 140,
      hideInSearch: true
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: COMMON_STATUS_VALUE_ENUM,
      fieldProps: {
        placeholder: '请选择状态'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: 'center',
      width: 180,
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 160,
      key: 'option',
      render: (_text, record) => {
        const moreMenuItems: MenuProps['items'] = [
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: '删除',
            onClick: () => handleDelete(record)
          },
          {
            key: 'resetPwd',
            icon: <KeyOutlined />,
            label: '重置密码',
            onClick: () => handleResetPwd(record)
          },
          {
            key: 'assignRole',
            icon: <UserSwitchOutlined />,
            label: '分配角色',
            onClick: () => handleAssignRole(record)
          }
        ]
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <a key="edit" onClick={() => handleEditUser(record)}>
              <EditOutlined /> 修改
            </a>
            <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <DoubleRightOutlined /> 更多
              </a>
            </Dropdown>
          </div>
        )
      }
    }
  ]

  // ===== 删除单个用户 =====
  const handleDelete = (record: API.SystemUserRespVO) => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除用户"${record.username}"吗？`,
      onOk: async () => {
        try {
          await deleteUser({ id: record.id })
          message.success('删除成功')
          actionRef.current?.reload()
        } catch {
          message.error('删除失败')
        }
      }
    })
  }

  // ===== 批量删除 =====
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteUser({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // 部门选中回调
  const handleDeptSelect = (deptId: number | undefined) => {
    setSelectedDeptId(deptId)
    actionRef.current?.reload()
  }

  // 导出用户
  const handleExport = () => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定要导出用户数据吗？',
      onOk: async () => {
        try {
          const formValues = formRef.current?.getFieldsValue?.() || {}
          const resp = await exportUserList({
            exportReqVO: {
              ...formValues,
              deptId: selectedDeptId
            }
          })
          const blob = new Blob([resp], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = '用户数据.xlsx'
          link.click()
          window.URL.revokeObjectURL(url)
          message.success('导出成功')
        } catch {
          message.error('导出失败')
        }
      }
    })
  }

  return (
    <Row gutter={16}>
      <Col span={4}>
        <DeptTree onSelect={handleDeptSelect} />
      </Col>
      <Col span={20}>
        <ProTable<API.SystemUserRespVO>
          columns={columns}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          formRef={formRef}
          form={{ colon: false }}
          cardBordered
          params={{ deptId: selectedDeptId }}
          request={async (params: Record<string, any>) => {
            const { current, pageSize, id, username, email, status, deptId, ...rest } = params

            // 如果输入了员工 ID，则精确查询该用户
            if (id) {
              try {
                const resp = await getUser({ id: Number(id) })
                if (resp.code === 0 && resp.data) {
                  return {
                    data: [resp.data],
                    success: true,
                    total: 1
                  }
                }
                return { data: [], success: true, total: 0 }
              } catch {
                return { data: [], success: true, total: 0 }
              }
            }

            // 否则走分页查询
            const resp = await getUserPage({
              pageReqVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(username ? { username } : {}),
                ...(email ? { email } : {}),
                ...(status !== undefined && status !== '' ? { status: Number(status) } : {}),
                ...(deptId ? { deptId: Number(deptId) } : {})
              },
              ...rest
            })
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
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true }
            }
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto'
          }}
          options={{
            setting: {
              listsHeight: 400
            }
          }}
          pagination={{
            align: 'center',
            showSizeChanger: true
          }}
          dateFormatter="string"
          headerTitle="用户管理"
          toolBarRender={() => [
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={handleCreateUser}
              type="primary"
            >
              新增
            </Button>,
            <Button
              key="batchDelete"
              icon={<DeleteOutlined />}
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>,
            <Button
              key="import"
              icon={<UploadOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' }}
              onClick={handleImportUser}
            >
              导入
            </Button>,
            <Button
              key="export"
              icon={<DownloadOutlined />}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14', color: '#fff' }}
              onClick={handleExport}
            >
              导出
            </Button>
          ]}
        />
      </Col>

      <SaveUserModal />

      <ResetPwdModal />

      <AssignRoleModal />

      <ImportUserModal />
    </Row>
  )
}

export default SystemUser
