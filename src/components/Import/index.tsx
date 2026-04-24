import React, { useState } from 'react'
import { Modal, Switch, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { textConst } from '@/locales/zh-CN'
import download from '@/utils/download'

const { Dragger } = Upload

export interface ImportModalProps {
  title?: string
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  importApi: (params: any, file: File) => Promise<any>
  templateApi: () => Promise<any>
  templateName?: string
  showUpdateSupport?: boolean // 是否显示“覆盖更新”开关
}

const ImportModal: React.FC<ImportModalProps> = ({
  title = '导入',
  open,
  onCancel,
  onSuccess,
  importApi,
  templateApi,
  templateName = '导入模板.xlsx',
  showUpdateSupport = false
}) => {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)

  const handleExportBtnClick = async () => {
    try {
      const resp = await templateApi()
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
      <div style={{ marginBottom: 16 }}>
        <a onClick={handleExportBtnClick}>下载导入模板</a>
      </div>
      <Dragger
        accept=".xlsx,.xls"
        maxCount={1}
        beforeUpload={(file) => {
          setImportFile(file)
          // 阻止自动上传，手动进行触发
          return false
        }}
        onRemove={() => setImportFile(null)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">支持 .xlsx 或 .xls 格式的 Excel 文件</p>
      </Dragger>

      {showUpdateSupport && (
        <div style={{ marginTop: 16 }}>
          <span style={{ marginRight: 8 }}>是否覆盖更新已有数据</span>
          <Switch checked={updateSupport} onChange={setUpdateSupport} />
        </div>
      )}
    </Modal>
  )
}

export default ImportModal
