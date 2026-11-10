import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Button, Modal, Space } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'

export interface FmsPrintPreviewRef {
  printHtml: (html: string, title?: string) => void
}

/**
 * FMS 账表/凭证打印预览弹窗
 */
const FmsPrintPreview = forwardRef<FmsPrintPreviewRef>((_, ref) => {
  const [visible, setVisible] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('打印预览')
  const [printContent, setPrintContent] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  /** 打开打印预览 */
  const printHtml = (html: string, title = '打印预览') => {
    setDialogTitle(title)
    setPrintContent(html)
    setVisible(true)
  }

  useImperativeHandle(ref, () => ({
    printHtml
  }))

  /** 执行浏览器打印 */
  const handlePrint = () => {
    const printWindow = iframeRef.current?.contentWindow
    if (!printWindow) return
    printWindow.focus()
    printWindow.print()
  }

  return (
    <Modal
      title={dialogTitle}
      open={visible}
      onCancel={() => setVisible(false)}
      width="92vw"
      style={{ top: 24 }}
      destroyOnHidden
      footer={
        <Space>
          <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            打印
          </Button>
          <Button onClick={() => setVisible(false)}>关闭</Button>
        </Space>
      }
    >
      {visible && (
        <iframe
          ref={iframeRef}
          title={dialogTitle}
          srcDoc={printContent}
          style={{
            width: '100%',
            height: 'calc(100vh - 200px)',
            border: '1px solid #f0f0f0',
            borderRadius: 6,
            backgroundColor: '#fff'
          }}
        />
      )}
    </Modal>
  )
})

FmsPrintPreview.displayName = 'FmsPrintPreview'

export default FmsPrintPreview

