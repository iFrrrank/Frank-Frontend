import { message } from 'antd'
import { textConst } from '@/locales/zh-CN'

type ImportApi = (params: any, data: FormData) => Promise<any>

export const handleImport = async (
  importApi: ImportApi,
  file: File | null,
  params: any = {},
  onSuccess?: () => void,
  onModalClose?: () => void
) => {
  // if (!file) {
  //   message.warning('请先选择文件')
  //   return false
  // }

  try {
    const formData = new FormData()
    formData.append('file', file)

    const resp = await importApi(params, formData)

    if (resp.code === 0) {
      const data = resp.data
      const msgs: string[] = []

      // Attempt to parse standard fields if present
      if (data?.createUsernames?.length) {
        msgs.push(`成功导入: ${data.createUsernames.join(', ')}`)
      }
      if (data?.updateUsernames?.length) {
        msgs.push(`成功更新: ${data.updateUsernames.join(', ')}`)
      }
      if (data?.failureUsernames) {
        const failMap = data.failureUsernames as Record<string, string>
        const failKeys = Object.keys(failMap)
        if (failKeys.length > 0) {
          msgs.push(`导入失败: ${failKeys.join(', ')}`)
        }
      }

      message.success(msgs.length > 0 ? msgs.join('；') : '导入成功')

      if (onModalClose) onModalClose()
      if (onSuccess) onSuccess()
      return true
    } else {
      message.error(resp.msg || '导入失败')
      return false
    }
  } catch (err) {
    message.error('操作发生异常')
    return false
  }
}

// Download template abstraction
export const handleDownloadTemplate = async (
  templateApi: () => Promise<any>,
  fileName: string = '导入模板.xlsx'
) => {
  try {
    const resp = await templateApi()
    const blob = new Blob([resp], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
  } catch {
    message.error('下载模板失败')
  }
}
