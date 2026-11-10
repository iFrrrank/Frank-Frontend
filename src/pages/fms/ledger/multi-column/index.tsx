import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import {
  fmsLedgerExportMultiColumn,
  fmsLedgerGetMultiColumn
} from '@/api/fms/ledger'
import HasPermi from '@/directives/permission/HasPermi'
import download from '@/utils/download'
import { handleTree, treeToList } from '@/utils/tree'
import type { SubjectNode } from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsLedgerSearchBar, {
  type FmsLedgerSearchQuery
} from '@/pages/fms/ledger/components/FmsLedgerSearchBar'
import { useFmsStore } from '@/pages/fms/store/fms'
import { buildPeriodFilename, formatMoney } from '@/pages/fms/utils/format'

function filterParentSubjects(items: SubjectNode[]): SubjectNode[] {
  return items.flatMap((item) =>
    item.children?.length
      ? [{ ...item, children: filterParentSubjects(item.children) }]
      : []
  )
}

const toMultiColumnApiParams = (
  accountSetId: number,
  query: FmsLedgerSearchQuery
): API.FmsLedgerGetMultiColumnParams => ({
  accountSetId: String(accountSetId),
  startMonth: query.startMonth,
  endMonth: query.endMonth,
  subjectId: query.subjectId !== undefined ? String(query.subjectId) : undefined,
  startSubjectId:
    query.startSubjectId !== undefined ? String(query.startSubjectId) : undefined,
  endSubjectId:
    query.endSubjectId !== undefined ? String(query.endSubjectId) : undefined,
  minLevel: query.minLevel !== undefined ? String(query.minLevel) : undefined,
  maxLevel: query.maxLevel !== undefined ? String(query.maxLevel) : undefined
})

const FmsMultiColumnLedger: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [subjects, setSubjects] = useState<SubjectNode[]>([])
  const [result, setResult] = useState<API.FmsLedgerMultiColumnRespVO>({
    columns: [],
    rows: []
  })
  const [queryParams, setQueryParams] = useState<FmsLedgerSearchQuery>({
    startMonth: currentMonth,
    endMonth: currentMonth,
    subjectId: 0
  })

  const multiColumnSubjects = useMemo(() => filterParentSubjects(subjects), [subjects])
  const debitColumns = useMemo(
    () => (result.columns || []).filter((col) => col.balanceDirection === 1),
    [result.columns]
  )
  const creditColumns = useMemo(
    () => (result.columns || []).filter((col) => col.balanceDirection === 2),
    [result.columns]
  )

  const getList = useCallback(
    async (accSetId: number | undefined, params: FmsLedgerSearchQuery) => {
      if (!accSetId || !params.subjectId) {
        setResult({ columns: [], rows: [] })
        return
      }
      setLoading(true)
      try {
        const resp = await fmsLedgerGetMultiColumn(
          toMultiColumnApiParams(accSetId, params)
        )
        if (resp.code === 0 && resp.data) {
          setResult(resp.data)
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const init = async () => {
      if (!accountSetId) {
        setSubjects([])
        setResult({ columns: [], rows: [] })
        return
      }
      const [subjectResp, accountingMonth] = await Promise.all([
        fmsSubjectGetSubjectSimpleList({ accountSetId: String(accountSetId) }),
        fmsStore.loadCurrentMonth()
      ])
      const tree = handleTree(
        subjectResp.code === 0 ? subjectResp.data || [] : []
      ) as SubjectNode[]
      setSubjects(tree)
      const parentTree = filterParentSubjects(tree)
      const firstSubId = treeToList(parentTree)[0]?.id || 0
      const targetMonth = accountingMonth || currentMonth
      const nextParams: FmsLedgerSearchQuery = {
        startMonth: targetMonth,
        endMonth: targetMonth,
        subjectId: firstSubId
      }
      setQueryParams(nextParams)
      await getList(accountSetId, nextParams)
    }
    init()
  }, [accountSetId])

  const handleQuery = (value: FmsLedgerSearchQuery) => {
    if (!accountSetId) return
    const nextParams: FmsLedgerSearchQuery = {
      ...queryParams,
      ...value,
      subjectId: value.subjectId || queryParams.subjectId
    }
    setQueryParams(nextParams)
    getList(accountSetId, nextParams)
  }

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportMultiColumn(
        toMultiColumnApiParams(accountSetId, queryParams),
        {
          responseType: 'blob'
        }
      )
      download.excel(
        data,
        buildPeriodFilename('多栏账', queryParams.startMonth, queryParams.endMonth)
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns = useMemo<ColumnsType<API.FmsLedgerDetailRespVO>>(() => {
    const baseCols: ColumnsType<API.FmsLedgerDetailRespVO> = [
      {
        title: '日期',
        dataIndex: 'accountDate',
        align: 'center',
        width: 110,
        fixed: 'left'
      },
      {
        title: '凭证字号',
        align: 'center',
        width: 110,
        fixed: 'left',
        render: (_, row) =>
          row.voucherId ? (
            <HasPermi value="fms:voucher:query">
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => history.push(`/fms/voucher/create?id=${row.voucherId}`)}
              >
                {row.voucherNumber}
              </Button>
            </HasPermi>
          ) : null
      },
      {
        title: '摘要',
        dataIndex: 'digest',
        width: 160,
        fixed: 'left'
      },
      {
        title: '借方',
        dataIndex: 'debitAmount',
        align: 'right',
        width: 125,
        render: (val) => formatMoney(val)
      },
      {
        title: '贷方',
        dataIndex: 'creditAmount',
        align: 'right',
        width: 125,
        render: (val) => formatMoney(val)
      },
      {
        title: '方向',
        dataIndex: 'balanceDirection',
        align: 'center',
        width: 70
      },
      {
        title: '余额',
        dataIndex: 'balance',
        align: 'right',
        width: 130,
        render: (val) => formatMoney(val)
      }
    ]

    if (debitColumns.length > 0) {
      baseCols.push({
        title: '借方',
        children: debitColumns.map((col) => ({
          title: `${col.subjectCode}/${col.subjectName}`,
          key: `debit-${col.subjectId}`,
          align: 'right' as const,
          width: 145,
          render: (_, row) =>
            formatMoney((row.columnAmounts as any)?.[col.subjectId!])
        }))
      })
    }

    if (creditColumns.length > 0) {
      baseCols.push({
        title: '贷方',
        children: creditColumns.map((col) => ({
          title: `${col.subjectCode}/${col.subjectName}`,
          key: `credit-${col.subjectId}`,
          align: 'right' as const,
          width: 145,
          render: (_, row) =>
            formatMoney((row.columnAmounts as any)?.[col.subjectId!])
        }))
      })
    }

    return baseCols
  }, [debitColumns, creditColumns])

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <FmsLedgerSearchBar
          startMonth={queryParams.startMonth}
          endMonth={queryParams.endMonth}
          subjectId={queryParams.subjectId}
          subjects={multiColumnSubjects}
          showSubject
          autoQuery
          exportLoading={exportLoading}
          permissionPrefix="fms:ledger:multi-column"
          printTarget="fms-multi-column-ledger-table"
          printTitle="多栏账"
          onExport={handleExport}
          onSearch={handleQuery}
        />
      </Card>

      <Card>
        <div id="fms-multi-column-ledger-table">
          <Table<API.FmsLedgerDetailRespVO>
            rowKey={(row, idx) => `${row.voucherId || idx}-${row.accountDate}-${idx}`}
            loading={loading}
            dataSource={result.rows || []}
            columns={columns}
            bordered
            pagination={false}
            scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
            onRow={(row) => ({
              style:
                row.rowType === 2
                  ? undefined
                  : { backgroundColor: '#f5f7fa', fontWeight: 600 }
            })}
          />
        </div>
      </Card>
    </Space>
  )
}

export default FmsMultiColumnLedger
