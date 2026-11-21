import React, { useState } from 'react'
import { Input, message } from 'antd'
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components'
import { sendSms } from '@/api/system/smsTemplate'

export let handleTestSmsTemplate: (record: API.SystemSmsTemplateRespVO) => void

// 短信模板测试发送：填写手机号，并按模板参数（params）逐个填值
const SendSmsTemplateForm: React.FC = () => {
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [testingTemplate, setTestingTemplate] = useState<API.SystemSmsTemplateRespVO | null>(null)

  handleTestSmsTemplate = (record: API.SystemSmsTemplateRespVO) => {
    setTestingTemplate(record)
    setTestModalVisible(true)
  }

  return (
    <ModalForm<API.SystemSmsTemplateSendReqVO>
      title="测试发送短信"
      width={560}
      open={testModalVisible}
      onOpenChange={(visible) => {
        setTestModalVisible(visible)
        if (!visible) {
          setTestingTemplate(null)
        }
      }}
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
          const resp = await sendSms({
            mobile: values.mobile,
            templateCode: testingTemplate.code,
            templateParams: values.templateParams || {}
          })
          if (resp.code === 0) {
            message.success('短信发送成功')
            return true
          } else {
            message.error(resp.msg || '短信发送失败')
            return false
          }
        } catch {
          message.error('短信发送失败')
          return false
        }
      }}
    >
      {/* 模板内容只读展示，方便对照填参数 */}
      <ProForm.Item label="模板内容">
        <Input.TextArea value={testingTemplate?.content} readOnly rows={3} />
      </ProForm.Item>
      <ProFormText
        name="mobile"
        label="手机号"
        colProps={{ span: 24 }}
        placeholder="请输入手机号"
        rules={[
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
        ]}
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

export default SendSmsTemplateForm
