import React, { useState } from 'react'
import { Modal, Switch, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'
import download from '@/utils/download'

const { Dragger } = Upload

export interface ImportModalProps {
  title?: string
  open: boolean
  accept?: string // 限制上传的格式，如 '.xlsx,.xls' 或 '.jpg,.png'
  maxSize?: number // 文件大小限制（单位：MB），如果不传则不限制
  onCancel: () => void
  onSuccess: () => void
  importApi: (params: any, file: File) => Promise<any>
  templateApi?: () => Promise<any>
  templateName?: string
  showUpdateSupport?: boolean // 是否显示“覆盖更新”开关
  // UI 文本定制
  draggerTitle?: React.ReactNode // 拖拽区主标题
  draggerHint?: React.ReactNode // 拖拽区副标题
  // 扩展插槽
  topContent?: React.ReactNode // 拖拽区上方的扩展内容
  bottomContent?: React.ReactNode // 拖拽区下方的扩展内容
}

const ImportModal: React.FC<ImportModalProps> = ({
  title = '导入',
  open,
  accept,
  maxSize = 5,
  onCancel,
  onSuccess,
  importApi,
  templateApi,
  templateName = '导入模板.xlsx',
  showUpdateSupport = false,
  draggerTitle = '点击或拖拽文件到此区域上传',
  draggerHint = `支持 .xlsx 或 .xls 格式的 Excel 文件，不超过 ${maxSize} MB`,
  topContent,
  bottomContent
}) => {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)

  const downloadTemplate = async () => {
    if (!templateApi) {
      return
    }
    try {
      const resp = await templateApi?.()
      download.excel(resp, templateName)
      message.success(textConst.msg.importTemplateSuccess)
    } catch (err: any) {
      message.error(textConst.msg.importTemplateError)
    }
  }

  // 确认导入操作
  const handleImport = async () => {
    if (!importFile) {
      message.warning('请先选择要导入的文件！')
      return
    }

    try {
      setImportLoading(true)
      const resp = await importApi({ updateSupport }, importFile)

      if (resp && resp.code === 0 && resp.data) {
        const { createUsernames = [], updateUsernames = [], failureUsernames = {} } = resp.data

        const createCount = createUsernames.length
        const updateCount = updateUsernames.length
        const failureEntries = Object.entries(failureUsernames)
        const failureCount = failureEntries.length

        if (failureCount > 0) {
          failureEntries.forEach(([username, reason]) => {
            message.error(`用户 ${username} 导入失败：${reason}！`)
          })
        }

        if (createCount > 0 || updateCount > 0) {
          message.success(`导入完成：新增成功 ${createCount} 条，更新成功 ${updateCount} 条`)
        }

        // 只要有成功的数据，或者完全没有失败，就刷新列表并关闭弹窗
        if (createCount > 0 || updateCount > 0 || failureCount === 0) {
          setImportFile(null)
          setUpdateSupport(false)
          onSuccess()
        }
      } else {
        message.error(resp?.msg || textConst.msg.importError)
      }
    } catch (error: any) {
      message.error(error?.message || textConst.msg.importError)
    } finally {
      setImportLoading(false)
    }
  }

  // 关闭弹窗时清理状态
  const handleCancel = () => {
    setImportFile(null)
    setUpdateSupport(false)
    onCancel()
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      onOk={handleImport}
      confirmLoading={importLoading}
      destroyOnHidden
    >
      {topContent && <div style={{ marginBottom: 16 }}>{topContent}</div>}
      <Dragger
        accept={accept}
        maxCount={1}
        beforeUpload={(file) => {
          if (maxSize) {
            // file.size 的单位是字节（Bytes），除以两次 1024 得到 MB
            const isLtMaxSize = file.size / 1024 / 1024 < maxSize

            if (!isLtMaxSize) {
              message.error(`文件大小不能超过 ${maxSize} MB！`)
              // 彻底拒绝该文件，不会显示在文件列表
              return Upload.LIST_IGNORE
            }
          }

          setImportFile(file)
          // 阻止自动上传，手动进行触发
          return false
        }}
        onRemove={() => setImportFile(null)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{draggerTitle}</p>
        {draggerHint && <p className="ant-upload-hint">{draggerHint}</p>}
      </Dragger>

      {
        bottomContent ? (
          // 1：父组件传入了特定的 bottomContent，优先渲染自定义内容
          <div style={{ marginTop: 10 }}>{bottomContent}</div>
        ) : showUpdateSupport ? (
          // 2：没传 bottomContent，但要求显示开关或有下载接口，则渲染默认结构
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            {showUpdateSupport && (
              <>
                <span style={{ marginRight: 8 }}>是否覆盖更新已有数据</span>
                <Switch checked={updateSupport} onChange={setUpdateSupport} />{' '}
                <a style={{ marginLeft: 'auto' }} onClick={downloadTemplate}>
                  下载导入模板
                </a>
              </>
            )}
          </div>
        ) : null // 3：如果都没传，彻底不渲染底部元素
      }
    </Modal>
  )
}

export default ImportModal
