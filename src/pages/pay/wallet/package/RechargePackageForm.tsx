import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio, ProFormDigit } from '@ant-design/pro-components'
import {
  createWalletRechargePackage,
  updateWalletRechargePackage,
  getWalletRechargePackage
} from '@/api/pay/wallet/package'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface WalletRechargePackageFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const WalletRechargePackageForm: React.FC<WalletRechargePackageFormProps> = ({
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
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      width={500}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getWalletRechargePackage({ id } as any)
          const data = resp.data as Record<string, any>

          if (data.payPrice) data.payPrice = data.payPrice / 100
          if (data.bonusPrice) data.bonusPrice = data.bonusPrice / 100

          return data
        }
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          const submitData = { ...values }
          if (submitData.payPrice !== undefined)
            submitData.payPrice = Math.round(submitData.payPrice * 100)
          if (submitData.bonusPrice !== undefined)
            submitData.bonusPrice = Math.round(submitData.bonusPrice * 100)

          if (isUpdate) {
            await updateWalletRechargePackage({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createWalletRechargePackage(submitData as any)
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
        label="套餐名称"
        rules={[{ required: true, message: '套餐名称是必填项！' }]}
        placeholder="请输入套餐名称"
      />
      <ProFormDigit
        name="payPrice"
        label="支付金额"
        placeholder="请输入支付金额"
        rules={[{ required: true, message: '支付金额是必填项！' }]}
        fieldProps={{ precision: 2, min: 0, addonAfter: '元' }}
      />
      <ProFormDigit
        name="bonusPrice"
        label="赠送金额"
        placeholder="请输入赠送金额"
        rules={[{ required: true, message: '赠送金额是必填项！' }]}
        fieldProps={{ precision: 2, min: 0, addonAfter: '元' }}
      />
      <ProFormRadio.Group
        name="status"
        label="套餐状态"
        rules={[{ required: true, message: '请选择套餐状态' }]}
        options={COMMON_STATUS_OPTIONS}
      />
    </ModalForm>
  )
}

export default WalletRechargePackageForm
