import React, { useState } from 'react'
import { message } from 'antd'
import { ModalForm, ProFormDigit, ProFormRadio, ProFormText } from '@ant-design/pro-components'
import { createMailAccount, updateMailAccount } from '@/api/system/mailAccount'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateMailAccount: () => void
export let handleEditMailAccount: (record: API.SystemMailAccountRespVO) => void

interface SaveMailAccountModalProps {
  onSuccess: () => void
}

const SaveMailAccountForm: React.FC<SaveMailAccountModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingMailAccount, setEditingMailAccount] = useState<API.SystemMailAccountRespVO | null>(
    null
  )

  handleCreateMailAccount = () => {
    setEditingMailAccount(null)
    setCreateModalVisible(true)
  }

  handleEditMailAccount = (record: API.SystemMailAccountRespVO) => {
    setEditingMailAccount(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<API.SystemMailAccountSaveReqVO>
      title={editingMailAccount ? textConstants.action.update : textConstants.action.create}
      width={600}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingMailAccount(null)
        }
      }}
      initialValues={
        editingMailAccount
          ? { ...editingMailAccount }
          : {
              sslEnable: true,
              starttlsEnable: false
            }
      }
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingMailAccount) {
            resp = await updateMailAccount({ ...values, id: editingMailAccount.id })
          } else {
            resp = await createMailAccount(values)
          }

          if (resp.code === 0) {
            message.success(
              editingMailAccount ? textConstants.msg.updateSuccess : textConstants.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg || (editingMailAccount ? textConstants.msg.updateError : '新增失败')
            )
            return false
          }
        } catch {
          message.error(editingMailAccount ? textConstants.msg.updateError : '新增失败')
          return false
        }
      }}
    >
      <ProFormText
        name="mail"
        label="邮箱"
        placeholder="请输入邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确的邮箱格式' }
        ]}
      />
      <ProFormText
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        placeholder="请输入密码"
        rules={[{ required: true, message: '请输入密码' }]}
      />
      <ProFormText
        name="host"
        label="SMTP 服务器域名"
        placeholder="请输入 SMTP 服务器域名"
        rules={[{ required: true, message: '请输入 SMTP 服务器域名' }]}
      />
      <ProFormDigit
        name="port"
        label="SMTP 服务器端口"
        placeholder="请输入 SMTP 服务器端口"
        rules={[{ required: true, message: '请输入 SMTP 服务器端口' }]}
        fieldProps={{
          precision: 0
        }}
      />
      <ProFormRadio.Group
        name="sslEnable"
        label="是否开启 SSL"
        options={[
          { label: '是', value: true },
          { label: '否', value: false }
        ]}
      />
      <ProFormRadio.Group
        name="starttlsEnable"
        label="是否开启 STARTTLS"
        options={[
          { label: '是', value: true },
          { label: '否', value: false }
        ]}
      />
    </ModalForm>
  )
}

export default SaveMailAccountForm
