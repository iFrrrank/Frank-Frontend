import React from 'react'
import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'

type ExportApi = (params: any) => Promise<any>

export const handleExport = (
  exportApi: ExportApi,
  exportParams: any,
  fileName: string = '导出数据.xlsx',
  content: string = '确认导出所有数据项吗？'
) => {
  Modal.confirm({
    title: textConst.msg.reminder,
    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    content,
    okText: textConst.common?.ok || '确认',
    cancelText: textConst.common?.cancel || '取消',
    onOk: async () => {
      try {
        const resp = await exportApi(exportParams)
        const blob = new Blob([resp], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(url)
        message.success(textConst.msg.exportSuccess || '导出成功')
      } catch (err) {
        message.error(textConst.msg.exportError || '导出失败')
      }
    }
  })
}
