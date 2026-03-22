import React, { useRef, useState } from 'react'
import type { MenuProps } from 'antd'
import { Button, Col, Dropdown, Input, message, Modal, Row, Switch, Upload } from 'antd'
import {
  DeleteOutlined,
  DoubleRightOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  KeyOutlined,
  PlusOutlined,
  UploadOutlined,
  UserSwitchOutlined
} from '@ant-design/icons'
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable
} from '@ant-design/pro-components'
import DeptTree from '@/pages/system/user/DeptTree'
import {
  createUser,
  deleteUser,
  exportUserList,
  getUser,
  getUserPage,
  importExcel,
  importTemplate,
  updateUser,
  updateUserPassword
} from '@/api/system/user'
import { getSimpleDeptList } from '@/api/system/dept'
import { getSimplePostList } from '@/api/system/post'
import { getSimpleRoleList } from '@/api/system/role'
import { assignUserRole, listAdminRoles } from '@/api/system/permission'

const { Dragger } = Upload

// 将扁平部门数据转换为 TreeSelect 树形结构
const buildDeptTreeSelectData = (list: { id: number; name: string; parentId: number }[]): any[] => {
  const map = new Map<number, any>()
  const tree: any[] = []
  list.forEach((item) => {
    map.set(item.id, { title: item.name, value: item.id, children: [] })
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

const App_: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [selectedDeptId, setSelectedDeptId] = useState<number | undefined>(undefined)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [updateSupport, setUpdateSupport] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  // 批量删除相关
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  // 编辑相关
  const [editingUser, setEditingUser] = useState<API.SystemUserRespVO | null>(null)
  // 重置密码相关
  const [resetPwdVisible, setResetPwdVisible] = useState(false)
  const [resetPwdUser, setResetPwdUser] = useState<API.SystemUserRespVO | null>(null)
  const [newPassword, setNewPassword] = useState('')
  // 分配角色相关
  const [assignRoleVisible, setAssignRoleVisible] = useState(false)
  const [assignRoleUser, setAssignRoleUser] = useState<API.SystemUserRespVO | null>(null)
  const [assignRoleIds, setAssignRoleIds] = useState<number[]>([])
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([])
  const [assignRoleLoading, setAssignRoleLoading] = useState(false)

  // 列定义
  const columns: ProColumns<API.SystemUserRespVO>[] = [
    {
      title: '员工ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入员工ID'
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
            <a key="edit" onClick={() => handleEdit(record)}>
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

  // ===== 编辑用户 =====
  const handleEdit = async (record: API.SystemUserRespVO) => {
    try {
      const resp = await getUser({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setEditingUser(resp.data)
        setCreateModalVisible(true)
      }
    } catch {
      message.error('获取用户信息失败')
    }
  }

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

  // ===== 重置密码 =====
  const handleResetPwd = (record: API.SystemUserRespVO) => {
    setResetPwdUser(record)
    setNewPassword('')
    setResetPwdVisible(true)
  }

  const handleResetPwdSubmit = async () => {
    if (!newPassword) {
      message.warning('请输入新密码')
      return
    }
    try {
      const resp = await updateUserPassword({ id: resetPwdUser!.id, password: newPassword })
      if (resp.code === 0) {
        message.success('重置密码成功')
        setResetPwdVisible(false)
      } else {
        message.error(resp.msg || '重置密码失败')
      }
    } catch {
      message.error('重置密码失败')
    }
  }

  // ===== 分配角色 =====
  const handleAssignRole = async (record: API.SystemUserRespVO) => {
    setAssignRoleUser(record)
    setAssignRoleLoading(true)
    try {
      // 并行获取角色列表和用户当前角色
      const [rolesResp, userRolesResp] = await Promise.all([
        getSimpleRoleList(),
        listAdminRoles({ userId: record.id })
      ])
      if (rolesResp.code === 0) {
        setRoleOptions(
          (rolesResp.data || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        )
      }
      if (userRolesResp.code === 0) {
        setAssignRoleIds((userRolesResp.data || []) as number[])
      }
      setAssignRoleVisible(true)
    } catch {
      message.error('获取角色信息失败')
    } finally {
      setAssignRoleLoading(false)
    }
  }

  const handleAssignRoleSubmit = async () => {
    try {
      const resp = await assignUserRole({
        userId: assignRoleUser!.id,
        roleIds: assignRoleIds
      })
      if (resp.code === 0) {
        message.success('分配角色成功')
        setAssignRoleVisible(false)
      } else {
        message.error(resp.msg || '分配角色失败')
      }
    } catch {
      message.error('分配角色失败')
    }
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

  // 下载导入模板
  const handleDownloadTemplate = async () => {
    try {
      const resp = await importTemplate()
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '用户导入模板.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    } catch {
      message.error('下载模板失败')
    }
  }

  // 导入用户
  const handleImport = async () => {
    if (!importFile) {
      message.warning('请先选择文件')
      return
    }
    setImportLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)
      const resp = await importExcel({ updateSupport, file: importFile } as any, formData as any)
      if (resp.code === 0) {
        const data = resp.data
        const msgs: string[] = []
        if (data?.createUsernames?.length) {
          msgs.push(`成功导入用户: ${data.createUsernames.join(', ')}`)
        }
        if (data?.updateUsernames?.length) {
          msgs.push(`成功更新用户: ${data.updateUsernames.join(', ')}`)
        }
        if (data?.failureUsernames) {
          const failMap = data.failureUsernames as Record<string, string>
          const failKeys = Object.keys(failMap)
          if (failKeys.length > 0) {
            msgs.push(`导入失败用户: ${failKeys.join(', ')}`)
          }
        }
        message.success(msgs.join('；') || '导入成功')
        setImportModalVisible(false)
        setImportFile(null)
        actionRef.current?.reload()
      } else {
        message.error(resp.msg || '导入失败')
      }
    } catch {
      message.error('导入失败')
    } finally {
      setImportLoading(false)
    }
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
          cardBordered
          params={{ deptId: selectedDeptId }}
          request={async (params: Record<string, any>) => {
            const { current, pageSize, id, username, email, status, deptId, ...rest } = params

            // 如果输入了员工ID，则精确查询该用户
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
              onClick={() => {
                setEditingUser(null)
                setCreateModalVisible(true)
              }}
              type="primary"
            >
              新建
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
              onClick={() => setImportModalVisible(true)}
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

      {/* ========== 新增/编辑用户弹窗 ========== */}
      <ModalForm<API.SystemUserSaveReqVO>
        title={editingUser ? '修改用户' : '新增'}
        width={600}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingUser(null)
          }
        }}
        initialValues={
          editingUser
            ? {
                id: editingUser.id,
                nickname: editingUser.nickname,
                deptId: editingUser.deptId,
                mobile: editingUser.mobile,
                email: editingUser.email,
                username: editingUser.username,
                sex: editingUser.sex,
                postIds: editingUser.postIds,
                remark: editingUser.remark
              }
            : undefined
        }
        layout="horizontal"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        autoFocusFirstInput
        grid={true}
        rowProps={{ gutter: [16, 0] }}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            let resp
            if (editingUser) {
              // 编辑模式
              resp = await updateUser({ ...values, id: editingUser.id })
            } else {
              // 新增模式
              resp = await createUser(values)
            }
            if (resp.code === 0) {
              message.success(editingUser ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingUser ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingUser ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="nickname"
          label="用户昵称"
          colProps={{ span: 12 }}
          placeholder="请输入用户昵称"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        />
        <ProFormTreeSelect
          name="deptId"
          label="归属部门"
          colProps={{ span: 12 }}
          placeholder="请选择归属部门"
          request={async () => {
            const resp = await getSimpleDeptList()
            if (resp.code === 0) {
              return buildDeptTreeSelectData(resp.data || [])
            }
            return []
          }}
          fieldProps={{
            fieldNames: { label: 'title', value: 'value', children: 'children' },
            showSearch: true,
            treeNodeFilterProp: 'title'
          }}
        />
        <ProFormText
          name="mobile"
          label="手机号码"
          colProps={{ span: 12 }}
          placeholder="请输入手机号码"
        />
        <ProFormText
          name="email"
          label="邮箱"
          colProps={{ span: 12 }}
          placeholder="请输入邮箱"
          rules={[{ type: 'email', message: '请输入有效邮箱' }]}
        />
        <ProFormText
          name="username"
          label="用户名称"
          colProps={{ span: 12 }}
          placeholder="请输入用户名称"
          rules={[{ required: true, message: '请输入用户名称' }]}
          disabled={!!editingUser}
        />
        <ProFormText.Password
          name="password"
          label="用户密码"
          colProps={{ span: 12 }}
          placeholder="请输入用户密码"
          rules={[{ required: true, message: '请输入用户密码' }]}
        />
        <ProFormSelect
          name="sex"
          label="用户性别"
          colProps={{ span: 12 }}
          placeholder="请选择性别"
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 2 }
          ]}
        />
        <ProFormSelect
          name="postIds"
          label="岗位"
          colProps={{ span: 12 }}
          placeholder="请选择岗位"
          fieldProps={{ mode: 'multiple' }}
          request={async () => {
            const resp = await getSimplePostList()
            if (resp.code === 0) {
              return (resp.data || []).map((item: any) => ({
                label: item.name,
                value: item.id
              }))
            }
            return []
          }}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          colProps={{ span: 24 }}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          placeholder="请输入备注内容"
        />
      </ModalForm>

      {/* ========== 重置密码弹窗 ========== */}
      <Modal
        title="温馨提示"
        open={resetPwdVisible}
        onCancel={() => setResetPwdVisible(false)}
        onOk={handleResetPwdSubmit}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />
          <span>请输入"{resetPwdUser?.username}"的新密码</span>
        </div>
        <Input.Password
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="请输入新密码"
        />
      </Modal>

      {/* ========== 分配角色弹窗 ========== */}
      <ModalForm
        title="分配角色"
        width={500}
        open={assignRoleVisible}
        onOpenChange={(visible) => {
          setAssignRoleVisible(visible)
          if (!visible) {
            setAssignRoleUser(null)
            setAssignRoleIds([])
          }
        }}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        submitter={{
          searchConfig: { submitText: '确 定', resetText: '取 消' },
          submitButtonProps: { type: 'primary' }
        }}
        onFinish={async () => {
          await handleAssignRoleSubmit()
          return true
        }}
      >
        <ProFormText
          name="username"
          label="用户名称"
          initialValue={assignRoleUser?.username}
          disabled
        />
        <ProFormText
          name="nickname"
          label="用户昵称"
          initialValue={assignRoleUser?.nickname}
          disabled
        />
        <ProFormSelect
          name="roleIds"
          label="角色"
          initialValue={assignRoleIds}
          placeholder="请选择角色"
          fieldProps={{
            mode: 'multiple',
            options: roleOptions,
            onChange: (val: number[]) => setAssignRoleIds(val)
          }}
        />
      </ModalForm>

      {/* ========== 导入用户弹窗 ========== */}
      <Modal
        title="导入用户"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false)
          setImportFile(null)
        }}
        onOk={handleImport}
        confirmLoading={importLoading}
        okText="确认导入"
      >
        <div style={{ marginBottom: 16 }}>
          <a onClick={handleDownloadTemplate}>下载导入模板</a>
        </div>
        <Dragger
          accept=".xlsx,.xls"
          maxCount={1}
          beforeUpload={(file) => {
            setImportFile(file)
            return false
          }}
          onRemove={() => setImportFile(null)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 .xlsx 或 .xls 格式的 Excel 文件</p>
        </Dragger>
        <div style={{ marginTop: 16 }}>
          <span style={{ marginRight: 8 }}>是否覆盖更新已有用户：</span>
          <Switch checked={updateSupport} onChange={setUpdateSupport} />
        </div>
      </Modal>
    </Row>
  )
}

export default App_
