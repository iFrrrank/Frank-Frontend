import React, { useState } from 'react'
import { message } from 'antd'
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createSmsTemplate, updateSmsTemplate } from '@/api/system/smsTemplate'
import { textConstants } from '@/locales/zh-CN'

export let handleCreateSmsTemplate: () => void
export let handleEditSmsTemplate: (record: API.SystemSmsTemplateRespVO) => void

interface SaveSmsTemplateModalProps {
  onSuccess: () => void
  channelOptions: { label: string; value: number }[]
}

const SaveSmsTemplateModal: React.FC<SaveSmsTemplateModalProps> = ({
  onSuccess,
  channelOptions
}) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editingSmsTemplate, setEditingSmsTemplate] = useState<API.SystemSmsTemplateRespVO | null>(
    null
  )

  handleCreateSmsTemplate = () => {
    setEditingSmsTemplate(null)
    setCreateModalVisible(true)
  }

  handleEditSmsTemplate = (record: API.SystemSmsTemplateRespVO) => {
    setEditingSmsTemplate(record)
    setCreateModalVisible(true)
  }

  return (
    <ModalForm<API.SystemSmsTemplateSaveReqVO>
      title={editingSmsTemplate ? textConstants.action.update : textConstants.action.create}
      width={700}
      open={createModalVisible}
      onOpenChange={(visible) => {
        setCreateModalVisible(visible)
        if (!visible) {
          setEditingSmsTemplate(null)
        }
      }}
      initialValues={
        editingSmsTemplate
          ? {
              ...editingSmsTemplate
            }
          : { status: 0 }
      }
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 17 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        bodyStyle: { paddingBottom: 0 }
      }}
      onFinish={async (values) => {
        try {
          let resp
          if (editingSmsTemplate) {
            resp = await updateSmsTemplate({ ...values, id: editingSmsTemplate.id } as any)
          } else {
            resp = await createSmsTemplate(values as any)
          }
          if (resp.code === 0) {
            message.success(editingSmsTemplate ? '修改成功' : textConstants.msg.createSuccess)
            onSuccess()
            return true
          } else {
            message.error(resp.msg || (editingSmsTemplate ? '修改失败' : '创建失败'))
            return false
          }
        } catch {
          message.error(editingSmsTemplate ? '修改失败' : '创建失败')
          return false
        }
      }}
    >
      <ProFormSelect
        name="channelId"
        label="短信渠道 ID"
        placeholder="textConstants.common.selectText短信渠道 ID"
        rules={[{ required: true, message: 'textConstants.common.selectText短信渠道 ID' }]}
        options={channelOptions}
        showSearch
      />
      <ProFormSelect
        name="type"
        label="短信类型"
        placeholder="textConstants.common.selectText短信类型"
        rules={[{ required: true, message: 'textConstants.common.selectText短信类型' }]}
        options={[
          { label: '验证码', value: 1 },
          { label: '通知', value: 2 },
          { label: '营销', value: 3 }
        ]}
      />
      <ProFormText
        name="code"
        label="模板编码"
        placeholder="textConstants.common.inputText模板编码"
        rules={[{ required: true, message: `${textConstants.common.inputText}模板编码` }]}
      />
      <ProFormText
        name="name"
        label="模板名称"
        placeholder="textConstants.common.inputText模板名称"
        rules={[{ required: true, message: `${textConstants.common.inputText}模板名称` }]}
      />
      <ProFormTextArea
        name="content"
        label="模板内容"
        placeholder="textConstants.common.inputText模板内容"
        rules={[{ required: true, message: `${textConstants.common.inputText}模板内容` }]}
        fieldProps={{ rows: 3 }}
      />
      <ProFormRadio.Group
        name="status"
        label="开启状态"
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
        rules={[{ required: true, message: 'textConstants.common.selectText开启状态' }]}
      />
      <ProFormText
        name="apiTemplateId"
        label="短信 API 模板 ID"
        placeholder="textConstants.common.inputText短信 API 的模板ID"
        rules={[{ required: true, message: `${textConstants.common.inputText}短信 API 的模板 ID` }]}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="textConstants.common.inputText备注"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default SaveSmsTemplateModal
