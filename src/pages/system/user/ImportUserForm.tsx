import React, { useRef, useState } from 'react'
import { Modal, message, Upload, Switch } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import { InboxOutlined } from '@ant-design/icons'
import { importExcel, importTemplate } from '@/api/system/user'
import textConstants from '@/locales/zh-CN'

const { Dragger } = Upload

export let handleImportUser: () => void

const ImportUserModal: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importLoading, setImportLoading] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(false)

  // 导入用户
  handleImportUser = async () => {
    if (!importFile) {
      message.warning('请先选择文件')
      return
    }
    setImportLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)
      const resp = await importExcel({ updateSupport, file: importFile } as any, formData as any)
      if (resp.code === 0) {
        const data = resp.data
        const msgs: string[] = []
        if (data?.createUsernames?.length) {
          msgs.push(`成功导入用户: ${data.createUsernames.join(', ')}`)
        }
        if (data?.updateUsernames?.length) {
          msgs.push(`成功更新用户: ${data.updateUsernames.join(', ')}`)
        }
        if (data?.failureUsernames) {
          const failMap = data.failureUsernames as Record<string, string>
          const failKeys = Object.keys(failMap)
          if (failKeys.length > 0) {
            msgs.push(`导入失败用户: ${failKeys.join(', ')}`)
          }
        }
        message.success(msgs.join('；') || textConstants.msg.exportSuccess)
        setImportModalVisible(false)
        setImportFile(null)
        actionRef.current?.reload()
      } else {
        message.error(resp.msg || textConstants.msg.exportFail)
      }
    } catch {
      message.error(textConstants.msg.exportFail)
    } finally {
      setImportLoading(false)
    }
  }

  // 下载导入模板
  const handleDownloadTemplate = async () => {
    try {
      const resp = await importTemplate()
      const blob = new Blob([resp], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = '用户导入模板.xlsx'
      link.click()
      window.URL.revokeObjectURL(url)
    } catch {
      message.error('下载模板失败')
    }
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
        <a onClick={handleDownloadTemplate}>下载导入模板</a>
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

export default ImportUserModal
