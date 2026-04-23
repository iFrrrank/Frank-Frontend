import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio, ProFormDigit } from '@ant-design/pro-components'
import {
  createWalletRechargePackage,
  updateWalletRechargePackage,
  getWalletRechargePackage
} from '@/api/pay/wallet/package'

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
      title={isUpdate ? `编辑充值套餐` : `新增`}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
        }
      }}
      form={form}
      layout="horizontal"
      labelAlign="right"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 17 }}
      width={600}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getWalletRechargePackage({ id } as any)
          const data = resp.data as Record<string, any>

          // 💡 将后端的“分”转换为前端表单展示的“元”
          if (data.payPrice) data.payPrice = data.payPrice / 100
          if (data.bonusPrice) data.bonusPrice = data.bonusPrice / 100

          return data
        }
        return { status: 0 } // 默认状态为开启
      }}
      onFinish={async (values) => {
        try {
          // 💡 将前端表单收集的“元”转换为后端存储所需的“分”
          const submitData = { ...values }
          if (submitData.payPrice !== undefined)
            submitData.payPrice = Math.round(submitData.payPrice * 100)
          if (submitData.bonusPrice !== undefined)
            submitData.bonusPrice = Math.round(submitData.bonusPrice * 100)

          if (isUpdate) {
            await updateWalletRechargePackage({ id, ...submitData } as any)
            message.success('更新成功')
          } else {
            await createWalletRechargePackage(submitData as any)
            message.success('新增成功')
          }
          onSuccess()
          return true
        } catch (e) {
          message.error('操作失败')
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="套餐名"
        rules={[{ required: true, message: '请输入套餐名' }]}
        placeholder="请输入套餐名"
      />

      <ProFormDigit
        name="payPrice"
        label="支付金额(元)"
        rules={[{ required: true, message: '请输入支付金额' }]}
        fieldProps={{ precision: 2, min: 0 }}
      />

      <ProFormDigit
        name="bonusPrice"
        label="赠送金额(元)"
        rules={[{ required: true, message: '请输入赠送金额' }]}
        fieldProps={{ precision: 2, min: 0 }}
      />

      <ProFormRadio.Group
        name="status"
        label="开启状态"
        rules={[{ required: true, message: '请选择开启状态' }]}
        options={[
          { label: '开启', value: 0 },
          { label: '关闭', value: 1 }
        ]}
      />
    </ModalForm>
  )
}

export default WalletRechargePackageForm
