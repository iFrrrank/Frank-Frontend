import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownloadOutlined, EditOutlined } from '@ant-design/icons'
import {
  fmsIncomeStatementCheckIncomeStatement,
  fmsIncomeStatementExportIncomeStatement,
  fmsIncomeStatementGetIncomeStatement
} from '@/api/fms/report/incomeStatement'
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

const FmsIncomeStatement: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsReportItemRespVO[]>([])
  const [checkResult, setCheckResult] = useState<API.FmsIncomeStatementCheckRespVO>()
  const [periodLabel, setPeriodLabel] = useState('')
  const [queryParams, setQueryParams] =
    useState<API.FmsIncomeStatementGetIncomeStatementParams>({
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
          fmsIncomeStatementGetIncomeStatement(reqParams),
          fmsIncomeStatementCheckIncomeStatement(reqParams)
        ])
        if (sheetResp.code === 0) setList(sheetResp.data || [])
        if (checkResp.code === 0) setCheckResult(checkResp.data)
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, queryParams]
  )

  useEffect(() => {
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
      const data = await fmsIncomeStatementExportIncomeStatement(
        { ...queryParams, accountSetId: String(accountSetId) },
        { responseType: 'blob' }
      )
      download.excel(data, `利润表-${periodLabel}.xls`)
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsReportItemRespVO> = [
    {
      title: '项目',
      width: 420,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              paddingLeft: row.level === 2 ? 20 : row.level === 3 ? 40 : 0,
              fontWeight: !row.editable ? 600 : 400
            }}
          >
            {row.name}
          </span>
          {row.editable && fmsStore.isAccountSetWritable && (
            <HasPermi value="fms:report:income-statement:update">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                title="编辑公式"
                style={{ padding: 0 }}
                onClick={() => formulaFormRef.current?.open(row, 'income')}
              />
            </HasPermi>
          )}
        </div>
      )
    },
    {
      title: '行次',
      dataIndex: 'rowNo',
      width: 90,
      align: 'center'
    },
    {
      title: '本年累计金额',
      dataIndex: 'yearAmount',
      width: 180,
      align: 'right',
      render: (val) => formatMoney(val)
    },
    {
      title: '本期金额',
      dataIndex: 'currentAmount',
      width: 180,
      align: 'right',
      render: (val) => formatMoney(val)
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <FmsReportPeriodBar onQuery={handleQuery}>
          <HasPermi value="fms:report:income-statement:print">
            <FmsReportPrintButton
              disabled={!queryParams.endMonth}
              periodLabel={periodLabel}
              target="fms-income-statement-table"
              title="利润表"
            />
          </HasPermi>
          <HasPermi value="fms:report:income-statement:export">
            <Button
              disabled={!queryParams.endMonth}
              loading={exportLoading}
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </HasPermi>
        </FmsReportPeriodBar>
      </Card>

      <Card>
        <FmsReportCheckAlert
          result={checkResult}
          reportType={FMS_REPORT_TYPE.INCOME_STATEMENT}
        />
        <div id="fms-income-statement-table">
          <Table<API.FmsReportItemRespVO>
            rowKey={(row, idx) => `${row.id || idx}`}
            loading={loading}
            dataSource={list}
            columns={columns}
            bordered
            pagination={false}
            scroll={{ y: 'calc(100vh - 300px)' }}
          />
        </div>
      </Card>

      <FmsReportFormulaForm ref={formulaFormRef} onSuccess={() => getList()} />
    </Space>
  )
}

export default FmsIncomeStatement

