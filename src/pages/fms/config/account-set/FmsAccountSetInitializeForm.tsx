import React, { useEffect, useState } from 'react'
import { Alert, DatePicker, Form, Input, Modal, Select, message } from 'antd'
import dayjs from 'dayjs'
import { fmsAccountSetInitializeAccountSet } from '@/api/fms/config/accountSet'
import {
  FMS_ACCOUNTING_STANDARD_OPTIONS,
  FMS_CURRENCY_CODE,
  FMS_CURRENCY_OPTIONS,
  FMS_DEFAULT_SUBJECT_CODE_RULE,
  FMS_DEFAULT_SUBJECT_LEVEL,
  FMS_LEDGER_BALANCE_MODE,
  FMS_LEDGER_BALANCE_MODE_OPTIONS
} from '../../utils/constants'

interface FmsAccountSetInitializeFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  row?: API.FmsAccountSetRespVO
  onSuccess: () => void
}

/**
 * 账套初始化（开始记账）弹窗
 */
const FmsAccountSetInitializeForm: React.FC<FmsAccountSetInitializeFormProps> = ({
  visible,
  setVisible,
  row,
  onSuccess
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!visible || !row) return
    form.resetFields()
    form.setFieldsValue({
      companyName: row.companyName,
      currencyCode: FMS_CURRENCY_CODE.RMB,
      startTime: row.startTime ? dayjs(row.startTime) : dayjs().startOf('month'),
      standard: FMS_ACCOUNTING_STANDARD_OPTIONS[0].value,
      level: FMS_DEFAULT_SUBJECT_LEVEL,
      subjectCodeRule: FMS_DEFAULT_SUBJECT_CODE_RULE,
      ledgerBalanceMode: FMS_LEDGER_BALANCE_MODE.SAME_AS_SUBJECT
    })
  }, [visible, row, form])

  const handleSubmit = async () => {
    if (!row) return
    try {
      const values = await form.validateFields()
      setLoading(true)
      const resp = await fmsAccountSetInitializeAccountSet({
        accountSetId: row.id,
        currencyCode: values.currencyCode,
        startTime: String(dayjs(values.startTime).startOf('month').valueOf()),
        standard: values.standard,
        level: values.level,
        subjectCodeRule: values.subjectCodeRule,
        ledgerBalanceMode: values.ledgerBalanceMode
      })
      if (resp.code === 0) {
        message.success('账套初始化成功')
        setVisible(false)
        onSuccess()
      }
    } catch {
      // 校验或请求失败
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="开始记账"
      open={visible}
      onCancel={() => setVisible(false)}
      onOk={handleSubmit}
      okText="开始记账"
      confirmLoading={loading}
      width={640}
      destroyOnHidden
    >
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        colon={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="companyName" label="公司名称">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="currencyCode"
          label="本位币"
          rules={[{ required: true, message: '本位币不能为空' }]}
        >
          <Select disabled options={FMS_CURRENCY_OPTIONS as any} />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="启用期间"
          rules={[{ required: true, message: '启用期间不能为空' }]}
        >
          <DatePicker
            picker="month"
            format="YYYY年MM月"
            allowClear={false}
            style={{ width: '100%' }}
            placeholder="请选择启用期间"
          />
        </Form.Item>
        <Form.Item
          name="standard"
          label="会计制度"
          rules={[{ required: true, message: '会计制度不能为空' }]}
        >
          <Select options={FMS_ACCOUNTING_STANDARD_OPTIONS as any} placeholder="请选择会计制度" />
        </Form.Item>
        <Form.Item
          name="level"
          label="科目级次"
          rules={[{ required: true, message: '科目级次不能为空' }]}
        >
          <Select
            placeholder="请选择科目级次"
            options={Array.from({ length: 8 }, (_, idx) => ({
              label: `${idx + 1} 级`,
              value: idx + 1
            }))}
          />
        </Form.Item>
        <Form.Item
          name="subjectCodeRule"
          label="科目编码规则"
          rules={[
            { required: true, message: '科目编码规则不能为空' },
            { pattern: /^([2-5]-)*[2-5]$/, message: '各级编码长度必须为 2 至 5 位' }
          ]}
        >
          <Input placeholder="例如：4-2-2-2" />
        </Form.Item>
        <Form.Item
          name="ledgerBalanceMode"
          label="余额方向"
          rules={[{ required: true, message: '余额方向不能为空' }]}
        >
          <Select
            options={FMS_LEDGER_BALANCE_MODE_OPTIONS as any}
            placeholder="请选择账簿余额方向"
          />
        </Form.Item>
        <Alert
          type="info"
          showIcon
          message="初始化后将建立本位币、财务参数和默认凭证字，启用期间不可随意变更"
        />
      </Form>
    </Modal>
  )
}

export default FmsAccountSetInitializeForm
