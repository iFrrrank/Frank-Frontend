import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'

type DeleteApi = (params: { ids: number[] }) => Promise<any>

export const handleBatchDelete = async (
  selectedRowKeys: React.Key[],
  deleteApi: DeleteApi,
  clearSelected: () => void,
  reload: () => void,
  content = textConst.msg.delDataMsg
) => {
  if (!selectedRowKeys?.length) {
    message.warning(textConst.msg.delDataMsg)
    return
  }

  Modal.confirm({
    title: textConst.msg.confirmTitle,
    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    content,
    okText: textConst.common.ok,
    cancelText: textConst.common.cancel,
    onOk: async () => {
      try {
        await Promise.all(selectedRowKeys.map((id) => deleteApi({ ids: [Number(id)] })))
        message.success(textConst.msg.batchDelSuccess)
        clearSelected()
        reload()
      } catch {
        message.error(textConst.msg.batchDelError)
      }
    }
  })
}
