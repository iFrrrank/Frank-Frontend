import React, { useState } from 'react'
import { Card, Button, Form, Space, message } from 'antd'
import { ProForm, ProFormRadio, ProFormDependency, ProFormDigit } from '@ant-design/pro-components'
import { getCustomerPoolConfig, saveCustomerPoolConfig } from '@/api/crm/contractConfig'
import { textConst } from '@/locales/zh-CN'
import { NOTIFY_STATUS } from '@/utils/constantsValue'

const ContractConfig: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)
      await saveCustomerPoolConfig(values as any)
      message.success(textConst.msg.saveSuccess)

      const res = await getCustomerPoolConfig()
      if (res.data) {
        form.setFieldsValue(res.data)
      }
    } catch (error: any) {
      if (!error.errorFields) {
        message.error(textConst.msg.saveError)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title="合同配置"
      extra={
        <Button type="primary" loading={loading} onClick={handleSave}>
          保存
        </Button>
      }
    >
      <ProForm
        form={form}
        submitter={false}
        layout="horizontal"
        colon={false}
        labelCol={{ flex: '120px' }}
        wrapperCol={{ flex: 'auto' }}
        labelAlign="right"
        request={async () => {
          try {
            const res = await getCustomerPoolConfig()
            return res.data || { notifyEnabled: false }
          } catch (error) {
            message.error('获取合同配置失败')
            return { notifyEnabled: false }
          }
        }}
      >
        <ProFormRadio.Group
          name="notifyEnabled"
          label="提前提醒设置"
          rules={[{ required: true, message: '请选择是否提醒' }]}
          options={NOTIFY_STATUS}
        />

        <ProFormDependency name={['notifyEnabled']}>
          {({ notifyEnabled }) => {
            if (!notifyEnabled) return null

            return (
              <Form.Item style={{ marginLeft: 120 }}>
                <Space align="center">
                  <span>提前</span>
                  <ProFormDigit
                    name="notifyDays"
                    noStyle
                    rules={[{ required: true, message: '请输入提前提醒天数' }]}
                    fieldProps={{
                      min: 0,
                      precision: 0,
                      controls: true,
                      style: { width: 120 },
                      placeholder: '请输入天数'
                    }}
                  />
                  <span>天提醒</span>
                </Space>
              </Form.Item>
            )
          }}
        </ProFormDependency>
      </ProForm>
    </Card>
  )
}

export default ContractConfig
