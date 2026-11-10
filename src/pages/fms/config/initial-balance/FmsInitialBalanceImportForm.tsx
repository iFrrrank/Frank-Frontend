import React, { useState } from 'react'
import { Button, Modal, Space, Upload, message } from 'antd'
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import {
  fmsInitialBalanceGetInitialBalanceImportTemplate,
  fmsInitialBalanceImportInitialBalance
} from '@/api/fms/config/initialBalance'
import download from '@/utils/download'

interface FmsInitialBalanceImportFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  onSuccess: () => void
}

/**
 * 财务初始余额导入弹窗
 */
const FmsInitialBalanceImportForm: React.FC<FmsInitialBalanceImportFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  onSuccess
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)

  const handleDownloadTemplate = async () => {
    setTemplateLoading(true)
    try {
      const data = await fmsInitialBalanceGetInitialBalanceImportTemplate(
        { accountSetId },
        { responseType: 'blob' }
      )
      download.excel(data, '财务初始余额导入模板.xlsx')
    } finally {
      setTemplateLoading(false)
    }
  }

  const handleSubmit = async () => {
    const rawFile = fileList[0]?.originFileObj || (fileList[0] as unknown as File)
    if (!rawFile) {
      message.warning('请上传文件')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', rawFile)
      const resp = await fmsInitialBalanceImportInitialBalance(
        { accountSetId },
        { data: formData }
      )
      if (resp.code === 0) {
        message.success(`成功导入 ${resp.data ?? 0} 条初始余额`)
        setVisible(false)
        setFileList([])
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="财务初始余额导入"
      open={visible}
      onCancel={() => {
        if (!loading) {
          setVisible(false)
          setFileList([])
        }
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      okButtonProps={{ disabled: fileList.length === 0 }}
      width={480}
      destroyOnHidden
    >
      <Upload.Dragger
        maxCount={1}
        accept=".xlsx,.xls"
        fileList={fileList}
        disabled={loading}
        beforeUpload={(file) => {
          setFileList([file as any])
          return false
        }}
        onRemove={() => {
          setFileList([])
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
      </Upload.Dragger>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Space direction="vertical" size={8}>
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            仅允许导入 xls、xlsx 格式文件。
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              loading={templateLoading}
              onClick={handleDownloadTemplate}
            >
              下载模板
            </Button>
          </span>
        </Space>
      </div>
    </Modal>
  )
}

export default FmsInitialBalanceImportForm
