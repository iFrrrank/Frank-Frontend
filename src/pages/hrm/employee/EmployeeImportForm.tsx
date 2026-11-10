import React, { useState } from 'react'
import { Modal, Radio, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { request } from '@umijs/max'
import { importTemplate } from '@/api/hrm/employee'
import download from '@/utils/download'

const { Dragger } = Upload

// 重复员工处理策略：1 跳过，2 覆盖，3 判失败
const DUPLICATE_STRATEGY_OPTIONS = [
  { label: '跳过', value: 1 },
  { label: '覆盖', value: 2 },
  { label: '判失败', value: 3 }
]

interface EmployeeImportFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

/** 上传员工档案文件（本地 API 层的 importExcel 不支持文件，按 home 模块先例在页面内直接请求） */
const uploadEmployeeFile = (params: { duplicateStrategy: number }, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request<API.CommonResultHrmEmployeeImportRespVO>('/hrm/employee/import', {
    method: 'POST',
    params: { duplicateStrategy: params.duplicateStrategy },
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/** 拼接导入结果文本（与 Vue 版一致：展示成功、跳过、失败明细） */
const buildImportResultText = (data?: API.HrmEmployeeImportRespVO): string => {
  if (!data) {
    return ''
  }
  let text = `上传成功数量：${data.createJobNumbers.length};`
  for (const jobNumber of data.createJobNumbers) {
    text += `< ${jobNumber} >`
  }
  text += `更新成功数量：${data.updateJobNumbers.length};`
  for (const jobNumber of data.updateJobNumbers) {
    text += `< ${jobNumber} >`
  }
  text += `跳过数量：${data.skipJobNumbers.length};`
  for (const jobNumber of data.skipJobNumbers) {
    text += `< ${jobNumber} >`
  }
  text += `更新失败数量：${Object.keys(data.failureJobNumbers).length};`
  for (const jobNumber in data.failureJobNumbers) {
    text += `< ${jobNumber}: ${data.failureJobNumbers[jobNumber]} >`
  }
  return text
}

// 员工档案导入（对应 Vue 的 EmployeeImportForm）
const EmployeeImportForm: React.FC<EmployeeImportFormProps> = ({
  visible,
  setVisible,
  onSuccess
}) => {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [duplicateStrategy, setDuplicateStrategy] = useState<number>(3)
  const [loading, setLoading] = useState<boolean>(false)

  /** 下载导入模板 */
  const downloadTemplate = async () => {
    try {
      const resp = await importTemplate()
      download.excel(resp, '员工档案导入模板.xlsx')
    } catch {
      message.error('下载模板失败，请稍后重试')
    }
  }

  /** 提交导入 */
  const handleImport = async () => {
    if (!importFile) {
      message.error('请上传文件')
      return
    }
    setLoading(true)
    try {
      const resp = await uploadEmployeeFile({ duplicateStrategy }, importFile)
      if (resp.code !== 0 || !resp.data) {
        message.error(resp.msg || '导入失败，请您重新上传！')
        setImportFile(null)
        return
      }
      // 展示导入结果明细
      Modal.info({
        title: '导入结果',
        width: 520,
        content: buildImportResultText(resp.data),
        okText: '知道了'
      })
      setImportFile(null)
      setDuplicateStrategy(3)
      setVisible(false)
      onSuccess()
    } catch {
      message.error('上传失败，请您重新上传！')
      setImportFile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setImportFile(null)
    setDuplicateStrategy(3)
    setVisible(false)
  }

  return (
    <Modal
      title="员工档案导入"
      open={visible}
      onCancel={handleCancel}
      onOk={handleImport}
      confirmLoading={loading}
      okText="确 定"
      cancelText="取 消"
      width={460}
    >
      <Dragger
        accept=".xlsx,.xls"
        maxCount={1}
        fileList={importFile ? [{ uid: '-1', name: importFile.name, status: 'done' }] : []}
        beforeUpload={(file) => {
          // 阻止自动上传，确认按钮手动触发
          setImportFile(file)
          return false
        }}
        onRemove={() => setImportFile(null)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
        <p className="ant-upload-hint">仅允许导入 xls、xlsx 格式文件。</p>
      </Dragger>
      <div style={{ marginTop: 10 }}>
        重复员工：
        <Radio.Group
          options={DUPLICATE_STRATEGY_OPTIONS}
          value={duplicateStrategy}
          onChange={(e) => setDuplicateStrategy(e.target.value)}
        />
        <a style={{ marginLeft: 12, fontSize: 12 }} onClick={downloadTemplate}>
          下载模板
        </a>
      </div>
    </Modal>
  )
}

export default EmployeeImportForm
