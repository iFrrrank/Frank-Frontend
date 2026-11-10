import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SwapOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import {
  fmsLedgerExportSubjectBalance,
  fmsLedgerGetSubjectBalanceList
} from '@/api/fms/ledger'
import download from '@/utils/download'
import { treeToList } from '@/utils/tree'
import FmsLedgerSearchBar, {
  type FmsLedgerSearchQuery
} from '@/pages/fms/ledger/components/FmsLedgerSearchBar'
import { useFmsStore } from '@/pages/fms/store/fms'
import {
  FMS_SUBJECT_BALANCE_NODE_TYPE,
  FMS_SUBJECT_LEVEL_MAX
} from '@/pages/fms/utils/constants'
import { buildPeriodFilename, formatMoney } from '@/pages/fms/utils/format'

const toSubjectBalanceApiParams = (
  accountSetId: number,
  query: FmsLedgerSearchQuery
): API.FmsLedgerGetSubjectBalanceListParams => ({
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

const FmsSubjectBalance: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerSubjectBalanceRespVO[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([])
  const [isExpandAll, setIsExpandAll] = useState(false)
  const [queryParams, setQueryParams] = useState<FmsLedgerSearchQuery>({
    startMonth: currentMonth,
    endMonth: currentMonth,
    minLevel: 1,
    maxLevel: FMS_SUBJECT_LEVEL_MAX
  })

  const getList = useCallback(
    async (accSetId: number | undefined, params: FmsLedgerSearchQuery) => {
      if (!accSetId) return
      setLoading(true)
      try {
        const resp = await fmsLedgerGetSubjectBalanceList(
          toSubjectBalanceApiParams(accSetId, params)
        )
        if (resp.code === 0) {
          setList(resp.data || [])
          setIsExpandAll(false)
          setExpandedRowKeys([])
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
        maxLevel: FMS_SUBJECT_LEVEL_MAX
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

  const getAllNodeKeys = useCallback(() => {
    return treeToList(list)
      .filter((item: API.FmsLedgerSubjectBalanceRespVO) => item.children?.length)
      .map((item: API.FmsLedgerSubjectBalanceRespVO) => item.nodeKey!)
  }, [list])

  const toggleExpandAll = () => {
    if (isExpandAll) {
      setIsExpandAll(false)
      setExpandedRowKeys([])
    } else {
      setIsExpandAll(true)
      setExpandedRowKeys(getAllNodeKeys())
    }
  }

  const expandBalanceForPrint = async () => {
    if (isExpandAll) return
    setIsExpandAll(true)
    setExpandedRowKeys(getAllNodeKeys())
  }

  const openDetail = (row: API.FmsLedgerSubjectBalanceRespVO) => {
    history.push(
      `/fms/ledger/detail?subjectId=${row.subjectId}&startMonth=${queryParams.startMonth}&endMonth=${queryParams.endMonth}`
    )
  }

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportSubjectBalance(
        toSubjectBalanceApiParams(accountSetId, queryParams),
        {
          responseType: 'blob'
        }
      )
      download.excel(
        data,
        buildPeriodFilename('科目余额表', queryParams.startMonth, queryParams.endMonth)
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsLedgerSubjectBalanceRespVO> = [
    {
      title: '科目编码',
      dataIndex: 'subjectCode',
      width: 150,
      render: (val, row) =>
        row.nodeType === FMS_SUBJECT_BALANCE_NODE_TYPE.SUBJECT ? (
          <Button type="link" style={{ padding: 0 }} onClick={() => openDetail(row)}>
            {val}
          </Button>
        ) : (
          <span>{val}</span>
        )
    },
    {
      title: '科目名称',
      dataIndex: 'subjectName',
      width: 180
    },
    {
      title: '期初余额',
      children: [
        {
          title: '借方',
          dataIndex: 'openingDebitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'openingCreditAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '本期发生额',
      children: [
        {
          title: '借方',
          dataIndex: 'periodDebitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'periodCreditAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '本年累计发生额',
      children: [
        {
          title: '借方',
          dataIndex: 'yearDebitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'yearCreditAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '期末余额',
      children: [
        {
          title: '借方',
          dataIndex: 'endingDebitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'endingCreditAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <FmsLedgerSearchBar
          startMonth={queryParams.startMonth}
          endMonth={queryParams.endMonth}
          maxLevel={FMS_SUBJECT_LEVEL_MAX}
          exportLoading={exportLoading}
          permissionPrefix="fms:ledger:subject-balance"
          beforePrint={expandBalanceForPrint}
          printTarget="fms-subject-balance-table"
          printTitle="科目余额表"
          onExport={handleExport}
          onSearch={handleQuery}
        >
          <Button danger ghost icon={<SwapOutlined />} onClick={toggleExpandAll}>
            展开/折叠
          </Button>
        </FmsLedgerSearchBar>
      </Card>

      <Card>
        <div id="fms-subject-balance-table">
          <Table<API.FmsLedgerSubjectBalanceRespVO>
            rowKey="nodeKey"
            loading={loading}
            dataSource={list}
            columns={columns}
            bordered
            pagination={false}
            expandable={{
              expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys])
            }}
            scroll={{ y: 'calc(100vh - 300px)' }}
          />
        </div>
      </Card>
    </Space>
  )
}

export default FmsSubjectBalance
