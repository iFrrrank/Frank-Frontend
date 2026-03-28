import React, { useRef, useState } from 'react'
import type { MenuProps } from 'antd'
import { Button, Col, Dropdown, Input, message, Modal, Row } from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
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
import {
  createOAuth2Client,
  deleteOAuth2Client,
  getOAuth2Client,
  getOAuth2ClientPage,
  updateOAuth2Client
} from '@/api/system/oAuth2Client'

const App_: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const formRef = useRef<ProFormInstance>(undefined)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [editingClient, setEditingClient] = useState<API.SystemOAuth2ClientRespVO | null>(null)
  const [copyModalVisible, setCopyModalVisible] = useState(false)
  const [copyClientData, setCopyClientData] = useState<{
    clientId: string
    secret: string
  } | null>(null)

  // 列定义
  const columns: ProColumns<API.SystemOAuth2ClientRespVO>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入 ID'
      }
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      align: 'center',
      width: 150,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入应用名称'
      }
    },
    {
      title: '客户端 ID',
      dataIndex: 'clientId',
      align: 'center',
      width: 200,
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '应用描述',
      dataIndex: 'description',
      align: 'center',
      width: 200,
      valueType: 'text',
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
      title: '访问令牌有效期',
      dataIndex: 'accessTokenValiditySeconds',
      align: 'center',
      width: 120,
      valueType: 'text',
      hideInSearch: true,
      render: (text) => (text ? `${text}秒` : '-')
    },
    {
      title: '刷新令牌有效期',
      dataIndex: 'refreshTokenValiditySeconds',
      align: 'center',
      width: 120,
      valueType: 'text',
      hideInSearch: true,
      render: (text) => (text ? `${text}秒` : '-')
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
            key: 'copy',
            icon: <CopyOutlined />,
            label: '复制凭证',
            onClick: () => handleCopyCredentials(record)
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

  // ===== 修改客户端 =====
  const handleEdit = async (record: API.SystemOAuth2ClientRespVO) => {
    try {
      const resp = await getOAuth2Client({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setEditingClient(resp.data)
        setCreateModalVisible(true)
      }
    } catch {
      message.error('获取客户端信息失败')
    }
  }

  // ===== 删除单个客户端 =====
  const handleDelete = (record: API.SystemOAuth2ClientRespVO) => {
    Modal.confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除应用"${record.name}"吗？`,
      onOk: async () => {
        try {
          await deleteOAuth2Client({ id: record.id })
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
      content: `确定要删除选中的 ${selectedRowKeys.length} 个应用吗？`,
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteOAuth2Client({ id: Number(id) })))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          actionRef.current?.reload()
        } catch {
          message.error('批量删除失败')
        }
      }
    })
  }

  // ===== 复制凭证 =====
  const handleCopyCredentials = (record: API.SystemOAuth2ClientRespVO) => {
    setCopyClientData({
      clientId: record.clientId,
      secret: record.secret
    })
    setCopyModalVisible(true)
  }

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success('复制成功')
      })
      .catch(() => {
        message.error('复制失败')
      })
  }

  return (
    <Row gutter={16}>
      <Col span={24}>
        <ProTable<API.SystemOAuth2ClientRespVO>
          columns={columns}
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          formRef={formRef}
          form={{ colon: false }}
          cardBordered
          request={async (params: Record<string, any>) => {
            const { current, pageSize, id, name, status, ...rest } = params

            // 如果输入了 ID，则精确查询
            if (id) {
              try {
                const resp = await getOAuth2Client({ id: Number(id) })
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
            const resp = await getOAuth2ClientPage({
              pageVO: {
                pageNo: current || 1,
                pageSize: pageSize || 10,
                ...(name ? { name } : {}),
                ...(status !== undefined && status !== '' ? { status: Number(status) } : {})
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
            persistenceKey: 'pro-table-oauth2-client',
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
          headerTitle="应用管理"
          toolBarRender={() => [
            <Button
              key="create"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingClient(null)
                setCreateModalVisible(true)
              }}
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
            </Button>
          ]}
        />
      </Col>

      {/* ========== 新增/修改应用弹窗 ========== */}
      <ModalForm<API.SystemOAuth2ClientSaveReqVO>
        title={editingClient ? '修改应用' : '新增应用'}
        width={800}
        open={createModalVisible}
        onOpenChange={(visible) => {
          setCreateModalVisible(visible)
          if (!visible) {
            setEditingClient(null)
          }
        }}
        initialValues={
          editingClient
            ? {
                id: editingClient.id,
                clientId: editingClient.clientId,
                secret: editingClient.secret,
                name: editingClient.name,
                logo: editingClient.logo,
                description: editingClient.description,
                status: editingClient.status,
                accessTokenValiditySeconds: editingClient.accessTokenValiditySeconds,
                refreshTokenValiditySeconds: editingClient.refreshTokenValiditySeconds,
                redirectUris: editingClient.redirectUris || [],
                authorizedGrantTypes:
                  editingClient.authorizedGrantTypes?.[0] || 'authorization_code',
                scopes: editingClient.scopes || [],
                autoApproveScopes: editingClient.autoApproveScopes || [],
                authorities: editingClient.authorities || [],
                resourceIds: editingClient.resourceIds || [],
                additionalInformation: editingClient.additionalInformation
              }
            : {
                status: 0,
                accessTokenValiditySeconds: 3600,
                refreshTokenValiditySeconds: 86400,
                authorizedGrantTypes: ['authorization_code', 'refresh_token']
              }
        }
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoFocusFirstInput
        grid={true}
        colon={false}
        rowProps={{ gutter: [16, 0] }}
        modalProps={{
          destroyOnClose: true,
          bodyStyle: { paddingBottom: 0 }
        }}
        onFinish={async (values) => {
          try {
            // 处理数组字段
            const processedValues = {
              ...values,
              redirectUris: values.redirectUris || [],
              authorizedGrantTypes: values.authorizedGrantTypes
                ? [values.authorizedGrantTypes as unknown as string]
                : [],
              scopes: values.scopes || [],
              autoApproveScopes: values.autoApproveScopes || [],
              authorities: values.authorities || [],
              resourceIds: values.resourceIds || []
            }

            let resp: any
            if (editingClient) {
              // 修改模式
              resp = await updateOAuth2Client({
                ...processedValues,
                id: editingClient.id
              })
            } else {
              // 新增模式
              resp = await createOAuth2Client(processedValues)
            }
            if (resp.code === 0) {
              message.success(editingClient ? '修改成功' : '创建成功')
              actionRef.current?.reload()
              return true
            } else {
              message.error(resp.msg || (editingClient ? '修改失败' : '创建失败'))
              return false
            }
          } catch {
            message.error(editingClient ? '修改失败' : '创建失败')
            return false
          }
        }}
      >
        <ProFormText
          name="name"
          label="应用名称"
          placeholder="请输入应用名称"
          rules={[{ required: true, message: '请输入应用名称' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          options={[
            { label: '开启', value: 0 },
            { label: '关闭', value: 1 }
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
        <ProFormText
          name="clientId"
          label="客户端 ID"
          placeholder="请输入客户端 ID"
          rules={[{ required: true, message: '请输入客户端 ID' }]}
          disabled={!!editingClient}
        />
        <ProFormText
          name="secret"
          label="客户端密钥"
          placeholder="请输入客户端密钥"
          rules={[{ required: true, message: '请输入客户端密钥' }]}
        />
        <ProFormText name="logo" label="应用图标" placeholder="请输入应用图标 URL" />
        <ProFormSelect
          name="authorizedGrantTypes"
          label="授权类型"
          placeholder="请选择授权类型"
          options={[
            { label: '授权码模式', value: 'authorization_code' },
            { label: '隐式授权', value: 'implicit' },
            { label: '密码模式', value: 'password' },
            { label: '客户端凭证', value: 'client_credentials' },
            { label: '刷新令牌', value: 'refresh_token' }
          ]}
          rules={[{ required: true, message: '请选择授权类型' }]}
        />
        <ProFormSelect
          name="scopes"
          label="授权范围"
          mode="multiple"
          placeholder="请选择授权范围"
          options={[
            { label: '读取', value: 'read' },
            { label: '写入', value: 'write' },
            { label: '删除', value: 'delete' },
            { label: '全部', value: 'all' }
          ]}
        />
        <ProFormSelect
          name="autoApproveScopes"
          label="自动授权范围"
          mode="multiple"
          placeholder="请选择自动授权范围"
          options={[
            { label: '读取', value: 'read' },
            { label: '写入', value: 'write' },
            { label: '删除', value: 'delete' },
            { label: '全部', value: 'all' }
          ]}
        />
        <ProFormSelect
          name="redirectUris"
          label="可重定向 URL"
          mode="tags"
          placeholder="请输入可重定向 URL"
          rules={[{ required: true, message: '请输入可重定向URL' }]}
        />
        <ProFormSelect
          name="authorities"
          label="权限"
          mode="multiple"
          placeholder="请选择权限"
          options={[
            { label: '用户管理', value: 'USER_VIEW' },
            { label: '角色管理', value: 'ROLE_VIEW' },
            { label: '菜单管理', value: 'MENU_VIEW' },
            { label: '部门管理', value: 'DEPT_VIEW' }
          ]}
        />
        <ProFormSelect
          name="resourceIds"
          label="资源"
          mode="multiple"
          placeholder="请选择资源"
          options={[
            { label: '系统管理', value: 'system' },
            { label: '用户中心', value: 'user' },
            { label: '消息中心', value: 'message' },
            { label: '日志管理', value: 'log' }
          ]}
        />
        <ProFormDigit
          name="accessTokenValiditySeconds"
          label="访问令牌有效期"
          placeholder="请输入访问令牌有效期"
          fieldProps={{
            addonAfter: '秒(s)'
          }}
          rules={[
            { required: true, message: '请输入访问令牌有效期' },
            { pattern: /^\d+$/, message: '请输入有效的数字' }
          ]}
        />

        <ProFormDigit
          name="refreshTokenValiditySeconds"
          label="刷新令牌有效期"
          placeholder="请输入刷新令牌有效期"
          fieldProps={{
            addonAfter: '秒(s)'
          }}
          rules={[
            { required: true, message: '请输入刷新令牌有效期' },
            { pattern: /^\d+$/, message: '请输入有效的数字' }
          ]}
        />
        <ProFormTextArea
          name="additionalInformation"
          label="附加信息"
          placeholder="请输入附加信息"
        />
        <ProFormTextArea name="description" label="应用描述" placeholder="请输入应用描述" />
      </ModalForm>

      {/* ========== 复制凭证弹窗 ========== */}
      <Modal
        title="应用凭证"
        open={copyModalVisible}
        onCancel={() => setCopyModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCopyModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>客户端 ID：</span>
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(copyClientData?.clientId || '')}
              style={{ padding: 0, marginLeft: 8 }}
            >
              复制
            </Button>
          </div>
          <Input value={copyClientData?.clientId} readOnly style={{ marginBottom: 16 }} />

          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>客户端密钥：</span>
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(copyClientData?.secret || '')}
              style={{ padding: 0, marginLeft: 8 }}
            >
              复制
            </Button>
          </div>
          <Input.Password value={copyClientData?.secret} readOnly visibilityToggle={false} />
        </div>
        <div
          style={{
            backgroundColor: '#fffbe6',
            border: '1px solid #ffe58f',
            padding: 12,
            borderRadius: 6
          }}
        >
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          <span style={{ color: '#d46b08' }}>请妥善保管您的客户端密钥，不要泄露给他人</span>
        </div>
      </Modal>
    </Row>
  )
}

export default App_

