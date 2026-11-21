import React, { useState } from 'react'
import { message, Form } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
  ProFormDigit,
  ProFormDependency
} from '@ant-design/pro-components'
import { textConst } from '@/locales/zh-CN'
import { COMMON_STATUS_OPTIONS, API_VERSION_TYPE } from '@/utils/constantsValue'
import { createChannel, getChannel, updateChannel } from '@/api/pay/channel'

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
  // 已配置过的渠道编号：有值走更新，无值走创建
  const [channelId, setChannelId] = useState<number>()

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
        try {
          const resp = await getChannel({ appId, code: channelCode } as any)
          if (resp.code === 0 && resp.data) {
            setChannelId(resp.data.id)
            // 渠道配置是 JSON 字符串，解析后回填到表单字段（字段名与配置键一致）
            const config = JSON.parse(resp.data.config || '{}')
            return {
              status: resp.data.status,
              feeRate: resp.data.feeRate,
              remark: resp.data.remark,
              ...config
            }
          }
        } catch {
          // 渠道尚未配置时按新建处理
        }
        setChannelId(undefined)
        return { status: 0, apiVersion: 'v2' }
      }}
      onFinish={async (values) => {
        try {
          const { status, feeRate, remark, ...configFields } = values
          const base = {
            appId,
            code: channelCode,
            status,
            feeRate,
            remark,
            // 配置字段整体序列化为 JSON 字符串提交
            config: JSON.stringify(configFields)
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
      <ProFormDependency name={['apiVersion']}>
        {({ apiVersion }) =>
          apiVersion === 'v3' ? (
            <>
              <ProFormText
                name="apiV3Key"
                label="API V3 密钥"
                placeholder={'请输入 API V3 密钥'}
                rules={[{ required: true, message: 'API V3 密钥是必填项！' }]}
              />
              <ProFormText
                name="certSerialNo"
                label="证书序列号"
                placeholder={'请输入证书序列号'}
                rules={[{ required: true, message: '证书序列号是必填项！' }]}
              />
              <ProFormTextArea
                name="privateKeyContent"
                label="商户私钥"
                placeholder={'请粘贴商户私钥内容（apiclient_key.pem）'}
                rules={[{ required: true, message: '商户私钥是必填项！' }]}
                fieldProps={{ rows: 3 }}
              />
              <ProFormTextArea
                name="publicKeyContent"
                label="微信支付公钥"
                placeholder={'请粘贴微信支付公钥内容'}
                fieldProps={{ rows: 3 }}
              />
              <ProFormText
                name="publicKeyId"
                label="公钥编号"
                placeholder={'请输入微信支付公钥编号'}
              />
            </>
          ) : (
            <>
              <ProFormText
                name="mchKey"
                label="商户密钥"
                placeholder={'请输入商户密钥（API 密钥）'}
                rules={[{ required: true, message: '商户密钥是必填项！' }]}
              />
              <ProFormTextArea
                name="keyContent"
                label="商户 P12 证书"
                placeholder={'请粘贴商户 P12 证书内容（Base64）'}
                fieldProps={{ rows: 3 }}
              />
            </>
          )
        }
      </ProFormDependency>
      <ProFormText name="remark" label="备注" placeholder={'请输入备注'} />
    </ModalForm>
  )
}

export default WechatChannelForm
