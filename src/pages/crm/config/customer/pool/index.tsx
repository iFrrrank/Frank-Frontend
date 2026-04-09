import React, { useState } from 'react'
import { Card, Button, Form, Space, message } from 'antd'
import { ProForm, ProFormRadio, ProFormDependency, ProFormDigit } from '@ant-design/pro-components'
import { getCustomerPoolConfig, updateCustomerPoolConfig } from '@/api/crm/customerPoolConfig'
import { COMMON_STATUS_OPTIONS, NOTIFY_STATUS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'

const CustomerPoolConfig: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      setLoading(true)
      await updateCustomerPoolConfig(values as any)
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
      title="客户公海规则设置"
      extra={
        <Button type="primary" loading={loading} onClick={handleSave}>
          {textConst.common.save}
        </Button>
      }
    >
      <ProForm
        form={form}
        submitter={false}
        layout="horizontal"
        colon={false}
        labelCol={{ span: 2 }}
        labelAlign="right"
        request={async () => {
          try {
            const res = await getCustomerPoolConfig()
            return res.data || { enabled: false, notifyEnabled: false }
          } catch (error) {
            message.error('获取配置失败')
            return { enabled: false, notifyEnabled: false }
          }
        }}
      >
        <ProFormRadio.Group
          name="enabled"
          label="客户公海规则设置"
          rules={[{ required: true, message: '请选择是否启用' }]}
          options={COMMON_STATUS_OPTIONS}
        />

        <ProFormDependency name={['enabled']}>
          {({ enabled }) => {
            if (enabled !== COMMON_STATUS_OPTIONS[0].value) return null

            return (
              <>
                <Form.Item wrapperCol={{ offset: 2 }}>
                  <Space align="center">
                    <ProFormDigit
                      name="contactExpireDays"
                      noStyle
                      fieldProps={{
                        min: 0,
                        precision: 0,
                        controls: true,
                        style: { width: 120 },
                        placeholder: '请输入天数'
                      }}
                    />
                    <span>天不跟进或</span>
                    <ProFormDigit
                      name="dealExpireDays"
                      noStyle
                      fieldProps={{
                        min: 0,
                        precision: 0,
                        controls: true,
                        style: { width: 120 },
                        placeholder: '请输入天数'
                      }}
                    />
                    <span>天未成交</span>
                  </Space>
                </Form.Item>

                <ProFormRadio.Group
                  name="notifyEnabled"
                  label="提前提醒设置"
                  options={NOTIFY_STATUS}
                />

                <ProFormDependency name={['notifyEnabled']}>
                  {({ notifyEnabled }) => {
                    if (notifyEnabled !== NOTIFY_STATUS[0].value) return null

                    return (
                      <Form.Item wrapperCol={{ offset: 2 }}>
                        <Space align="center">
                          <span>提前</span>
                          <ProFormDigit
                            name="notifyDays"
                            noStyle
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
              </>
            )
          }}
        </ProFormDependency>
      </ProForm>
    </Card>
  )
}

export default CustomerPoolConfig
