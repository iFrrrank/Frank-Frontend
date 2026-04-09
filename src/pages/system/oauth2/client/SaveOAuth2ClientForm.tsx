import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createOAuth2Client, getOAuth2Client, updateOAuth2Client } from '@/api/system/oAuth2Client'
import { textConst } from '@/locales/zh-CN'

export let handleCreateOAuth2Client: () => void
export let handleEditOAuth2Client: (record: API.SystemOAuth2ClientRespVO) => void

interface SaveOAuth2ClientModalProps {
  onSuccess: () => void
}

const SaveOAuth2ClientForm: React.FC<SaveOAuth2ClientModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<API.SystemOAuth2ClientRespVO | null>(null)

  handleCreateOAuth2Client = () => {
    setEditingClient(null)
    setCreateModalVisible(true)
  }

  handleEditOAuth2Client = async (record: API.SystemOAuth2ClientRespVO) => {
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

  return (
    <ModalForm<API.SystemOAuth2ClientSaveReqVO>
      title={editingClient ? textConst.action.update : textConst.action.create}
      width={550}
      modalProps={{
        // 1. 设置内容区高度（推荐）
        bodyStyle: {
          height: '700px', // 固定高度
          maxHeight: '70vh', // 最大高度（推荐，响应式）
          overflowY: 'auto' // 内容溢出自动滚动
        },
        // 其他 Modal 配置
        centered: true, // 垂直居中
        destroyOnHidden: true // 关闭销毁
      }}
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
            authorizedGrantTypes: editingClient.authorizedGrantTypes?.[0] || 'authorization_code',
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
            resp = await updateOAuth2Client({ ...processedValues, id: editingClient.id })
          } else {
            resp = await createOAuth2Client(processedValues)
          }
          if (resp.code === 0) {
            message.success(
              editingClient ? textConst.msg.updateSuccess : textConst.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg || (editingClient ? textConst.msg.updateError : textConst.msg.createError)
            )
            return false
          }
        } catch {
          message.error(editingClient ? textConst.msg.updateError : textConst.msg.createError)
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
        rules={[{ required: true, message: '请输入状态' }]}
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
        rules={[{ required: true, message: '请输入授权类型' }]}
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
      <ProFormTextArea name="additionalInformation" label="附加信息" placeholder="请输入附加信息" />
      <ProFormTextArea name="description" label="应用描述" placeholder="请输入应用描述" />
    </ModalForm>
  )
}

export default SaveOAuth2ClientForm
