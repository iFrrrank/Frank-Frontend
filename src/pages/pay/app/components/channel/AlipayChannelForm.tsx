import React, { useState } from 'react'
import { message, Form, Upload, Button } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
  ProFormDigit
} from '@ant-design/pro-components'
import { UploadOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'
import {
  COMMON_STATUS_OPTIONS,
  GATEWAY_TYPE,
  PUBLICKEY_TYPE,
  ENCRYPT_TYPE
} from '@/utils/constantsValue'
import { createChannel, getChannel, updateChannel } from '@/api/pay/channel'

interface AlipayChannelFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  channelInfo: { appId: number; channelCode: string } | null
  onSuccess: () => void
}

const AlipayChannelForm: React.FC<AlipayChannelFormProps> = ({
  visible,
  setVisible,
  channelInfo,
  onSuccess
}) => {
  const [form] = Form.useForm()
  // 已配置过的渠道编号：有值走更新，无值走创建
  const [channelId, setChannelId] = useState<number>()

  const handleCertUpload = (file: File, fieldName: string) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.setFieldValue(fieldName, e.target?.result)
      message.success('文件内容读取成功')
    }
    reader.readAsText(file)
    return false // 返回 false 阻止 antd 的默认上传行为
  }

  if (!channelInfo || !channelInfo.channelCode.startsWith('alipay_')) return null
  const { appId, channelCode } = channelInfo

  return (
    <ModalForm
      title="创建支付宝渠道"
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) form.resetFields()
      }}
      form={form}
      colon={false}
      layout="horizontal"
      labelAlign="right"
      width={650}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        styles: { body: { maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' } }
      }}
      request={async () => {
        try {
          const resp = await getChannel({ appId, code: channelCode } as any)
          if (resp.code === 0 && resp.data) {
            setChannelId(resp.data.id)
            // 渠道配置是 JSON 字符串，解析后映射回表单字段
            const config = JSON.parse(resp.data.config || '{}')
            return {
              status: resp.data.status,
              feeRate: resp.data.feeRate,
              remark: resp.data.remark,
              appId: config.appId,
              gateway: config.serverUrl,
              signType: config.signType || 'RSA2',
              // 后端 mode：1 公钥模式，2 证书模式
              publicKeyType: config.mode === 2 ? 'certificate' : 'publicKey',
              privateKey: config.privateKey,
              alipayPublicKey: config.alipayPublicKey,
              merchantCert: config.appCertContent,
              alipayCert: config.alipayPublicCertContent,
              rootCert: config.rootCertContent,
              encryptType: config.encryptType || 'none',
              encryptKey: config.encryptKey
            }
          }
        } catch {
          // 渠道尚未配置时按新建处理
        }
        setChannelId(undefined)
        return { status: 0, signType: 'RSA2', encryptType: 'none' }
      }}
      onFinish={async (values) => {
        try {
          // 表单字段映射为后端渠道配置的 JSON 结构
          const config = {
            appId: values.appId,
            serverUrl: values.gateway,
            signType: values.signType,
            mode: values.publicKeyType === 'certificate' ? 2 : 1,
            privateKey: values.privateKey,
            alipayPublicKey: values.alipayPublicKey,
            appCertContent: values.merchantCert,
            alipayPublicCertContent: values.alipayCert,
            rootCertContent: values.rootCert,
            encryptType: values.encryptType,
            encryptKey: values.encryptKey
          }
          const base = {
            appId,
            code: channelCode,
            status: values.status,
            feeRate: values.feeRate,
            remark: values.remark,
            config: JSON.stringify(config)
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
        label="开放平台APPID"
        placeholder={'请输入开放平台 APPID'}
        rules={[{ required: true, message: '开放平台 APPID 是必填项！' }]}
      />
      <ProFormRadio.Group
        name="status"
        label="渠道状态"
        rules={[{ required: true, message: '渠道状态是必选项！' }]}
        options={COMMON_STATUS_OPTIONS}
      />
      <ProFormRadio.Group
        name="gateway"
        label="网关地址"
        rules={[{ required: true }]}
        options={GATEWAY_TYPE}
      />
      <ProFormRadio.Group
        name="signType"
        label="算法类型"
        rules={[{ required: true, message: '算法类型是必选项！' }]}
        options={[{ label: 'RSA2', value: 'RSA2' }]}
      />
      <ProFormRadio.Group
        name="publicKeyType"
        label="公钥类型"
        rules={[{ required: true, message: '公钥类型是必选项！' }]}
        options={PUBLICKEY_TYPE}
      />

      <ProFormDependency name={['publicKeyType']}>
        {({ publicKeyType }) => {
          // 1. 如果什么都没选，不显示任何后续输入框
          if (!publicKeyType) return null

          // 2.1 证书模式
          if (publicKeyType === 'certificate') {
            return (
              <>
                <ProFormTextArea
                  name="privateKey"
                  label="应用私钥"
                  placeholder={'请输入应用私钥'}
                  rules={[{ required: true, message: '应用私钥是必填项！' }]}
                  fieldProps={{ rows: 3 }}
                />
                <ProFormTextArea
                  name="merchantCert"
                  label="商户公钥应用证书"
                  placeholder={'请上传商户公钥应用证书'}
                  rules={[{ required: true, message: '商户公钥应用证书是必填项！' }]}
                  fieldProps={{ rows: 3 }}
                  extra={
                    <Upload
                      beforeUpload={(file) => handleCertUpload(file as File, 'merchantCert')}
                      showUploadList={false}
                      accept=".crt"
                    >
                      <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                        上传文件
                      </Button>
                    </Upload>
                  }
                />
                <ProFormTextArea
                  name="alipayCert"
                  label="支付宝公钥证书"
                  placeholder={'请上传支付宝公钥证书'}
                  rules={[{ required: true, message: '支付宝公钥证书是必填项！' }]}
                  fieldProps={{ rows: 3 }}
                  extra={
                    <Upload
                      beforeUpload={(file) => handleCertUpload(file as File, 'alipayCert')}
                      showUploadList={false}
                      accept=".crt"
                    >
                      <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                        上传文件
                      </Button>
                    </Upload>
                  }
                />
                <ProFormTextArea
                  name="rootCert"
                  label="根证书"
                  placeholder={'请上传根证书'}
                  fieldProps={{ rows: 3 }}
                  rules={[{ required: true, message: '支付宝公钥证书是必填项！' }]}
                  extra={
                    <Upload
                      beforeUpload={(file) => handleCertUpload(file as File, 'rootCert')}
                      showUploadList={false}
                      accept=".crt"
                    >
                      <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                        上传文件
                      </Button>
                    </Upload>
                  }
                />
              </>
            )
          }

          // 2.2 公钥模式
          if (publicKeyType === 'publicKey') {
            return (
              <>
                <ProFormTextArea
                  name="privateKey"
                  label="应用私钥"
                  placeholder={'请输入应用私钥'}
                  rules={[{ required: true, message: '应用私钥是必填项！' }]}
                  fieldProps={{ rows: 3 }}
                />
                <ProFormTextArea
                  name="alipayPublicKey"
                  label="支付宝公钥"
                  placeholder={'请输入支付宝公钥'}
                  rules={[{ required: true, message: '支付宝公钥是必填项！' }]}
                  fieldProps={{ rows: 3 }}
                />
              </>
            )
          }
          return null
        }}
      </ProFormDependency>

      <ProFormRadio.Group name="encryptType" label="接口内容加密方式" options={ENCRYPT_TYPE} />

      <ProFormDependency name={['encryptType']}>
        {({ encryptType }) => {
          if (encryptType === 'AES') {
            return (
              <ProFormText
                name="encryptKey"
                label="接口内容加密密钥"
                placeholder={'请输入接口内容加密密钥'}
                rules={[{ required: true, message: '接口内容加密密钥是必填项！' }]}
              />
            )
          }
          return null
        }}
      </ProFormDependency>

      <ProFormText name="remark" label="备注" placeholder={'请输入备注'} />
    </ModalForm>
  )
}

export default AlipayChannelForm
