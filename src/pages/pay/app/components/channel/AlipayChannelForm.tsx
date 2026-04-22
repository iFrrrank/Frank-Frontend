import React from 'react'
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
        // TODO: 获取渠道配置详情 API
        return { status: 0, signType: 'RSA2', encryptType: 'none' }
      }}
      onFinish={async (values) => {
        try {
          // TODO: 保存配置 API
          console.log('提交的支付宝数据：', { appId, channelCode, ...values })
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
