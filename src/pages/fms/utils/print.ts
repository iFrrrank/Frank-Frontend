/** FMS 账表打印参数 */
export interface FmsTablePrintOptions {
  title: string
  companyName: string
  periodLabel: string
  centerText?: string
  unitLabel?: string
  footerLabels?: string[]
  tableElement: HTMLElement
}

/**
 * 构建 FMS 账表打印 HTML（兼容 Ant Design Table 与原生 Table DOM）
 */
export function buildFmsTablePrintHtml(options: FmsTablePrintOptions) {
  const theadHtml =
    options.tableElement.querySelector('.ant-table-thead')?.innerHTML ||
    options.tableElement.querySelector('thead')?.innerHTML ||
    ''
  const tbodyClone = (options.tableElement.querySelector('.ant-table-tbody') ||
    options.tableElement.querySelector('tbody'))?.cloneNode(true) as HTMLElement | undefined
  // 移除 Ant Design Table 虚拟测量隐藏行
  tbodyClone?.querySelectorAll('.ant-table-measure-row').forEach((row) => row.remove())
  const tbodyHtml = tbodyClone?.innerHTML || ''
  const tfootHtml =
    options.tableElement.querySelector('.ant-table-summary')?.innerHTML ||
    options.tableElement.querySelector('tfoot')?.innerHTML ||
    ''
  const footerHtml = options.footerLabels?.length
    ? `<div class="footer">${options.footerLabels.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
    : ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(options.title)}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { margin: 0; color: #303133; font-family: "Microsoft YaHei", sans-serif; font-size: 12px; }
  h1 { margin: 0 0 12px; text-align: center; font-size: 20px; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 10px; gap: 16px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { padding: 6px 8px; border: 1px solid #dcdfe6; word-break: break-all; }
  th { background: #f5f7fa; text-align: center; }
  .ant-table-cell-ellipsis, .cell { overflow: visible !important; white-space: normal !important; }
  .ant-table-row-expand-icon { display: none !important; }
  button, a { border: 0; background: transparent; padding: 0; font: inherit; color: inherit; text-decoration: none; }
  .footer { display: flex; justify-content: space-between; margin-top: 16px; }
</style>
</head>
<body>
  <h1>${escapeHtml(options.title)}</h1>
  <div class="meta">
    <span>核算单位：${escapeHtml(options.companyName || '-')}</span>
    <span>${escapeHtml(options.centerText || '')}</span>
    <span>期间：${escapeHtml(options.periodLabel || '-')}</span>
    <span>单位：${escapeHtml(options.unitLabel || '元')}</span>
  </div>
  <table>
    <thead>${theadHtml}</thead>
    <tbody>${tbodyHtml}</tbody>
    ${tfootHtml ? `<tfoot>${tfootHtml}</tfoot>` : ''}
  </table>
  ${footerHtml}
</body>
</html>`
}

/**
 * 转义打印 HTML 文本
 */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

