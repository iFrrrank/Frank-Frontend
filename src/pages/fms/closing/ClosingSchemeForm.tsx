import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import {
  fmsClosingSchemeCreateClosingScheme,
  fmsClosingSchemeDeleteClosingScheme,
  fmsClosingSchemeUpdateClosingScheme
} from '@/api/fms/closing/scheme'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'
import {
  FMS_CLOSING_TIME_TYPE,
  FMS_CLOSING_TIME_TYPE_OPTIONS,
  FMS_DEBIT_CREDIT_DIRECTION,
  FMS_FORMULA_RULE,
  FMS_FORMULA_RULE_OPTIONS
} from '@/pages/fms/utils/constants'

export interface ClosingSchemeFormRef {
  open: (
    scheme?: API.FmsClosingSchemeRespVO,
    template?: API.FmsClosingTemplateRespVO
  ) => void
}

interface ClosingSchemeFormProps {
  accountSetId: number
  subjects: API.FmsSubjectRespVO[]
  voucherWords: API.FmsVoucherWordRespVO[]
  onSuccess?: () => void
}

interface SubjectRuleRow extends API.SubjectRule {
  _key: string
}

const ClosingSchemeForm = forwardRef<ClosingSchemeFormRef, ClosingSchemeFormProps>(
  ({ accountSetId, subjects, voucherWords, onSuccess }, ref) => {
    const formulaRuleOptions = FMS_FORMULA_RULE_OPTIONS.slice(0, 3)
    const timeTypeOptions = FMS_CLOSING_TIME_TYPE_OPTIONS

    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [schemeId, setSchemeId] = useState<number>()
    const [subjectRules, setSubjectRules] = useState<SubjectRuleRow[]>([])

    useImperativeHandle(ref, () => ({
      open: (scheme, template) => {
        form.resetFields()
        const defaultWordId =
          voucherWords.find((item) => item.defaultStatus)?.id || voucherWords[0]?.id

        if (scheme) {
          setSchemeId(scheme.id)
          form.setFieldsValue({
            name: scheme.name,
            voucherWordId: scheme.voucherWordId,
            subjectId: scheme.subjectId,
            formulaRule: scheme.formulaRule ?? FMS_FORMULA_RULE.BALANCE,
            timeType: scheme.timeType ?? FMS_CLOSING_TIME_TYPE.PERIOD_END,
            periodEnd: scheme.periodEnd ?? true
          })
          setSubjectRules(
            (scheme.subjects || []).map((item, idx) => ({
              ...item,
              _key: `scheme-${idx}-${Date.now()}`
            }))
          )
        } else if (template) {
          setSchemeId(undefined)
          form.setFieldsValue({
            name: template.name,
            voucherWordId: defaultWordId,
            subjectId: template.subjectId,
            formulaRule: template.formulaRule ?? FMS_FORMULA_RULE.BALANCE,
            timeType: template.timeType ?? FMS_CLOSING_TIME_TYPE.PERIOD_END,
            periodEnd: template.periodEnd ?? true
          })
          setSubjectRules(
            (template.subjects || []).map((item, idx) => ({
              ...item,
              _key: `tpl-${idx}-${Date.now()}`
            }))
          )
        } else {
          setSchemeId(undefined)
          form.setFieldsValue({
            name: '',
            voucherWordId: defaultWordId,
            subjectId: undefined,
            formulaRule: FMS_FORMULA_RULE.BALANCE,
            timeType: FMS_CLOSING_TIME_TYPE.PERIOD_END,
            periodEnd: true
          })
          setSubjectRules([
            {
              _key: `init-debit-${Date.now()}`,
              subjectId: undefined as any,
              digest: '期末结转',
              direction: FMS_DEBIT_CREDIT_DIRECTION.DEBIT,
              amountRatio: 100
            },
            {
              _key: `init-credit-${Date.now()}`,
              subjectId: undefined as any,
              digest: '期末结转',
              direction: FMS_DEBIT_CREDIT_DIRECTION.CREDIT,
              amountRatio: 100
            }
          ])
        }
        setVisible(true)
      }
    }))

    /** 添加凭证分录规则 */
    const addSubjectRule = (direction: number = FMS_DEBIT_CREDIT_DIRECTION.DEBIT) => {
      const currentName = form.getFieldValue('name')
      setSubjectRules((prev) => [
        ...prev,
        {
          _key: `add-${Date.now()}-${Math.random()}`,
          subjectId: undefined as any,
          digest: currentName || '期末结转',
          direction,
          amountRatio: 100
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

    /** 提交表单 */
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
      if (Math.abs(debitRatio - 100) > 0.001 || Math.abs(creditRatio - 100) > 0.001) {
        message.warning('借方和贷方的金额比例需要分别等于 100%')
        return
      }

      const payload: API.FmsClosingSchemeSaveReqVO = {
        id: schemeId,
        accountSetId,
        name: values.name,
        periodEnd: Boolean(values.periodEnd),
        subjectId: values.subjectId,
        formulaRule: values.formulaRule,
        timeType: values.timeType,
        voucherWordId: values.voucherWordId,
        subjects: subjectRules.map(({ _key, ...rest }) => rest)
      }

      setSubmitting(true)
      try {
        const resp = schemeId
          ? await fmsClosingSchemeUpdateClosingScheme(payload)
          : await fmsClosingSchemeCreateClosingScheme(payload)
        if (resp.code === 0) {
          message.success(schemeId ? '修改成功' : '创建成功')
          setVisible(false)
          onSuccess?.()
        }
      } finally {
        setSubmitting(false)
      }
    }

    /** 删除结账方案 */
    const deleteScheme = () => {
      if (!schemeId) return
      Modal.confirm({
        title: '系统提示',
        content: '确认删除该结账方案吗？',
        onOk: async () => {
          const resp = await fmsClosingSchemeDeleteClosingScheme({
            accountSetId,
            id: schemeId
          })
          if (resp.code === 0) {
            message.success('删除成功')
            setVisible(false)
            onSuccess?.()
          }
        }
      })
    }

    const columns: ColumnsType<SubjectRuleRow> = [
      {
        title: '摘要',
        width: 190,
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
        title={schemeId ? '编辑期末结转方案' : '新增期末结转方案'}
        open={visible}
        width={920}
        onCancel={() => setVisible(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {schemeId ? (
              <Button type="link" danger style={{ padding: 0 }} onClick={deleteScheme}>
                删除方案
              </Button>
            ) : (
              <span />
            )}
            <div>
              <Button type="primary" loading={submitting} onClick={submitForm}>
                确定
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setVisible(false)}>
                取消
              </Button>
            </div>
          </div>
        }
        destroyOnHidden
      >
        <Form form={form} labelCol={{ flex: '90px' }}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="方案名称"
                name="name"
                rules={[{ required: true, message: '方案名称不能为空' }]}
              >
                <Input placeholder="请输入方案名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="凭证字"
                name="voucherWordId"
                rules={[{ required: true, message: '凭证字不能为空' }]}
              >
                <FmsVoucherWordSelect options={voucherWords} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={10}>
              <Form.Item
                label="来源科目"
                name="subjectId"
                rules={[{ required: true, message: '来源科目不能为空' }]}
              >
                <FmsSubjectSelect
                  options={subjects}
                  placeholder="请选择来源科目"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label="取数规则"
                name="formulaRule"
                rules={[{ required: true, message: '取数规则不能为空' }]}
              >
                <Select options={formulaRuleOptions} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label="时间类型"
                name="timeType"
                rules={[{ required: true, message: '时间类型不能为空' }]}
              >
                <Select options={timeTypeOptions} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="期末结转" name="periodEnd" valuePropName="checked">
            <Checkbox>用于期末结账前生成凭证</Checkbox>
          </Form.Item>
        </Form>

        {/* 凭证分录规则 */}
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
          scroll={{ y: 360 }}
        />

        <Typography.Text type="secondary" style={{ marginTop: 10, display: 'block' }}>
          借方和贷方的金额比例需要分别等于 100%，科目规则随方案保存为 JSON
        </Typography.Text>
      </Modal>
    )
  }
)

ClosingSchemeForm.displayName = 'ClosingSchemeForm'

export default ClosingSchemeForm

