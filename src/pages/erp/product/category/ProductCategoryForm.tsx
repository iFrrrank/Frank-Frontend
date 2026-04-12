import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import {
  createProductCategory,
  updateProductCategory,
  getProductCategory,
  getProductCategorySimpleList
} from '@/api/erp/product/category'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface ProductCategoryFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

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
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => form.resetFields()
      }}
      colon={false}
      labelAlign="right"
      width={500}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getProductCategory({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
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
        label="上级编号"
        rules={[{ required: true, message: '请选择上级编号' }]}
        placeholder="请选择上级编号"
        request={async () => {
          const res = await getProductCategorySimpleList()
          // 需要确保后端返回的数据结构中有 id 和 name，ProFormTreeSelect 默认认 value 和 label
          // 如果后端字段不一致，可以使用 fieldProps={{ fieldNames: { label: 'name', value: 'id' } }} 来映射
          return res.data || []
        }}
        fieldProps={{
          // 映射后端的字段名为 TreeSelect 需要的格式
          fieldNames: { label: 'name', value: 'id' },
          // 允许清空，或者选择顶层（通常设置 parentId 为 0）
          allowClear: true,
          // 可选：添加一个“顶级分类”作为虚拟节点
          treeDataSimpleMode: true
        }}
      />
      <ProFormText
        name="name"
        label="名称"
        rules={[{ required: true, message: '请输入产品分类名称' }]}
        placeholder="请输入产品分类名称"
      />
      <ProFormText
        name="code"
        label="编码"
        rules={[{ required: true, message: '请输入产品分类编码' }]}
        placeholder="请输入产品分类编码"
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入产品分类排序' }]}
        placeholder="请输入产品分类排序"
        fieldProps={{ precision: 0 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择产品分类状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
    </ModalForm>
  )
}

export default ProductCategoryForm
