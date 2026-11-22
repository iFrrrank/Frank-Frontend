import React, { useState } from 'react'
import { Form, message } from 'antd'
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'
import { createDemoWithdraw } from '@/api/pay/demo/withdraw'
import { textConst } from '@/locales/zh-CN'

export let handleCreateDemoWithdraw: () => void

interface CreateDemoWithdrawModalProps {
  onSuccess: () => void
}

// 收款人账号输入提示随提现类型变化
const getAccountPlaceholder = (type?: number) => {
  switch (type) {
    case 1:
      return '请输入支付宝账号'
    case 2:
      return '请输入微信 openid'
    case 3:
      return '请输入用户编号'
    default:
      return '请输入收款人账号'
  }
}

const CreateDemoWithdrawForm: React.FC<CreateDemoWithdrawModalProps> = ({ onSuccess }) => {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  // 监听提现类型，用于切换收款人账号的输入提示
  const withdrawType = Form.useWatch('type', form)

  handleCreateDemoWithdraw = () => {
    setCreateModalVisible(true)
  }

  return (
    <ModalForm
      form={form}
      title="发起提现"
      width={560}
      open={createModalVisible}
      onOpenChange={setCreateModalVisible}
      initialValues={{ type: 1 }}
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      colon={false}
      modalProps={{
        destroyOnHidden: true,
        styles: {
          body: { paddingBottom: 0 }
        }
      }}
      onFinish={async (values) => {
        try {
          // 提现金额表单里填的是“元”，提交时换算为“分”
          const resp = await createDemoWithdraw({
            subject: values.subject,
            type: values.type,
            price: Math.round((values.price || 0) * 100),
            userAccount: values.userAccount,
            userName: values.userName
          })
          if (resp.code === 0) {
            message.success(textConst.msg.createSuccess)
            onSuccess()
            return true
          } else {
            message.error(resp.msg || textConst.msg.createError)
            return false
          }
        } catch {
          message.error(textConst.msg.createError)
          return false
        }
      }}
    >
      <ProFormText
        name="subject"
        label="提现标题"
        colProps={{ span: 24 }}
        placeholder="请输入提现标题"
        rules={[{ required: true, message: '提现标题不能为空' }]}
      />
      <ProFormRadio.Group
        name="type"
        label="提现类型"
        colProps={{ span: 24 }}
        options={[
          { label: '支付宝', value: 1 },
          { label: '微信余额', value: 2 },
          { label: '钱包', value: 3 }
        ]}
        rules={[{ required: true, message: '提现类型不能为空' }]}
      />
      <ProFormDigit
        name="price"
        label="提现金额"
        colProps={{ span: 24 }}
        placeholder="请输入提现金额（元）"
        fieldProps={{ min: 0.01, precision: 2, step: 0.01 }}
        rules={[{ required: true, message: '提现金额不能为空' }]}
      />
      <ProFormText
        name="userAccount"
        label="收款人账号"
        colProps={{ span: 24 }}
        placeholder={getAccountPlaceholder(withdrawType)}
        rules={[{ required: true, message: '收款人账号不能为空' }]}
      />
      <ProFormText
        name="userName"
        label="收款人姓名"
        colProps={{ span: 24 }}
        placeholder="请输入收款人姓名"
        rules={[{ required: true, message: '收款人姓名不能为空' }]}
      />
    </ModalForm>
  )
}

export default CreateDemoWithdrawForm
