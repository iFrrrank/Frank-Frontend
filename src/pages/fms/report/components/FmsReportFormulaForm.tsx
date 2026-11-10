import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Form,
  Modal,
  Radio,
  Select,
  Spin,
  Table,
  Tag,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import { fmsBalanceSheetUpdateBalanceSheetFormula } from '@/api/fms/report/balanceSheet'
import { fmsCashFlowStatementUpdateCashFlowAdjustmentFormula } from '@/api/fms/report/cashFlowStatement'
import { fmsIncomeStatementUpdateIncomeStatementFormula } from '@/api/fms/report/incomeStatement'
import { treeToList } from '@/utils/tree'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import { useFmsStore } from '@/pages/fms/store/fms'
import {
  FMS_FORMULA_RULE,
  FMS_FORMULA_RULE_OPTIONS,
  FMS_SUBJECT_STATUS
} from '@/pages/fms/utils/constants'
import { formatMoney } from '@/pages/fms/utils/format'

export type FormulaType = 'balance' | 'income' | 'cash-flow'

export interface FmsReportFormulaItem {
  subjectId?: number
  subjectName?: string
  subjectNumber?: string
  operator: '+' | '-'
  rules: number
  openingAmount?: number
  closingAmount?: number
  currentAmount?: number
  yearAmount?: number
}

export interface FmsReportFormulaFormRef {
  open: (
    item: { id?: number; name?: string; formula?: string },
    type: FormulaType
  ) => void
}

interface FmsReportFormulaFormProps {
  onSuccess?: () => void
}

function parseFormula(formula?: string): FmsReportFormulaItem[] {
  if (!formula) return []
  try {
    const values: unknown = JSON.parse(formula)
    if (!Array.isArray(values)) return []
    return values.filter(
      (item): item is FmsReportFormulaItem =>
        typeof item === 'object' && item !== null && 'subjectNumber' in item
    )
  } catch {
    return []
  }
}

const FmsReportFormulaForm = forwardRef<
  FmsReportFormulaFormRef,
  FmsReportFormulaFormProps
>(({ onSuccess }, ref) => {
  const fmsStore = useFmsStore()

  const balanceFormulaRuleOptions = useMemo(
    () =>
      FMS_FORMULA_RULE_OPTIONS.filter((item) =>
        [
          FMS_FORMULA_RULE.BALANCE,
          FMS_FORMULA_RULE.DEBIT_BALANCE,
          FMS_FORMULA_RULE.CREDIT_BALANCE
        ].some((rule) => rule === item.value)
      ),
    []
  )
  const incomeFormulaRuleOptions = useMemo(
    () =>
      FMS_FORMULA_RULE_OPTIONS.filter((item) =>
        [
          FMS_FORMULA_RULE.DEBIT_AMOUNT,
          FMS_FORMULA_RULE.CREDIT_AMOUNT,
          FMS_FORMULA_RULE.PROFIT_LOSS_AMOUNT
        ].some((rule) => rule === item.value)
      ),
    []
  )

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formulaType, setFormulaType] = useState<FormulaType>('balance')
  const [currentItem, setCurrentItem] = useState<{
    id?: number
    name?: string
    formula?: string
  }>()
  const [subjects, setSubjects] = useState<API.FmsSubjectRespVO[]>([])
  const [formulaList, setFormulaList] = useState<FmsReportFormulaItem[]>([])
  const [subjectId, setSubjectId] = useState<number>()
  const [rules, setRules] = useState<number>(FMS_FORMULA_RULE.BALANCE)
  const [operator, setOperator] = useState<'+' | '-'>('+')

  const enabledSubjects = useMemo(
    () => subjects.filter((s) => s.status === FMS_SUBJECT_STATUS.ENABLED),
    [subjects]
  )
  const ruleOptions = useMemo(
    () =>
      formulaType === 'balance' ? balanceFormulaRuleOptions : incomeFormulaRuleOptions,
    [formulaType, balanceFormulaRuleOptions, incomeFormulaRuleOptions]
  )

  useImperativeHandle(ref, () => ({
    open: async (item, type) => {
      const accountSetId = fmsStore.accountSetId
      if (!accountSetId) return
      setVisible(true)
      setLoading(true)
      setFormulaType(type)
      setCurrentItem(item)
      setSubjectId(undefined)
      setOperator('+')
      setRules(
        type === 'balance' ? FMS_FORMULA_RULE.BALANCE : FMS_FORMULA_RULE.DEBIT_AMOUNT
      )
      setFormulaList(parseFormula(item.formula))
      try {
        const resp = await fmsSubjectGetSubjectSimpleList({
          accountSetId: String(accountSetId)
        })
        if (resp.code === 0) {
          setSubjects(treeToList(resp.data || []))
        }
      } finally {
        setLoading(false)
      }
    }
  }))

  const addFormula = () => {
    const subject = subjects.find((item) => item.id === subjectId)
    if (!subject) {
      message.warning('请选择科目')
      return
    }
    if (formulaList.some((item) => item.subjectId === subject.id)) {
      message.warning('科目不能重复添加')
      return
    }
    setFormulaList((prev) => [
      {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectNumber: subject.code,
        operator,
        rules,
        openingAmount: 0,
        closingAmount: 0,
        currentAmount: 0,
        yearAmount: 0
      },
      ...prev
    ])
    setSubjectId(undefined)
  }

  const removeFormula = (index: number) => {
    setFormulaList((prev) => prev.filter((_, idx) => idx !== index))
  }

  const submitForm = async () => {
    const accountSetId = fmsStore.accountSetId
    if (!accountSetId || !currentItem?.id) return
    if (formulaList.some((item) => !item.subjectId)) {
      message.warning('公式中存在已失效科目，请删除后保存')
      return
    }
    setLoading(true)
    try {
      const payload: API.FmsReportFormulaUpdateReqVO = {
        accountSetId,
        id: currentItem.id,
        formulas: formulaList.map((item) => ({
          subjectId: item.subjectId!,
          operator: item.operator,
          rules: item.rules
        }))
      }
      const resp =
        formulaType === 'balance'
          ? await fmsBalanceSheetUpdateBalanceSheetFormula(payload)
          : formulaType === 'income'
            ? await fmsIncomeStatementUpdateIncomeStatementFormula(payload)
            : await fmsCashFlowStatementUpdateCashFlowAdjustmentFormula(payload)
      if (resp.code === 0) {
        message.success('保存成功')
        setVisible(false)
        onSuccess?.()
      }
    } finally {
      setLoading(false)
    }
  }

  const getRuleName = (val: number) => {
    return ruleOptions.find((item) => item.value === val)?.label || '-'
  }

  const columns: ColumnsType<FmsReportFormulaItem> = [
    {
      title: '科目',
      width: 240,
      render: (_, row) => (
        <>
          {row.subjectNumber} {row.subjectName}
          {!row.subjectId && (
            <Tag color="error" style={{ marginLeft: 6 }}>
              科目已失效
            </Tag>
          )}
        </>
      )
    },
    {
      title: '运算符号',
      dataIndex: 'operator',
      width: 90,
      align: 'center'
    },
    {
      title: '取数规则',
      width: 150,
      render: (_, row) => getRuleName(row.rules)
    },
    ...(formulaType === 'balance'
      ? [
          {
            title: '期末数',
            dataIndex: 'closingAmount',
            align: 'right' as const,
            render: (val: number) => formatMoney(val)
          },
          {
            title: '年初数',
            dataIndex: 'openingAmount',
            align: 'right' as const,
            render: (val: number) => formatMoney(val)
          }
        ]
      : [
          {
            title: '本期金额',
            dataIndex: 'currentAmount',
            align: 'right' as const,
            render: (val: number) => formatMoney(val)
          },
          {
            title: '本年累计金额',
            dataIndex: 'yearAmount',
            align: 'right' as const,
            render: (val: number) => formatMoney(val)
          }
        ]),
    {
      title: '操作',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <Button
          type="link"
          danger
          style={{ padding: 0 }}
          onClick={() => removeFormula(index)}
        >
          删除
        </Button>
      )
    }
  ]

  const calcTotal = (field: keyof FmsReportFormulaItem) => {
    const total = formulaList.reduce((acc, item) => {
      const amount = Number(item[field] || 0)
      return acc + (item.operator === '-' ? -amount : amount)
    }, 0)
    return formatMoney(total)
  }

  const firstField = formulaType === 'balance' ? 'closingAmount' : 'currentAmount'
  const secondField = formulaType === 'balance' ? 'openingAmount' : 'yearAmount'

  return (
    <Modal
      title={`编辑公式——${currentItem?.name || ''}`}
      open={visible}
      width={900}
      confirmLoading={loading}
      onOk={submitForm}
      onCancel={() => setVisible(false)}
      okText="保 存"
      cancelText="取 消"
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Form layout="inline" style={{ marginBottom: 12 }}>
          <Form.Item label="科目">
            <FmsSubjectSelect
              value={subjectId}
              options={enabledSubjects}
              style={{ width: 240 }}
              onChange={(val) => setSubjectId(val as number | undefined)}
            />
          </Form.Item>
          <Form.Item label="取数规则">
            <Select
              value={rules}
              options={ruleOptions}
              style={{ width: 140 }}
              onChange={setRules}
            />
          </Form.Item>
          <Form.Item label="运算符号">
            <Radio.Group value={operator} onChange={(e) => setOperator(e.target.value)}>
              <Radio value="+">+</Radio>
              <Radio value="-">-</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={addFormula}>
              添加
            </Button>
          </Form.Item>
        </Form>

        <Table<FmsReportFormulaItem>
          rowKey={(row, idx) => `${row.subjectId || row.subjectNumber}-${idx}`}
          dataSource={formulaList}
          columns={columns}
          bordered
          pagination={false}
          scroll={{ y: 320 }}
          summary={() => (
            <Table.Summary.Row style={{ fontWeight: 600 }}>
              <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
              <Table.Summary.Cell index={1} />
              <Table.Summary.Cell index={2} />
              <Table.Summary.Cell index={3} align="right">
                {calcTotal(firstField)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="right">
                {calcTotal(secondField)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} />
            </Table.Summary.Row>
          )}
        />

        <Alert
          style={{ marginTop: 16 }}
          type="warning"
          showIcon
          message={
            formulaType === 'balance'
              ? '新公式将应用于当前报表和以后尚未生成的报表，不影响其他已生成的历史报表'
              : '新公式仅应用于当前报表，不影响其他期间报表'
          }
        />
      </Spin>
    </Modal>
  )
})

FmsReportFormulaForm.displayName = 'FmsReportFormulaForm'

export default FmsReportFormulaForm
