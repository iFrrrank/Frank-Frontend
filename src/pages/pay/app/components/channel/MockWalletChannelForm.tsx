import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'

interface MockWalletChannelFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  channelInfo: { appId: number; channelCode: string } | null
  onSuccess: () => void
}

const MockWalletChannelForm: React.FC<MockWalletChannelFormProps> = ({
  visible,
  setVisible,
  channelInfo,
  onSuccess
}) => {
  const [form] = Form.useForm()

  if (!channelInfo || (channelInfo.channelCode !== 'mock' && channelInfo.channelCode !== 'wallet'))
    return null
  const { appId, channelCode } = channelInfo
  const title = channelCode === 'mock' ? '模拟支付配置' : '钱包支付配置'

  return (
    <ModalForm
      title={`创建${title}`}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) form.resetFields()
      }}
      form={form}
      colon={false}
      layout="horizontal"
      labelAlign="right"
      width={500}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      request={async () => {
        // TODO: 获取渠道 API
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          // TODO: 保存配置 API
          console.log('提交的钱包/模拟数据：', { appId, channelCode, ...values })
          message.success('配置保存成功')
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormRadio.Group
        name="status"
        label="渠道状态"
        rules={[{ required: true, message: '渠道状态是必选项！' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormText name="remark" label="备注" placeholder={'请输入备注'} />
    </ModalForm>
  )
}

export default MockWalletChannelForm
