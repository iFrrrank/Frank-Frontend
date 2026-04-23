import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'
import { createApp, updateApp, getApp } from '@/api/pay/app'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface AppFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const AppForm: React.FC<AppFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) form.resetFields()
      }}
      form={form}
      colon={false}
      layout="horizontal"
      labelAlign="right"
      width={600}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getApp({ id } as any)
          return resp.data as Record<string, any>
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateApp({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createApp(values as any)
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
        label="应用名称"
        rules={[{ required: true, message: '请输入应用名称' }]}
        placeholder="请输入应用名称"
      />
      <ProFormText
        name="appKey"
        label="应用标识"
        rules={[{ required: true, message: '请输入应用标识' }]}
        placeholder="请输入应用标识"
      />
      <ProFormRadio.Group
        name="status"
        label="应用状态"
        rules={[{ required: true, message: '请选择应用状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormText
        name="payNotifyUrl"
        label="支付结果回调地址"
        placeholder={'请输入支付结果回调地址'}
        rules={[{ required: true, message: '请输入支付结果回调地址' }]}
      />
      <ProFormText
        name="refundNotifyUrl"
        label="退款结果回调地址"
        placeholder={'请输入支付结果回调地址'}
        rules={[{ required: true, message: '请输入支付结果回调地址' }]}
      />
      <ProFormText
        name="transferNotifyUrl"
        label="转账结果回调地址"
        placeholder={'请输入转账结果回调地址'}
      />
      <ProFormText name="remark" label="备注" placeholder="请输入备注" />
    </ModalForm>
  )
}

export default AppForm
