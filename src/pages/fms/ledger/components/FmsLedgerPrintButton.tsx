import React, { useRef } from 'react'
import { Button, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import HasPermi from '@/directives/permission/HasPermi'
import FmsPrintPreview, {
  type FmsPrintPreviewRef
} from '@/pages/fms/components/print/FmsPrintPreview'
import { useFmsStore } from '@/pages/fms/store/fms'
import { formatPeriodLabel } from '@/pages/fms/utils/format'
import { buildFmsTablePrintHtml } from '@/pages/fms/utils/print'

interface FmsLedgerPrintButtonProps {
  target: string
  title: string
  startMonth: string
  endMonth: string
  permissionPrefix?: string
  centerText?: string
  beforePrint?: () => void | Promise<void>
}

const FmsLedgerPrintButton: React.FC<FmsLedgerPrintButtonProps> = ({
  target,
  title,
  startMonth,
  endMonth,
  permissionPrefix = 'fms:ledger:general',
  centerText = '',
  beforePrint
}) => {
  const fmsStore = useFmsStore()
  const printPreviewRef = useRef<FmsPrintPreviewRef>(null)

  const handlePrint = async () => {
    await beforePrint?.()
    await new Promise((resolve) => setTimeout(resolve, 60))
    const tableElement = document.getElementById(target)
    if (!tableElement) {
      message.error('未找到可打印的表格')
      return
    }
    printPreviewRef.current?.printHtml(
      buildFmsTablePrintHtml({
        title,
        companyName: fmsStore.accountSet?.companyName || '',
        periodLabel: formatPeriodLabel(startMonth, endMonth),
        centerText,
        tableElement
      })
    )
  }

  return (
    <>
      <HasPermi value={`${permissionPrefix}:print`}>
        <Button type="primary" ghost icon={<PrinterOutlined />} onClick={handlePrint}>
          打印
        </Button>
      </HasPermi>
      <FmsPrintPreview ref={printPreviewRef} />
    </>
  )
}

export default FmsLedgerPrintButton
