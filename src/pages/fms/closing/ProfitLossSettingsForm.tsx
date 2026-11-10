import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Tooltip,
  message
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { fmsClosingSchemeSaveProfitLossSettings } from '@/api/fms/closing/scheme'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'
import {
  FMS_CLOSING_VOUCHER_TYPE,
  FMS_CLOSING_VOUCHER_TYPE_OPTIONS,
  FMS_SUBJECT_TYPE
} from '@/pages/fms/utils/constants'

export interface ProfitLossSettingsFormRef {
  open: (settings?: API.FmsClosingSchemeRespVO) => void
}

interface ProfitLossSettingsFormProps {
  accountSetId: number
  month: string
  subjects: API.FmsSubjectRespVO[]
  voucherWords: API.FmsVoucherWordRespVO[]
  onSuccess?: () => void
}

const ProfitLossSettingsForm = forwardRef<
  ProfitLossSettingsFormRef,
  ProfitLossSettingsFormProps
>(({ accountSetId, month, subjects, voucherWords, onSuccess }, ref) => {
  const voucherTypeOptions = FMS_CLOSING_VOUCHER_TYPE_OPTIONS

  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const profitLossSubjects = useMemo(
    () => subjects.filter((item) => item.type === FMS_SUBJECT_TYPE.PROFIT_LOSS),
    [subjects]
  )
  const closingSubjects = useMemo(
    () => subjects.filter((item) => item.type !== FMS_SUBJECT_TYPE.PROFIT_LOSS),
    [subjects]
  )

  useImperativeHandle(ref, () => ({
    open: (settings) => {
      form.resetFields()
      const defaultWordId =
        voucherWords.find((item) => item.defaultStatus)?.id || voucherWords[0]?.id
      const defaultPriorYearId = subjects.find((item) => item.code === '6000')?.id
      const defaultAdjClosingId = subjects.find((item) => item.code === '310415')?.id
      const defaultOtherClosingId = subjects.find((item) => item.code === '3103')?.id

      const legacySettings = !settings?.priorYearAdjustmentSubjectId
      const closingDay = Math.min(
        settings?.closingDay || 31,
        dayjs(`${month}-01`).daysInMonth()
      )
      const voucherDate = dayjs(`${month}-${String(closingDay).padStart(2, '0')}`)

      form.setFieldsValue({
        voucherDate,
        voucherWordId: settings?.voucherWordId || defaultWordId,
        digest: settings?.digest || '结转损益',
        voucherType: settings?.voucherType ?? FMS_CLOSING_VOUCHER_TYPE.COMBINED_GAIN_AND_LOSS,
        priorYearAdjustmentSubjectId:
          settings?.priorYearAdjustmentSubjectId || defaultPriorYearId,
        adjustmentClosingSubjectId:
          settings?.adjustmentClosingSubjectId || defaultAdjClosingId,
        otherClosingSubjectId: settings?.otherClosingSubjectId || defaultOtherClosingId,
        reverseBalance: legacySettings ? true : (settings?.reverseBalance ?? true)
      })
      setVisible(true)
    }
  }))

  const submitForm = async () => {
    const values = await form.validateFields()
    if (!values.voucherDate) {
      message.warning('凭证日期不能为空')
      return
    }
    setSubmitting(true)
    try {
      const resp = await fmsClosingSchemeSaveProfitLossSettings({
        accountSetId,
        voucherWordId: values.voucherWordId,
        digest: values.digest,
        voucherType: values.voucherType,
        priorYearAdjustmentSubjectId: values.priorYearAdjustmentSubjectId,
        adjustmentClosingSubjectId: values.adjustmentClosingSubjectId,
        otherClosingSubjectId: values.otherClosingSubjectId,
        reverseBalance: Boolean(values.reverseBalance),
        closingDay: dayjs(values.voucherDate).date()
      })
      if (resp.code === 0) {
        message.success('保存成功')
        setVisible(false)
        onSuccess?.()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="结转损益参数设置"
      open={visible}
      width={680}
      confirmLoading={submitting}
      onOk={submitForm}
      onCancel={() => setVisible(false)}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ flex: '220px' }}>
        <Form.Item
          label="凭证日期"
          name="voucherDate"
          rules={[{ required: true, message: '请选择凭证日期' }]}
        >
          <DatePicker
            format="YYYY年MM月DD日"
            allowClear={false}
            disabledDate={(date) => date.format('YYYY-MM') !== month}
          />
        </Form.Item>
        <Form.Item
          label="凭证字"
          name="voucherWordId"
          rules={[{ required: true, message: '凭证字不能为空' }]}
        >
          <FmsVoucherWordSelect options={voucherWords} style={{ width: 260 }} />
        </Form.Item>
        <Form.Item
          label="凭证摘要"
          name="digest"
          rules={[{ required: true, message: '凭证摘要不能为空' }]}
        >
          <Input placeholder="请输入凭证摘要" style={{ width: 360 }} />
        </Form.Item>
        <Form.Item
          label="凭证分类"
          name="voucherType"
          rules={[{ required: true, message: '凭证分类不能为空' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              {voucherTypeOptions.map((item) => (
                <Radio key={String(item.value)} value={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="“以前年度损益调整”科目"
          name="priorYearAdjustmentSubjectId"
          rules={[{ required: true, message: '以前年度损益调整科目不能为空' }]}
        >
          <FmsSubjectSelect
            options={profitLossSubjects}
            placeholder="请选择科目"
            style={{ width: 360 }}
          />
        </Form.Item>
        <Form.Item
          label="“以前年度损益调整”结转科目"
          name="adjustmentClosingSubjectId"
          rules={[{ required: true, message: '以前年度损益调整结转科目不能为空' }]}
        >
          <FmsSubjectSelect
            options={closingSubjects}
            placeholder="请选择科目"
            style={{ width: 360 }}
          />
        </Form.Item>
        <Form.Item
          label="其他损益科目的结转科目"
          name="otherClosingSubjectId"
          rules={[{ required: true, message: '其他损益结转科目不能为空' }]}
        >
          <FmsSubjectSelect
            options={closingSubjects}
            placeholder="请选择科目"
            style={{ width: 360 }}
          />
        </Form.Item>
        <Form.Item name="reverseBalance" valuePropName="checked" wrapperCol={{ offset: 2 }}>
          <Checkbox>
            结转方式：按余额反向结转{' '}
            <Tooltip
              title={
                <>
                  选中时按科目实际余额的相反方向结转
                  <br />
                  未选中时按科目属性中定义的余额方向反向结转
                </>
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
})

ProfitLossSettingsForm.displayName = 'ProfitLossSettingsForm'

export default ProfitLossSettingsForm
