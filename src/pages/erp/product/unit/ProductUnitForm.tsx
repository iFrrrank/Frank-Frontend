import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'
import { createProductUnit, updateProductUnit, getProductUnit } from '@/api/erp/product/unit'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface ProductUnitFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ProductUnitForm: React.FC<ProductUnitFormProps> = ({
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
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getProductUnit({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateProductUnit({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createProductUnit(values as any)
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
        label="单位名称"
        rules={[{ required: true, message: '请输入单位名称' }]}
        placeholder="请输入单位名称"
      />
      <ProFormRadio.Group
        name="status"
        label="单位状态"
        rules={[{ required: true, message: '请选择单位状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
    </ModalForm>
  )
}

export default ProductUnitForm
