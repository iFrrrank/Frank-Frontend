import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Empty, Modal, Upload, message } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
import { fmsVoucherUpdateVoucherAttachments } from '@/api/fms/voucher'
import { uploadFile } from '@/api/infra/fileList'
import { useHasPermi } from '@/directives/permission/HasPermi'
import { useFmsStore } from '@/pages/fms/store/fms'
import { FMS_VOUCHER_ATTACHMENT_FILE_TYPES, FMS_VOUCHER_STATUS } from '@/pages/fms/utils/constants'

export interface FmsVoucherAttachmentFormRef {
  open: (currentAccountSetId: number, voucher: API.FmsVoucherRespVO) => void
}

interface FmsVoucherAttachmentFormProps {
  onSuccess?: () => void
}

const FmsVoucherAttachmentForm = forwardRef<
  FmsVoucherAttachmentFormRef,
  FmsVoucherAttachmentFormProps
>(({ onSuccess }, ref) => {
  const fmsStore = useFmsStore()
  const checkPermi = useHasPermi()
  const hasUpdatePermi = checkPermi('fms:voucher:update')

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accountSetId, setAccountSetId] = useState(0)
  const [voucherId, setVoucherId] = useState(0)
  const [editable, setEditable] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  useImperativeHandle(ref, () => ({
    open: (currentAccountSetId: number, voucher: API.FmsVoucherRespVO) => {
      setAccountSetId(currentAccountSetId)
      setVoucherId(voucher.id!)
      const urls = voucher.attachmentUrls || []
      setFileList(
        urls.map((url, idx) => ({
          uid: `${idx}-${url}`,
          name: url.split('/').pop() || `附件${idx + 1}`,
          status: 'done',
          url
        }))
      )
      setEditable(
        fmsStore.isAccountSetWritable &&
          voucher.status === FMS_VOUCHER_STATUS.PENDING_REVIEW &&
          !voucher.closingGenerated &&
          hasUpdatePermi
      )
      setVisible(true)
    }
  }))

  /** 自定义上传处理 */
  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess: onUploadSuccess, onError } = options
    try {
      const formData = new FormData()
      formData.append('file', file)
      const resp = await uploadFile(
        {} as any,
        {
          data: formData,
          headers: {}
        }
      )
      if (resp.code === 0 && resp.data) {
        onUploadSuccess(resp.data)
      } else {
        onError(new Error(resp.msg || '上传失败'))
      }
    } catch (err) {
      onError(err)
    }
  }

  /** 提交凭证附件 */
  const handleSubmit = async () => {
    const attachmentUrls = fileList
      .filter((item) => item.status === 'done')
      .map((item) => item.url || item.response)
      .filter(Boolean) as string[]

    setLoading(true)
    try {
      const resp = await fmsVoucherUpdateVoucherAttachments({
        id: voucherId,
        accountSetId,
        attachmentUrls
      })
      if (resp.code === 0) {
        message.success('附件保存成功')
        setVisible(false)
        onSuccess?.()
      }
    } finally {
      setLoading(false)
    }
  }

  const acceptAttr = FMS_VOUCHER_ATTACHMENT_FILE_TYPES.map((ext) => `.${ext}`).join(',')

  return (
    <Modal
      title="凭证附件"
      open={visible}
      width={570}
      onCancel={() => setVisible(false)}
      footer={
        editable ? (
          <>
            <Button onClick={() => setVisible(false)}>取 消</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              保 存
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setVisible(false)}>
            确 定
          </Button>
        )
      }
      destroyOnHidden
    >
      {editable || fileList.length > 0 ? (
        <Upload
          accept={acceptAttr}
          fileList={fileList}
          disabled={!editable}
          maxCount={100}
          customRequest={handleCustomRequest}
          onChange={({ fileList: nextList }) => setFileList(nextList)}
        >
          {editable && (
            <Button icon={<UploadOutlined />}>
              上传附件（支持 {FMS_VOUCHER_ATTACHMENT_FILE_TYPES.join('/')}）
            </Button>
          )}
        </Upload>
      ) : (
        <Empty description="暂无附件" />
      )}
    </Modal>
  )
})

FmsVoucherAttachmentForm.displayName = 'FmsVoucherAttachmentForm'

export default FmsVoucherAttachmentForm
