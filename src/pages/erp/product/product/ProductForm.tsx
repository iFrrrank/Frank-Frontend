import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createProduct, updateProduct, getProduct } from '@/api/erp/product/product'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface ProductFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ProductForm: React.FC<ProductFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
      grid={true}
      colon={false}
      labelAlign="right"
      width={700}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 12 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getProduct({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateProduct({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createProduct(values as any)
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
        rules={[{ required: true, message: '请输入产品名称' }]}
        placeholder="请输入名称"
      />
      <ProFormText
        name="barCode"
        label="条码"
        rules={[{ required: true, message: '请输入产品条码' }]}
        placeholder="请输入条码"
      />
      <ProFormSelect
        name="categoryId"
        label="分类"
        rules={[{ required: true, message: '请选择产品分类' }]}
        placeholder="请选择产品分类"
        request={async () => []}
      />
      <ProFormSelect
        name="unitId"
        label="单位"
        rules={[{ required: true, message: '请选择产品单位' }]}
        placeholder="请选择产品单位"
        request={async () => []}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择产品状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormText name="standard" label="规格" placeholder="请输入产品规格" />
      <ProFormDigit
        name="expiryDay"
        label="保质期天数"
        placeholder="请输入保质期天数"
        fieldProps={{ precision: 0, min: 0 }}
      />
      <ProFormDigit
        name="weight"
        label="重量"
        placeholder="请输入产品重量"
        fieldProps={{ precision: 2, min: 0, suffix: 'Kg' }}
      />

      <ProFormDigit
        name="purchasePrice"
        label="采购价格"
        placeholder="请输入采购价格"
        fieldProps={{ precision: 2, min: 0, suffix: '元' }}
      />
      <ProFormDigit
        name="salesPrice"
        label="销售价格"
        placeholder="请输入销售价格"
        fieldProps={{ precision: 2, min: 0, suffix: '元' }}
      />
      <ProFormDigit
        name="minPrice"
        label="最低价格"
        placeholder="请输入最低价格"
        fieldProps={{ precision: 2, min: 0, suffix: '元' }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default ProductForm
