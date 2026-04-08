import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-components'
import { createProduct, updateProduct, getProduct } from '@/api/crm/product'
import { getProductCategoryList } from '@/api/crm/productCategory'
import { getSimpleUserList } from '@/api/system/user'
import { textConst } from '@/locales/zh-CN'
import { PRODUCT_UNITS, PRODUCT_STATUS } from '@/utils/constantsValue'

interface ProductFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

let userOptionsCache: any[] | null = null

const ProductForm: React.FC<ProductFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={setVisible}
      form={form}
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          form.resetFields()
          setVisible(false)
        }
      }}
      layout="horizontal"
      width={800}
      grid={true}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 12 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      colon={false}
      labelAlign="right"
      request={async () => {
        if (id !== undefined) {
          const resp = await getProduct({ id })
          return resp.data as Record<string, any>
        }
        return {}
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
        label="产品名称"
        rules={[{ required: true, message: '请输入产品名称' }]}
        placeholder="请输入产品名称"
      />
      <ProFormSelect
        name="ownerUserId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
        placeholder="请选择负责人"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          if (res.data) {
            userOptionsCache = res.data.map((user: any) => ({
              label: user.nickname,
              value: user.id
            }))
          }
          return userOptionsCache || []
        }}
      />
      <ProFormSelect
        name="categoryId"
        label="产品类型"
        rules={[{ required: true, message: '请选择产品类型' }]}
        placeholder="请选择产品类型"
        showSearch
        request={async (params) => {
          const { current, pageSize, ...rest } = params
          const req = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest
          }
          const res = await getProductCategoryList({ pageVO: req } as any)
          return (
            res.data?.map((item: any) => ({
              label: item.name,
              value: item.id
            })) || []
          )
        }}
      />
      <ProFormSelect
        name="unit"
        label="产品单位"
        placeholder="请选择单位"
        options={PRODUCT_UNITS}
      />

      <ProFormText
        name="barCode"
        label="产品编码"
        rules={[{ required: true, message: '请输入产品编码' }]}
        placeholder="请输入产品编码"
      />
      <ProFormDigit
        name="price"
        label="价格"
        rules={[{ required: true, message: '请输入价格' }]}
        placeholder="请输入价格"
        fieldProps={{
          min: 0,
          precision: 2,
          controls: true,
          suffix: '元'
        }}
      />

      <ProFormText name="description" label="产品描述" placeholder="请输入产品描述" />
      <ProFormSelect
        name="status"
        label="产品状态"
        rules={[{ required: true, message: '请选择产品状态' }]}
        placeholder="请选择产品状态"
        options={PRODUCT_STATUS}
      />
    </ModalForm>
  )
}

export default ProductForm
