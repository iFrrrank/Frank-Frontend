import React, { useState } from 'react'
import { Button, Checkbox, Modal, Space, Upload, message } from 'antd'
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import {
  fmsAuxiliaryItemGetAuxiliaryItemImportTemplate,
  fmsAuxiliaryItemImportAuxiliaryItem
} from '@/api/fms/config/auxiliaryItem'
import download from '@/utils/download'

interface FmsAuxiliaryItemImportFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  accountSetId: number
  auxiliaryType?: API.FmsAuxiliaryTypeRespVO
  onSuccess: () => void
}

/**
 * 辅助核算项目导入弹窗
 */
const FmsAuxiliaryItemImportForm: React.FC<FmsAuxiliaryItemImportFormProps> = ({
  visible,
  setVisible,
  accountSetId,
  auxiliaryType,
  onSuccess
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [updateSupport, setUpdateSupport] = useState(false)
  const [loading, setLoading] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)

  const handleDownloadTemplate = async () => {
    if (!auxiliaryType) return
    setTemplateLoading(true)
    try {
      const data = await fmsAuxiliaryItemGetAuxiliaryItemImportTemplate(
        {
          type: auxiliaryType.type
        },
        { responseType: 'blob' }
      )
      download.excel(data, `${auxiliaryType.name}导入模板.xls`)
    } finally {
      setTemplateLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!auxiliaryType) return
    const rawFile = fileList[0]?.originFileObj || (fileList[0] as unknown as File)
    if (!rawFile) {
      message.warning('请上传文件')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', rawFile)
      const resp = await fmsAuxiliaryItemImportAuxiliaryItem(
        {
          accountSetId,
          auxiliaryTypeId: auxiliaryType.id,
          file: undefined as any
        },
        { data: formData }
      )
      if (resp.code === 0 && resp.data) {
        const data = resp.data
        let content = `导入总数：${data.totalCount || 0}；成功数量：${data.successItemCodes?.length || 0}；`
        for (const code of data.successItemCodes || []) {
          content += `< ${code} >`
        }
        content += `失败数量：${Object.keys(data.failureReasons || {}).length}；`
        for (const [code, msgText] of Object.entries(data.failureReasons || {})) {
          content += `< ${code}: ${msgText} >`
        }
        Modal.info({
          title: '导入结果',
          content
        })
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
      title={`${auxiliaryType?.name || '辅助核算'}导入`}
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
          <Checkbox
            checked={updateSupport}
            disabled={loading}
            onChange={(e) => setUpdateSupport(e.target.checked)}
          >
            是否更新已经存在的{auxiliaryType?.name || '辅助核算'}数据
          </Checkbox>
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

export default FmsAuxiliaryItemImportForm

