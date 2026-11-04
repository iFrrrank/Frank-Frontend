import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Drawer,
  Input,
  InputNumber,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import {
  HrmPerformanceAssessmentStageStatus,
  HrmPerformanceRaterType
} from '@/pages/hrm/performance/constants'

const { Text } = Typography

export interface PerformanceReviewFormProps {
  onSuccess: () => void
}

export interface PerformanceReviewFormRef {
  open: (assessmentId?: number, stageId?: number) => Promise<void>
}

const PerformanceReviewForm = forwardRef<PerformanceReviewFormRef, PerformanceReviewFormProps>(
  ({ onSuccess }, ref) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [detail, setDetail] = useState<
      Partial<PerformanceAssessmentApi.PortalPerformanceAssessmentVO>
    >({})
    const [quotas, setQuotas] = useState<any[]>([])
    const [stageComment, setStageComment] = useState('')
    const [scorePreview, setScorePreview] = useState<any>()

    // 驳回弹窗
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [rejectSubmitting, setRejectSubmitting] = useState(false)

    const previewTimer = useRef<any>(null)

    const currentStage = detail.currentReviewStage
    const canReject =
      currentStage?.rejectAuthority === true &&
      !!detail.reviewStages?.some(
        (stage: any) =>
          stage.status === HrmPerformanceAssessmentStageStatus.PROCESSED &&
          (stage.sort || 0) < (currentStage?.sort || 0)
      )

    const schedulePreview = (updatedQuotas = quotas) => {
      if (previewTimer.current) clearTimeout(previewTimer.current)
      previewTimer.current = setTimeout(async () => {
        if (
          !detail.id ||
          !currentStage?.id ||
          !updatedQuotas.length ||
          updatedQuotas.some((q) => q.finalScore === undefined || q.finalScore === null)
        ) {
          setScorePreview(undefined)
          return
        }
        try {
          const resp = await PerformanceAssessmentApi.previewPerformanceAssessmentScore({
            assessmentId: detail.id,
            reviewStageId: currentStage.id,
            quotas: updatedQuotas
          })
          setScorePreview(resp.data)
        } catch {
          setScorePreview(undefined)
        }
      }, 300)
    }

    useImperativeHandle(ref, () => ({
      open: async (assessmentId, stageId) => {
        if (!assessmentId || !stageId) return
        setOpen(true)
        setLoading(true)
        setStageComment('')
        setScorePreview(undefined)
        try {
          const resp = await PerformanceAssessmentApi.getPerformanceAssessment(
            assessmentId,
            stageId
          )
          const d = resp.data || {}
          setDetail(d)
          setStageComment(d.currentReviewStage?.comment || '')

          const scoreMap = new Map(
            (d.currentReviewStage?.quotaScoreList || []).map((s: any) => [
              s.assessmentQuotaId,
              s.score
            ])
          )
          const initialQuotas = (d.quotas || []).map((quota: any) => ({
            ...quota,
            finalScore: scoreMap.get(quota.id)
          }))
          setQuotas(initialQuotas)
          schedulePreview(initialQuotas)
        } finally {
          setLoading(false)
        }
      }
    }))

    const updateQuotaField = (index: number, field: string, val: any) => {
      setQuotas((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], [field]: val }
        if (field === 'finalScore') {
          schedulePreview(next)
        }
        return next
      })
    }

    const handleRejectPreviousStage = async () => {
      if (!detail.id || !currentStage?.id) return
      if (!rejectReason.trim()) {
        message.warning('驳回原因不能为空')
        return
      }

      setRejectSubmitting(true)
      try {
        await PerformanceAssessmentApi.rejectPerformanceAssessmentReviewStage({
          assessmentId: detail.id,
          reviewStageId: currentStage.id,
          reason: rejectReason.trim()
        })
        message.success('上一评分阶段已驳回')
        setRejectModalOpen(false)
        setOpen(false)
        onSuccess()
      } catch (err: any) {
        message.error(err?.message || '驳回失败')
      } finally {
        setRejectSubmitting(false)
      }
    }

    const submitReview = async () => {
      if (!detail.id || !currentStage?.id) return

      if (
        !quotas.length ||
        quotas.some((q) => q.finalScore === undefined || q.finalScore === null)
      ) {
        message.error('请完成全部指标评分')
        return
      }

      if (currentStage.requiredSetting && !stageComment.trim()) {
        message.error('请填写本阶段评语')
        return
      }

      setSubmitting(true)
      try {
        await PerformanceAssessmentApi.scorePerformanceAssessment({
          assessmentId: detail.id,
          reviewStageId: currentStage.id,
          comment: stageComment.trim(),
          selfComment:
            currentStage.raterType === HrmPerformanceRaterType.SELF
              ? stageComment.trim()
              : undefined,
          reviewerComment:
            currentStage.raterType === HrmPerformanceRaterType.SELF
              ? undefined
              : stageComment.trim(),
          quotas
        })
        message.success('当前阶段评分已提交')
        setOpen(false)
        onSuccess()
      } catch (err: any) {
        message.error(err?.message || '提交评分失败')
      } finally {
        setSubmitting(false)
      }
    }

    const quotaColumns: ColumnsType<any> = [
      { title: '维度', dataIndex: 'dimensionName', width: 110, ellipsis: true },
      { title: '指标', dataIndex: 'name', minWidth: 145, ellipsis: true },
      { title: '目标值', dataIndex: 'targetValue', minWidth: 125, ellipsis: true },
      {
        title: '实际值',
        minWidth: 125,
        render: (_, record, index) => (
          <Input
            value={record.actualValue}
            onChange={(e) => updateQuotaField(index, 'actualValue', e.target.value)}
            maxLength={1000}
            placeholder="实际完成情况"
          />
        )
      },
      {
        title: '评分',
        width: 110,
        render: (_, record, index) => (
          <InputNumber
            value={record.finalScore}
            onChange={(val) => updateQuotaField(index, 'finalScore', val)}
            min={0}
            max={detail.upperLimitScore}
            precision={2}
            controls={false}
            style={{ width: '100%' }}
          />
        )
      },
      {
        title: '评语',
        minWidth: 160,
        render: (_, record, index) => (
          <Input
            value={record.comment}
            onChange={(e) => updateQuotaField(index, 'comment', e.target.value)}
            maxLength={1000}
            placeholder="指标评语"
          />
        )
      }
    ]

    return (
      <Drawer
        title="绩效评分"
        width={880}
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
        extra={
          <Space>
            {canReject && (
              <Button
                danger
                onClick={() => {
                  setRejectReason('')
                  setRejectModalOpen(true)
                }}
              >
                驳回上一阶段
              </Button>
            )}
            <Button onClick={() => setOpen(false)}>取 消</Button>
            <Button type="primary" loading={submitting} onClick={submitReview}>
              提交评分
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
            <Space>
              <Tag color="warning">{currentStage?.name || '待评分'}</Tag>
              <span>权重 {currentStage?.weight || 0}%</span>
            </Space>
          </div>

          {detail.reviewStages && detail.reviewStages.length > 0 && (
            <Card size="small" style={{ marginBottom: 16 }}>
              {detail.reviewStages.map((stage: any) => (
                <div
                  key={stage.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(180px, 1fr) 70px 80px 70px',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{stage.name}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {stage.handlerName || '-'}
                    </Text>
                  </div>
                  <span>{stage.weight || 0}%</span>
                  <div>
                    {stage.status === HrmPerformanceAssessmentStageStatus.PROCESSED ? (
                      <Tag color="success">已完成</Tag>
                    ) : stage.status === HrmPerformanceAssessmentStageStatus.PENDING ? (
                      <Tag color="warning">待评分</Tag>
                    ) : (
                      <Tag>未开始</Tag>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 500 }}>{stage.score ?? '-'}</div>
                </div>
              ))}
            </Card>
          )}

          {currentStage?.rejectReason && (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
              message={`评分被驳回：${currentStage.rejectReason}`}
            />
          )}

          {scorePreview && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                backgroundColor: '#fafafa',
                borderRadius: 6,
                border: '1px solid #f0f0f0',
                marginBottom: 16
              }}
            >
              <Space size={8}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  本阶段试算
                </Text>
                <span style={{ fontSize: 16, fontWeight: 600 }}>
                  {scorePreview.stageScore ?? '-'} 分
                </span>
                {scorePreview.stageResultLevel && (
                  <Tag color="blue">{scorePreview.stageResultLevel}</Tag>
                )}
              </Space>
              <Space size={8}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  当前累计分
                </Text>
                <span style={{ fontSize: 16, fontWeight: 600 }}>
                  {scorePreview.cumulativeScore ?? '-'} 分
                </span>
                {scorePreview.cumulativeResultLevel && (
                  <Tag color="success">{scorePreview.cumulativeResultLevel}</Tag>
                )}
              </Space>
            </div>
          )}

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message={`单项评分范围为 0～${detail.upperLimitScore ?? '-'} 分，最多保留两位小数；总分按评分、维度权重和指标权重计算。`}
          />

          <Table
            rowKey="id"
            dataSource={quotas}
            columns={quotaColumns}
            pagination={false}
            bordered
            size="small"
          />

          <div style={{ marginTop: 16 }}>
            <Input.TextArea
              rows={3}
              value={stageComment}
              onChange={(e) => setStageComment(e.target.value)}
              maxLength={2000}
              showCount
              placeholder={
                currentStage?.raterType === HrmPerformanceRaterType.SELF ? '自评说明' : '评分说明'
              }
            />
          </div>

          <Modal
            title="驳回上一评分阶段"
            open={rejectModalOpen}
            onOk={handleRejectPreviousStage}
            onCancel={() => setRejectModalOpen(false)}
            confirmLoading={rejectSubmitting}
            destroyOnClose
          >
            <div style={{ marginBottom: 8 }}>请输入驳回原因：</div>
            <Input.TextArea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回原因"
              maxLength={200}
              showCount
            />
          </Modal>
        </Spin>
      </Drawer>
    )
  }
)

export default PerformanceReviewForm
