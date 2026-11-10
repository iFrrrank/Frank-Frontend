import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownloadOutlined, EditOutlined } from '@ant-design/icons'
import {
  fmsBalanceSheetCheckBalanceSheet,
  fmsBalanceSheetExportBalanceSheet,
  fmsBalanceSheetGetBalanceSheet
} from '@/api/fms/report/balanceSheet'
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

const FmsBalanceSheet: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsBalanceSheetRowRespVO[]>([])
  const [checkResult, setCheckResult] = useState<API.FmsBalanceSheetCheckRespVO>()
  const [periodLabel, setPeriodLabel] = useState('')
  const [queryParams, setQueryParams] = useState<API.FmsBalanceSheetGetBalanceSheetParams>({
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
          fmsBalanceSheetGetBalanceSheet(reqParams),
          fmsBalanceSheetCheckBalanceSheet(reqParams)
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
      const data = await fmsBalanceSheetExportBalanceSheet(
        { ...queryParams, accountSetId: String(accountSetId) },
        { responseType: 'blob' }
      )
      download.excel(data, `资产负债表-${periodLabel}.xls`)
    } finally {
      setExportLoading(false)
    }
  }

  const getItemStyle = (
    level?: number,
    editable?: boolean,
    rowNo?: number
  ): React.CSSProperties => ({
    paddingLeft: level === 2 ? 16 : level === 3 ? 32 : 0,
    fontWeight: !editable && rowNo ? 600 : 400
  })

  const openFormula = (row: API.FmsBalanceSheetRowRespVO, asset: boolean) => {
    formulaFormRef.current?.open(
      {
        id: asset ? row.assetId : row.liabilityId,
        name: asset ? row.assetName : row.liabilityName,
        formula: asset ? row.assetFormula : row.liabilityFormula
      },
      'balance'
    )
  }

  const columns: ColumnsType<API.FmsBalanceSheetRowRespVO> = [
    {
      title: '资产',
      width: 210,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={getItemStyle(row.assetLevel, row.assetEditable, row.assetRowNo)}>
            {row.assetName}
          </span>
          {row.assetEditable && fmsStore.isAccountSetWritable && (
            <HasPermi value="fms:report:balance-sheet:update">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                title="编辑公式"
                style={{ padding: 0 }}
                onClick={() => openFormula(row, true)}
              />
            </HasPermi>
          )}
        </div>
      )
    },
    {
      title: '行次',
      width: 64,
      align: 'center',
      render: (_, row) => row.assetRowNo || ''
    },
    {
      title: '期末余额',
      width: 140,
      align: 'right',
      render: (_, row) => formatMoney(row.assetClosingAmount)
    },
    {
      title: '年初余额',
      width: 140,
      align: 'right',
      render: (_, row) => formatMoney(row.assetOpeningAmount)
    },
    {
      title: '负债和所有者权益',
      width: 250,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={getItemStyle(
              row.liabilityLevel,
              row.liabilityEditable,
              row.liabilityRowNo
            )}
          >
            {row.liabilityName}
          </span>
          {row.liabilityEditable && fmsStore.isAccountSetWritable && (
            <HasPermi value="fms:report:balance-sheet:update">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                title="编辑公式"
                style={{ padding: 0 }}
                onClick={() => openFormula(row, false)}
              />
            </HasPermi>
          )}
        </div>
      )
    },
    {
      title: '行次',
      width: 64,
      align: 'center',
      render: (_, row) => row.liabilityRowNo || ''
    },
    {
      title: '期末余额',
      width: 140,
      align: 'right',
      render: (_, row) => formatMoney(row.liabilityClosingAmount)
    },
    {
      title: '年初余额',
      width: 140,
      align: 'right',
      render: (_, row) => formatMoney(row.liabilityOpeningAmount)
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <FmsReportPeriodBar onQuery={handleQuery}>
          <HasPermi value="fms:report:balance-sheet:print">
            <FmsReportPrintButton
              disabled={!queryParams.endMonth}
              periodLabel={periodLabel}
              target="fms-balance-sheet-table"
              title="资产负债表"
            />
          </HasPermi>
          <HasPermi value="fms:report:balance-sheet:export">
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
          reportType={FMS_REPORT_TYPE.BALANCE_SHEET}
        />
        <div id="fms-balance-sheet-table">
          <Table<API.FmsBalanceSheetRowRespVO>
            rowKey={(row, idx) => `${row.assetId || ''}-${row.liabilityId || ''}-${idx}`}
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

export default FmsBalanceSheet

