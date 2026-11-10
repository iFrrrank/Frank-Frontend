import React, { useEffect, useState } from 'react'
import {
  Alert,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
  message
} from 'antd'
import {
  createSalaryTaxRule,
  getSalaryTaxRule,
  updateSalaryTaxRule
} from '@/api/hrm/salary/taxRule'
import { textConst } from '@/locales/zh-CN'

interface SalaryTaxRuleFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  id?: number
  onSuccess: () => void
}

const TAX_TYPE_OPTIONS = [
  { label: '工资薪金所得税', value: 1 },
  { label: '劳务报酬所得税', value: 2 },
  { label: '不计税', value: 3 }
]

const TAX_CYCLE_TYPE_OPTIONS = [
  { label: '12月到11月（税款所属期）', value: 1 },
  { label: '1月到12月（税款所属期）', value: 2 }
]

const SalaryTaxRuleForm: React.FC<SalaryTaxRuleFormProps> = ({
  visible,
  setVisible,
  id,
  onSuccess
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [taxType, setTaxType] = useState<number>(1)

  useEffect(() => {
    if (!visible) {
      form.resetFields()
      return
    }

    if (id) {
      setLoading(true)
      getSalaryTaxRule({ id })
        .then((resp) => {
          const data = (resp.data || {}) as API.HrmSalaryTaxRuleRespVO
          setTaxType(data.type ?? 1)
          form.setFieldsValue({
            ...data,
            taxEnabled: data.taxEnabled ?? true,
            threshold: data.threshold ?? 5000,
            decimalScale: data.decimalScale ?? 2,
            cycleType: data.cycleType ?? 2
          })
        })
        .finally(() => setLoading(false))
    } else {
      setTaxType(1)
      form.setFieldsValue({
        type: 1,
        taxEnabled: true,
        threshold: 5000,
        decimalScale: 2,
        cycleType: 2
      })
    }
  }, [visible, id, form])

  const handleTypeChange = (type: number) => {
    setTaxType(type)
    if (type === 1) {
      // 工资薪金
      form.setFieldsValue({
        taxEnabled: true,
        threshold: 5000,
        decimalScale: 2,
        cycleType: 2
      })
    } else if (type === 2) {
      // 劳务报酬
      form.setFieldsValue({
        taxEnabled: true,
        threshold: 800,
        decimalScale: 2,
        cycleType: undefined
      })
    } else {
      // 不计税
      form.setFieldsValue({
        taxEnabled: false,
        threshold: 0,
        decimalScale: undefined,
        cycleType: undefined
      })
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const payload: API.HrmSalaryTaxRuleSaveReqVO = {
        ...values,
        id
      }

      if (isUpdate) {
        await updateSalaryTaxRule(payload)
        message.success(textConst.msg.updateSuccess)
      } else {
        await createSalaryTaxRule(payload)
        message.success(textConst.msg.createSuccess)
      }

      setVisible(false)
      onSuccess()
    } catch {
      // Form error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={isUpdate ? '修改计税规则' : '新增计税规则'}
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleOk}
      confirmLoading={loading}
      destroyOnClose
      okText={textConst.common.ok}
      cancelText={textConst.common.cancel}
      width={640}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        colon={false}
      >
        <Form.Item
          name="name"
          label="方案名称"
          rules={[{ required: true, message: '方案名称不能为空' }]}
        >
          <Input maxLength={64} placeholder="请输入方案名称" />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="个税类型"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              rules={[{ required: true, message: '个税类型不能为空' }]}
            >
              <Select
                options={TAX_TYPE_OPTIONS}
                onChange={handleTypeChange}
                placeholder="请选择个税类型"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taxEnabled"
              label="是否计税"
              valuePropName="checked"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <Switch disabled={taxType === 3} />
            </Form.Item>
          </Col>
        </Row>

        {taxType !== 3 && (
          <>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="threshold"
                  label="起征点"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  rules={[{ required: true, message: '起征点不能为空' }]}
                >
                  <InputNumber min={0} precision={2} addonAfter="元" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="decimalScale"
                  label="小数位"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  rules={[{ required: true, message: '小数位不能为空' }]}
                >
                  <InputNumber min={0} max={4} precision={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Alert
              message="工资薪金默认起征点为 5000 元，劳务报酬默认 800 元；小数位决定个税计算结果保留 0～4 位。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </>
        )}

        {taxType === 1 && (
          <Form.Item
            name="cycleType"
            label="计税周期"
            rules={[{ required: true, message: '计税周期不能为空' }]}
          >
            <Radio.Group options={TAX_CYCLE_TYPE_OPTIONS} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default SalaryTaxRuleForm
