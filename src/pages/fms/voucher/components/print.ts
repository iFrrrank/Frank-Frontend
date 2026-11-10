import dayjs from 'dayjs'
import {
  FMS_VOUCHER_PRINT_LAYOUT,
  type FmsVoucherPrintLayoutType
} from '../../utils/constants'
import {
  formatAmount,
  formatMoney,
  formatSubjectDisplay,
  toChineseMoney
} from '../../utils/format'
import { escapeHtml } from '../../utils/print'

/** 凭证打印版式配置 */
export interface FmsVoucherPrintConfig {
  layout: FmsVoucherPrintLayoutType
  printRowCount: number
  fontSize: number
  topMargin: number
  leftMargin: number
  printAuxiliary: boolean
  printQuantityAndPrice: boolean
  showCreator: boolean
  customCreator: boolean
  creatorName: string
  showReviewer: boolean
  customReviewer: boolean
  reviewerName: string
}

interface VoucherPrintLayoutPreset {
  value: FmsVoucherPrintLayoutType
  label: string
  pageSize: 'A4 portrait' | 'A4 landscape'
  vouchersPerPage: 1 | 2
  defaultRowCount: number
}

/** 凭证打印版式预设列表 */
export const FMS_VOUCHER_PRINT_LAYOUT_PRESETS: VoucherPrintLayoutPreset[] = [
  {
    value: FMS_VOUCHER_PRINT_LAYOUT.SINGLE_PORTRAIT,
    label: 'A4 一页一张（纵向）',
    pageSize: 'A4 portrait',
    vouchersPerPage: 1,
    defaultRowCount: 5
  },
  {
    value: FMS_VOUCHER_PRINT_LAYOUT.DOUBLE_PORTRAIT,
    label: 'A4 一页两张（纵向）',
    pageSize: 'A4 portrait',
    vouchersPerPage: 2,
    defaultRowCount: 5
  },
  {
    value: FMS_VOUCHER_PRINT_LAYOUT.A4_TWO_PER_PAGE,
    label: 'A4 两版打印（含裁剪线）',
    pageSize: 'A4 portrait',
    vouchersPerPage: 2,
    defaultRowCount: 5
  },
  {
    value: FMS_VOUCHER_PRINT_LAYOUT.SINGLE_LANDSCAPE,
    label: 'A4 一页一张（横向）',
    pageSize: 'A4 landscape',
    vouchersPerPage: 1,
    defaultRowCount: 8
  },
  {
    value: FMS_VOUCHER_PRINT_LAYOUT.GENERAL_PAPER,
    label: '通用发票版式',
    pageSize: 'A4 landscape',
    vouchersPerPage: 1,
    defaultRowCount: 6
  }
]

/** 创建默认凭证打印参数 */
export function createDefaultVoucherPrintConfig(): FmsVoucherPrintConfig {
  return {
    layout: FMS_VOUCHER_PRINT_LAYOUT.DOUBLE_PORTRAIT,
    printRowCount: 5,
    fontSize: 9,
    topMargin: 22,
    leftMargin: 15,
    printAuxiliary: true,
    printQuantityAndPrice: false,
    showCreator: true,
    customCreator: false,
    creatorName: '',
    showReviewer: true,
    customReviewer: false,
    reviewerName: ''
  }
}

/** 获得凭证打印版式预设 */
export function getVoucherPrintLayoutPreset(layout: FmsVoucherPrintLayoutType) {
  return (
    FMS_VOUCHER_PRINT_LAYOUT_PRESETS.find((item) => item.value === layout) ||
    FMS_VOUCHER_PRINT_LAYOUT_PRESETS[0]
  )
}

/** 构建记账凭证套打 HTML */
export function buildVoucherPrintHtml(
  companyName: string,
  vouchers: API.FmsVoucherRespVO[],
  wordPrintTitleMap: Map<number, string>,
  config: FmsVoucherPrintConfig
) {
  const layoutPreset = getVoucherPrintLayoutPreset(config.layout)
  const rowCount = Math.min(Math.max(Number(config.printRowCount || 5), 5), 20)
  const sheets = vouchers.flatMap((voucher) =>
    buildVoucherSheetList(companyName, voucher, wordPrintTitleMap, config, rowCount)
  )
  const pages = chunkVoucherSheets(sheets, layoutPreset.vouchersPerPage)
  const showCutLine =
    config.layout === FMS_VOUCHER_PRINT_LAYOUT.A4_TWO_PER_PAGE &&
    layoutPreset.vouchersPerPage === 2

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>凭证打印</title>
<style>
  @page { size: ${layoutPreset.pageSize}; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    color: #303133;
    font-family: "Microsoft YaHei", sans-serif;
    font-size: ${Math.min(Math.max(Number(config.fontSize || 9), 5), 20)}pt;
  }
  .print-page {
    padding: ${Math.max(Number(config.topMargin || 0), 0)}mm ${Math.max(Number(config.leftMargin || 0), 0)}mm 12mm;
    page-break-after: always;
  }
  .print-page:last-child { page-break-after: auto; }
  .voucher-sheet + .voucher-sheet { margin-top: 14mm; }
  .cut-line {
    margin: 8mm 0;
    border-top: 1px dashed #909399;
  }
  .voucher-title {
    margin: 0 0 8px;
    font-size: 1.65em;
    font-weight: 700;
    letter-spacing: 6px;
    text-align: center;
  }
  .voucher-meta, .voucher-footer {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    line-height: 1.7;
  }
  .voucher-meta { margin-bottom: 6px; }
  .voucher-footer { margin-top: 8px; }
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  th, td {
    height: 28px;
    padding: 4px 6px;
    border: 1px solid #303133;
    word-break: break-all;
  }
  th { font-weight: 600; text-align: center; }
  .text-right {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style>
</head>
<body>
  ${pages
    .map(
      (page) => `<section class="print-page">${page
        .map((sheet, index) =>
          index > 0 && showCutLine ? `<div class="cut-line"></div>${sheet}` : sheet
        )
        .join('')}</section>`
    )
    .join('')}
</body>
</html>`
}

/** 构建凭证列表清单打印 HTML */
export function buildVoucherListPrintHtml(
  companyName: string,
  periodText: string,
  vouchers: API.FmsVoucherRespVO[]
) {
  const rowsHtml = vouchers
    .flatMap((voucher) => {
      const voucherDate = dayjs(voucher.voucherTime).format('YYYY-MM-DD')
      const voucherNo = `${voucher.voucherWordName || ''}-${voucher.voucherNumber}`
      return (voucher.entries || []).map(
        (entry) => `<tr>
          <td class="text-center">${escapeHtml(voucherDate)}</td>
          <td class="text-center">${escapeHtml(voucherNo)}</td>
          <td>${escapeHtml(entry.digest || '')}</td>
          <td>${escapeHtml(entry.subjectCode || '')}</td>
          <td>${escapeHtml(formatEntrySubjectName(entry, true))}</td>
          <td class="text-right">${escapeHtml(formatMoney(entry.debitAmount))}</td>
          <td class="text-right">${escapeHtml(formatMoney(entry.creditAmount))}</td>
          <td class="text-center">${escapeHtml(voucher.creatorUserName || '')}</td>
          <td class="text-center">${escapeHtml(voucher.reviewerUserName || '')}</td>
        </tr>`
      )
    })
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>凭证列表打印</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { margin: 0; color: #303133; font-family: "Microsoft YaHei", sans-serif; font-size: 12px; }
  h1 { margin: 0 0 10px; font-size: 20px; text-align: center; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { padding: 5px 6px; border: 1px solid #303133; word-break: break-all; }
  th { background: #f5f7fa; text-align: center; }
  .text-center { text-align: center; }
  .text-right { text-align: right; font-variant-numeric: tabular-nums; }
</style>
</head>
<body>
  <h1>凭证列表</h1>
  <div class="meta">
    <span>单位名称：${escapeHtml(companyName || '-')}</span>
    <span>期间：${escapeHtml(periodText)}</span>
    <span>单位：元</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 92px">日期</th>
        <th style="width: 86px">凭证字号</th>
        <th>摘要</th>
        <th style="width: 92px">科目编码</th>
        <th>科目名称</th>
        <th style="width: 110px">借方金额</th>
        <th style="width: 110px">贷方金额</th>
        <th style="width: 82px">制单人</th>
        <th style="width: 82px">审核人</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`
}

function buildVoucherSheetList(
  companyName: string,
  voucher: API.FmsVoucherRespVO,
  wordPrintTitleMap: Map<number, string>,
  config: FmsVoucherPrintConfig,
  rowCount: number
) {
  const entries = voucher.entries?.length ? voucher.entries : []
  const chunks: API.Entry[][] = []
  for (let i = 0; i < entries.length; i += rowCount) {
    chunks.push(entries.slice(i, i + rowCount))
  }
  if (!chunks.length) {
    chunks.push([])
  }

  const totalSheets = chunks.length
  const title =
    wordPrintTitleMap.get(voucher.voucherWordId) ||
    `${voucher.voucherWordName || '记'}账凭证`
  const baseVoucherNo = `${voucher.voucherWordName || ''}-${voucher.voucherNumber}`
  const voucherDate = dayjs(voucher.voucherTime).format('YYYY-MM-DD')
  const debitTotal = Number(voucher.total || voucher.debitAmount || 0)
  const creditTotal = sumCreditAmount(entries)
  const creator = config.showCreator
    ? `制单人：${escapeHtml((config.customCreator ? config.creatorName : voucher.creatorUserName) || '')}`
    : ''
  const reviewer = config.showReviewer
    ? `审核人：${escapeHtml((config.customReviewer ? config.reviewerName : voucher.reviewerUserName) || '')}`
    : ''

  return chunks.map((chunk, sheetIndex) => {
    const voucherNo =
      totalSheets > 1
        ? `${baseVoucherNo}(${sheetIndex + 1}/${totalSheets})`
        : baseVoucherNo
    const rows = Array.from(
      { length: rowCount },
      (_, index) => chunk[index]
    )
    return `<article class="voucher-sheet">
      <h2 class="voucher-title">${escapeHtml(title)}</h2>
      <div class="voucher-meta">
        <span>核算单位：${escapeHtml(companyName || '-')}</span>
        <span>日期：${escapeHtml(voucherDate)}</span>
        <span>凭证号：${escapeHtml(voucherNo)}</span>
        <span>附单据数：${voucher.attachmentCount ?? 0}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 28%">摘要</th>
            <th>会计科目</th>
            <th style="width: 18%">借方金额</th>
            <th style="width: 18%">贷方金额</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((entry) => buildEntryRowHtml(entry, config)).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">合计：${escapeHtml(toChineseMoney(debitTotal))}</td>
            <td class="text-right">${escapeHtml(formatAmount(debitTotal))}</td>
            <td class="text-right">${escapeHtml(formatAmount(creditTotal))}</td>
          </tr>
        </tfoot>
      </table>
      <div class="voucher-footer">
        <span>${creator}</span>
        <span>${reviewer}</span>
      </div>
    </article>`
  })
}

function buildEntryRowHtml(
  entry: API.Entry | undefined,
  config: FmsVoucherPrintConfig
) {
  if (!entry) {
    return '<tr><td></td><td></td><td></td><td></td></tr>'
  }
  return `<tr>
    <td>${escapeHtml(entry.digest || '')}</td>
    <td>${escapeHtml(formatEntrySubjectText(entry, config))}</td>
    <td class="text-right">${escapeHtml(formatMoney(entry.debitAmount))}</td>
    <td class="text-right">${escapeHtml(formatMoney(entry.creditAmount))}</td>
  </tr>`
}

function formatEntrySubjectText(
  entry: API.Entry,
  config: FmsVoucherPrintConfig
) {
  const subjectText = formatSubjectDisplay(
    entry.subjectCode,
    entry.subjectName,
    config.printAuxiliary
      ? (entry.auxiliaries || []).map((item: any) => item.name)
      : []
  )
  if (!config.printQuantityAndPrice || (!entry.quantity && !entry.unitPrice)) {
    return subjectText
  }
  const quantityText = entry.quantity ? `数量:${entry.quantity}` : ''
  const unitPriceText = entry.unitPrice
    ? `单价:${formatAmount(entry.unitPrice)}`
    : ''
  const extraText = [quantityText, unitPriceText].filter(Boolean).join(' ')
  return extraText ? `${subjectText}（${extraText}）` : subjectText
}

function formatEntrySubjectName(
  entry: API.Entry,
  printAuxiliary: boolean
) {
  const auxiliaryText = printAuxiliary
    ? (entry.auxiliaries || [])
        .map((item: any) => item.name)
        .filter(Boolean)
        .join(' / ')
    : ''
  return auxiliaryText
    ? `${entry.subjectName || ''} / ${auxiliaryText}`
    : entry.subjectName || ''
}

function sumCreditAmount(entries: API.Entry[]) {
  return Number(
    entries
      .reduce((total, entry) => total + Number(entry.creditAmount || 0), 0)
      .toFixed(2)
  )
}

function chunkVoucherSheets(sheets: string[], size: number) {
  const pages: string[][] = []
  for (let i = 0; i < sheets.length; i += size) {
    pages.push(sheets.slice(i, i + size))
  }
  return pages
}

