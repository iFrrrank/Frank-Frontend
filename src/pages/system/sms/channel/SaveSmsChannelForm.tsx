import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createSmsChannel, updateSmsChannel } from '@/api/system/smsChannel'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateSmsChannel: () => void
export let handleEditSmsChannel: (record: API.SystemSmsChannelRespVO) => void

interface SaveSmsChannelModalProps {
  onSuccess: () => void
}

const SaveSmsChannelForm: React.FC<SaveSmsChannelModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingSmsChannel, setEditingSmsChannel] = useState<API.SystemSmsChannelRespVO | null>(
    null
  )

  handleCreateSmsChannel = () => {
    setEditingSmsChannel(null)
    setCreateModalVisible(true)
  }

  handleEditSmsChannel = (record: API.SystemSmsChannelRespVO) => {
    setEditingSmsChannel(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<API.SystemSmsChannelSaveReqVO>
      title={editingSmsChannel ? textConstants.action.update : textConstants.action.create}
      width={700}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingSmsChannel(null)
        }
      }}
      initialValues={
        editingSmsChannel
          ? {
              ...editingSmsChannel
            }
          : { status: 0 }
      }
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingSmsChannel) {
            resp = await updateSmsChannel({ ...values, id: editingSmsChannel.id } as any)
          } else {
            resp = await createSmsChannel(values as any)
          }
          if (resp.code === 0) {
            message.success(
              editingSmsChannel ? textConstants.msg.updateSuccess : textConstants.msg.createSuccess
            )
            onSuccess()
            return true
          } else {
            message.error(
              resp.msg ||
                (editingSmsChannel ? textConstants.msg.updateError : textConstants.msg.createError)
            )
            return false
          }
        } catch {
          message.error(
            editingSmsChannel ? textConstants.msg.updateError : textConstants.msg.createError
          )
          return false
        }
      }}
    >
      <ProFormText
        name="signature"
        label="短信签名"
        placeholder="textConstants.common.inputText短信签名"
        rules={[{ required: true, message: `${textConstants.common.inputText}短信签名` }]}
      />
      <ProFormSelect
        name="code"
        label="渠道编码"
        placeholder="textConstants.common.selectText渠道编码"
        rules={[{ required: true, message: `${textConstants.common.inputText}渠道编码` }]}
        options={[
          { label: '阿里云', value: 'ALIYUN' },
          { label: '腾讯云', value: 'TENCENT' },
          { label: '钉钉', value: 'DINGTALK' },
          { label: '华为云', value: 'HUAWEI' },
          { label: '七牛云', value: 'QINIU' }
        ]}
      />
      <ProFormRadio.Group
        name="status"
        label="启用状态"
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="textConstants.common.inputText备注"
        fieldProps={{ rows: 2 }}
      />
      <ProFormText
        name="apiKey"
        label="短信 API 的账号"
        placeholder="textConstants.common.inputText短信 API 的账号"
        rules={[{ required: true, message: `${textConstants.common.inputText}短信 API 的账号` }]}
      />
      <ProFormText
        name="apiSecret"
        label="短信 API 的密钥"
        placeholder="textConstants.common.inputText短信 API 的密钥"
      />
      <ProFormText
        name="callbackUrl"
        label="短信发送回调 URL"
        placeholder="textConstants.common.inputText短信发送回调 URL"
      />
    </ModalForm>
  )
}

export default SaveSmsChannelForm
