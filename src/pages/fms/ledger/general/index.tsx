import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import {
  fmsLedgerExportGeneral,
  fmsLedgerGetGeneralList
} from '@/api/fms/ledger'
import download from '@/utils/download'
import FmsLedgerSearchBar, {
  type FmsLedgerSearchQuery
} from '@/pages/fms/ledger/components/FmsLedgerSearchBar'
import { useFmsStore } from '@/pages/fms/store/fms'
import { buildPeriodFilename, formatMoney } from '@/pages/fms/utils/format'

const toGeneralApiParams = (
  accountSetId: number,
  query: FmsLedgerSearchQuery
): API.FmsLedgerGetGeneralListParams => ({
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

const FmsGeneralLedger: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerGeneralRespVO[]>([])
  const [queryParams, setQueryParams] = useState<FmsLedgerSearchQuery>({
    startMonth: currentMonth,
    endMonth: currentMonth,
    minLevel: 1,
    maxLevel: 1
  })

  const getList = useCallback(
    async (accSetId: number | undefined, params: FmsLedgerSearchQuery) => {
      if (!accSetId) return
      setLoading(true)
      try {
        const resp = await fmsLedgerGetGeneralList(
          toGeneralApiParams(accSetId, params)
        )
        if (resp.code === 0) {
          setList(resp.data || [])
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
        setList([])
        return
      }
      const accountingMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
      const nextParams: FmsLedgerSearchQuery = {
        startMonth: accountingMonth,
        endMonth: accountingMonth,
        minLevel: 1,
        maxLevel: 1
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
      ...value
    }
    setQueryParams(nextParams)
    getList(accountSetId, nextParams)
  }

  const openDetail = (row: API.FmsLedgerGeneralRespVO) => {
    history.push(
      `/fms/ledger/detail?subjectId=${row.subjectId}&startMonth=${queryParams.startMonth}&endMonth=${queryParams.endMonth}`
    )
  }

  /** 计算科目列合并行数 */
  const getSubjectRowSpan = (index: number) => {
    const subjectId = list[index]?.subjectId
    if (index > 0 && list[index - 1]?.subjectId === subjectId) return 0
    let rowSpan = 1
    while (list[index + rowSpan]?.subjectId === subjectId) {
      rowSpan++
    }
    return rowSpan
  }

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportGeneral(
        toGeneralApiParams(accountSetId, queryParams),
        { responseType: 'blob' }
      )
      download.excel(
        data,
        buildPeriodFilename('总账', queryParams.startMonth, queryParams.endMonth)
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsLedgerGeneralRespVO> = [
    {
      title: '科目编码',
      dataIndex: 'subjectCode',
      align: 'center',
      width: 125,
      onCell: (_, index) => ({
        rowSpan: index !== undefined ? getSubjectRowSpan(index) : 1
      }),
      render: (val, row) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => openDetail(row)}>
          {val}
        </Button>
      )
    },
    {
      title: '科目名称',
      dataIndex: 'subjectName',
      width: 160,
      onCell: (_, index) => ({
        rowSpan: index !== undefined ? getSubjectRowSpan(index) : 1
      })
    },
    {
      title: '期间',
      dataIndex: 'period',
      align: 'center',
      width: 100
    },
    {
      title: '摘要',
      dataIndex: 'digest',
      width: 150
    },
    {
      title: '借方',
      dataIndex: 'debitAmount',
      align: 'right',
      width: 140,
      render: (val) => formatMoney(val)
    },
    {
      title: '贷方',
      dataIndex: 'creditAmount',
      align: 'right',
      width: 140,
      render: (val) => formatMoney(val)
    },
    {
      title: '方向',
      dataIndex: 'balanceDirection',
      align: 'center',
      width: 80
    },
    {
      title: '余额',
      dataIndex: 'balance',
      align: 'right',
      width: 150,
      render: (val) => formatMoney(val)
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <FmsLedgerSearchBar
          startMonth={queryParams.startMonth}
          endMonth={queryParams.endMonth}
          exportLoading={exportLoading}
          permissionPrefix="fms:ledger:general"
          printTarget="fms-general-ledger-table"
          printTitle="总账"
          onExport={handleExport}
          onSearch={handleQuery}
        />
      </Card>

      <Card>
        <div id="fms-general-ledger-table">
          <Table<API.FmsLedgerGeneralRespVO>
            rowKey={(row, idx) => `${row.subjectId}-${row.period}-${idx}`}
            loading={loading}
            dataSource={list}
            columns={columns}
            bordered
            pagination={false}
            scroll={{ y: 'calc(100vh - 300px)' }}
          />
        </div>
      </Card>
    </Space>
  )
}

export default FmsGeneralLedger
