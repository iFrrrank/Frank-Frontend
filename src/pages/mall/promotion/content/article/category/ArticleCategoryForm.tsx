import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormUploadButton
} from '@ant-design/pro-components'
import {
  createArticleCategory,
  updateArticleCategory,
  getArticleCategory
} from '@/api/mall/promotion/article/category'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface ArticleCategoryFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ArticleCategoryForm: React.FC<ArticleCategoryFormProps> = ({
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
          const resp = await getArticleCategory({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateArticleCategory({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createArticleCategory(values as any)
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
        label="分类名称"
        rules={[{ required: true, message: '请输入分类名称' }]}
        placeholder="请输入分类名称"
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="picUrl"
        label="分类图标"
        max={1}
        title="单击上传"
        listType="picture-card"
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        placeholder="请输入排序"
        rules={[{ required: true, message: '请输入排序' }]}
        fieldProps={{ precision: 0 }}
      />
    </ModalForm>
  )
}

export default ArticleCategoryForm
