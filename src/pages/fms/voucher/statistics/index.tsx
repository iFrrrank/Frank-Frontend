import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, DatePicker, Form, InputNumber, Modal, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DownloadOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { history } from '@umijs/max'
import dayjs from 'dayjs'
import { fmsVoucherWordGetVoucherWordSimpleList } from '@/api/fms/config/voucherWord'
import {
  fmsVoucherExportVoucherStatisticsExcel,
  fmsVoucherGetVoucherStatisticsList
} from '@/api/fms/voucher'
import HasPermi, { useHasPermi } from '@/directives/permission/HasPermi'
import download from '@/utils/download'
import { useFmsStore } from '@/pages/fms/store/fms'
import FmsVoucherWordSelect from '@/pages/fms/config/voucher-word/components/FmsVoucherWordSelect'
import FmsPrintPreview, {
  type FmsPrintPreviewRef
} from '@/pages/fms/components/print/FmsPrintPreview'
import { buildPeriodFilename, formatMoney, formatPeriodLabel } from '@/pages/fms/utils/format'
import { buildFmsTablePrintHtml } from '@/pages/fms/utils/print'

const FmsVoucherStatistics: React.FC = () => {
  const fmsStore = useFmsStore()
  const accountSetId = fmsStore.accountSetId
  const checkPermi = useHasPermi()
  const hasDetailPermi = checkPermi('fms:ledger:detail:query')

  const currentMonth = dayjs().format('YYYY-MM')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [monthRange, setMonthRange] = useState<[string, string]>([currentMonth, currentMonth])
  const [voucherWords, setVoucherWords] = useState<API.FmsVoucherWordRespVO[]>([])
  const [list, setList] = useState<API.FmsVoucherStatisticsRespVO[]>([])
  const printPreviewRef = useRef<FmsPrintPreviewRef>(null)

  const getQueryParams = useCallback(
    (range = monthRange): API.FmsVoucherGetVoucherStatisticsListParams => {
      const formValues = form.getFieldsValue()
      return {
        accountSetId: String(accountSetId || 0),
        startMonth: range[0],
        endMonth: range[1],
        voucherWordId:
          formValues.voucherWordId !== undefined ? String(formValues.voucherWordId) : undefined,
        minVoucherNumber:
          formValues.minVoucherNumber !== undefined
            ? String(formValues.minVoucherNumber)
            : undefined,
        maxVoucherNumber:
          formValues.maxVoucherNumber !== undefined
            ? String(formValues.maxVoucherNumber)
            : undefined,
        minLevel: String(formValues.minLevel ?? 1),
        maxLevel: String(formValues.maxLevel ?? 1)
      }
    },
    [accountSetId, form, monthRange]
  )

  /** 查询凭证汇总列表 */
  const getList = useCallback(
    async (range = monthRange) => {
      if (!accountSetId) return
      setLoading(true)
      try {
        const resp = await fmsVoucherGetVoucherStatisticsList(getQueryParams(range))
        if (resp.code === 0) {
          setList(resp.data || [])
        }
      } finally {
        setLoading(false)
      }
    },
    [accountSetId, getQueryParams, monthRange]
  )

  useEffect(() => {
    const init = async () => {
      if (!accountSetId) {
        setVoucherWords([])
        setList([])
        return
      }
      form.setFieldsValue({ minLevel: 1, maxLevel: 1 })
      const [wordResp, accountingMonth] = await Promise.all([
        fmsVoucherWordGetVoucherWordSimpleList({ accountSetId }),
        fmsStore.loadCurrentMonth()
      ])
      if (wordResp.code === 0) setVoucherWords(wordResp.data || [])
      const targetMonth = accountingMonth || currentMonth
      const nextRange: [string, string] = [targetMonth, targetMonth]
      setMonthRange(nextRange)
      await getList(nextRange)
    }
    init()
  }, [accountSetId])

  /** 搜索凭证汇总 */
  const handleQuery = () => {
    getList()
  }

  /** 重置搜索条件 */
  const resetQuery = () => {
    form.resetFields()
    form.setFieldsValue({ minLevel: 1, maxLevel: 1 })
    const accountingMonth = fmsStore.currentMonth || currentMonth
    const nextRange: [string, string] = [accountingMonth, accountingMonth]
    setMonthRange(nextRange)
    getList(nextRange)
  }

  /** 打开科目明细账 */
  const openDetail = (row: API.FmsVoucherStatisticsRespVO) => {
    if (!hasDetailPermi) return
    history.push(
      `/fms/ledger/detail?subjectId=${row.subjectId}&startMonth=${monthRange[0]}&endMonth=${monthRange[1]}`
    )
  }

  /** 导出凭证汇总表 */
  const handleExport = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认导出数据项？',
      onOk: async () => {
        setExportLoading(true)
        try {
          const params = getQueryParams()
          const data = await fmsVoucherExportVoucherStatisticsExcel(params, {
            responseType: 'blob'
          })
          download.excel(
            data,
            buildPeriodFilename('凭证汇总表', params.startMonth, params.endMonth)
          )
        } finally {
          setExportLoading(false)
        }
      }
    })
  }

  /** 打印凭证汇总表 */
  const handlePrint = () => {
    const tableElement = document.getElementById('voucher-statistics-table')
    if (!tableElement) {
      message.error('未找到可打印的表格')
      return
    }
    printPreviewRef.current?.printHtml(
      buildFmsTablePrintHtml({
        title: '凭证汇总表',
        companyName: fmsStore.accountSet?.companyName || '',
        periodLabel: formatPeriodLabel(monthRange[0], monthRange[1]),
        tableElement
      })
    )
  }

  const columns: ColumnsType<API.FmsVoucherStatisticsRespVO> = [
    {
      title: '科目编码',
      dataIndex: 'subjectCode',
      width: 160,
      render: (val, row) =>
        hasDetailPermi ? (
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
      width: 220
    },
    {
      title: '借方金额',
      dataIndex: 'debitAmount',
      align: 'right',
      width: 180,
      render: (val) => formatMoney(val)
    },
    {
      title: '贷方金额',
      dataIndex: 'creditAmount',
      align: 'right',
      width: 180,
      render: (val) => formatMoney(val)
    }
  ]

  const minLevel = form.getFieldValue('minLevel') ?? 1
  const totalRows = list.filter((item) => item.level === minLevel)
  const totalDebit = totalRows.reduce((sum, item) => sum + Number(item.debitAmount || 0), 0)
  const totalCredit = totalRows.reduce((sum, item) => sum + Number(item.creditAmount || 0), 0)

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 搜索 */}
      <Card>
        <Form
          form={form}
          layout="inline"
          initialValues={{ minLevel: 1, maxLevel: 1 }}
          style={{ rowGap: 16 }}
        >
          <Form.Item label="会计期间">
            <DatePicker.RangePicker
              picker="month"
              allowClear={false}
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
          <Form.Item label="凭证号">
            <Space size={8}>
              <Form.Item name="minVoucherNumber" noStyle>
                <InputNumber
                  controls={false}
                  min={1}
                  placeholder="起始号"
                  style={{ width: 105 }}
                />
              </Form.Item>
              <span>至</span>
              <Form.Item name="maxVoucherNumber" noStyle>
                <InputNumber
                  controls={false}
                  min={1}
                  placeholder="结束号"
                  style={{ width: 105 }}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="科目级次">
            <Space size={8}>
              <Form.Item name="minLevel" noStyle>
                <InputNumber controls={false} min={1} max={10} style={{ width: 105 }} />
              </Form.Item>
              <span>至</span>
              <Form.Item name="maxLevel" noStyle>
                <InputNumber controls={false} min={1} max={10} style={{ width: 105 }} />
              </Form.Item>
            </Space>
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
              <HasPermi value="fms:voucher:print">
                <Button type="primary" ghost icon={<PrinterOutlined />} onClick={handlePrint}>
                  打印
                </Button>
              </HasPermi>
              <HasPermi value="fms:voucher:statistics:export">
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

      {/* 列表 */}
      <Card>
        <div id="voucher-statistics-table">
          <Table<API.FmsVoucherStatisticsRespVO>
            rowKey={(row) => `${row.subjectId}-${row.subjectCode}`}
            loading={loading}
            dataSource={list}
            columns={columns}
            bordered
            pagination={false}
            summary={() => (
              <Table.Summary.Row style={{ fontWeight: 600 }}>
                <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} align="right">
                  {formatMoney(totalDebit)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  {formatMoney(totalCredit)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      </Card>

      {/* 打印预览 */}
      <FmsPrintPreview ref={printPreviewRef} />
    </Space>
  )
}

export default FmsVoucherStatistics

