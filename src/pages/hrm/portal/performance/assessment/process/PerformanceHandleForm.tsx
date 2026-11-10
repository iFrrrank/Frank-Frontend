import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
  Button,
  Checkbox,
  Descriptions,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Table,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PaperClipOutlined } from '@ant-design/icons'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import {
  HrmPerformanceAssessmentStageStatus,
  HrmPerformanceConfirmationResult
} from '@/pages/hrm/performance/constants'
import { formatHrmDateTime, formatHrmScore } from '@/pages/hrm/utils/format'

const { Link } = Typography

export interface PerformanceHandleFormProps {
  mode: 'result-audit' | 'appeal'
  onSuccess: () => void
}

export interface PerformanceHandleFormRef {
  open: (assessmentId?: number, stageId?: number) => Promise<void>
}

const PerformanceHandleForm = forwardRef<PerformanceHandleFormRef, PerformanceHandleFormProps>(
  ({ mode, onSuccess }, ref) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [detail, setDetail] = useState<
      Partial<PerformanceAssessmentApi.PortalPerformanceAssessmentVO>
    >({})
    const [reviewStageIds, setReviewStageIds] = useState<number[]>([])
    const [comment, setComment] = useState('')

    const title = mode === 'appeal' ? '绩效申诉确认' : '绩效结果审核'

    useImperativeHandle(ref, () => ({
      open: async (assessmentId, stageId) => {
        if (!assessmentId || !stageId) return
        setOpen(true)
        setLoading(true)
        setDetail({} as any)
        setReviewStageIds([])
        setComment('')
        try {
          const resp = await PerformanceAssessmentApi.getPerformanceAssessment(
            assessmentId,
            stageId
          )
          const d = resp.data || {}
          setDetail(d)

          const completed = (d.reviewStages || []).filter(
            (s: any) => s.id != null && s.status === HrmPerformanceAssessmentStageStatus.PROCESSED
          )
          const latest = completed[completed.length - 1]
          setReviewStageIds(latest?.id ? [latest.id] : [])
        } finally {
          setLoading(false)
        }
      }
    }))

    const completedReviewStages = (detail.reviewStages || []).filter(
      (stage: any) =>
        stage.id != null && stage.status === HrmPerformanceAssessmentStageStatus.PROCESSED
    )

    const appealReviewStageNames = (() => {
      const selectedIds = new Set(detail.appealReviewStageIds || [])
      return completedReviewStages
        .filter((stage: any) => stage.id != null && selectedIds.has(stage.id))
        .map((stage: any) => stage.name || '评分阶段')
        .join('、')
    })()

    const submitForm = async (pass: boolean) => {
      if (!detail.id || !detail.currentStage?.id) return

      if (!pass && mode === 'result-audit' && !reviewStageIds.length) {
        message.warning('请选择需要退回的评分节点')
        return
      }

      Modal.confirm({
        title: `确认${pass ? '通过' : '驳回'}当前${title}？`,
        onOk: async () => {
          setSubmitting(true)
          try {
            const payload: PerformanceAssessmentApi.PerformanceHandleStageReqVO = {
              assessmentId: detail.id!,
              stageId: detail.currentStage!.id!,
              pass: pass
                ? HrmPerformanceConfirmationResult.PASS
                : HrmPerformanceConfirmationResult.REJECT,
              comment: comment.trim() || undefined,
              reviewStageIds: !pass && mode === 'result-audit' ? reviewStageIds : undefined
            }

            if (mode === 'appeal') {
              await PerformanceAssessmentApi.handlePerformanceAssessmentAppeal(payload)
            } else {
              await PerformanceAssessmentApi.handlePerformanceAssessmentResultAudit(payload)
            }

            message.success(`${title}处理成功`)
            setOpen(false)
            onSuccess()
          } catch (err: any) {
            message.error(err?.message || `${title}处理失败`)
          } finally {
            setSubmitting(false)
          }
        }
      })
    }

    const quotaColumns: ColumnsType<any> = [
      { title: '维度', dataIndex: 'dimensionName', minWidth: 120 },
      { title: '指标', dataIndex: 'name', minWidth: 150, ellipsis: true },
      { title: '目标值', dataIndex: 'targetValue', minWidth: 120, ellipsis: true },
      { title: '实际值', dataIndex: 'actualValue', minWidth: 120, ellipsis: true },
      {
        title: '最终分',
        dataIndex: 'finalScore',
        width: 90,
        align: 'center',
        render: (val) => formatHrmScore(val)
      }
    ]

    const stageOptions = completedReviewStages.map((stage: any) => ({
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
        title={title}
        width={900}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setOpen(false)}>取 消</Button>
            <Button danger loading={submitting} onClick={() => submitForm(false)}>
              驳 回
            </Button>
            <Button type="primary" loading={submitting} onClick={() => submitForm(true)}>
              通 过
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Descriptions bordered size="small" column={3} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="考核名称">{detail.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="被考核人">{detail.employeeName || '-'}</Descriptions.Item>
            <Descriptions.Item label="工号">{detail.jobNumber || '-'}</Descriptions.Item>
            <Descriptions.Item label="当前节点">
              {detail.currentStage?.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="绩效得分">{formatHrmScore(detail.score)}</Descriptions.Item>
            <Descriptions.Item label="绩效等级">{detail.resultLevel || '-'}</Descriptions.Item>
            {mode === 'appeal' && (
              <>
                <Descriptions.Item label="申诉原因" span={3}>
                  {detail.appealReason || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="申诉时间">
                  {formatHrmDateTime(detail.appealSubmitTime)}
                </Descriptions.Item>
                <Descriptions.Item label="申诉附件" span={2}>
                  {detail.appealFileUrls && detail.appealFileUrls.length > 0 ? (
                    <Space wrap>
                      {detail.appealFileUrls.map((url: string) => (
                        <Link
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 13 }}
                        >
                          <PaperClipOutlined /> 附件
                        </Link>
                      ))}
                    </Space>
                  ) : (
                    '-'
                  )}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>

          <Table
            rowKey="id"
            dataSource={detail.quotas || []}
            columns={quotaColumns}
            pagination={false}
            bordered
            size="small"
            scroll={{ y: 240 }}
            style={{ marginBottom: 16 }}
          />

          <Form layout="horizontal" labelCol={{ flex: '110px' }}>
            {mode === 'result-audit' ? (
              <Form.Item label="退回评分节点">
                <Checkbox.Group
                  options={stageOptions}
                  value={reviewStageIds}
                  onChange={(vals) => setReviewStageIds(vals as number[])}
                />
              </Form.Item>
            ) : (
              <Form.Item label="申诉评分节点">
                <span>{appealReviewStageNames || '-'}</span>
              </Form.Item>
            )}

            <Form.Item label="处理意见">
              <Input.TextArea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                showCount
                placeholder="请输入处理意见"
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    )
  }
)

export default PerformanceHandleForm
