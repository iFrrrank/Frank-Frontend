import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Button, Modal, Result, Spin, Steps, Upload, message } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { DownloadOutlined, InboxOutlined } from '@ant-design/icons'
import {
  fmsVoucherGetVoucherImportTemplate,
  fmsVoucherImportVoucher
} from '@/api/fms/voucher'
import download from '@/utils/download'

export interface FmsVoucherImportFormRef {
  open: (accountSetId: number) => void
}

interface FmsVoucherImportFormProps {
  onSuccess?: () => void
}

const FmsVoucherImportForm = forwardRef<FmsVoucherImportFormRef, FmsVoucherImportFormProps>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false)
    const [step, setStep] = useState(0)
    const [accountSetId, setAccountSetId] = useState(0)
    const [templateLoading, setTemplateLoading] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [result, setResult] = useState<API.FmsVoucherImportRespVO>()

    useImperativeHandle(ref, () => ({
      open: (id: number) => {
        setAccountSetId(id)
        setVisible(true)
        resetImport()
      }
    }))

    const resetImport = () => {
      setStep(0)
      setFileList([])
      setResult(undefined)
    }

    /** 凭证导入结果摘要 */
    const importResultSummary = useMemo(() => {
      return `共 ${result?.totalVoucherCount || 0} 张凭证、${result?.totalRowCount || 0} 条分录，成功 ${result?.successVoucherCount || 0} 张、${result?.successRowCount || 0} 条，失败 ${result?.failureVoucherCount || 0} 张、${result?.failureRowCount || 0} 条`
    }, [result])

    /** 下载凭证导入模板 */
    const downloadTemplate = async () => {
      setTemplateLoading(true)
      try {
        const data = await fmsVoucherGetVoucherImportTemplate(
          { accountSetId },
          { responseType: 'blob' }
        )
        download.excel(data, '凭证导入模板.xlsx')
      } finally {
        setTemplateLoading(false)
      }
    }

    /** 提交凭证导入 */
    const submitImport = async () => {
      const rawFile = fileList[0]?.originFileObj || (fileList[0] as unknown as File)
      if (!rawFile) {
        message.warning('请选择需要导入的文件')
        return
      }
      if (rawFile.size > 2 * 1024 * 1024) {
        message.error('导入文件不能超过 2MB')
        return
      }
      setStep(1)
      try {
        const formData = new FormData()
        formData.append('file', rawFile)
        const resp = await fmsVoucherImportVoucher(
          { accountSetId, file: undefined as any },
          { data: formData }
        )
        if (resp.code === 0 && resp.data) {
          setResult(resp.data)
          setStep(2)
          if ((resp.data.successVoucherCount || 0) > 0) {
            onSuccess?.()
          }
        } else {
          setStep(0)
        }
      } catch {
        setStep(0)
      }
    }

    /** 下载导入错误文件 */
    const downloadErrorFile = () => {
      if (!result?.errorFileUrl) return
      const a = document.createElement('a')
      a.href = result.errorFileUrl
      a.download = '凭证导入错误数据.xlsx'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    return (
      <Modal
        title="导入凭证"
        open={visible}
        width={750}
        onCancel={() => setVisible(false)}
        footer={
          step === 0 ? (
            <>
              <Button onClick={() => setVisible(false)}>取 消</Button>
              <Button type="primary" disabled={!fileList.length} onClick={submitImport}>
                开始导入
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <Button onClick={resetImport}>继续导入</Button>
              <Button type="primary" onClick={() => setVisible(false)}>
                完 成
              </Button>
            </>
          ) : null
        }
        destroyOnHidden
      >
        <Steps
          current={step}
          style={{ marginBottom: 28 }}
          items={[{ title: '上传文件' }, { title: '导入数据' }, { title: '导入完成' }]}
        />

        {step === 0 && (
          <div style={{ minHeight: 340, padding: '0 36px' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ marginBottom: 14, fontSize: 15, fontWeight: 600 }}>
                一、请按照数据模板的格式准备要导入的数据
              </div>
              <div style={{ paddingLeft: 20 }}>
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  loading={templateLoading}
                  onClick={downloadTemplate}
                  style={{ padding: 0 }}
                >
                  下载《凭证导入模板》
                </Button>
                <div style={{ marginTop: 8, fontSize: 13, color: '#909399' }}>
                  导入文件请勿超过 2MB
                </div>
              </div>
            </div>
            <div>
              <div style={{ marginBottom: 14, fontSize: 15, fontWeight: 600 }}>
                二、请选择需要导入的文件
              </div>
              <Upload.Dragger
                accept=".xlsx,.xls"
                maxCount={1}
                fileList={fileList}
                beforeUpload={(file) => {
                  setFileList([file])
                  return false
                }}
                onRemove={() => {
                  setFileList([])
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                </p>
                <p className="ant-upload-text">
                  将文件拖到此处，或<span style={{ color: '#1677ff' }}>点击选择文件</span>
                </p>
                <p className="ant-upload-hint">仅支持 xls、xlsx 格式</p>
              </Upload.Dragger>
            </div>
          </div>
        )}

        {step === 1 && (
          <div
            style={{
              display: 'flex',
              minHeight: 330,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <Spin size="large" />
            <div style={{ marginTop: 24, fontSize: 18, fontWeight: 600 }}>
              凭证正在导入，请稍候
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#909399' }}>
              系统会按同一日期、凭证字和凭证号合并分录
            </div>
          </div>
        )}

        {step === 2 && (
          <div
            style={{
              display: 'flex',
              minHeight: 330,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <Result
              status={result?.failureVoucherCount ? 'warning' : 'success'}
              title={
                result?.failureVoucherCount ? '凭证导入完成，部分数据未导入' : '凭证导入成功'
              }
              subTitle={importResultSummary}
              extra={
                result?.errorFileUrl ? (
                  <Button
                    type="primary"
                    ghost
                    icon={<DownloadOutlined />}
                    onClick={downloadErrorFile}
                  >
                    下载错误数据
                  </Button>
                ) : null
              }
            />
          </div>
        )}
      </Modal>
    )
  }
)

FmsVoucherImportForm.displayName = 'FmsVoucherImportForm'

export default FmsVoucherImportForm

