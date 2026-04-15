import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-components'
import {
  createDiyTemplate,
  updateDiyTemplate,
  getDiyTemplate
} from '@/api/mall/promotion/diy/template'
import { textConst } from '@/locales/zh-CN'

interface DiyTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const DiyTemplateForm: React.FC<DiyTemplateFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
        }
      }}
      form={form}
      layout="horizontal"
      labelAlign="right"
      colon={false}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      width={450}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getDiyTemplate({ id } as any)
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateDiyTemplate({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDiyTemplate(values as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="模板名称"
        rules={[{ required: true, message: '请输入模板名称' }]}
        placeholder="请输入模板名称"
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 2 }}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="previewPicUrls"
        label="预览图"
        max={1}
        title="单击上传"
        listType="picture-card"
      />
    </ModalForm>
  )
}

export default DiyTemplateForm
