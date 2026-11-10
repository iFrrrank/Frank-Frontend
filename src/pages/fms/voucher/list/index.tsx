import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DownOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsSubjectGetSubjectSimpleList } from '@/api/fms/config/subject'
import { fmsVoucherWordGetVoucherWordSimpleList } from '@/api/fms/config/voucherWord'
import {
  fmsVoucherDeleteVoucherList,
  fmsVoucherExportVoucherExcel,
  fmsVoucherGetVoucherPage,
  fmsVoucherGetVoucherPrintList,
  fmsVoucherUpdateVoucherReviewStatus
} from '@/api/fms/voucher'
import { getSimpleUserList } from '@/api/system/user'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import download from '@/utils/download'
import { useFmsStore } from '@/pages/fms/store/fms'
import { FMS_VOUCHER_STATUS, FMS_VOUCHER_STATUS_OPTIONS } from '@/pages/fms/utils/constants'
import { formatMoney, getMonthRange } from '@/pages/fms/utils/format'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'
import FmsVoucherPrintForm, {
  type FmsVoucherPrintFormRef
} from '@/pages/fms/voucher/components/FmsVoucherPrintForm'
import { buildVoucherListPrintHtml } from '@/pages/fms/voucher/components/print'
import FmsVoucherAttachmentForm, {
  type FmsVoucherAttachmentFormRef
} from './FmsVoucherAttachmentForm'
import FmsVoucherMoveForm, { type FmsVoucherMoveFormRef } from './FmsVoucherMoveForm'
import FmsVoucherImportForm, { type FmsVoucherImportFormRef } from './FmsVoucherImportForm'
import FmsVoucherTidyForm, { type FmsVoucherTidyFormRef } from './FmsVoucherTidyForm'

const FmsVoucherList: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const voucherStatusOptions = FMS_VOUCHER_STATUS_OPTIONS

  const checkPermi = useHasPermi()
  const hasPrintPermi = checkPermi('fms:voucher:print')
  const hasExportPermi = checkPermi('fms:voucher:export')
  const hasImportPermi = checkPermi('fms:voucher:import')
  const hasMovePermi = checkPermi('fms:voucher:move')
  const hasTidyPermi = checkPermi('fms:voucher:tidy')
  const hasUpdatePermi = checkPermi('fms:voucher:update')

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<API.FmsVoucherRespVO[]>([])
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<API.FmsVoucherRespVO[]>([])

  const [voucherWords, setVoucherWords] = useState<API.FmsVoucherWordRespVO[]>([])
  const [subjects, setSubjects] = useState<API.FmsSubjectRespVO[]>([])
  const [users, setUsers] = useState<API.UserSimpleBaseVO[]>([])
  const [monthRange, setMonthRange] = useState<[string, string]>([
    dayjs().format('YYYY-MM'),
    dayjs().format('YYYY-MM')
  ])

  const moveFormRef = useRef<FmsVoucherMoveFormRef>(null)
  const importFormRef = useRef<FmsVoucherImportFormRef>(null)
  const tidyFormRef = useRef<FmsVoucherTidyFormRef>(null)
  const printFormRef = useRef<FmsVoucherPrintFormRef>(null)
  const attachmentFormRef = useRef<FmsVoucherAttachmentFormRef>(null)

  /** 构建凭证查询参数 */
  const buildQueryParams = useCallback(
    (customPageNo = pageNo, customPageSize = pageSize, ids?: number[]) => {
      const formValues = form.getFieldsValue()
      const params: any = {
        pageNo: customPageNo,
        pageSize: customPageSize,
        accountSetId: accountSetId || 0,
        ...formValues
      }
      if (ids?.length) {
        params.ids = ids
      }
      if (monthRange.length === 2 && monthRange[0] && monthRange[1]) {
        const [beginTime] = getMonthRange(monthRange[0])
        const [, endTime] = getMonthRange(monthRange[1])
        params.voucherTime = [beginTime, endTime]
      }
      return params
    },
    [accountSetId, form, monthRange, pageNo, pageSize]
  )

  /** 查询凭证列表 */
  const getList = useCallback(
    async (customPageNo = pageNo, customPageSize = pageSize) => {
      if (!accountSetId) return
      setLoading(true)
      try {
        const resp = await fmsVoucherGetVoucherPage(buildQueryParams(customPageNo, customPageSize))
        if (resp.code === 0 && resp.data) {
          setList(resp.data.list || [])
          setTotal(resp.data.total || 0)
          setSelectedRowKeys([])
          setSelectedRows([])
        }
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, buildQueryParams, pageNo, pageSize]
  )

  /** 初始化页面 */
  useEffect(() => {
    const init = async () => {
      if (!accountSetId) {
        setList([])
        return
      }
      const [wordResp, subjectResp, userResp, accountingMonth] = await Promise.all([
        fmsVoucherWordGetVoucherWordSimpleList({ accountSetId }),
        fmsSubjectGetSubjectSimpleList({ accountSetId: String(accountSetId) }),
        getSimpleUserList(),
        fmsStore.loadCurrentMonth()
      ])
      if (wordResp.code === 0) setVoucherWords(wordResp.data || [])
      if (subjectResp.code === 0) setSubjects(subjectResp.data || [])
      if (userResp.code === 0) setUsers(userResp.data || [])
      const targetMonth = accountingMonth || dayjs().format('YYYY-MM')
      setMonthRange([targetMonth, targetMonth])
    }
    init()
  }, [accountSetId])

  useEffect(() => {
    if (accountSetId) {
      getList(1, pageSize)
    }
  }, [accountSetId, monthRange])

  /** 搜索凭证 */
  const handleQuery = () => {
    setPageNo(1)
    getList(1, pageSize)
  }

  /** 重置搜索条件 */
  const resetQuery = () => {
    form.resetFields()
    const accountingMonth = fmsStore.currentMonth || dayjs().format('YYYY-MM')
    setMonthRange([accountingMonth, accountingMonth])
    setPageNo(1)
    getList(1, pageSize)
  }

  /** 查询全部凭证 */
  const getAllVoucherList = async () => {
    setLoading(true)
    try {
      const resp = await fmsVoucherGetVoucherPrintList(buildQueryParams())
      return resp.code === 0 ? resp.data || [] : []
    } finally {
      setLoading(false)
    }
  }

  /** 打印凭证 */
  const handlePrintVoucher = async (row?: API.FmsVoucherRespVO) => {
    if (!accountSetId) return
    let vouchers = row ? [row] : selectedRows
    if (!vouchers.length) {
      vouchers = await getAllVoucherList()
    }
    if (!vouchers.length) {
      message.warning('暂无可打印的凭证')
      return
    }
    printFormRef.current?.open(accountSetId, fmsStore.accountSet?.companyName || '', vouchers)
  }

  /** 打印凭证列表 */
  const handlePrintList = async () => {
    const vouchers = await getAllVoucherList()
    if (!vouchers.length) {
      message.warning('暂无可打印的凭证')
      return
    }
    const startPeriod = dayjs(`${monthRange[0]}-01`).format('YYYY年第MM期')
    const endPeriod = dayjs(`${monthRange[1]}-01`).format('YYYY年第MM期')
    printFormRef.current?.previewHtml(
      buildVoucherListPrintHtml(
        fmsStore.accountSet?.companyName || '',
        startPeriod === endPeriod ? startPeriod : `${startPeriod} 至 ${endPeriod}`,
        vouchers
      )
    )
  }

  /** 导出凭证 */
  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认导出数据项？',
      onOk: async () => {
        setLoading(true)
        try {
          const ids = selectedRows.length
            ? (selectedRows.map((row) => row.id).filter(Boolean) as number[])
            : undefined
          const data = await fmsVoucherExportVoucherExcel(buildQueryParams(pageNo, pageSize, ids), {
            responseType: 'blob'
          })
          download.excel(data, '凭证列表.xls')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  /** 处理更多操作 */
  const handleMoreCommand = async (key: string) => {
    if (!accountSetId) return
    switch (key) {
      case 'print':
        await handlePrintVoucher()
        return
      case 'printList':
        await handlePrintList()
        return
      case 'export':
        handleExport()
        return
      case 'import':
        importFormRef.current?.open(accountSetId)
        return
      default:
        break
    }
    if (!voucherWords.length) {
      message.warning('请先设置凭证字')
      return
    }
    const defaultMonth = monthRange[1] || fmsStore.currentMonth || dayjs().format('YYYY-MM')
    if (key === 'move') {
      moveFormRef.current?.open(accountSetId, defaultMonth, voucherWords)
    } else if (key === 'tidy') {
      tidyFormRef.current?.open(accountSetId, defaultMonth, voucherWords)
    }
  }

  /** 打开凭证详情 */
  const openVoucher = (row: API.FmsVoucherRespVO) => {
    history.push(
      `/fms/voucher/create?id=${row.id}&ids=${list.map((item) => item.id).join(',')}`
    )
  }

  /** 判断凭证附件是否可编辑 */
  const canEditVoucherAttachments = (row: API.FmsVoucherRespVO) => {
    return (
      fmsStore.isAccountSetWritable &&
      row.status === FMS_VOUCHER_STATUS.PENDING_REVIEW &&
      !row.closingGenerated &&
      hasUpdatePermi
    )
  }

  /** 审核或反审核凭证 */
  const handleReview = (row: API.FmsVoucherRespVO, status: number) => {
    if (!accountSetId) return
    Modal.confirm({
      title: '系统提示',
      content: status === FMS_VOUCHER_STATUS.APPROVED ? '确认审核该凭证吗？' : '确认反审核该凭证吗？',
      onOk: async () => {
        const resp = await fmsVoucherUpdateVoucherReviewStatus({
          accountSetId,
          ids: [row.id!],
          status
        })
        if (resp.code === 0) {
          message.success('操作成功')
          await getList()
        }
      }
    })
  }

  /** 批量审核或反审核凭证 */
  const handleBatchReview = (status: number) => {
    if (!accountSetId || !selectedRows.length) return
    const rows = selectedRows.filter((row) =>
      status === FMS_VOUCHER_STATUS.APPROVED
        ? row.status === FMS_VOUCHER_STATUS.PENDING_REVIEW
        : row.status === FMS_VOUCHER_STATUS.APPROVED
    )
    if (!rows.length) {
      message.warning('所选凭证不符合当前审核操作')
      return
    }
    Modal.confirm({
      title: '系统提示',
      content:
        status === FMS_VOUCHER_STATUS.APPROVED
          ? `确认审核选中的 ${rows.length} 张凭证吗？`
          : `确认反审核选中的 ${rows.length} 张凭证吗？`,
      onOk: async () => {
        const resp = await fmsVoucherUpdateVoucherReviewStatus({
          accountSetId,
          ids: rows.map((row) => row.id!),
          status
        })
        if (resp.code === 0) {
          message.success('操作成功')
          await getList()
        }
      }
    })
  }

  /** 删除凭证 */
  const handleDelete = (row: API.FmsVoucherRespVO) => {
    if (!accountSetId) return
    Modal.confirm({
      title: '系统提示',
      content: `确认删除凭证“${row.voucherWordName}-${row.voucherNumber}”吗？删除后会产生断号`,
      onOk: async () => {
        const resp = await fmsVoucherDeleteVoucherList({
          accountSetId,
          ids: [row.id!]
        })
        if (resp.code === 0) {
          message.success('删除成功')
          await getList()
        }
      }
    })
  }

  /** 批量删除凭证 */
  const handleBatchDelete = () => {
    if (!accountSetId) return
    if (selectedRows.some((row) => row.status === FMS_VOUCHER_STATUS.APPROVED)) {
      message.warning('批量删除不能包含已审核凭证')
      return
    }
    Modal.confirm({
      title: '系统提示',
      content: `确认删除选中的 ${selectedRows.length} 张凭证吗？删除后会产生断号`,
      onOk: async () => {
        const resp = await fmsVoucherDeleteVoucherList({
          accountSetId,
          ids: selectedRows.map((row) => row.id!)
        })
        if (resp.code === 0) {
          message.success('删除成功')
          await getList()
        }
      }
    })
  }

  const entryRowStyle: React.CSSProperties = {
    minHeight: 28,
    lineHeight: '28px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    borderBottom: '1px dashed #ebeef5'
  }

  const columns: ColumnsType<API.FmsVoucherRespVO> = [
    {
      title: '日期',
      dataIndex: 'voucherTime',
      align: 'center',
      width: 110,
      render: (val: string) => (val ? dayjs(val).format('YYYY-MM-DD') : '')
    },
    {
      title: '凭证字号',
      align: 'center',
      width: 110,
      render: (_, row) => (
        <Button type="link" style={{ padding: 0 }} onClick={() => openVoucher(row)}>
          {row.voucherWordName}-{row.voucherNumber}
        </Button>
      )
    },
    {
      title: '附件',
      align: 'center',
      width: 72,
      render: (_, row) => {
        const count = row.attachmentUrls?.length || 0
        if (count > 0 || canEditVoucherAttachments(row)) {
          return (
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => accountSetId && attachmentFormRef.current?.open(accountSetId, row)}
            >
              <PaperClipOutlined /> {count}
            </Button>
          )
        }
        return (
          <span>
            <PaperClipOutlined /> {count}
          </span>
        )
      }
    },
    {
      title: '摘要',
      width: 200,
      render: (_, row) => (
        <div>
          {(row.entries || []).map((entry, idx, arr) => (
            <div
              key={entry.id || idx}
              title={entry.digest}
              style={{
                ...entryRowStyle,
                borderBottom: idx === arr.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {entry.digest}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '会计科目',
      width: 240,
      render: (_, row) => (
        <div>
          {(row.entries || []).map((entry, idx, arr) => (
            <div
              key={entry.id || idx}
              title={entry.subjectName}
              style={{
                ...entryRowStyle,
                borderBottom: idx === arr.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {entry.subjectCode} {entry.subjectName}
              {entry.auxiliaries && entry.auxiliaries.length > 0 && (
                <span style={{ color: '#909399' }}>
                  {' '}
                  / {entry.auxiliaries.map((item: any) => item.name).join('、')}
                </span>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '借方金额',
      align: 'right',
      width: 135,
      render: (_, row) => (
        <div style={{ fontFamily: 'Arial, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
          {(row.entries || []).map((entry, idx, arr) => (
            <div
              key={entry.id || idx}
              style={{
                ...entryRowStyle,
                borderBottom: idx === arr.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {Number(entry.debitAmount) ? formatMoney(entry.debitAmount) : ''}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '贷方金额',
      align: 'right',
      width: 135,
      render: (_, row) => (
        <div style={{ fontFamily: 'Arial, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
          {(row.entries || []).map((entry, idx, arr) => (
            <div
              key={entry.id || idx}
              style={{
                ...entryRowStyle,
                borderBottom: idx === arr.length - 1 ? 'none' : entryRowStyle.borderBottom
              }}
            >
              {Number(entry.creditAmount) ? formatMoney(entry.creditAmount) : ''}
            </div>
          ))}
        </div>
      )
    },
    {
      title: '制单人',
      dataIndex: 'creatorUserName',
      align: 'center',
      width: 100
    },
    {
      title: '审核人',
      dataIndex: 'reviewerUserName',
      align: 'center',
      width: 100
    },
    {
      title: '状态',
      align: 'center',
      width: 90,
      render: (_, row) => {
        if (row.closingGenerated) {
          return <Tag>结账生成</Tag>
        }
        return (
          <Tag color={row.status === FMS_VOUCHER_STATUS.APPROVED ? 'success' : 'warning'}>
            {row.status === FMS_VOUCHER_STATUS.APPROVED ? '已审核' : '待审核'}
          </Tag>
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 220,
      render: (_, row) => (
        <Space size="small">
          <Button type="link" style={{ padding: 0 }} onClick={() => openVoucher(row)}>
            {row.closingGenerated || !fmsStore.isAccountSetWritable ? '查看' : '编辑'}
          </Button>
          {fmsStore.isAccountSetWritable &&
            !row.closingGenerated &&
            row.status === FMS_VOUCHER_STATUS.PENDING_REVIEW && (
              <HasPermi value="fms:voucher:review">
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => handleReview(row, FMS_VOUCHER_STATUS.APPROVED)}
                >
                  审核
                </Button>
              </HasPermi>
            )}
          {fmsStore.isAccountSetWritable &&
            !row.closingGenerated &&
            row.status === FMS_VOUCHER_STATUS.APPROVED && (
              <HasPermi value="fms:voucher:review">
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => handleReview(row, FMS_VOUCHER_STATUS.PENDING_REVIEW)}
                >
                  反审核
                </Button>
              </HasPermi>
            )}
          <HasPermi value="fms:voucher:print">
            <Button type="link" style={{ padding: 0 }} onClick={() => handlePrintVoucher(row)}>
              打印
            </Button>
          </HasPermi>
          {fmsStore.isAccountSetWritable &&
            !row.closingGenerated &&
            row.status !== FMS_VOUCHER_STATUS.APPROVED && (
              <HasPermi value="fms:voucher:delete">
                <Button
                  type="link"
                  danger
                  style={{ padding: 0 }}
                  onClick={() => handleDelete(row)}
                >
                  删除
                </Button>
              </HasPermi>
            )}
        </Space>
      )
    }
  ]

  const moreMenuItems: any[] = []
  if (hasPrintPermi) {
    moreMenuItems.push({ key: 'print', label: '打印凭证' })
    moreMenuItems.push({ key: 'printList', label: '打印列表' })
  }
  if (hasExportPermi) {
    moreMenuItems.push({ key: 'export', label: '导出' })
  }
  if (fmsStore.isAccountSetWritable && hasImportPermi) {
    moreMenuItems.push({ key: 'import', label: '导入凭证' })
  }
  if (fmsStore.isAccountSetWritable && (hasMovePermi || hasTidyPermi)) {
    moreMenuItems.push({ type: 'divider' })
    if (hasMovePermi) moreMenuItems.push({ key: 'move', label: '移动凭证' })
    if (hasTidyPermi) moreMenuItems.push({ key: 'tidy', label: '整理凭证' })
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 搜索 */}
      <Card>
        <Form form={form} layout="inline" style={{ rowGap: 16 }}>
          <Form.Item label="会计期间">
            <DatePicker.RangePicker
              picker="month"
              value={[dayjs(monthRange[0], 'YYYY-MM'), dayjs(monthRange[1], 'YYYY-MM')]}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setMonthRange([dates[0].format('YYYY-MM'), dates[1].format('YYYY-MM')])
                }
              }}
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="凭证字" name="voucherWordId">
            <FmsVoucherWordSelect options={voucherWords} allowClear style={{ width: 240 }} />
          </Form.Item>
          <Form.Item label="凭证号" name="voucherNumber">
            <InputNumber
              controls={false}
              min={1}
              placeholder="请输入凭证号"
              style={{ width: 240 }}
            />
          </Form.Item>
          <Form.Item label="摘要" name="digest">
            <Input
              allowClear
              placeholder="请输入摘要"
              style={{ width: 240 }}
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item label="科目" name="subjectId">
            <FmsSubjectSelect options={subjects} allowClear style={{ width: 240 }} />
          </Form.Item>
          <Form.Item label="金额">
            <Space size={6}>
              <Form.Item name="minAmount" noStyle>
                <InputNumber
                  controls={false}
                  min={0}
                  precision={2}
                  placeholder="最小金额"
                  style={{ width: 106 }}
                />
              </Form.Item>
              <span>至</span>
              <Form.Item name="maxAmount" noStyle>
                <InputNumber
                  controls={false}
                  min={0}
                  precision={2}
                  placeholder="最大金额"
                  style={{ width: 106 }}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="制单人" name="creatorUserId">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择制单人"
              style={{ width: 240 }}
              options={users.map((u) => ({ label: u.nickname, value: u.id }))}
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select
              allowClear
              placeholder="请选择状态"
              style={{ width: 240 }}
              options={voucherStatusOptions}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button icon={<SearchOutlined />} onClick={handleQuery}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetQuery}>
                重置
              </Button>
              {fmsStore.isAccountSetWritable && (
                <HasPermi value="fms:voucher:create">
                  <Button
                    type="primary"
                    ghost
                    icon={<PlusOutlined />}
                    onClick={() => history.push('/fms/voucher/create')}
                  >
                    新增
                  </Button>
                </HasPermi>
              )}
              {moreMenuItems.length > 0 && (
                <Dropdown
                  menu={{
                    items: moreMenuItems,
                    onClick: ({ key }) => handleMoreCommand(key)
                  }}
                >
                  <Button>
                    更多 <DownOutlined />
                  </Button>
                </Dropdown>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 列表 */}
      <Card>
        {selectedRows.length > 0 && fmsStore.isAccountSetWritable && (
          <div
            style={{
              marginBottom: 12,
              display: 'flex',
              minHeight: 44,
              alignItems: 'center',
              gap: 10,
              border: '1px solid #91caff',
              background: '#e6f4ff',
              padding: '0 14px',
              color: '#1677ff',
              borderRadius: 4
            }}
          >
            <span>已选择 {selectedRows.length} 张凭证</span>
            <HasPermi value="fms:voucher:review">
              <Button onClick={() => handleBatchReview(FMS_VOUCHER_STATUS.APPROVED)}>
                批量审核
              </Button>
            </HasPermi>
            <HasPermi value="fms:voucher:review">
              <Button onClick={() => handleBatchReview(FMS_VOUCHER_STATUS.PENDING_REVIEW)}>
                批量反审核
              </Button>
            </HasPermi>
            <HasPermi value="fms:voucher:delete">
              <Button danger onClick={handleBatchDelete}>
                批量删除
              </Button>
            </HasPermi>
          </div>
        )}

        <Table<API.FmsVoucherRespVO>
          rowKey="id"
          loading={loading}
          dataSource={list}
          columns={columns}
          pagination={false}
          scroll={{ x: 1300 }}
          rowSelection={
            fmsStore.isAccountSetWritable
              ? {
                  selectedRowKeys,
                  onChange: (keys, rows) => {
                    setSelectedRowKeys(keys)
                    setSelectedRows(rows)
                  },
                  getCheckboxProps: (row) => ({
                    disabled: Boolean(row.closingGenerated)
                  })
                }
              : undefined
          }
        />

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={pageNo}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={(t) => `共 ${t} 条`}
            onChange={(nextPage, nextSize) => {
              setPageNo(nextPage)
              setPageSize(nextSize)
              getList(nextPage, nextSize)
            }}
          />
        </div>
      </Card>

      {/* 移动、导入、打印和整理凭证弹窗 */}
      <FmsVoucherMoveForm ref={moveFormRef} onSuccess={() => getList()} />
      <FmsVoucherImportForm ref={importFormRef} onSuccess={() => getList()} />
      <FmsVoucherPrintForm ref={printFormRef} />
      <FmsVoucherTidyForm ref={tidyFormRef} onSuccess={() => getList()} />
      <FmsVoucherAttachmentForm ref={attachmentFormRef} onSuccess={() => getList()} />
    </Space>
  )
}

export default FmsVoucherList
