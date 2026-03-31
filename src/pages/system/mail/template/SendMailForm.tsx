import React, { useState } from 'react'
import { message } from 'antd'
import { ModalForm, ProForm, ProFormTextArea } from '@ant-design/pro-components'
import { Editor } from '@/components/Editor'
import { sendMail } from '@/api/system/mailTemplate'
import { textConstants } from '@/locales/zh-CN'

export let handleTestMailTemplate: (record: API.SystemMailTemplateRespVO) => void

const SendMailForm: React.FC = () => {
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [testingTemplate, setTestingTemplate] = useState<API.SystemMailTemplateRespVO | null>(null)

  handleTestMailTemplate = (record: API.SystemMailTemplateRespVO) => {
    setTestingTemplate(record)
    setTestModalVisible(true)
  }

  return (
    <ModalForm<{ mail: string; ccMail?: string; bccMail?: string }>
      title="测试"
      width={900}
      open={testModalVisible}
      onOpenChange={(visible) => {
        setTestModalVisible(visible)
        if (!visible) {
          setTestingTemplate(null)
        }
      }}
      initialValues={{}}
      layout="horizontal"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 20 }}
      colon={false}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      onFinish={async (values) => {
        if (!testingTemplate) return false
        try {
          // 目前 API 只发送 mail 字段，可以根据需要扩充
          const reqVO: API.SystemMailTemplateSendReqVO = {
            mail: values.mail,
            templateCode: testingTemplate.code,
            templateParams: {} // 可以根据需要让用户填参，此图里并没有参数表单，只填入基础占位
          }
          const resp = await sendMail(reqVO)

          if (resp.code === 0) {
            message.success('测试邮件发送成功')
            return true
          } else {
            message.error(resp.msg || '测试邮件发送失败')
            return false
          }
        } catch {
          message.error('测试邮件发送失败')
          return false
        }
      }}
    >
      <ProForm.Item label="模板内容" wrapperCol={{ span: 20 }}>
        <Editor value={testingTemplate?.content} readonly={true} height={100} />
      </ProForm.Item>
      <ProFormTextArea
        name="mail"
        label="收件邮箱"
        placeholder="请输入收件邮箱，多个邮箱用回车分隔"
        rules={[{ required: true, message: '请输入收件邮箱' }]}
        fieldProps={{ rows: 2 }}
      />
      <ProFormTextArea
        name="ccMail"
        label="抄送邮箱"
        placeholder="请输入抄送邮箱，多个邮箱用回车分隔"
        fieldProps={{ rows: 2 }}
      />
      <ProFormTextArea
        name="bccMail"
        label="密送邮箱"
        placeholder="请输入密送邮箱，多个邮箱用回车分隔"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default SendMailForm
