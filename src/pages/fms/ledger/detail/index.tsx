import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Input, Space, Table, Tree } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import { SearchOutlined } from '@ant-design/icons'
import { history, useSearchParams } from '@umijs/max'
import dayjs from 'dayjs'
import {
  fmsLedgerExportDetail,
  fmsLedgerGetDetailList,
  fmsLedgerGetDetailSubjectList
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

const toDetailApiParams = (
  accountSetId: number,
  query: FmsLedgerSearchQuery
): API.FmsLedgerGetDetailListParams => ({
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

const FmsDetailLedger: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const [searchParams] = useSearchParams()
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerDetailRespVO[]>([])
  const [subjects, setSubjects] = useState<SubjectNode[]>([])
  const [subjectKeyword, setSubjectKeyword] = useState('')
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
        const resp = await fmsLedgerGetDetailList(
          toDetailApiParams(accSetId, params)
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

  const loadSubjectTree = useCallback(
    async (
      currentAccSetId: number,
      startMonth: string,
      endMonth: string,
      preferredSubjectId?: number
    ) => {
      if (!currentAccSetId) {
        setSubjects([])
        return undefined
      }
      const resp = await fmsLedgerGetDetailSubjectList({
        accountSetId: String(currentAccSetId),
        startMonth,
        endMonth
      })
      const tree = handleTree(resp.code === 0 ? resp.data || [] : []) as SubjectNode[]
      setSubjects(tree)
      const subjectIds = treeToList(tree).map((s: API.FmsSubjectRespVO) => s.id)
      if (preferredSubjectId && subjectIds.includes(preferredSubjectId)) {
        return preferredSubjectId
      }
      return subjectIds[0]
    },
    []
  )

  useEffect(() => {
    const init = async () => {
      if (!accountSetId) {
        setSubjects([])
        setList([])
        return
      }
      const accountingMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
      const startMonth = searchParams.get('startMonth') || accountingMonth
      const endMonth = searchParams.get('endMonth') || accountingMonth
      const urlSubjectId = Number(searchParams.get('subjectId')) || undefined

      const targetSubjectId = await loadSubjectTree(
        accountSetId,
        startMonth,
        endMonth,
        urlSubjectId
      )
      const nextParams: FmsLedgerSearchQuery = {
        startMonth,
        endMonth,
        subjectId: targetSubjectId
      }
      setQueryParams(nextParams)
      await getList(accountSetId, nextParams)
    }
    init()
  }, [accountSetId])

  const handleQuery = async (value: FmsLedgerSearchQuery) => {
    if (!accountSetId) return
    const periodChanged =
      value.startMonth !== queryParams.startMonth || value.endMonth !== queryParams.endMonth
    let nextSubjectId = value.subjectId
    if (periodChanged) {
      nextSubjectId = await loadSubjectTree(
        accountSetId,
        value.startMonth,
        value.endMonth,
        value.subjectId
      )
    }
    const nextParams: FmsLedgerSearchQuery = {
      ...queryParams,
      ...value,
      subjectId: nextSubjectId
    }
    setQueryParams(nextParams)
    await getList(accountSetId, nextParams)
  }

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportDetail(
        toDetailApiParams(accountSetId, queryParams),
        { responseType: 'blob' }
      )
      download.excel(
        data,
        buildPeriodFilename('明细账', queryParams.startMonth, queryParams.endMonth)
      )
    } finally {
      setExportLoading(false)
    }
  }

  /** 构建过滤后的科目树节点 */
  const treeData = useMemo(() => {
    const keyword = subjectKeyword.trim().toLowerCase()
    const buildNodes = (items: SubjectNode[]): DataNode[] => {
      return items.flatMap((item) => {
        const children = item.children ? buildNodes(item.children) : []
        const label = `${item.code} ${item.name}`
        const matched = !keyword || label.toLowerCase().includes(keyword)
        if (matched || children.length > 0) {
          return [
            {
              key: item.id!,
              title: label,
              children
            }
          ]
        }
        return []
      })
    }
    return buildNodes(subjects)
  }, [subjects, subjectKeyword])

  const columns: ColumnsType<API.FmsLedgerDetailRespVO> = [
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
      width: 180
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
          subjectId={queryParams.subjectId}
          subjects={subjects}
          showSubject
          autoQuery
          exportLoading={exportLoading}
          permissionPrefix="fms:ledger:detail"
          printTarget="fms-detail-ledger-table"
          printTitle="明细账"
          onExport={handleExport}
          onSearch={handleQuery}
        />
      </Card>

      <Card>
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              height: 'calc(100vh - 280px)',
              flex: '0 0 260px',
              overflow: 'auto',
              borderRight: '1px solid #ebeef5',
              paddingRight: 14
            }}
          >
            <Input
              allowClear
              placeholder="搜索科目"
              prefix={<SearchOutlined />}
              value={subjectKeyword}
              onChange={(e) => setSubjectKeyword(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <Tree
              treeData={treeData}
              defaultExpandAll
              selectedKeys={queryParams.subjectId ? [queryParams.subjectId] : []}
              onSelect={(keys) => {
                if (keys[0] && accountSetId) {
                  const nextSubjectId = Number(keys[0])
                  const nextParams = { ...queryParams, subjectId: nextSubjectId }
                  setQueryParams(nextParams)
                  getList(accountSetId, nextParams)
                }
              }}
            />
          </div>

          <div id="fms-detail-ledger-table" style={{ flex: 1, minWidth: 0 }}>
            <Table<API.FmsLedgerDetailRespVO>
              rowKey={(row, idx) => `${row.voucherId || idx}-${row.accountDate}-${idx}`}
              loading={loading}
              dataSource={list}
              columns={columns}
              bordered
              pagination={false}
              scroll={{ y: 'calc(100vh - 335px)' }}
              onRow={(row) => ({
                style:
                  row.rowType === 2
                    ? undefined
                    : { backgroundColor: '#f5f7fa', fontWeight: 600 }
              })}
            />
          </div>
        </div>
      </Card>
    </Space>
  )
}

export default FmsDetailLedger
