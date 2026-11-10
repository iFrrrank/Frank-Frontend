import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import {
  fmsLedgerExportQuantityDetail,
  fmsLedgerGetQuantityDetailList
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

function filterQuantitySubjects(subjects: SubjectNode[]): SubjectNode[] {
  return subjects.flatMap((subject) => {
    const children = filterQuantitySubjects(subject.children || [])
    return subject.quantityAccounting ? [{ ...subject, children }] : children
  })
}

const toQuantityDetailApiParams = (
  accountSetId: number,
  query: FmsLedgerSearchQuery
): API.FmsLedgerGetQuantityDetailListParams => ({
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

const FmsQuantityDetailLedger: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerQuantityDetailRespVO[]>([])
  const [quantitySubjects, setQuantitySubjects] = useState<SubjectNode[]>([])
  const [queryParams, setQueryParams] = useState<FmsLedgerSearchQuery>({
    startMonth: currentMonth,
    endMonth: currentMonth,
    subjectId: undefined
  })

  const getList = useCallback(
    async (accSetId: number | undefined, params: FmsLedgerSearchQuery) => {
      if (!accSetId || !params.subjectId) {
        setList([])
        return
      }
      setLoading(true)
      try {
        const resp = await fmsLedgerGetQuantityDetailList(
          toQuantityDetailApiParams(accSetId, params)
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
        setQuantitySubjects([])
        setList([])
        return
      }
      const [subjectResp, accountingMonth] = await Promise.all([
        fmsSubjectGetSubjectSimpleList({ accountSetId: String(accountSetId) }),
        fmsStore.loadCurrentMonth()
      ])
      const filteredTree = filterQuantitySubjects(
        handleTree(
          subjectResp.code === 0 ? subjectResp.data || [] : []
        ) as SubjectNode[]
      )
      setQuantitySubjects(filteredTree)
      const firstSubId = treeToList(filteredTree)[0]?.id
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
      ...value
    }
    setQueryParams(nextParams)
    getList(accountSetId, nextParams)
  }

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportQuantityDetail(
        toQuantityDetailApiParams(accountSetId, queryParams),
        {
          responseType: 'blob'
        }
      )
      download.excel(
        data,
        buildPeriodFilename('数量金额明细账', queryParams.startMonth, queryParams.endMonth)
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsLedgerQuantityDetailRespVO> = [
    {
      title: '日期',
      dataIndex: 'accountDate',
      align: 'center',
      width: 110
    },
    {
      title: '凭证字号',
      align: 'center',
      width: 110,
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
      width: 160
    },
    {
      title: '借方发生额',
      children: [
        {
          title: '数量',
          dataIndex: 'debitQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '单价',
          align: 'right',
          width: 110,
          render: (_, row) =>
            formatMoney(
              row.debitQuantity ? (row.debitAmount || 0) / row.debitQuantity : undefined
            )
        },
        {
          title: '金额',
          dataIndex: 'debitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '贷方发生额',
      children: [
        {
          title: '数量',
          dataIndex: 'creditQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '单价',
          align: 'right',
          width: 110,
          render: (_, row) =>
            formatMoney(
              row.creditQuantity ? (row.creditAmount || 0) / row.creditQuantity : undefined
            )
        },
        {
          title: '金额',
          dataIndex: 'creditAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '余额',
      children: [
        {
          title: '方向',
          dataIndex: 'balanceDirection',
          align: 'center',
          width: 70
        },
        {
          title: '数量',
          dataIndex: 'balanceQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '单价',
          align: 'right',
          width: 110,
          render: (_, row) =>
            formatMoney(
              row.balanceQuantity ? (row.balance || 0) / row.balanceQuantity : undefined
            )
        },
        {
          title: '金额',
          dataIndex: 'balance',
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
          subjectId={queryParams.subjectId}
          subjects={quantitySubjects}
          showSubject
          exportLoading={exportLoading}
          permissionPrefix="fms:ledger:detail"
          printTarget="fms-quantity-detail-ledger-table"
          printTitle="数量金额明细账"
          onExport={handleExport}
          onSearch={handleQuery}
        />
      </Card>

      <Card>
        <div id="fms-quantity-detail-ledger-table">
          <Table<API.FmsLedgerQuantityDetailRespVO>
            rowKey={(row, idx) => `${row.voucherId || idx}-${row.accountDate}-${idx}`}
            loading={loading}
            dataSource={list}
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

export default FmsQuantityDetailLedger

