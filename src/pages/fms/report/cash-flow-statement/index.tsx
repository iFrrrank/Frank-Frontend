import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  InputNumber,
  Space,
  Table,
  Tooltip,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DownloadOutlined,
  EditOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import {
  fmsCashFlowStatementCheckCashFlowStatement,
  fmsCashFlowStatementExportCashFlowStatement,
  fmsCashFlowStatementGetCashFlowAdjustmentList,
  fmsCashFlowStatementGetCashFlowStatement,
  fmsCashFlowStatementUpdateCashFlowAdjustment,
  fmsCashFlowStatementUpdateCashFlowStatement
} from '@/api/fms/report/cashFlowStatement'
import HasPermi from '@/directives/permission/HasPermi'
import download from '@/utils/download'
import FmsReportCheckAlert from '@/pages/fms/report/components/FmsReportCheckAlert'
import FmsReportFormulaForm, {
  type FmsReportFormulaFormRef
} from '@/pages/fms/report/components/FmsReportFormulaForm'
import FmsReportPeriodBar, {
  type FmsReportPeriodQuery
} from '@/pages/fms/report/components/FmsReportPeriodBar'
import FmsReportPrintButton from '@/pages/fms/report/components/FmsReportPrintButton'
import { useFmsStore } from '@/pages/fms/store/fms'
import { FMS_REPORT_TYPE } from '@/pages/fms/utils/constants'
import { formatMoney } from '@/pages/fms/utils/format'

function calculateAdjustmentLineAmount(
  formula: string,
  lineMap: Map<number, API.FmsCashFlowAdjustmentRespVO>,
  amountField: 'currentAmount' | 'yearAmount'
) {
  let expressions: unknown
  try {
    expressions = JSON.parse(formula)
  } catch {
    return 0
  }
  if (!Array.isArray(expressions) || typeof expressions[0] !== 'string') return 0
  let amount = 0
  for (const match of expressions[0].matchAll(/([+-]?)(L\d+)/g)) {
    const rowAmount = Number(
      lineMap.get(Number(match[2].slice(1)))?.[amountField] || 0
    )
    amount += match[1] === '-' ? -rowAmount : rowAmount
  }
  return Number(amount.toFixed(2))
}

function recalculateAdjustmentRows(
  rows: API.FmsCashFlowAdjustmentRespVO[]
): API.FmsCashFlowAdjustmentRespVO[] {
  const nextRows = rows.map((item) => ({ ...item }))
  const lineMap = new Map<number, API.FmsCashFlowAdjustmentRespVO>()
  nextRows.forEach((item) => {
    if (item.rowNo !== undefined) lineMap.set(item.rowNo, item)
  })
  nextRows.forEach((item) => {
    if (!item.formula?.includes('L')) return
    item.currentAmount = calculateAdjustmentLineAmount(
      item.formula,
      lineMap,
      'currentAmount'
    )
    item.yearAmount = calculateAdjustmentLineAmount(
      item.formula,
      lineMap,
      'yearAmount'
    )
    if (item.rowNo !== undefined) lineMap.set(item.rowNo, item)
  })
  return nextRows
}

function isAmountAdjustable(item: API.FmsReportItemRespVO) {
  return Boolean(item.rowNo && !item.formula?.includes('L'))
}

const FmsCashFlowStatement: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [adjustmentMode, setAdjustmentMode] = useState(false)
  const [statementAdjustmentMode, setStatementAdjustmentMode] = useState(false)
  const [list, setList] = useState<API.FmsReportItemRespVO[]>([])
  const [checkResult, setCheckResult] = useState<API.FmsCashFlowCheckRespVO>()
  const [adjustmentList, setAdjustmentList] = useState<
    API.FmsCashFlowAdjustmentRespVO[]
  >([])
  const [periodLabel, setPeriodLabel] = useState('')
  const [queryParams, setQueryParams] =
    useState<API.FmsCashFlowStatementGetCashFlowStatementParams>({
      accountSetId: '',
      startMonth: '',
      endMonth: ''
    })

  const formulaFormRef = useRef<FmsReportFormulaFormRef>(null)

  const getList = useCallback(
    async (params = queryParams) => {
      if (!accountSetId || !params.endMonth) {
        setList([])
        setCheckResult(undefined)
        return
      }
      setLoading(true)
      try {
        const reqParams = { ...params, accountSetId: String(accountSetId) }
        const [sheetResp, checkResp] = await Promise.all([
          fmsCashFlowStatementGetCashFlowStatement(reqParams),
          fmsCashFlowStatementCheckCashFlowStatement(reqParams)
        ])
        if (sheetResp.code === 0) setList(sheetResp.data || [])
        if (checkResp.code === 0) setCheckResult(checkResp.data)
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, queryParams]
  )

  const getAdjustmentList = useCallback(
    async (params = queryParams) => {
      if (!accountSetId || !params.endMonth) return
      setLoading(true)
      try {
        const resp = await fmsCashFlowStatementGetCashFlowAdjustmentList({
          ...params,
          accountSetId: String(accountSetId)
        })
        if (resp.code === 0) {
          setAdjustmentList(resp.data || [])
        }
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, queryParams]
  )

  useEffect(() => {
    setAdjustmentMode(false)
    setStatementAdjustmentMode(false)
    if (queryParams.endMonth) {
      getList()
    }
  }, [accountSetId])

  const handleQuery = async (value: FmsReportPeriodQuery) => {
    setPeriodLabel(value.label)
    const nextParams = {
      accountSetId: String(accountSetId || ''),
      startMonth: value.startMonth,
      endMonth: value.endMonth
    }
    setQueryParams(nextParams)
    await getList(nextParams)
  }

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsCashFlowStatementExportCashFlowStatement(
        { ...queryParams, accountSetId: String(accountSetId) },
        { responseType: 'blob' }
      )
      download.excel(data, `现金流量表-${periodLabel}.xls`)
    } finally {
      setExportLoading(false)
    }
  }

  const openAdjustment = async () => {
    setStatementAdjustmentMode(false)
    setAdjustmentMode(true)
    await getAdjustmentList()
  }

  const saveAdjustment = async (next = false) => {
    const items = adjustmentList
      .filter((item) => item.editable)
      .map((item) => ({
        id: item.id!,
        currentAmount: Number(item.currentAmount || 0),
        yearAmount: Number(item.yearAmount || 0)
      }))
    if (!accountSetId || !items.length) return
    setSubmitting(true)
    try {
      const resp = await fmsCashFlowStatementUpdateCashFlowAdjustment({
        accountSetId,
        items: items as any
      })
      if (resp.code === 0) {
        message.success('保存成功')
        setAdjustmentMode(false)
        setStatementAdjustmentMode(next)
        await getList()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const clearAdjustment = () => {
    setAdjustmentList((prev) =>
      recalculateAdjustmentRows(
        prev.map((item) =>
          item.editable ? { ...item, currentAmount: 0, yearAmount: 0 } : item
        )
      )
    )
  }

  const closeAdjustment = async () => {
    setAdjustmentMode(false)
    setAdjustmentList([])
    await getList()
  }

  const returnToAdjustment = async () => {
    setStatementAdjustmentMode(false)
    setAdjustmentMode(true)
    await getAdjustmentList()
  }

  const saveStatementAdjustment = async () => {
    const items = list
      .filter(isAmountAdjustable)
      .map(({ id, currentAmount, yearAmount }) => ({
        id: id!,
        currentAmount: Number(currentAmount || 0),
        yearAmount: Number(yearAmount || 0)
      }))
    if (!accountSetId || !items.length) return
    setSubmitting(true)
    try {
      const resp = await fmsCashFlowStatementUpdateCashFlowStatement({
        ...queryParams,
        accountSetId,
        items: items as any
      })
      if (resp.code === 0) {
        message.success('保存成功')
        setStatementAdjustmentMode(false)
        await getList()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const clearStatementAdjustment = () => {
    setList((prev) =>
      prev.map((item) =>
        isAmountAdjustable(item)
          ? { ...item, currentAmount: 0, yearAmount: 0 }
          : item
      )
    )
  }

  const updateAdjustmentCell = (
    id: number | undefined,
    field: 'currentAmount' | 'yearAmount',
    val: number | null
  ) => {
    setAdjustmentList((prev) =>
      recalculateAdjustmentRows(
        prev.map((item) =>
          item.id === id ? { ...item, [field]: Number(val || 0) } : item
        )
      )
    )
  }

  const updateStatementCell = (
    id: number | undefined,
    field: 'currentAmount' | 'yearAmount',
    val: number | null
  ) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: Number(val || 0) } : item
      )
    )
  }

  const columns: ColumnsType<any> = [
    {
      title: '项目',
      width: 480,
      render: (_, row) => (
        <div
          style={{
            display: 'flex',
            minHeight: 32,
            alignItems: 'center',
            paddingLeft: row.level === 2 ? 20 : row.level === 3 ? 40 : 0,
            fontWeight: !row.editable ? 600 : 400
          }}
        >
          <span>{row.name}</span>
          {adjustmentMode && row.remark && (
            <Tooltip title={row.remark}>
              <QuestionCircleOutlined style={{ marginLeft: 6, color: '#909399' }} />
            </Tooltip>
          )}
          {adjustmentMode && row.editable && fmsStore.isAccountSetWritable && (
            <HasPermi value="fms:report:cash-flow-statement:update">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                style={{ marginLeft: 8, padding: 0 }}
                onClick={() => formulaFormRef.current?.open(row, 'cash-flow')}
              />
            </HasPermi>
          )}
        </div>
      )
    },
    {
      title: '行次',
      width: 90,
      align: 'center',
      render: (_, row) => row.rowNo || ''
    },
    {
      title: adjustmentMode ? '本年数' : '本年累计金额',
      width: 180,
      align: 'right',
      render: (_, row) => {
        if (adjustmentMode && row.editable) {
          return (
            <InputNumber
              value={row.yearAmount}
              controls={false}
              precision={2}
              style={{ width: '100%' }}
              onChange={(val) => updateAdjustmentCell(row.id, 'yearAmount', val)}
            />
          )
        }
        if (statementAdjustmentMode && isAmountAdjustable(row)) {
          return (
            <InputNumber
              value={row.yearAmount}
              controls={false}
              precision={2}
              style={{ width: '100%' }}
              onChange={(val) => updateStatementCell(row.id, 'yearAmount', val)}
            />
          )
        }
        return <span>{formatMoney(row.yearAmount)}</span>
      }
    },
    {
      title: adjustmentMode ? '本期数' : '本期金额',
      width: 180,
      align: 'right',
      render: (_, row) => {
        if (adjustmentMode && row.editable) {
          return (
            <InputNumber
              value={row.currentAmount}
              controls={false}
              precision={2}
              style={{ width: '100%' }}
              onChange={(val) => updateAdjustmentCell(row.id, 'currentAmount', val)}
            />
          )
        }
        if (statementAdjustmentMode && isAmountAdjustable(row)) {
          return (
            <InputNumber
              value={row.currentAmount}
              controls={false}
              precision={2}
              style={{ width: '100%' }}
              onChange={(val) => updateStatementCell(row.id, 'currentAmount', val)}
            />
          )
        }
        return <span>{formatMoney(row.currentAmount)}</span>
      }
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        {statementAdjustmentMode || adjustmentMode ? (
          <Space wrap>
            {adjustmentMode && fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:report:cash-flow-statement:update">
                <Button
                  type="primary"
                  loading={submitting}
                  onClick={() => saveAdjustment(true)}
                >
                  下一步
                </Button>
                <Button disabled={submitting} onClick={clearAdjustment}>
                  清空并重算
                </Button>
              </HasPermi>
            )}
            {adjustmentMode && (
              <Button disabled={submitting} onClick={closeAdjustment}>
                返回
              </Button>
            )}
            {statementAdjustmentMode && fmsStore.isAccountSetWritable && (
              <>
                <HasPermi value="fms:report:cash-flow-statement:update">
                  <Button
                    type="primary"
                    loading={submitting}
                    onClick={saveStatementAdjustment}
                  >
                    保存
                  </Button>
                </HasPermi>
                <Button disabled={submitting} onClick={returnToAdjustment}>
                  上一步
                </Button>
                <HasPermi value="fms:report:cash-flow-statement:update">
                  <Button disabled={submitting} onClick={clearStatementAdjustment}>
                    清空并重算
                  </Button>
                </HasPermi>
              </>
            )}
            <HasPermi value="fms:report:cash-flow-statement:print">
              <FmsReportPrintButton
                disabled={!queryParams.endMonth || loading}
                periodLabel={periodLabel}
                target="fms-cash-flow-statement-table"
                title="现金流量表"
              />
            </HasPermi>
            <HasPermi value="fms:report:cash-flow-statement:export">
              <Button
                disabled={!queryParams.endMonth}
                loading={exportLoading}
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
            </HasPermi>
          </Space>
        ) : (
          <FmsReportPeriodBar onQuery={handleQuery}>
            <HasPermi value="fms:report:cash-flow-statement:print">
              <FmsReportPrintButton
                disabled={!queryParams.endMonth}
                periodLabel={periodLabel}
                target="fms-cash-flow-statement-table"
                title="现金流量表"
              />
            </HasPermi>
            <HasPermi value="fms:report:cash-flow-statement:export">
              <Button
                disabled={!queryParams.endMonth}
                loading={exportLoading}
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
            </HasPermi>
            {fmsStore.isAccountSetWritable && (
              <HasPermi value="fms:report:cash-flow-statement:update">
                <Button type="primary" onClick={openAdjustment}>
                  调整
                </Button>
              </HasPermi>
            )}
          </FmsReportPeriodBar>
        )}
      </Card>

      <Card>
        {!adjustmentMode && !statementAdjustmentMode && (
          <FmsReportCheckAlert
            result={checkResult}
            reportType={FMS_REPORT_TYPE.CASH_FLOW_STATEMENT}
          />
        )}
        {adjustmentMode && (
          <Alert
            style={{ marginBottom: 16 }}
            type="info"
            showIcon
            message="辅助数据用于现金流量表 EX 项取数；可编辑公式或直接调整本期、本年金额"
          />
        )}
        {statementAdjustmentMode && (
          <Alert
            style={{ marginBottom: 16 }}
            type="warning"
            showIcon
            message="可直接调整非行次公式项目；金额为 0 时重新按公式计算"
          />
        )}
        <div id="fms-cash-flow-statement-table">
          <Table<any>
            rowKey={(row, idx) => `${row.id || idx}`}
            loading={loading}
            dataSource={adjustmentMode ? adjustmentList : list}
            columns={columns}
            bordered
            pagination={false}
            scroll={{ y: 'calc(100vh - 300px)' }}
          />
        </div>
        {adjustmentMode && (
          <div style={{ padding: '12px 16px 0', textAlign: 'right', color: '#909399' }}>
            共 {adjustmentList.length} 条
          </div>
        )}
      </Card>

      <FmsReportFormulaForm ref={formulaFormRef} onSuccess={() => getAdjustmentList()} />
    </Space>
  )
}

export default FmsCashFlowStatement

