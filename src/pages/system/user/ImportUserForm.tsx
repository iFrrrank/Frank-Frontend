import React, { useRef, useState } from 'react'
import { message, Modal, Switch, Upload } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import { InboxOutlined } from '@ant-design/icons'
import { importExcel, importTemplate } from '@/api/system/user'
import { handleImport, handleDownloadTemplate } from '@/components/Import'
import { textConst } from '@/locales/zh-CN'

const { Dragger } = Upload

export let handleImportUser: () => void

const ImportUserForm: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)

  // 导入用户
  handleImportUser = async () => {
    setImportLoading(true)
    await handleImport(
      importExcel,
      importFile,
      { updateSupport },
      () => actionRef.current?.reload(),
      () => {
        setImportModalVisible(false)
        setImportFile(null)
      }
    )
    setImportLoading(false)
  }

  // 下载导入模板
  const handleDownloadTemplateClick = async () => {
    await handleDownloadTemplate(importTemplate, '用户导入模板.xlsx')
  }

  return (
    <Modal
      title="导入用户"
      open={importModalVisible}
      onCancel={() => {
        setImportModalVisible(false)
        setImportFile(null)
      }}
      onOk={handleImportUser}
      confirmLoading={importLoading}
      okText="确认导入"
    >
      <div style={{ marginBottom: 16 }}>
        <a onClick={handleDownloadTemplateClick}>下载导入模板</a>
      </div>
      <Dragger
        accept=".xlsx,.xls"
        maxCount={1}
        beforeUpload={(file) => {
          setImportFile(file)
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
      <div style={{ marginTop: 16 }}>
        <span style={{ marginRight: 8 }}>是否覆盖更新已有用户：</span>
        <Switch checked={updateSupport} onChange={setUpdateSupport} />
      </div>
    </Modal>
  )
}

export default ImportUserForm
