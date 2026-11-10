import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Form, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DownloadOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  fmsLedgerExportAuxiliaryBalance,
  fmsLedgerGetAuxiliaryBalanceList
} from '@/api/fms/ledger'
import HasPermi from '@/directives/permission/HasPermi'
import download from '@/utils/download'
import FmsAuxiliaryItemSelect from '@/pages/fms/config/auxiliary/components/FmsAuxiliaryItemSelect'
import FmsAuxiliaryTypeSelect from '@/pages/fms/config/auxiliary/components/FmsAuxiliaryTypeSelect'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsLedgerMonthRangePicker from '@/pages/fms/ledger/components/FmsLedgerMonthRangePicker'
import FmsLedgerPrintButton from '@/pages/fms/ledger/components/FmsLedgerPrintButton'
import { useFmsStore } from '@/pages/fms/store/fms'
import { buildPeriodFilename, formatMoney } from '@/pages/fms/utils/format'

const FmsAuxiliaryBalance: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerAuxiliaryBalanceRespVO[]>([])
  const [types, setTypes] = useState<API.FmsAuxiliaryTypeRespVO[]>([])
  const [monthRange, setMonthRange] = useState<[string, string]>([
    currentMonth,
    currentMonth
  ])
  const [auxiliaryTypeId, setAuxiliaryTypeId] = useState<number>(0)
  const [auxiliaryItemId, setAuxiliaryItemId] = useState<number | undefined>()
  const [subjectId, setSubjectId] = useState<number | undefined>()

  const getList = useCallback(
    async (
      customRange = monthRange,
      customTypeId = auxiliaryTypeId,
      customItemId = auxiliaryItemId,
      customSubjectId = subjectId
    ) => {
      if (!accountSetId || !customTypeId || customRange.length !== 2) return
      setLoading(true)
      try {
        const resp = await fmsLedgerGetAuxiliaryBalanceList({
          accountSetId: String(accountSetId),
          startMonth: customRange[0],
          endMonth: customRange[1],
          auxiliaryTypeId: String(customTypeId),
          auxiliaryItemId:
            customItemId !== undefined ? String(customItemId) : undefined,
          subjectId:
            customSubjectId !== undefined ? String(customSubjectId) : undefined
        })
        if (resp.code === 0) {
          setList(resp.data || [])
        }
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, monthRange, auxiliaryTypeId, auxiliaryItemId, subjectId]
  )

  useEffect(() => {
    const init = async () => {
      if (!accountSetId) {
        setList([])
        return
      }
      const accountingMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
      const nextRange: [string, string] = [accountingMonth, accountingMonth]
      setMonthRange(nextRange)
      if (auxiliaryTypeId) {
        await getList(nextRange, auxiliaryTypeId, auxiliaryItemId, subjectId)
      }
    }
    init()
  }, [accountSetId])

  const handleTypeLoaded = (typeList: API.FmsAuxiliaryTypeRespVO[]) => {
    setTypes(typeList)
    let targetTypeId = auxiliaryTypeId
    if (!typeList.some((t) => t.id === targetTypeId)) {
      targetTypeId = typeList[0]?.id || 0
      setAuxiliaryTypeId(targetTypeId)
      setAuxiliaryItemId(undefined)
    }
    if (targetTypeId) {
      getList(monthRange, targetTypeId, undefined, subjectId)
    }
  }

  const resetQuery = async () => {
    const accountingMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
    const nextRange: [string, string] = [accountingMonth, accountingMonth]
    const nextTypeId = types[0]?.id || 0
    setMonthRange(nextRange)
    setAuxiliaryTypeId(nextTypeId)
    setAuxiliaryItemId(undefined)
    setSubjectId(undefined)
    await getList(nextRange, nextTypeId, undefined, undefined)
  }

  const handleExport = async () => {
    if (!accountSetId || !auxiliaryTypeId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportAuxiliaryBalance(
        {
          accountSetId: String(accountSetId),
          startMonth: monthRange[0],
          endMonth: monthRange[1],
          auxiliaryTypeId: String(auxiliaryTypeId),
          auxiliaryItemId:
            auxiliaryItemId !== undefined ? String(auxiliaryItemId) : undefined,
          subjectId: subjectId !== undefined ? String(subjectId) : undefined
        },
        { responseType: 'blob' }
      )
      download.excel(
        data,
        buildPeriodFilename('核算项目余额表', monthRange[0], monthRange[1])
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsLedgerAuxiliaryBalanceRespVO> = [
    {
      title: '编码',
      dataIndex: 'code',
      align: 'center',
      width: 120,
      fixed: 'left'
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 180,
      fixed: 'left'
    },
    {
      title: '期初余额',
      children: [
        {
          title: '借方',
          dataIndex: 'openingDebitAmount',
          align: 'right',
          width: 130,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'openingCreditAmount',
          align: 'right',
          width: 130,
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
          width: 130,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'periodCreditAmount',
          align: 'right',
          width: 130,
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
          width: 130,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'yearCreditAmount',
          align: 'right',
          width: 130,
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
          width: 130,
          render: (val) => formatMoney(val)
        },
        {
          title: '贷方',
          dataIndex: 'endingCreditAmount',
          align: 'right',
          width: 130,
          render: (val) => formatMoney(val)
        }
      ]
    }
  ]

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card>
        <Form layout="inline" style={{ rowGap: 16 }}>
          <Form.Item label="会计期间">
            <FmsLedgerMonthRangePicker value={monthRange} onChange={setMonthRange} />
          </Form.Item>
          <Form.Item label="辅助类">
            <FmsAuxiliaryTypeSelect
              value={auxiliaryTypeId || undefined}
              allowClear={false}
              style={{ width: 240 }}
              onLoaded={handleTypeLoaded}
              onChange={(val) => {
                const nextTypeId = Number(val || 0)
                setAuxiliaryTypeId(nextTypeId)
                setAuxiliaryItemId(undefined)
                getList(monthRange, nextTypeId, undefined, subjectId)
              }}
            />
          </Form.Item>
          <Form.Item label="辅助项目">
            <FmsAuxiliaryItemSelect
              value={auxiliaryItemId}
              auxiliaryTypeId={auxiliaryTypeId}
              allowClear
              placeholder="全部辅助项目"
              style={{ width: 240 }}
              onChange={(val) => setAuxiliaryItemId(val as number | undefined)}
            />
          </Form.Item>
          <Form.Item label="科目">
            <FmsSubjectSelect
              value={subjectId}
              allowClear
              placeholder="全部科目"
              style={{ width: 240 }}
              onChange={(val) => setSubjectId(val as number | undefined)}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button icon={<SearchOutlined />} onClick={() => getList()}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetQuery}>
                重置
              </Button>
              <FmsLedgerPrintButton
                startMonth={monthRange[0]}
                endMonth={monthRange[1]}
                permissionPrefix="fms:ledger:subject-balance"
                target="fms-auxiliary-balance-table"
                title="核算项目余额表"
              />
              <HasPermi value="fms:ledger:subject-balance:export">
                <Button
                  icon={<DownloadOutlined />}
                  loading={exportLoading}
                  onClick={handleExport}
                >
                  导出
                </Button>
              </HasPermi>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <div id="fms-auxiliary-balance-table">
          <Table<API.FmsLedgerAuxiliaryBalanceRespVO>
            rowKey={(row, idx) => `${row.auxiliaryItemId || idx}`}
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

export default FmsAuxiliaryBalance
