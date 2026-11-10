import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message
} from 'antd'
import {
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { fmsAccountSetGetAccountSet } from '@/api/fms/config/accountSet'
import {
  fmsInitialBalanceExportInitialBalance,
  fmsInitialBalanceGetInitialBalanceList,
  fmsInitialBalanceSaveInitialBalance
} from '@/api/fms/config/initialBalance'
import HasPermi from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import download from '@/utils/download'
import { useFmsStore } from '../../store/fms'
import {
  FMS_DEBIT_CREDIT_DIRECTION,
  FMS_SUBJECT_TYPE,
  FMS_SUBJECT_TYPE_OPTIONS
} from '../../utils/constants'
import { formatAmount, formatQuantity } from '../../utils/format'
import FmsInitialAssistForm, { type FmsInitialAssistFormRef } from './FmsInitialAssistForm'
import FmsInitialBalanceImportForm from './FmsInitialBalanceImportForm'
import FmsTrialBalanceDialog, { type FmsTrialBalanceDialogRef } from './FmsTrialBalanceDialog'

interface AssistAuxiliaryDisplayItem {
  type: number
  typeId: number
  itemId: number
  name: string
}

interface ViewRow extends API.FmsInitialBalanceRespVO {
  rowKey: string
  isAssist?: boolean
  isLeaf?: boolean
  level: number
  auxiliaryItemIds?: number[]
  auxiliaries?: AssistAuxiliaryDisplayItem[]
}

const AMOUNT_FIELDS = [
  'openingAmount',
  'openingQuantity',
  'yearDebitAmount',
  'yearDebitQuantity',
  'yearCreditAmount',
  'yearCreditQuantity',
  'yearOpeningAmount',
  'yearOpeningQuantity',
  'profitLossAmount',
  'profitLossQuantity'
] as const

type AmountField = (typeof AMOUNT_FIELDS)[number]

const DIRECT_SUM_FIELDS = new Set<AmountField>([
  'yearDebitAmount',
  'yearDebitQuantity',
  'yearCreditAmount',
  'yearCreditQuantity'
])

/**
 * 财务初始余额管理页面
 */
const InitialBalancePage: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [edited, setEdited] = useState(false)
  const [subjectType, setSubjectType] = useState<number>(FMS_SUBJECT_TYPE.ASSET)
  const [tableData, setTableData] = useState<ViewRow[]>([])
  const [accountStartTime, setAccountStartTime] = useState<string>()
  const [currentMonth, setCurrentMonth] = useState<string>()
  const [importVisible, setImportVisible] = useState(false)

  const assistSubjectRef = useRef<ViewRow | undefined>(undefined)
  const assistFormRef = useRef<FmsInitialAssistFormRef>(null)
  const trialBalanceRef = useRef<FmsTrialBalanceDialogRef>(null)

  const isJanuary = useMemo(
    () => Boolean(accountStartTime) && dayjs(accountStartTime).month() === 0,
    [accountStartTime]
  )

  const editable = useMemo(
    () =>
      Boolean(accountStartTime) &&
      Boolean(currentMonth) &&
      currentMonth === dayjs(accountStartTime).format('YYYY-MM'),
    [accountStartTime, currentMonth]
  )

  const pageEditable = fmsStore.isAccountSetWritable && editable

  /** 汇总父级科目余额：辅助明细计入所属科目，子科目计入父科目 */
  const aggregateRows = useCallback((sourceRows: ViewRow[]): ViewRow[] => {
    const rows = sourceRows.map((row) => ({ ...row }))
    const subjectMap = new Map<number, ViewRow>()

    // 1. 非末级科目和启用辅助核算的科目由明细汇总，先清零
    rows.forEach((row) => {
      if (row.isAssist) return
      subjectMap.set(row.subjectId, row)
      if (!row.isLeaf || row.auxiliaryAccounting) {
        AMOUNT_FIELDS.forEach((field) => {
          row[field] = 0
        })
      }
    })

    // 2. 平铺列表父级在前，倒序遍历时子级先完成汇总，再逐级累加到父级
    for (let index = rows.length - 1; index >= 0; index--) {
      const row = rows[index]
      const parent = row.isAssist
        ? subjectMap.get(row.subjectId)
        : row.parentId
          ? subjectMap.get(row.parentId)
          : undefined
      if (!parent) continue
      AMOUNT_FIELDS.forEach((field) => {
        const amount = Number(row[field] || 0)
        parent[field] =
          Number(parent[field] || 0) +
          (DIRECT_SUM_FIELDS.has(field) || row.balanceDirection === parent.balanceDirection
            ? amount
            : -amount)
      })
    }

    return rows
  }, [])

  /** 构建辅助核算明细行 */
  const buildAssistViewRow = useCallback(
    (
      subject: ViewRow,
      assist: API.AssistBalance & {
        assistCombinationId?: number
        auxiliaries?: AssistAuxiliaryDisplayItem[]
      },
      index: number
    ): ViewRow => {
      const auxList = assist.auxiliaries || []
      return {
        ...subject,
        ...assist,
        rowKey: `assist-${subject.subjectId}-${assist.assistCombinationId || index}`,
        isAssist: true,
        level: subject.level + 1,
        auxiliaryItemIds:
          assist.auxiliaryItemIds || auxList.map((item) => item.itemId),
        auxiliaries: auxList,
        assistBalances: []
      }
    },
    []
  )

  /** 构建平铺行：父级科目在前，辅助明细紧跟所属科目 */
  const buildViewRows = useCallback(
    (list: API.FmsInitialBalanceRespVO[]): ViewRow[] => {
      const rows: ViewRow[] = []
      const levelMap = new Map<number, number>()
      const parentIds = new Set(list.map((item) => item.parentId).filter(Boolean))

      list.forEach((item) => {
        const level = (item.parentId ? levelMap.get(item.parentId) || 0 : 0) + 1
        levelMap.set(item.subjectId, level)
        const subjectRow: ViewRow = {
          ...item,
          rowKey: `subject-${item.subjectId}`,
          isLeaf: !parentIds.has(item.subjectId),
          level
        }
        rows.push(subjectRow)
        ;(item.assistBalances || []).forEach((assist, index) => {
          rows.push(buildAssistViewRow(subjectRow, assist as any, index))
        })
      })
      return aggregateRows(rows)
    },
    [buildAssistViewRow, aggregateRows]
  )

  /** 加载账套信息、初始余额列表和当前会计期间 */
  const loadPage = useCallback(
    async (currentType = subjectType) => {
      if (!accountSetId) {
        setTableData([])
        return
      }
      setLoading(true)
      try {
        const [accountSetResp, balancesResp, month] = await Promise.all([
          fmsAccountSetGetAccountSet({ id: accountSetId }),
          fmsInitialBalanceGetInitialBalanceList({
            accountSetId,
            subjectType: currentType
          }),
          fmsStore.loadCurrentMonth()
        ])
        if (accountSetResp.code === 0 && accountSetResp.data) {
          setAccountStartTime(accountSetResp.data.startTime)
        }
        setCurrentMonth(month)
        if (balancesResp.code === 0) {
          setTableData(buildViewRows(balancesResp.data || []))
        }
        setEdited(false)
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, subjectType, fmsStore, buildViewRows]
  )

  useEffect(() => {
    loadPage()
  }, [accountSetId])

  /** 浏览器刷新或关闭前提示未保存修改 */
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!edited) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [edited])

  /** 切换科目类别 */
  const handleChangeSubjectType = (nextType: number) => {
    const doSwitch = () => {
      if (isJanuary && nextType === FMS_SUBJECT_TYPE.PROFIT_LOSS) {
        message.warning('年初启用的账套不需要录入损益初始余额')
        return
      }
      setSubjectType(nextType)
      loadPage(nextType)
    }

    if (edited) {
      Modal.confirm({
        title: '系统提示',
        icon: <ExclamationCircleOutlined />,
        content: '当前修改尚未保存，确定放弃修改并切换科目类别吗？',
        onOk: doSwitch
      })
      return
    }
    doSwitch()
  }

  /** 判断是否可编辑：辅助明细行，或未启用辅助核算的末级科目行 */
  const canEdit = (row: ViewRow) =>
    pageEditable && Boolean(row.isAssist || (row.isLeaf && !row.auxiliaryAccounting))

  /** 判断是否可添加明细：启用辅助核算的末级科目行 */
  const canAddAssist = (row: ViewRow) =>
    pageEditable && Boolean(!row.isAssist && row.isLeaf && row.auxiliaryAccounting)

  /** 获得行名称，辅助明细行拼接“科目名称_项目名称” */
  const getRowName = (row: ViewRow) => {
    if (!row.isAssist) return row.subjectName
    const suffix = row.auxiliaries?.map((item) => item.name).join('_')
    return suffix ? `${row.subjectName}_${suffix}` : row.subjectName
  }

  /** 添加辅助核算明细行 */
  const handleAddAssist = (combinations: API.FmsAuxiliaryItemRespVO[][]) => {
    const subject = assistSubjectRef.current
    if (!subject) return

    setTableData((prev) => {
      let insertIndex = prev.findIndex((row) => row.rowKey === subject.rowKey) + 1
      while (
        insertIndex < prev.length &&
        prev[insertIndex].isAssist &&
        prev[insertIndex].subjectId === subject.subjectId
      ) {
        insertIndex++
      }

      const newRows = combinations
        .filter(
          (items) =>
            !prev.some(
              (row) =>
                row.isAssist &&
                row.subjectId === subject.subjectId &&
                row.auxiliaryItemIds?.length === items.length &&
                items.every((item) => row.auxiliaryItemIds?.includes(item.id))
            )
        )
        .map((items, index) => {
          const auxiliaries = (subject.auxiliaryConfigs || []).map((config, configIndex) => {
            const item = items[configIndex]
            return {
              type: config.type,
              typeId: config.auxiliaryTypeId,
              itemId: item.id,
              name: item.name
            }
          })
          return buildAssistViewRow(
            subject,
            {
              openingAmount: 0,
              openingQuantity: 0,
              yearDebitAmount: 0,
              yearDebitQuantity: 0,
              yearCreditAmount: 0,
              yearCreditQuantity: 0,
              yearOpeningAmount: 0,
              yearOpeningQuantity: 0,
              profitLossAmount: 0,
              profitLossQuantity: 0,
              auxiliaryItemIds: auxiliaries.map((a) => a.itemId),
              auxiliaries
            },
            Date.now() + index
          )
        })

      if (!newRows.length) {
        message.warning('所选辅助核算明细均已存在')
        return prev
      }

      const next = [...prev]
      next.splice(insertIndex, 0, ...newRows)
      setEdited(true)
      return aggregateRows(next)
    })
  }

  /** 删除辅助核算明细行 */
  const handleRemoveAssist = (row: ViewRow) => {
    setTableData((prev) => {
      const next = prev.filter((item) => item.rowKey !== row.rowKey)
      setEdited(true)
      return aggregateRows(next)
    })
  }

  /** 金额变化时按余额方向重算年初余额，并汇总父级 */
  const handleFieldChange = (
    rowKey: string,
    field: AmountField,
    value: number | null,
    isProfitLossField = false
  ) => {
    setTableData((prev) => {
      const next = prev.map((row) => {
        if (row.rowKey !== rowKey) return row
        const updated: ViewRow = {
          ...row,
          [field]: Number(value || 0)
        }
        if (!isProfitLossField && !isJanuary) {
          if (updated.balanceDirection === FMS_DEBIT_CREDIT_DIRECTION.DEBIT) {
            updated.yearOpeningAmount =
              Number(updated.openingAmount || 0) -
              Number(updated.yearDebitAmount || 0) +
              Number(updated.yearCreditAmount || 0)
            updated.yearOpeningQuantity =
              Number(updated.openingQuantity || 0) -
              Number(updated.yearDebitQuantity || 0) +
              Number(updated.yearCreditQuantity || 0)
          } else {
            updated.yearOpeningAmount =
              Number(updated.openingAmount || 0) +
              Number(updated.yearDebitAmount || 0) -
              Number(updated.yearCreditAmount || 0)
            updated.yearOpeningQuantity =
              Number(updated.openingQuantity || 0) +
              Number(updated.yearDebitQuantity || 0) -
              Number(updated.yearCreditQuantity || 0)
          }
        }
        return updated
      })
      setEdited(true)
      return aggregateRows(next)
    })
  }

  const pickAmounts = (row: ViewRow) => ({
    openingAmount: Number(row.openingAmount || 0),
    openingQuantity: Number(row.openingQuantity || 0),
    yearDebitAmount: Number(row.yearDebitAmount || 0),
    yearDebitQuantity: Number(row.yearDebitQuantity || 0),
    yearCreditAmount: Number(row.yearCreditAmount || 0),
    yearCreditQuantity: Number(row.yearCreditQuantity || 0),
    yearOpeningAmount: Number(row.yearOpeningAmount || 0),
    yearOpeningQuantity: Number(row.yearOpeningQuantity || 0),
    profitLossAmount: Number(row.profitLossAmount || 0),
    profitLossQuantity: Number(row.profitLossQuantity || 0)
  })

  /** 保存初始余额 */
  const handleSave = async () => {
    if (!accountSetId || !pageEditable) return
    const assistRows = tableData.filter((row) => row.isAssist)
    const balances: API.Balance[] = tableData
      .filter((row) => !row.isAssist && row.isLeaf)
      .map((row) => ({
        subjectId: row.subjectId,
        ...pickAmounts(row),
        assistBalances: assistRows
          .filter((item) => item.subjectId === row.subjectId)
          .map((item) => ({
            auxiliaryItemIds: item.auxiliaryItemIds || [],
            ...pickAmounts(item)
          }))
      }))

    if (
      subjectType === FMS_SUBJECT_TYPE.PROFIT_LOSS &&
      balances.some((item) => Math.abs(Number(item.yearOpeningAmount || 0)) >= 0.005)
    ) {
      message.warning('损益类科目的年初余额必须为 0')
      return
    }

    setSaving(true)
    try {
      const resp = await fmsInitialBalanceSaveInitialBalance({
        accountSetId,
        balances
      })
      if (resp.code === 0) {
        message.success('保存成功')
        await loadPage()
      }
    } finally {
      setSaving(false)
    }
  }

  /** 导出初始余额 */
  const handleExport = () => {
    if (!accountSetId) return
    Modal.confirm({
      title: '系统提示',
      icon: <ExclamationCircleOutlined />,
      content: textConst.msg.exportMsg,
      onOk: async () => {
        setExportLoading(true)
        try {
          const data = await fmsInitialBalanceExportInitialBalance(
            { accountSetId },
            { responseType: 'blob' }
          )
          download.excel(data, '财务初始余额.xlsx')
          message.success(textConst.msg.exportSuccess)
        } finally {
          setExportLoading(false)
        }
      }
    })
  }

  const renderAmountInput = (
    row: ViewRow,
    field: AmountField,
    isQuantity = false,
    isProfitLossField = false
  ) => {
    if (isQuantity) {
      if (canEdit(row) && row.quantityAccounting) {
        return (
          <InputNumber
            value={row[field]}
            min={0}
            precision={4}
            controls={false}
            style={{ width: 118 }}
            onChange={(val) =>
              handleFieldChange(row.rowKey, field, val, isProfitLossField)
            }
          />
        )
      }
      return <span>{formatQuantity(row[field], row.quantityAccounting)}</span>
    }

    if (canEdit(row)) {
      return (
        <InputNumber
          value={row[field]}
          min={0}
          precision={2}
          controls={false}
          style={{ width: 118 }}
          onChange={(val) =>
            handleFieldChange(row.rowKey, field, val, isProfitLossField)
          }
        />
      )
    }
    return <span>{formatAmount(row[field])}</span>
  }

  const columns = useMemo<ColumnsType<ViewRow>>(() => {
    const cols: ColumnsType<ViewRow> = [
      {
        title: '科目编码',
        dataIndex: 'subjectCode',
        fixed: 'left',
        width: 140,
        render: (_, record) => (
          <span
            style={{
              color: record.isAssist ? 'rgba(0,0,0,0.45)' : undefined
            }}
          >
            {record.subjectCode}
          </span>
        )
      },
      {
        title: '科目名称',
        dataIndex: 'subjectName',
        fixed: 'left',
        minWidth: 240,
        render: (_, record) => (
          <div>
            <span
              style={{
                color: record.isAssist ? 'rgba(0,0,0,0.45)' : undefined,
                paddingLeft: `${(record.level - 1) * 14}px`
              }}
            >
              {getRowName(record)}
            </span>
            {canAddAssist(record) && (
              <Button
                type="link"
                size="small"
                icon={<PlusOutlined />}
                style={{ marginLeft: 8 }}
                onClick={() => {
                  assistSubjectRef.current = record
                  assistFormRef.current?.open(record)
                }}
              >
                添加明细
              </Button>
            )}
            {record.isAssist && pageEditable && (
              <Button
                type="link"
                danger
                size="small"
                style={{ marginLeft: 8 }}
                onClick={() => handleRemoveAssist(record)}
              >
                删除
              </Button>
            )}
          </div>
        )
      },
      {
        title: '方向',
        dataIndex: 'balanceDirection',
        align: 'center',
        fixed: 'left',
        width: 72,
        render: (val) => (
          <Tag color={val === FMS_DEBIT_CREDIT_DIRECTION.DEBIT ? 'processing' : 'warning'}>
            {val === FMS_DEBIT_CREDIT_DIRECTION.DEBIT ? '借' : '贷'}
          </Tag>
        )
      },
      {
        title: '期初余额',
        children: [
          {
            title: '数量',
            key: 'openingQuantity',
            align: 'right',
            width: 135,
            render: (_, record) => renderAmountInput(record, 'openingQuantity', true)
          },
          {
            title: '金额',
            key: 'openingAmount',
            align: 'right',
            width: 145,
            render: (_, record) => renderAmountInput(record, 'openingAmount', false)
          }
        ]
      }
    ]

    if (!isJanuary) {
      cols.push(
        {
          title: '本年累计借方',
          children: [
            {
              title: '数量',
              key: 'yearDebitQuantity',
              align: 'right',
              width: 135,
              render: (_, record) => renderAmountInput(record, 'yearDebitQuantity', true)
            },
            {
              title: '金额',
              key: 'yearDebitAmount',
              align: 'right',
              width: 145,
              render: (_, record) => renderAmountInput(record, 'yearDebitAmount', false)
            }
          ]
        },
        {
          title: '本年累计贷方',
          children: [
            {
              title: '数量',
              key: 'yearCreditQuantity',
              align: 'right',
              width: 135,
              render: (_, record) => renderAmountInput(record, 'yearCreditQuantity', true)
            },
            {
              title: '金额',
              key: 'yearCreditAmount',
              align: 'right',
              width: 145,
              render: (_, record) => renderAmountInput(record, 'yearCreditAmount', false)
            }
          ]
        },
        {
          title: '年初余额',
          children: [
            {
              title: '数量',
              key: 'yearOpeningQuantity',
              align: 'right',
              width: 135,
              render: (_, record) =>
                formatQuantity(record.yearOpeningQuantity, record.quantityAccounting)
            },
            {
              title: '金额',
              key: 'yearOpeningAmount',
              align: 'right',
              width: 145,
              render: (_, record) => formatAmount(record.yearOpeningAmount)
            }
          ]
        }
      )

      if (subjectType === FMS_SUBJECT_TYPE.PROFIT_LOSS) {
        cols.push({
          title: '实际损益发生额',
          children: [
            {
              title: '数量',
              key: 'profitLossQuantity',
              align: 'right',
              width: 135,
              render: (_, record) =>
                renderAmountInput(record, 'profitLossQuantity', true, true)
            },
            {
              title: '金额',
              key: 'profitLossAmount',
              align: 'right',
              width: 145,
              render: (_, record) =>
                renderAmountInput(record, 'profitLossAmount', false, true)
            }
          ]
        })
      }
    }

    return cols
  }, [isJanuary, subjectType, pageEditable, tableData])

  return (
    <>
      <Card variant="borderless" style={{ marginBottom: 16 }}>
        <Space wrap>
          <span>科目类别：</span>
          <Select
            value={subjectType}
            options={FMS_SUBJECT_TYPE_OPTIONS}
            style={{ width: 240 }}
            onChange={handleChangeSubjectType}
          />
          {pageEditable && (
            <HasPermi value="fms:config:initial-balance:update">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={handleSave}
              >
                保存
              </Button>
            </HasPermi>
          )}
          <HasPermi value="fms:config:initial-balance:query">
            <Button
              color="primary"
              variant="outlined"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                if (accountSetId) {
                  trialBalanceRef.current?.open(accountSetId)
                }
              }}
            >
              试算平衡
            </Button>
          </HasPermi>
          {pageEditable && (
            <HasPermi value="fms:config:initial-balance:import">
              <Button
                color="green"
                variant="outlined"
                icon={<UploadOutlined />}
                onClick={() => setImportVisible(true)}
              >
                {textConst.action.import}
              </Button>
            </HasPermi>
          )}
          <HasPermi value="fms:config:initial-balance:export">
            <Button
              color="volcano"
              variant="outlined"
              icon={<DownloadOutlined />}
              loading={exportLoading}
              onClick={handleExport}
            >
              {textConst.action.export}
            </Button>
          </HasPermi>
        </Space>
      </Card>

      <Card variant="borderless">
        {isJanuary && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="账套从一月启用，只需录入期初余额"
          />
        )}
        {accountStartTime && !editable && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="账套已结账，初始余额不可修改"
          />
        )}
        {edited && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="当前修改尚未保存，切换科目类别或离开页面前请先保存"
          />
        )}

        <Table<ViewRow>
          rowKey="rowKey"
          loading={loading}
          dataSource={tableData}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <FmsInitialAssistForm ref={assistFormRef} onSuccess={handleAddAssist} />
      <FmsTrialBalanceDialog ref={trialBalanceRef} />

      {accountSetId && (
        <FmsInitialBalanceImportForm
          visible={importVisible}
          setVisible={setImportVisible}
          accountSetId={accountSetId}
          onSuccess={() => loadPage()}
        />
      )}
    </>
  )
}

export default InitialBalancePage
