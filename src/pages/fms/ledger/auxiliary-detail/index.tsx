import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Empty, Form, Input, Space, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DownloadOutlined,
  LeftOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsAuxiliaryItemGetAuxiliaryItemSimpleList } from '@/api/fms/config/auxiliaryItem'
import {
  fmsLedgerExportAuxiliaryDetail,
  fmsLedgerGetAuxiliaryBalanceList,
  fmsLedgerGetAuxiliaryDetailList
} from '@/api/fms/ledger'
import HasPermi from '@/directives/permission/HasPermi'
import download from '@/utils/download'
import FmsAuxiliaryTypeSelect from '@/pages/fms/config/auxiliary/components/FmsAuxiliaryTypeSelect'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsLedgerMonthRangePicker from '@/pages/fms/ledger/components/FmsLedgerMonthRangePicker'
import FmsLedgerPrintButton from '@/pages/fms/ledger/components/FmsLedgerPrintButton'
import { useFmsStore } from '@/pages/fms/store/fms'
import { buildPeriodFilename, formatMoney } from '@/pages/fms/utils/format'

const FmsAuxiliaryDetailLedger: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const currentMonth = dayjs().format('YYYY-MM')

  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.FmsLedgerAuxiliaryDetailRespVO[]>([])
  const [types, setTypes] = useState<API.FmsAuxiliaryTypeRespVO[]>([])
  const [items, setItems] = useState<API.FmsAuxiliaryItemRespVO[]>([])
  const [dataItemIds, setDataItemIds] = useState<number[]>([])
  const [itemKeyword, setItemKeyword] = useState('')
  const [quickPanelCollapsed, setQuickPanelCollapsed] = useState(false)

  const [monthRange, setMonthRange] = useState<[string, string]>([
    currentMonth,
    currentMonth
  ])
  const [auxiliaryTypeId, setAuxiliaryTypeId] = useState<number>(0)
  const [auxiliaryItemId, setAuxiliaryItemId] = useState<number>(0)
  const [subjectId, setSubjectId] = useState<number | undefined>()

  const selectedType = useMemo(
    () => types.find((t) => t.id === auxiliaryTypeId),
    [types, auxiliaryTypeId]
  )
  const selectedItem = useMemo(
    () => items.find((item) => item.id === auxiliaryItemId),
    [items, auxiliaryItemId]
  )
  const selectedItemPrintText = useMemo(
    () =>
      selectedItem
        ? `辅助项目：${selectedType?.name || ''} ${selectedItem.code}_${selectedItem.name}`
        : '',
    [selectedItem, selectedType]
  )

  const filteredItems = useMemo(() => {
    const keyword = itemKeyword.trim().toLowerCase()
    return items
      .filter((item) => dataItemIds.includes(item.id!))
      .filter(
        (item) =>
          !keyword || `${item.code} ${item.name}`.toLowerCase().includes(keyword)
      )
  }, [items, dataItemIds, itemKeyword])

  const getList = useCallback(
    async (
      customRange: [string, string],
      customTypeId: number,
      customItemId: number,
      customSubjectId?: number
    ) => {
      if (!accountSetId || !customItemId || customRange.length !== 2) {
        setList([])
        return
      }
      setLoading(true)
      try {
        const resp = await fmsLedgerGetAuxiliaryDetailList({
          accountSetId: String(accountSetId),
          startMonth: customRange[0],
          endMonth: customRange[1],
          auxiliaryTypeId: String(customTypeId),
          auxiliaryItemId: String(customItemId),
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
    [accountSetId]
  )

  const loadItems = useCallback(
    async (
      customRange = monthRange,
      customTypeId = auxiliaryTypeId,
      customSubjectId = subjectId
    ) => {
      setList([])
      setItems([])
      setDataItemIds([])
      setAuxiliaryItemId(0)
      if (!accountSetId || !customTypeId) return

      const [itemsResp, balancesResp] = await Promise.all([
        fmsAuxiliaryItemGetAuxiliaryItemSimpleList({
          accountSetId,
          auxiliaryTypeId: customTypeId
        }),
        fmsLedgerGetAuxiliaryBalanceList({
          accountSetId: String(accountSetId),
          startMonth: customRange[0],
          endMonth: customRange[1],
          auxiliaryTypeId: String(customTypeId),
          subjectId:
            customSubjectId !== undefined ? String(customSubjectId) : undefined
        })
      ])

      const itemList = itemsResp.code === 0 ? itemsResp.data || [] : []
      const balances = balancesResp.code === 0 ? balancesResp.data || [] : []
      setItems(itemList)

      const activeIds = balances
        .filter(
          (b) =>
            Number(b.periodDebitAmount || 0) !== 0 ||
            Number(b.periodCreditAmount || 0) !== 0
        )
        .map((b) => b.auxiliaryItemId!)
      setDataItemIds(activeIds)

      const firstItemId = activeIds[0] || 0
      setAuxiliaryItemId(firstItemId)
      await getList(customRange, customTypeId, firstItemId, customSubjectId)
    },
    [accountSetId, monthRange, auxiliaryTypeId, subjectId, getList]
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
        await loadItems(nextRange, auxiliaryTypeId, subjectId)
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
    }
    if (targetTypeId) {
      loadItems(monthRange, targetTypeId, subjectId)
    }
  }

  const resetQuery = async () => {
    const accountingMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
    const nextRange: [string, string] = [accountingMonth, accountingMonth]
    const nextTypeId = types[0]?.id || 0
    setMonthRange(nextRange)
    setAuxiliaryTypeId(nextTypeId)
    setSubjectId(undefined)
    setItemKeyword('')
    await loadItems(nextRange, nextTypeId, undefined)
  }

  const handleExport = async () => {
    if (!accountSetId || !auxiliaryItemId) return
    setExportLoading(true)
    try {
      const data = await fmsLedgerExportAuxiliaryDetail(
        {
          accountSetId: String(accountSetId),
          startMonth: monthRange[0],
          endMonth: monthRange[1],
          auxiliaryTypeId: String(auxiliaryTypeId),
          auxiliaryItemId: String(auxiliaryItemId),
          subjectId: subjectId !== undefined ? String(subjectId) : undefined
        },
        { responseType: 'blob' }
      )
      download.excel(
        data,
        buildPeriodFilename('核算项目明细账', monthRange[0], monthRange[1])
      )
    } finally {
      setExportLoading(false)
    }
  }

  const columns: ColumnsType<API.FmsLedgerAuxiliaryDetailRespVO> = [
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
                setItemKeyword('')
                loadItems(monthRange, nextTypeId, subjectId)
              }}
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
              <Button icon={<SearchOutlined />} onClick={() => loadItems()}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetQuery}>
                重置
              </Button>
              <FmsLedgerPrintButton
                centerText={selectedItemPrintText}
                startMonth={monthRange[0]}
                endMonth={monthRange[1]}
                permissionPrefix="fms:ledger:detail"
                target="fms-auxiliary-detail-ledger-table"
                title="核算项目明细账"
              />
              <HasPermi value="fms:ledger:detail:export">
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
        {selectedItem && (
          <div style={{ paddingBottom: 12, fontWeight: 600 }}>
            {selectedType?.name}：{selectedItem.code}_{selectedItem.name}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
          <div id="fms-auxiliary-detail-ledger-table" style={{ flex: 1, minWidth: 0 }}>
            <Table<API.FmsLedgerAuxiliaryDetailRespVO>
              rowKey={(row, idx) => `${row.voucherId || idx}-${row.accountDate}-${idx}`}
              loading={loading}
              dataSource={list}
              columns={columns}
              bordered
              pagination={false}
              scroll={{ y: 'calc(100vh - 350px)' }}
              onRow={(row) => ({
                style:
                  row.rowType === 2
                    ? undefined
                    : { backgroundColor: '#f5f7fa', fontWeight: 600 }
              })}
            />
          </div>

          {!quickPanelCollapsed ? (
            <div
              style={{
                height: 'calc(100vh - 300px)',
                flex: '0 0 240px',
                borderLeft: '1px solid #ebeef5',
                paddingLeft: 14
              }}
            >
              <div
                style={{
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>快捷项目</span>
                <Tooltip title="收起快捷项目">
                  <Button
                    shape="circle"
                    size="small"
                    icon={<RightOutlined />}
                    onClick={() => setQuickPanelCollapsed(true)}
                  />
                </Tooltip>
              </div>
              <Input
                allowClear
                placeholder="搜索辅助项目"
                prefix={<SearchOutlined />}
                value={itemKeyword}
                onChange={(e) => setItemKeyword(e.target.value)}
              />
              <div
                style={{
                  marginTop: 12,
                  height: 'calc(100% - 80px)',
                  overflow: 'auto'
                }}
              >
                {filteredItems.map((item) => {
                  const active = item.id === auxiliaryItemId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      style={{
                        display: 'flex',
                        width: '100%',
                        cursor: 'pointer',
                        flexDirection: 'column',
                        gap: 3,
                        borderRadius: 4,
                        border: 0,
                        background: active ? '#e6f4ff' : 'transparent',
                        padding: '9px 10px',
                        textAlign: 'left',
                        color: active ? '#1677ff' : '#606266'
                      }}
                      onClick={() => {
                        setAuxiliaryItemId(item.id!)
                        getList(monthRange, auxiliaryTypeId, item.id!, subjectId)
                      }}
                    >
                      <span>{item.code}</span>
                      <span>{item.name}</span>
                    </button>
                  )
                })}
                {filteredItems.length === 0 && (
                  <Empty description="暂无辅助项目" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                height: 'calc(100vh - 300px)',
                flex: '0 0 36px',
                borderLeft: '1px solid #ebeef5',
                paddingLeft: 8
              }}
            >
              <Tooltip title="展开快捷项目">
                <Button
                  shape="circle"
                  size="small"
                  icon={<LeftOutlined />}
                  onClick={() => setQuickPanelCollapsed(false)}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </Card>
    </Space>
  )
}

export default FmsAuxiliaryDetailLedger

