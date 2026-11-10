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
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import {
  fmsClosingTemplateCreateClosingTemplate,
  fmsClosingTemplateUpdateClosingTemplate
} from '@/api/fms/closing/template'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import {
  FMS_CLOSING_TEMPLATE_CATEGORY,
  FMS_CLOSING_TEMPLATE_CATEGORY_OPTIONS,
  FMS_CLOSING_TIME_TYPE_OPTIONS,
  FMS_DEBIT_CREDIT_DIRECTION,
  FMS_FORMULA_RULE_OPTIONS
} from '@/pages/fms/utils/constants'

export interface ClosingTemplateFormRef {
  open: (
    type: 'create' | 'update',
    template?: API.FmsClosingTemplateRespVO,
    category?: number
  ) => void
}

interface ClosingTemplateFormProps {
  accountSetId: number
  subjects: API.FmsSubjectRespVO[]
  onSuccess?: () => void
}

interface SubjectRuleRow extends API.SubjectRule {
  _key: string
}

const ClosingTemplateForm = forwardRef<ClosingTemplateFormRef, ClosingTemplateFormProps>(
  ({ accountSetId, subjects, onSuccess }, ref) => {
    const categoryOptions = FMS_CLOSING_TEMPLATE_CATEGORY_OPTIONS
    const formulaRuleOptions = FMS_FORMULA_RULE_OPTIONS.slice(0, 3)
    const timeTypeOptions = FMS_CLOSING_TIME_TYPE_OPTIONS

    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formType, setFormType] = useState<'create' | 'update'>('create')
    const [templateId, setTemplateId] = useState<number>()
    const [subjectRules, setSubjectRules] = useState<SubjectRuleRow[]>([])

    useImperativeHandle(ref, () => ({
      open: (type, template, category = FMS_CLOSING_TEMPLATE_CATEGORY.DAILY_EXPENSE) => {
        setFormType(type)
        form.resetFields()
        if (template) {
          setTemplateId(template.id)
          form.setFieldsValue({
            name: template.name,
            category: template.category ?? category,
            sort: template.sort ?? 0,
            subjectId: template.subjectId,
            formulaRule: template.formulaRule,
            timeType: template.timeType,
            periodEnd: template.periodEnd ?? true
          })
          setSubjectRules(
            (template.subjects || []).map((item, idx) => ({
              ...item,
              _key: `tpl-${idx}-${Date.now()}`
            }))
          )
        } else {
          setTemplateId(undefined)
          form.setFieldsValue({
            name: '',
            category,
            sort: 0,
            subjectId: undefined,
            formulaRule: undefined,
            timeType: undefined,
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

      const payload: API.FmsClosingTemplateSaveReqVO = {
        id: templateId,
        accountSetId,
        name: values.name,
        category: values.category,
        sort: values.sort,
        subjectId: values.subjectId,
        formulaRule: values.formulaRule,
        timeType: values.timeType,
        periodEnd: Boolean(values.periodEnd),
        subjects: subjectRules.map(({ _key, ...rest }) => rest)
      }

      setSubmitting(true)
      try {
        const resp =
          formType === 'update'
            ? await fmsClosingTemplateUpdateClosingTemplate(payload)
            : await fmsClosingTemplateCreateClosingTemplate(payload)
        if (resp.code === 0) {
          message.success(formType === 'update' ? '修改成功' : '新增成功')
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
        title={formType === 'create' ? '新增结账模板' : '编辑结账模板'}
        open={visible}
        width={920}
        confirmLoading={submitting}
        onOk={submitForm}
        onCancel={() => setVisible(false)}
        destroyOnHidden
      >
        <Form form={form} labelCol={{ flex: '90px' }}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="模板名称"
                name="name"
                rules={[{ required: true, message: '模板名称不能为空' }]}
              >
                <Input maxLength={255} placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="模板分类"
                name="category"
                rules={[{ required: true, message: '模板分类不能为空' }]}
              >
                <Select options={categoryOptions} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="显示顺序"
                name="sort"
                rules={[{ required: true, message: '显示顺序不能为空' }]}
              >
                <InputNumber min={0} controls={false} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={10}>
              <Form.Item label="来源科目" name="subjectId">
                <FmsSubjectSelect
                  options={subjects}
                  allowClear
                  placeholder="可在使用模板时补充"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="取数规则" name="formulaRule">
                <Select allowClear options={formulaRuleOptions} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="时间类型" name="timeType">
                <Select allowClear options={timeTypeOptions} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="期末结转" name="periodEnd" valuePropName="checked">
            <Checkbox>用于期末结账前生成凭证</Checkbox>
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
          scroll={{ y: 360 }}
        />
      </Modal>
    )
  }
)

ClosingTemplateForm.displayName = 'ClosingTemplateForm'

export default ClosingTemplateForm
