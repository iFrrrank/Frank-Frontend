import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Radio,
  Row,
  Col,
  Space,
  message
} from 'antd'
import { CheckOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { createSalaryConfig, getSalaryConfig, updateSalaryConfig } from '@/api/hrm/salary/config'
import { textConst } from '@/locales/zh-CN'

const SOCIAL_SECURITY_MONTH_TYPE_OPTIONS = [
  { label: '上月', value: 1 },
  { label: '当月', value: 2 },
  { label: '次月', value: 3 }
]

const SalaryConfigPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [cycleStartDay, setCycleStartDay] = useState<number>(1)

  const loadConfig = async () => {
    setLoading(true)
    try {
      const resp = await getSalaryConfig()
      const data = resp.data
      const isInit = Boolean(data?.startYear && data?.startMonth)
      setInitialized(isInit)

      if (data) {
        const startDay = data.cycleStartDay ?? 1
        setCycleStartDay(startDay)
        form.setFieldsValue({
          cycleStartDay: startDay,
          socialSecurityMonthType: data.socialSecurityMonthType ?? 1,
          startYearMonth:
            data.startYear && data.startMonth
              ? dayjs(`${data.startYear}-${String(data.startMonth).padStart(2, '0')}`)
              : undefined
        })
      } else {
        setCycleStartDay(1)
        form.setFieldsValue({
          cycleStartDay: 1,
          socialSecurityMonthType: 1
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const getCycleEndDay = (startDay: number) => {
    return startDay === 1 ? 31 : startDay - 1
  }

  const handleSave = async () => {
    try {
      if (initialized) {
        await form.validateFields(['socialSecurityMonthType'])
      } else {
        await form.validateFields()
      }

      setSaving(true)
      const values = form.getFieldsValue()

      if (initialized) {
        await updateSalaryConfig({
          socialSecurityMonthType: values.socialSecurityMonthType
        })
        message.success(textConst.msg.updateSuccess)
      } else {
        const startYearMonth = values.startYearMonth
        const startYear = startYearMonth ? dayjs(startYearMonth).year() : dayjs().year()
        const startMonth = startYearMonth ? dayjs(startYearMonth).month() + 1 : dayjs().month() + 1

        await createSalaryConfig({
          cycleStartDay: values.cycleStartDay,
          socialSecurityMonthType: values.socialSecurityMonthType,
          startYear,
          startMonth
        })
        message.success(textConst.msg.createSuccess)
      }

      loadConfig()
    } catch {
      // Form validation failed
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card title="计薪配置" variant="borderless">
      {initialized && (
        <Alert
          message="计薪初始化已完成，仅可调整对应社保自然月。"
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        colon={false}
        style={{ maxWidth: 840 }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="cycleStartDay"
              label="计薪周期开始日"
              rules={[{ required: true, message: '计薪周期开始日不能为空' }]}
            >
              <InputNumber
                min={1}
                max={31}
                disabled={initialized}
                style={{ width: '100%' }}
                onChange={(val) => setCycleStartDay(val || 1)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="工资周期结束日">
              <InputNumber
                value={getCycleEndDay(cycleStartDay)}
                disabled
                min={1}
                max={31}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        {!initialized && (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="startYearMonth"
                label="薪资启用月份"
                rules={[{ required: true, message: '薪资启用月份不能为空' }]}
              >
                <DatePicker
                  picker="month"
                  placeholder="请选择月份"
                  style={{ width: '100%' }}
                  disabled={initialized}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item
          name="socialSecurityMonthType"
          label="对应社保自然月"
          rules={[{ required: true, message: '对应社保自然月不能为空' }]}
        >
          <Radio.Group options={SOCIAL_SECURITY_MONTH_TYPE_OPTIONS} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5 }}>
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={saving || loading}
              onClick={handleSave}
            >
              {textConst.action.save}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={loadConfig}>
              {textConst.action.reset}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default SalaryConfigPage
