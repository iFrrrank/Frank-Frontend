import React, { useState } from 'react'
import { message } from 'antd'
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { createSocialClient, getSocialClient, updateSocialClient } from '@/api/system/socialClient'
import { textConst } from '@/locales/zh-CN'

export let handleCreateSocialClient: () => void
export let handleEditSocialClient: (record: API.SystemSocialClientRespVO) => void

interface SaveSocialClientModalProps {
  onSuccess: () => void
}

const SaveSocialClientForm: React.FC<SaveSocialClientModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<API.SystemSocialClientRespVO | null>(null)

  handleCreateSocialClient = () => {
    setEditingClient(null)
    setCreateModalVisible(true)
  }

  handleEditSocialClient = async (record: API.SystemSocialClientRespVO) => {
    try {
      const resp = await getSocialClient({ id: record.id })
      if (resp.code === 0 && resp.data) {
        setEditingClient(resp.data)
        setCreateModalVisible(true)
      }
    } catch {
      message.error('获取社交客户端信息失败')
    }
  }

  return (
    <ModalForm<API.SystemSocialClientSaveReqVO>
      title={editingClient ? textConst.action.update : textConst.action.create}
      width={450}
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
              name: editingClient.name,
              socialType: editingClient.socialType,
              userType: editingClient.userType,
              clientId: editingClient.clientId,
              clientSecret: editingClient.clientSecret,
              agentId: editingClient.agentId,
              status: editingClient.status
            }
          : {
              status: 0
            }
      }
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      autoFocusFirstInput
      colon={false}
      modalProps={{
        destroyOnHidden: true,
        styles: {
          body: { paddingBottom: 0 }
        }
      }}
      onFinish={async (values) => {
        try {
          let resp: any
          if (editingClient) {
            resp = await updateSocialClient({ ...values, id: editingClient.id })
          } else {
            resp = await createSocialClient(values)
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
        label="应用名"
        placeholder="请输入应用名"
        rules={[{ required: true, message: '请输入应用名' }]}
      />
      <ProFormSelect
        name="socialType"
        label="社交平台"
        placeholder="请选择社交平台"
        options={[
          { label: 'Gitee', value: 5 },
          { label: '钉钉', value: 10 },
          { label: '企业微信', value: 20 },
          { label: '微信公众平台', value: 31 },
          { label: '微信开放平台', value: 32 },
          { label: '微信小程序', value: 30 }
        ]}
        rules={[{ required: true, message: '请输入社交平台' }]}
      />
      <ProFormSelect
        name="userType"
        label="用户类型"
        placeholder="请选择用户类型"
        options={[
          { label: '会员', value: 2 },
          { label: '管理员', value: 1 }
        ]}
        rules={[{ required: true, message: '请输入用户类型' }]}
      />
      <ProFormText
        name="clientId"
        label="客户端 ID"
        placeholder="请输入客户端 ID"
        rules={[{ required: true, message: '请输入客户端 ID' }]}
      />
      <ProFormText
        name="clientSecret"
        label="客户端密钥"
        placeholder="请输入客户端密钥"
        rules={[{ required: true, message: '请输入客户端密钥' }]}
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
    </ModalForm>
  )
}

export default SaveSocialClientForm
