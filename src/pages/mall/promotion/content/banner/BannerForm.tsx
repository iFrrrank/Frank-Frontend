import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormUploadButton,
  ProFormTextArea,
  ProFormSelect
} from '@ant-design/pro-components'
import { createBanner, updateBanner, getBanner } from '@/api/mall/promotion/banner'
import { textConst } from '@/locales/zh-CN'
import { BANNER_POSITION_OPTIONS, COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface BannerFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const BannerForm: React.FC<BannerFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
          const resp = await getBanner({ id } as any)
          return resp.data as Record<string, any>
        }
        return {
          status: 0
        }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateBanner({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createBanner(values as any)
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
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入 Banner 标题' }]}
        placeholder="请输入 Banner 标题"
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="picUrl"
        label="图片"
        rules={[{ required: true, message: '请上传图片' }]}
        max={1}
        listType="picture-card"
      />
      <ProFormText
        name="url"
        label="跳转地址"
        rules={[{ required: true, message: '请输入 Banner 跳转地址' }]}
        placeholder="请输入 Banner 跳转地址"
      />
      <ProFormDigit
        name="sort"
        label="排序"
        placeholder="请输入 Banner 排序"
        rules={[{ required: true, message: '请输入 Banner 排序' }]}
        fieldProps={{ precision: 0 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true, message: '请选择 Banner 状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormSelect
        name="position"
        label="位置"
        rules={[{ required: true, message: '请选择 Banner 位置' }]}
        placeholder="请选择 Banner 位置"
        options={BANNER_POSITION_OPTIONS}
      />
      <ProFormTextArea
        name="memo"
        label="描述"
        placeholder="请输入 Banner 描述"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  )
}

export default BannerForm
