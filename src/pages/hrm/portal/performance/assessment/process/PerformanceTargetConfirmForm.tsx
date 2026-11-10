import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
  Button,
  Descriptions,
  Drawer,
  Input,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'

const { Text } = Typography

export interface PerformanceTargetConfirmFormProps {
  onSuccess: () => void
}

export interface PerformanceTargetConfirmFormRef {
  open: (assessmentId?: number, stageId?: number) => Promise<void>
}

const PerformanceTargetConfirmForm = forwardRef<
  PerformanceTargetConfirmFormRef,
  PerformanceTargetConfirmFormProps
>(({ onSuccess }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [detail, setDetail] = useState<
    Partial<PerformanceAssessmentApi.PortalPerformanceAssessmentVO>
  >({})
  const [comment, setComment] = useState('')

  useImperativeHandle(ref, () => ({
    open: async (assessmentId, stageId) => {
      if (!assessmentId || !stageId) return
      setOpen(true)
      setLoading(true)
      setComment('')
      try {
        const resp = await PerformanceAssessmentApi.getPerformanceAssessment(assessmentId, stageId)
        setDetail(resp.data || {})
      } finally {
        setLoading(false)
      }
    }
  }))

  const submitConfirm = async (pass: number) => {
    if (!detail.id) return

    if (pass === 0 && !comment.trim()) {
      message.error('退回指标时请填写原因')
      return
    }

    setSubmitting(true)
    try {
      await PerformanceAssessmentApi.confirmPerformanceAssessmentTarget({
        assessmentId: detail.id,
        pass,
        comment: comment.trim() || (pass === 1 ? '指标确认通过' : undefined)
      })
      message.success(pass === 1 ? '指标已确认' : '指标已退回')
      setOpen(false)
      onSuccess()
    } catch (err: any) {
      message.error(err?.message || '操作失败')
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnsType<any> = [
    { title: '维度', dataIndex: 'dimensionName', minWidth: 120, ellipsis: true },
    { title: '指标', dataIndex: 'name', minWidth: 160, ellipsis: true },
    { title: '指标说明', dataIndex: 'description', minWidth: 180, ellipsis: true },
    { title: '考核标准', dataIndex: 'standard', minWidth: 210, ellipsis: true },
    {
      title: '权重',
      width: 130,
      align: 'center',
      render: (_, record) => `${record.dimensionWeight || 0}% / ${record.weight || 0}%`
    }
  ]

  return (
    <Drawer
      title="确认绩效指标"
      width={920}
      open={open}
      onClose={() => setOpen(false)}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>取 消</Button>
          <Button danger loading={submitting} onClick={() => submitConfirm(0)}>
            退回指标
          </Button>
          <Button type="primary" loading={submitting} onClick={() => submitConfirm(1)}>
            确认通过
          </Button>
        </Space>
      }
    >
      <Spin spinning={loading}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{detail.employeeName || '-'}</div>
            <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>
              {detail.name || '-'}
            </Text>
          </div>
          <Tag color="warning">待指标确认</Tag>
        </div>

        <Descriptions bordered column={3} size="small" style={{ marginBottom: 16 }}>
          <Descriptions.Item label="工号">{detail.jobNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="确认人">
            {detail.targetConfirmationEmployeeName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="指标数">{detail.quotas?.length || 0}</Descriptions.Item>
        </Descriptions>

        <Table
          rowKey="id"
          dataSource={detail.quotas || []}
          columns={columns}
          pagination={false}
          bordered
          size="small"
        />

        <div style={{ marginTop: 16 }}>
          <Input.TextArea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            showCount
            placeholder="填写确认意见；退回时必填"
          />
        </div>
      </Spin>
    </Drawer>
  )
})

export default PerformanceTargetConfirmForm
