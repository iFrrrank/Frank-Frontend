import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
  InputNumber,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import {
  HrmPerformanceStageType,
  PERFORMANCE_STAGE_STATUS
} from '@/pages/hrm/performance/constants'

const { Text } = Typography

export interface PerformanceQuotaFormProps {
  onSuccess: () => void
}

export interface PerformanceQuotaFormRef {
  open: (assessmentId?: number) => Promise<void>
}

interface DimensionGroup {
  key: string
  dimensionId?: number
  name: string
  weight: number
  allowEdit?: boolean
  quotas: any[]
}

const PerformanceQuotaForm = forwardRef<PerformanceQuotaFormRef, PerformanceQuotaFormProps>(
  ({ onSuccess }, ref) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [detail, setDetail] = useState<
      Partial<PerformanceAssessmentApi.PortalPerformanceAssessmentVO>
    >({})
    const [quotas, setQuotas] = useState<any[]>([])

    useImperativeHandle(ref, () => ({
      open: async (assessmentId?: number) => {
        if (!assessmentId) return
        setOpen(true)
        setLoading(true)
        try {
          const resp = await PerformanceAssessmentApi.getPerformanceAssessment(assessmentId)
          setDetail(resp.data || {})
          setQuotas(JSON.parse(JSON.stringify(resp.data?.quotas || [])))
        } finally {
          setLoading(false)
        }
      }
    }))

    const getDimensionGroups = (): DimensionGroup[] => {
      const groups = new Map<string, DimensionGroup>()
      for (const dimension of detail.dimensions || []) {
        const key = dimension.id !== undefined ? String(dimension.id) : dimension.name || 'default'
        groups.set(key, {
          key,
          dimensionId: dimension.id,
          name: dimension.name || '未命名维度',
          weight: Number(dimension.weight || 0),
          allowEdit: dimension.allowEdit,
          quotas: []
        })
      }
      for (const quota of quotas) {
        const key = quota.dimensionId ? String(quota.dimensionId) : quota.dimensionName || 'default'
        if (!groups.has(key)) {
          groups.set(key, {
            key,
            dimensionId: quota.dimensionId,
            name: quota.dimensionName || '未命名维度',
            weight: Number(quota.dimensionWeight || 0),
            allowEdit: quota.allowEdit,
            quotas: []
          })
        }
        groups.get(key)?.quotas.push(quota)
      }
      return Array.from(groups.values())
    }

    const weightTotal = (group: DimensionGroup) => {
      return Number(
        group.quotas.reduce((sum, item) => sum + Number(item.weight || 0), 0).toFixed(2)
      )
    }

    const addQuota = (group: DimensionGroup) => {
      const total = weightTotal(group)
      const remainingWeight = Math.max(0, Number((100 - total).toFixed(2)))
      const newQuota = {
        _uid: Math.random().toString(36).slice(2),
        dimensionId: group.dimensionId,
        dimensionName: group.name,
        preset: false,
        name: '',
        description: '',
        standard: '',
        weight: remainingWeight || undefined,
        scoreType: 1
      }
      setQuotas((prev) => [...prev, newQuota])
    }

    const removeQuota = (record: any) => {
      setQuotas((prev) =>
        prev.filter((item) => (item.id ? item.id !== record.id : item._uid !== record._uid))
      )
    }

    const updateQuotaField = (record: any, field: string, val: any) => {
      setQuotas((prev) =>
        prev.map((item) => {
          if ((item.id && item.id === record.id) || (item._uid && item._uid === record._uid)) {
            return { ...item, [field]: val }
          }
          return item
        })
      )
    }

    const validateQuota = (groups: DimensionGroup[]) => {
      for (const group of groups) {
        if (weightTotal(group) !== 100) {
          message.error(`${group.name}的指标权重合计必须等于 100%`)
          return false
        }
        const customQuotas = group.quotas.filter((q) => !q.preset)
        if (
          customQuotas.some(
            (q) => !q.name?.trim() || !q.standard?.trim() || !q.weight || q.weight <= 0
          )
        ) {
          message.error(`请完整填写${group.name}的新增指标`)
          return false
        }
        const names = group.quotas.map((q) => q.name?.trim()).filter(Boolean)
        if (new Set(names).size !== names.length) {
          message.error(`${group.name}存在重复指标名称`)
          return false
        }
      }
      return groups.length > 0
    }

    const submitQuota = async () => {
      const groups = getDimensionGroups()
      if (!detail.id || !validateQuota(groups)) return

      setSubmitting(true)
      try {
        await PerformanceAssessmentApi.fillPerformanceAssessmentQuota({
          assessmentId: detail.id,
          quotas: quotas.map((q) => ({
            id: q.id,
            dimensionId: q.dimensionId,
            name: q.name,
            description: q.description,
            standard: q.standard,
            weight: q.weight,
            scoreType: q.scoreType,
            targetValue: q.targetValue,
            actualValue: q.actualValue,
            selfScore: q.selfScore,
            reviewerScore: q.reviewerScore,
            finalScore: q.finalScore,
            comment: q.comment,
            sort: q.sort
          }))
        })
        message.success('绩效指标已提交')
        setOpen(false)
        onSuccess()
      } catch (err: any) {
        message.error(err?.message || '提交指标失败')
      } finally {
        setSubmitting(false)
      }
    }

    const dimensionGroups = getDimensionGroups()

    return (
      <Drawer
        title="制定绩效指标"
        width={960}
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>取 消</Button>
            <Button
              type="primary"
              disabled={detail.stageType !== HrmPerformanceStageType.FILL_QUOTA}
              loading={submitting}
              onClick={submitQuota}
            >
              提交指标
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{detail.employeeName || '-'}</div>
              <Text type="secondary" style={{ fontSize: 13, marginTop: 4 }}>
                {detail.name || '-'}
              </Text>
            </div>
            {detail.stageType !== undefined && (
              <Tag color={PERFORMANCE_STAGE_STATUS[detail.stageType]?.color}>
                {PERFORMANCE_STAGE_STATUS[detail.stageType]?.label || '-'}
              </Tag>
            )}
          </div>

          {detail.targetConfirmationResult === 0 && (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
              message={`目标已退回：${detail.targetConfirmationComment || '请调整后重新提交'}`}
            />
          )}

          {dimensionGroups.map((group) => {
            const total = weightTotal(group)
            const isFull = total === 100

            const columns: ColumnsType<any> = [
              {
                title: '指标名称',
                minWidth: 170,
                render: (_, record) =>
                  record.preset ? (
                    <Space>
                      <span>{record.name || '-'}</span>
                      <Tag>预置</Tag>
                    </Space>
                  ) : (
                    <Input
                      value={record.name}
                      onChange={(e) => updateQuotaField(record, 'name', e.target.value)}
                      maxLength={255}
                      placeholder="请输入指标名称"
                    />
                  )
              },
              {
                title: '指标说明',
                minWidth: 180,
                render: (_, record) =>
                  record.preset ? (
                    <span>{record.description || '-'}</span>
                  ) : (
                    <Input
                      value={record.description}
                      onChange={(e) => updateQuotaField(record, 'description', e.target.value)}
                      maxLength={1000}
                      placeholder="请输入指标说明"
                    />
                  )
              },
              {
                title: '考核标准',
                minWidth: 210,
                render: (_, record) =>
                  record.preset ? (
                    <span>{record.standard || '-'}</span>
                  ) : (
                    <Input
                      value={record.standard}
                      onChange={(e) => updateQuotaField(record, 'standard', e.target.value)}
                      maxLength={1000}
                      placeholder="请输入考核标准"
                    />
                  )
              },
              {
                title: '指标权重',
                width: 125,
                render: (_, record) =>
                  record.preset ? (
                    <span>{record.weight || 0}%</span>
                  ) : (
                    <InputNumber
                      value={record.weight}
                      onChange={(val) => updateQuotaField(record, 'weight', val)}
                      min={0.01}
                      max={100}
                      precision={2}
                      controls={false}
                      style={{ width: '100%' }}
                    />
                  )
              },
              {
                title: '操作',
                width: 72,
                align: 'center',
                render: (_, record) =>
                  !record.preset ? (
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeQuota(record)}
                    />
                  ) : null
              }
            ]

            return (
              <Card
                key={group.key}
                size="small"
                style={{ marginBottom: 16 }}
                title={
                  <div>
                    <span style={{ fontWeight: 600 }}>{group.name}</span>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                      维度权重 {group.weight}%
                    </Text>
                  </div>
                }
                extra={
                  <Space size={12}>
                    <span style={{ color: isFull ? '#52c41a' : '#ff4d4f', fontSize: 13 }}>
                      指标权重 {total}%
                    </span>
                    {group.allowEdit && (
                      <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<PlusOutlined />}
                        disabled={detail.stageType !== HrmPerformanceStageType.FILL_QUOTA}
                        onClick={() => addQuota(group)}
                      >
                        新增指标
                      </Button>
                    )}
                  </Space>
                }
              >
                <Table
                  rowKey={(r) => r.id || r._uid}
                  dataSource={group.quotas}
                  columns={columns}
                  pagination={false}
                  bordered
                  size="small"
                />
              </Card>
            )
          })}

          {dimensionGroups.length === 0 && <Empty description="暂无可填写指标" />}
        </Spin>
      </Drawer>
    )
  }
)

export default PerformanceQuotaForm
