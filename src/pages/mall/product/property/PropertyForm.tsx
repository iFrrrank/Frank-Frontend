import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { createProperty, updateProperty, getProperty } from '@/api/mall/product/property'
import { textConst } from '@/locales/zh-CN'

interface PropertyFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const PropertyForm: React.FC<PropertyFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      colon={false}
      labelAlign="right"
      width={450}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 21 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getProperty({ id } as any)
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateProperty({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createProperty(values as any)
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
        label="名称"
        rules={[{ required: true, message: '请输入属性名称' }]}
        placeholder="请输入属性名称"
      />

      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 3 }}
      />
    </ModalForm>
  )
}

export default PropertyForm
