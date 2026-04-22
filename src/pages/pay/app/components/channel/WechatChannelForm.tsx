import React from 'react'
import { message, Form } from 'antd'
import { ModalForm, ProFormText, ProFormRadio, ProFormDigit } from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS, API_VERSION_TYPE } from '@/utils/constantsValue'

interface WechatChannelFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  channelInfo: { appId: number; channelCode: string } | null
  onSuccess: () => void
}

const WechatChannelForm: React.FC<WechatChannelFormProps> = ({
  visible,
  setVisible,
  channelInfo,
  onSuccess
}) => {
  const [form] = Form.useForm()

  if (!channelInfo || !channelInfo.channelCode.startsWith('wx_')) return null
  const { appId, channelCode } = channelInfo

  return (
    <ModalForm
      title="创建微信支付渠道"
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
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      modalProps={{ destroyOnClose: true, maskClosable: false }}
      request={async () => {
        // TODO: 获取渠道 API
        return { status: 0, apiVersion: 'v2' }
      }}
      onFinish={async (values) => {
        try {
          // TODO: 保存配置 API
          console.log('提交的微信数据：', { appId, channelCode, ...values })
          message.success('配置保存成功')
          onSuccess()
          return true
        } catch (e) {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormDigit
        name="feeRate"
        label="渠道费率"
        placeholder={'请输入渠道费率'}
        rules={[{ required: true, message: '渠道费率是必填项！' }]}
        fieldProps={{ addonAfter: '%', precision: 2 }}
      />
      <ProFormText
        name="appId"
        label="微信 APPID"
        placeholder={'请输入微信 APPID'}
        rules={[{ required: true, message: '微信 APPID 是必填项！' }]}
        extra={
          <a
            href="https://pay.weixin.qq.com/index.php/extend/merchant_appid/mapay_platform/account_manage"
            target="_blank"
            rel="noreferrer"
          >
            前往微信商户平台查看 APPID
          </a>
        }
      />
      <ProFormText
        name="mchId"
        label="商户号"
        placeholder={'请输入商户号'}
        rules={[{ required: true, message: '商户号是必填项！' }]}
        extra={
          <a
            href="https://pay.weixin.qq.com/index.php/extend/pay_setting"
            target="_blank"
            rel="noreferrer"
          >
            前往微信商户平台查看商户号
          </a>
        }
      />
      <ProFormRadio.Group
        name="status"
        label="渠道状态"
        rules={[{ required: true, message: '渠道状态是必选项！' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormRadio.Group
        name="apiVersion"
        label="API 版本"
        rules={[{ required: true }]}
        options={API_VERSION_TYPE}
      />
      <ProFormText name="remark" label="备注" placeholder={'请输入备注'} />
    </ModalForm>
  )
}

export default WechatChannelForm
