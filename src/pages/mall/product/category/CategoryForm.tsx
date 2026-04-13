import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormUploadButton
} from '@ant-design/pro-components'
import {
  createCategory,
  updateCategory,
  getCategory,
  getCategoryList
} from '@/api/mall/product/category'
import { handleTreeData } from '@/utils/tree'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface CategoryFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const CategoryForm: React.FC<CategoryFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
          const resp = await getCategory({ id } as any)
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateCategory({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createCategory(values as any)
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
        label="上级分类"
        placeholder="请选择上级分类"
        request={async () => {
          const res = await getCategoryList({} as any)
          const list = res.data || []
          const treeData = handleTreeData(list, 0)
          return [{ id: 0, name: '顶级分类', children: treeData }]
        }}
        fieldProps={{
          fieldNames: { label: 'name', value: 'id' },
          allowClear: true,
          treeDefaultExpandAll: true
        }}
      />
      <ProFormText
        name="name"
        label="分类名称"
        rules={[{ required: true, message: '请输入分类名称' }]}
        placeholder="请输入分类名称"
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="picUrl"
        label="分类图片"
        max={1}
        title="上传图片"
        listType="picture-card"
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请选择分类排序' }]}
        placeholder="请选择分类排序"
        fieldProps={{ precision: 0 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
    </ModalForm>
  )
}

export default CategoryForm
