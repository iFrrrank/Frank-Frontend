import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormUploadButton,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createBrand, updateBrand, getBrand } from '@/api/mall/product/brand'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface BrandFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const BrandForm: React.FC<BrandFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
          const resp = await getBrand({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateBrand({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createBrand(values as any)
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
        label="品牌名称"
        rules={[{ required: true, message: '请输入品牌名称' }]}
        placeholder="请输入品牌名称"
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="picUrl"
        label="品牌图片"
        title="单击上传"
        rules={[{ required: true, message: '请上传品牌图片' }]}
        max={1}
        listType="picture-card"
      />
      <ProFormDigit
        name="sort"
        label="品牌排序"
        rules={[{ required: true, message: '请输入品牌排序' }]}
        placeholder="请输入品牌排序"
        fieldProps={{ precision: 0 }}
      />
      <ProFormRadio.Group name="status" label="品牌状态" options={COMMON_STATUS_OPTIONS} />
      <ProFormTextArea
        name="description"
        label="品牌描述"
        placeholder="请输入品牌描述"
        fieldProps={{ rows: 3 }}
      />
    </ModalForm>
  )
}

export default BrandForm
