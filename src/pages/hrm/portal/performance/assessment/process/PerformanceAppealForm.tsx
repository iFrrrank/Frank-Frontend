import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Button, Checkbox, Form, Input, Modal, Space, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import { uploadFile } from '@/api/infra/fileList'
import { HrmPerformanceAssessmentStageStatus } from '@/pages/hrm/performance/constants'

export interface PerformanceAppealFormProps {
  onSuccess: () => void
}

export interface PerformanceAppealFormRef {
  open: (assessmentId: number) => Promise<void>
}

const PerformanceAppealForm = forwardRef<PerformanceAppealFormRef, PerformanceAppealFormProps>(
  ({ onSuccess }, ref) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [assessmentId, setAssessmentId] = useState<number>()
    const [completedStages, setCompletedStages] = useState<any[]>([])
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [form] = Form.useForm()

    useImperativeHandle(ref, () => ({
      open: async (id: number) => {
        setAssessmentId(id)
        setOpen(true)
        setLoading(true)
        form.resetFields()
        setFileList([])
        try {
          const resp = await PerformanceAssessmentApi.getPerformanceAssessment(id)
          const stages = (resp.data?.reviewStages || []).filter(
            (stage: any) =>
              stage.id != null && stage.status === HrmPerformanceAssessmentStageStatus.PROCESSED
          )
          setCompletedStages(stages)
          const latest = stages[stages.length - 1]
          form.setFieldsValue({
            reviewStageIds: latest?.id ? [latest.id] : [],
            appealReason: ''
          })
        } finally {
          setLoading(false)
        }
      }
    }))

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields()
        if (!assessmentId) return

        setSubmitting(true)

        const appealFileUrls = fileList
          .map((f) => f.url || (f.response as string) || (f.response?.data as string))
          .filter(Boolean)

        await PerformanceAssessmentApi.submitPerformanceAssessmentAppeal({
          assessmentId,
          appealReason: values.appealReason,
          reviewStageIds: values.reviewStageIds,
          appealFileUrls
        })

        message.success('绩效申诉已提交')
        setOpen(false)
        onSuccess()
      } catch (err: any) {
        if (err?.errorFields) return
        message.error(err?.message || '提交申诉失败')
      } finally {
        setSubmitting(false)
      }
    }

    const customUpload = async (options: any) => {
      const { file, onSuccess: uploadSuccess, onError: uploadError } = options
      try {
        const formData = new FormData()
        formData.append('file', file)
        const resp: any = await uploadFile(formData as any)
        const fileUrl = resp.data || resp
        uploadSuccess(fileUrl)
      } catch (err) {
        uploadError(err)
      }
    }

    const stageOptions = completedStages.map((stage) => ({
      label: (
        <span>
          {stage.name || '评分阶段'}
          {stage.handlerName && `（${stage.handlerName}）`}
        </span>
      ),
      value: stage.id
    }))

    return (
      <Modal
        title="提交绩效申诉"
        width={680}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="horizontal" labelCol={{ flex: '120px' }}>
          <Form.Item
            name="reviewStageIds"
            label="退回评分节点"
            rules={[{ required: true, message: '请选择需要退回的评分节点' }]}
          >
            <Checkbox.Group options={stageOptions} />
          </Form.Item>

          <Form.Item
            name="appealReason"
            label="申诉原因"
            rules={[{ required: true, message: '申诉原因不能为空' }]}
          >
            <Input.TextArea rows={4} maxLength={500} showCount placeholder="请输入申诉原因" />
          </Form.Item>

          <Form.Item label="申诉附件">
            <Upload
              customRequest={customUpload}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>上传附件 (最多5个)</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

export default PerformanceAppealForm
