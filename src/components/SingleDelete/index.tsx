import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'

type DeleteApi = (params: { id: number }) => Promise<any>

export const handleDelete = (
  record: { id: number },
  deleteApi: DeleteApi,
  reload: () => void,
  content = textConst.msg.delOneMsg
) => {
  Modal.confirm({
    title: textConst.msg.confirmTitle,
    icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    content,
    okText: textConst.common.ok,
    cancelText: textConst.common.cancel,
    onOk: async () => {
      try {
        await deleteApi({ id: record.id })
        message.success(textConst.msg.delSuccess)
        reload()
      } catch {
        message.error(textConst.msg.delError)
      }
    }
  })
}
