import React, { useRef } from 'react'
import { Button, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import FmsPrintPreview, {
  type FmsPrintPreviewRef
} from '@/pages/fms/components/print/FmsPrintPreview'
import { useFmsStore } from '@/pages/fms/store/fms'
import { buildFmsTablePrintHtml } from '@/pages/fms/utils/print'

interface FmsReportPrintButtonProps {
  disabled?: boolean
  periodLabel: string
  target: string
  title: string
}

const FmsReportPrintButton: React.FC<FmsReportPrintButtonProps> = ({
  disabled,
  periodLabel,
  target,
  title
}) => {
  const fmsStore = useFmsStore()
  const printPreviewRef = useRef<FmsPrintPreviewRef>(null)

  const handlePrint = () => {
    const tableElement = document.getElementById(target)
    if (!tableElement) {
      message.error('未找到可打印的表格')
      return
    }
    printPreviewRef.current?.printHtml(
      buildFmsTablePrintHtml({
        title,
        companyName: fmsStore.accountSet?.companyName || '',
        periodLabel,
        footerLabels: ['单位负责人：', '会计负责人：', '制表人：'],
        tableElement
      })
    )
  }

  return (
    <>
      <Button disabled={disabled} icon={<PrinterOutlined />} onClick={handlePrint}>
        打印
      </Button>
      <FmsPrintPreview ref={printPreviewRef} />
    </>
  )
}

export default FmsReportPrintButton
