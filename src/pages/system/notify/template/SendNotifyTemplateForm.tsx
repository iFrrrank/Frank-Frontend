import React, { useState } from 'react'
import { Input, message } from 'antd'
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'
import { sendNotify } from '@/api/system/notifyTemplate'

export let handleTestNotifyTemplate: (record: API.SystemNotifyTemplateRespVO) => void

// 站内信模板测试发送：选择用户类型与接收人，并按模板参数（params）逐个填值
const SendNotifyTemplateForm: React.FC = () => {
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [testingTemplate, setTestingTemplate] = useState<API.SystemNotifyTemplateRespVO | null>(
    null
  )

  handleTestNotifyTemplate = (record: API.SystemNotifyTemplateRespVO) => {
    setTestingTemplate(record)
    setTestModalVisible(true)
  }

  return (
    <ModalForm<API.SystemNotifyTemplateSendReqVO>
      title="测试发送站内信"
      width={560}
      open={testModalVisible}
      onOpenChange={(visible) => {
        setTestModalVisible(visible)
        if (!visible) {
          setTestingTemplate(null)
        }
      }}
      initialValues={{ userType: 1 }}
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      colon={false}
      modalProps={{
        destroyOnHidden: true,
        styles: {
          body: { paddingBottom: 0 }
        }
      }}
      onFinish={async (values) => {
        if (!testingTemplate) return false
        try {
          const resp = await sendNotify({
            userId: values.userId,
            userType: values.userType,
            templateCode: testingTemplate.code,
            templateParams: values.templateParams || {}
          })
          if (resp.code === 0) {
            message.success('站内信发送成功')
            return true
          } else {
            message.error(resp.msg || '站内信发送失败')
            return false
          }
        } catch {
          message.error('站内信发送失败')
          return false
        }
      }}
    >
      {/* 模板内容只读展示，方便对照填参数 */}
      <ProForm.Item label="模板内容">
        <Input.TextArea value={testingTemplate?.content} readOnly rows={3} />
      </ProForm.Item>
      <ProFormRadio.Group
        name="userType"
        label="用户类型"
        colProps={{ span: 24 }}
        options={[
          { label: '管理员', value: 1 },
          { label: '会员', value: 2 }
        ]}
        rules={[{ required: true, message: '用户类型不能为空' }]}
      />
      <ProFormDigit
        name="userId"
        label="接收人ID"
        colProps={{ span: 24 }}
        placeholder="请输入接收人ID"
        fieldProps={{ min: 1 }}
        rules={[{ required: true, message: '接收人ID不能为空' }]}
      />
      {/* 模板参数来自模板的 params 数组，按参数名动态生成输入项 */}
      {(testingTemplate?.params || []).map((param) => (
        <ProFormText
          key={param}
          name={['templateParams', param]}
          label={`参数 {${param}}`}
          colProps={{ span: 24 }}
          placeholder={`请输入参数 ${param}`}
          rules={[{ required: true, message: `参数 ${param} 不能为空` }]}
        />
      ))}
    </ModalForm>
  )
}

export default SendNotifyTemplateForm
