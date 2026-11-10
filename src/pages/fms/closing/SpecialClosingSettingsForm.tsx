import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { fmsClosingSchemeUpdateSpecialClosingSettings } from '@/api/fms/closing/scheme'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'
import { FMS_CLOSING_TYPE, FMS_DEBIT_CREDIT_DIRECTION } from '@/pages/fms/utils/constants'

export interface SpecialClosingSettingsFormRef {
  open: (scheme: API.FmsClosingSchemeRespVO) => void
}

interface SpecialClosingSettingsFormProps {
  accountSetId: number
  subjects: API.FmsSubjectRespVO[]
  voucherWords: API.FmsVoucherWordRespVO[]
  onSuccess?: () => void
}

interface SubjectRuleRow extends API.SubjectRule {
  _key: string
}

const SpecialClosingSettingsForm = forwardRef<
  SpecialClosingSettingsFormRef,
  SpecialClosingSettingsFormProps
>(({ accountSetId, subjects, voucherWords, onSuccess }, ref) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [schemeId, setSchemeId] = useState(0)
  const [schemeName, setSchemeName] = useState('专用结转')
  const [schemeType, setSchemeType] = useState<number>(FMS_CLOSING_TYPE.UNPAID_VAT)
  const [subjectRules, setSubjectRules] = useState<SubjectRuleRow[]>([])

  const ratioTip = useMemo(
    () =>
      schemeType === FMS_CLOSING_TYPE.UNPAID_VAT
        ? '转出未交增值税的借方和贷方比例必须分别等于 100%'
        : '借方和贷方比例必须相等，该比例同时作为本方案的计提税率',
    [schemeType]
  )

  useImperativeHandle(ref, () => ({
    open: (scheme) => {
      setSchemeId(scheme.id!)
      setSchemeName(scheme.name || '专用结转')
      setSchemeType(scheme.type ?? FMS_CLOSING_TYPE.UNPAID_VAT)
      form.resetFields()
      form.setFieldsValue({
        voucherWordId: scheme.voucherWordId
      })
      setSubjectRules(
        (scheme.subjects || []).map((item, idx) => ({
          ...item,
          _key: `spec-${idx}-${Date.now()}`
        }))
      )
      setVisible(true)
    }
  }))

  const addSubjectRule = (direction: number = FMS_DEBIT_CREDIT_DIRECTION.DEBIT) => {
    setSubjectRules((prev) => [
      ...prev,
      {
        _key: `add-${Date.now()}-${Math.random()}`,
        subjectId: undefined as any,
        digest: schemeName,
        direction,
        amountRatio: schemeType === FMS_CLOSING_TYPE.UNPAID_VAT ? 100 : 1
      }
    ])
  }

  const updateRuleRow = (key: string, patch: Partial<SubjectRuleRow>) => {
    setSubjectRules((prev) =>
      prev.map((row) => (row._key === key ? { ...row, ...patch } : row))
    )
  }

  const removeRuleRow = (key: string) => {
    setSubjectRules((prev) => prev.filter((row) => row._key !== key))
  }

  const submitForm = async () => {
    const values = await form.validateFields()
    if (
      subjectRules.length < 2 ||
      subjectRules.some((item) => !item.digest || !item.subjectId)
    ) {
      message.warning('请完整填写至少两条凭证分录规则')
      return
    }
    const debitRatio = subjectRules
      .filter((item) => item.direction === FMS_DEBIT_CREDIT_DIRECTION.DEBIT)
      .reduce((sum, item) => sum + Number(item.amountRatio || 0), 0)
    const creditRatio = subjectRules
      .filter((item) => item.direction === FMS_DEBIT_CREDIT_DIRECTION.CREDIT)
      .reduce((sum, item) => sum + Number(item.amountRatio || 0), 0)
    if (
      debitRatio <= 0 ||
      debitRatio > 100 ||
      Math.abs(debitRatio - creditRatio) > 0.001 ||
      (schemeType === FMS_CLOSING_TYPE.UNPAID_VAT && Math.abs(debitRatio - 100) > 0.001)
    ) {
      message.warning(ratioTip)
      return
    }

    setSubmitting(true)
    try {
      const resp = await fmsClosingSchemeUpdateSpecialClosingSettings({
        id: schemeId,
        accountSetId,
        voucherWordId: values.voucherWordId,
        subjects: subjectRules.map(({ _key, ...rest }) => rest)
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

  const columns: ColumnsType<SubjectRuleRow> = [
    {
      title: '摘要',
      width: 180,
      render: (_, row) => (
        <Input
          value={row.digest}
          placeholder="请输入摘要"
          onChange={(e) => updateRuleRow(row._key, { digest: e.target.value })}
        />
      )
    },
    {
      title: '借/贷',
      width: 105,
      render: (_, row) => (
        <Select
          value={row.direction}
          style={{ width: '100%' }}
          options={[
            { label: '借', value: FMS_DEBIT_CREDIT_DIRECTION.DEBIT },
            { label: '贷', value: FMS_DEBIT_CREDIT_DIRECTION.CREDIT }
          ]}
          onChange={(val) => updateRuleRow(row._key, { direction: val })}
        />
      )
    },
    {
      title: '科目',
      width: 280,
      render: (_, row) => (
        <FmsSubjectSelect
          value={row.subjectId}
          options={subjects}
          style={{ width: '100%' }}
          onChange={(val) => updateRuleRow(row._key, { subjectId: val as number })}
        />
      )
    },
    {
      title: '金额比例%',
      width: 130,
      render: (_, row) => (
        <InputNumber
          value={row.amountRatio}
          min={0.01}
          max={100}
          controls={false}
          precision={2}
          style={{ width: '100%' }}
          onChange={(val) => updateRuleRow(row._key, { amountRatio: Number(val || 0) })}
        />
      )
    },
    {
      title: '操作',
      width: 70,
      align: 'center',
      render: (_, row) => (
        <Button
          type="link"
          danger
          style={{ padding: 0 }}
          onClick={() => removeRuleRow(row._key)}
        >
          删除
        </Button>
      )
    }
  ]

  return (
    <Modal
      title={`编辑${schemeName}`}
      open={visible}
      width={880}
      confirmLoading={submitting}
      onOk={submitForm}
      onCancel={() => setVisible(false)}
      destroyOnHidden
    >
      <Form form={form} labelCol={{ flex: '90px' }}>
        <Form.Item
          label="凭证字"
          name="voucherWordId"
          rules={[{ required: true, message: '凭证字不能为空' }]}
        >
          <FmsVoucherWordSelect options={voucherWords} style={{ width: 260 }} />
        </Form.Item>
      </Form>

      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span style={{ fontWeight: 600 }}>凭证分录规则</span>
        <Button
          type="link"
          icon={<PlusOutlined />}
          style={{ padding: 0 }}
          onClick={() => addSubjectRule()}
        >
          添加分录
        </Button>
      </div>

      <Table<SubjectRuleRow>
        rowKey="_key"
        dataSource={subjectRules}
        columns={columns}
        bordered
        pagination={false}
        scroll={{ y: 420 }}
      />

      <Typography.Text type="secondary" style={{ marginTop: 10, display: 'block' }}>
        {ratioTip}
      </Typography.Text>
    </Modal>
  )
})

SpecialClosingSettingsForm.displayName = 'SpecialClosingSettingsForm'

export default SpecialClosingSettingsForm

