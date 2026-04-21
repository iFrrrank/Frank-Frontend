import React from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormRadio,
  ProFormUploadButton
} from '@ant-design/pro-components'
import {
  createDeliveryExpress,
  updateDeliveryExpress,
  getDeliveryExpress
} from '@/api/mall/trade/delivery/express'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface DeliveryExpressFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ExpressForm: React.FC<DeliveryExpressFormProps> = ({
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
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
        }
      }}
      form={form}
      colon={false}
      layout="horizontal"
      labelAlign="right"
      rowProps={{ gutter: 24 }}
      colProps={{ span: 24 }}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      width={450}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getDeliveryExpress({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateDeliveryExpress({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDeliveryExpress(values as any)
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
        name="code"
        label="公司编码"
        rules={[{ required: true, message: '请输入快递编码' }]}
        placeholder="请输入快递编码"
      />

      <ProFormText
        name="name"
        label="公司名称"
        rules={[{ required: true, message: '请输入快递名称' }]}
        placeholder="请输入快递名称"
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="logo"
        label="公司 logo"
        max={1}
        title="单击上传"
        rules={[{ required: true, message: '请上传公司 logo' }]}
        listType="picture-card"
        extra="推荐 180x180 图片分辨率"
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        fieldProps={{ precision: 0 }}
        placeholder="请输入排序"
      />
      <ProFormRadio.Group
        name="status"
        label="开启状态"
        rules={[{ required: true, message: '请选择开启状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
    </ModalForm>
  )
}

export default ExpressForm
