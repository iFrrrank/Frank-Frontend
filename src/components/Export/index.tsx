import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'
import download from '@/utils/download'

interface ExportOptions {
  exportApi: (params: any) => Promise<any>
  exportParams: any
  fileName?: string
  content?: string
}

export const handleExport = ({
  exportApi,
  exportParams,
  fileName = '导出数据.xlsx',
  content = textConst.msg.exportMsg
}: ExportOptions) => {
  Modal.confirm({
    title: textConst.msg.reminder,
    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    content,
    okText: textConst.common?.ok,
    cancelText: textConst.common?.cancel,
    onOk: async () => {
      try {
        const resp = await exportApi(exportParams)
        download.excel(resp, fileName)
        message.success(textConst.msg.exportSuccess)
      } catch (err: any) {
        if (!err.errorFields) {
          message.error(textConst.msg.exportError)
        }
        // 导出失败时弹窗不关闭
        return Promise.reject(err)
      }
    }
  })
}
