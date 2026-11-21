import React, { useState } from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS } from '@/utils/constantsValue'
import { createChannel, getChannel, updateChannel } from '@/api/pay/channel'

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
  // 已配置过的渠道编号：有值走更新，无值走创建
  const [channelId, setChannelId] = useState<number>()

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
        try {
          const resp = await getChannel({ appId, code: channelCode } as any)
          if (resp.code === 0 && resp.data) {
            setChannelId(resp.data.id)
            return { status: resp.data.status, remark: resp.data.remark }
          }
        } catch {
          // 渠道尚未配置时按新建处理
        }
        setChannelId(undefined)
        return { status: 0 }
      }}
      onFinish={async (values) => {
        try {
          // 模拟/钱包渠道无额外配置，config 为空对象
          const base = {
            appId,
            code: channelCode,
            status: values.status,
            remark: values.remark,
            feeRate: 0,
            config: '{}'
          }
          if (channelId) {
            await updateChannel({ id: channelId, ...base } as any)
          } else {
            await createChannel(base as any)
          }
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
