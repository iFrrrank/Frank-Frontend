import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components'
import {
  createProductCategory,
  updateProductCategory,
  getProductCategory,
  getProductCategoryList
} from '@/api/crm/productCategory'
import { handleTreeData } from '@/utils/tree'
import { textConst } from '@/locales/zh-CN'

interface ProductCategoryFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

let categoryTreeCache: any[] | null = null

const ProductCategoryForm: React.FC<ProductCategoryFormProps> = ({
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
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          form.resetFields()
          setVisible(false)
        }
      }}
      layout="horizontal"
      width={450}
      colon={false}
      labelAlign="right"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 17 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getProductCategory({ id })
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateProductCategory({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createProductCategory(values as any)
            message.success(textConst.msg.createSuccess)
          }
          categoryTreeCache = null
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="父级分类"
        rules={[{ required: true, message: '请选择上级分类' }]}
        placeholder="请选择上级分类"
        request={async () => {
          if (categoryTreeCache) return categoryTreeCache
          const res = await getProductCategoryList({ listReqVO: {} })
          if (res.data) {
            const flatData = res.data.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.id,
              sort: item.sort || 0
            }))

            const treeData = handleTreeData(flatData, 0)
            categoryTreeCache = [{ label: '顶级分类', value: 0, children: treeData }]
            return categoryTreeCache
          }
          return [{ label: '顶级分类', value: 0 }]
        }}
        fieldProps={{
          showSearch: true,
          treeNodeFilterProp: 'label',
          dropdownStyle: { maxHeight: 400, overflow: 'auto' }
        }}
      />
      <ProFormText
        name="name"
        label="分类名称"
        rules={[{ required: true, message: '请输入分类名称' }]}
        placeholder="请输入分类名称"
      />
    </ModalForm>
  )
}

export default ProductCategoryForm
