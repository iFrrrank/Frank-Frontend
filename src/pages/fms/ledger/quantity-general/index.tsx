import React, { useCallback, useEffect, useState } from 'react'
import { Card, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import {
  fmsLedgerExportQuantityGeneral,
  fmsLedgerGetQuantityGeneralList
} from '@/api/fms/ledger'
import download from '@/utils/download'
import { treeToList } from '@/utils/tree'
import FmsLedgerSearchBar, {
  type FmsLedgerSearchQuery
} from '@/pages/fms/ledger/components/FmsLedgerSearchBar'
import { useFmsStore } from '@/pages/fms/store/fms'
import {
  FMS_SUBJECT_LEVEL_MAX,
  FMS_SUBJECT_LEVEL_MIN
} from '@/pages/fms/utils/constants'
import { buildPeriodFilename, formatMoney } from '@/pages/fms/utils/format'

const toQuantityGeneralApiParams = (
  accountSetId: number,
  query: FmsLedgerSearchQuery
): API.FmsLedgerGetQuantityGeneralListParams => ({
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

const FmsQuantityGeneralLedger: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerQuantityGeneralRespVO[]>([])
  const [queryParams, setQueryParams] = useState<FmsLedgerSearchQuery>({
    startMonth: currentMonth,
    endMonth: currentMonth,
    minLevel: FMS_SUBJECT_LEVEL_MIN,
    maxLevel: FMS_SUBJECT_LEVEL_MAX
  })

  const getList = useCallback(
    async (accSetId: number | undefined, params: FmsLedgerSearchQuery) => {
      if (!accSetId) return
      setLoading(true)
      try {
        const resp = await fmsLedgerGetQuantityGeneralList(
          toQuantityGeneralApiParams(accSetId, params)
        )
        if (resp.code === 0) {
          setList(treeToList(resp.data || []))
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
        minLevel: FMS_SUBJECT_LEVEL_MIN,
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

  const handleExport = async () => {
    if (!accountSetId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportQuantityGeneral(
        toQuantityGeneralApiParams(accountSetId, queryParams),
        {
          responseType: 'blob'
        }
      )
      download.excel(
        data,
        buildPeriodFilename('数量金额总账', queryParams.startMonth, queryParams.endMonth)
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsLedgerQuantityGeneralRespVO> = [
    {
      title: '科目编码',
      dataIndex: 'subjectCode',
      align: 'center',
      width: 125
    },
    {
      title: '科目名称',
      dataIndex: 'subjectName',
      width: 150
    },
    {
      title: '单位',
      dataIndex: 'quantityUnit',
      align: 'center',
      width: 80
    },
    {
      title: '期初余额',
      children: [
        {
          title: '方向',
          dataIndex: 'openingBalanceDirection',
          align: 'center',
          width: 70
        },
        {
          title: '数量',
          dataIndex: 'openingQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '单价',
          dataIndex: 'openingUnitPrice',
          align: 'right',
          width: 110,
          render: (val) => formatMoney(val)
        },
        {
          title: '金额',
          align: 'right',
          width: 125,
          render: (_, row) =>
            formatMoney(row.openingDebitAmount || row.openingCreditAmount)
        }
      ]
    },
    {
      title: '本期借方',
      children: [
        {
          title: '数量',
          dataIndex: 'periodDebitQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '金额',
          dataIndex: 'periodDebitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '本期贷方',
      children: [
        {
          title: '数量',
          dataIndex: 'periodCreditQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '金额',
          dataIndex: 'periodCreditAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '本年累计借方',
      children: [
        {
          title: '数量',
          dataIndex: 'yearDebitQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '金额',
          dataIndex: 'yearDebitAmount',
          align: 'right',
          width: 125,
          render: (val) => formatMoney(val)
        }
      ]
    },
    {
      title: '本年累计贷方',
      children: [
        {
          title: '数量',
          dataIndex: 'yearCreditQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '金额',
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
          title: '方向',
          dataIndex: 'endingBalanceDirection',
          align: 'center',
          width: 70
        },
        {
          title: '数量',
          dataIndex: 'endingQuantity',
          align: 'right',
          width: 105,
          render: (val) => formatMoney(val)
        },
        {
          title: '单价',
          dataIndex: 'endingUnitPrice',
          align: 'right',
          width: 110,
          render: (val) => formatMoney(val)
        },
        {
          title: '金额',
          align: 'right',
          width: 125,
          render: (_, row) =>
            formatMoney(row.endingDebitAmount || row.endingCreditAmount)
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
          permissionPrefix="fms:ledger:general"
          printTarget="fms-quantity-general-ledger-table"
          printTitle="数量金额总账"
          onExport={handleExport}
          onSearch={handleQuery}
        />
      </Card>

      <Card>
        <div id="fms-quantity-general-ledger-table">
          <Table<API.FmsLedgerQuantityGeneralRespVO>
            rowKey={(row, idx) => `${row.subjectId}-${idx}`}
            loading={loading}
            dataSource={list}
            columns={columns}
            bordered
            pagination={false}
            scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
          />
        </div>
      </Card>
    </Space>
  )
}

export default FmsQuantityGeneralLedger
