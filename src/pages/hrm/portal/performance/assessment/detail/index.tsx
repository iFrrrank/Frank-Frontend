import React, { forwardRef, useImperativeHandle, useState } from 'react'
import {
  Card,
  Descriptions,
  Drawer,
  Empty,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PaperClipOutlined } from '@ant-design/icons'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import {
  HrmPerformanceStageType,
  PERFORMANCE_APPEAL_STATUS,
  PERFORMANCE_STAGE_STATUS
} from '@/pages/hrm/performance/constants'
import { formatHrmDate, formatHrmDateTime, formatHrmScore } from '@/pages/hrm/utils/format'

const { Text, Link } = Typography

export interface PerformanceAssessmentDetailRef {
  open: (
    row:
      | PerformanceAssessmentApi.PortalPerformanceAssessmentSummaryVO
      | PerformanceAssessmentApi.PortalPerformanceAssessmentVO,
    taskType?: number
  ) => Promise<void>
}

const PerformanceAssessmentDetail = forwardRef<PerformanceAssessmentDetailRef>((_, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('detail')
  const [assessment, setAssessment] =
    useState<PerformanceAssessmentApi.PortalPerformanceAssessmentVO>()
  const [records, setRecords] = useState<PerformanceAssessmentApi.PerformanceRecordVO[]>([])

  useImperativeHandle(ref, () => ({
    open: async (row, taskType) => {
      if (!row.id) return

      let stageId: number | undefined
      if (taskType !== undefined) {
        const task = row as PerformanceAssessmentApi.PortalPerformanceAssessmentVO
        stageId =
          taskType === HrmPerformanceStageType.OTHER_SCORE
            ? task.currentReviewStage?.id
            : task.currentStage?.id
        if (!stageId) {
          message.error('绩效任务阶段不存在')
          return
        }
      }

      setOpen(true)
      setActiveTab('detail')
      setLoading(true)
      try {
        const [assessmentResp, recordsResp] = await Promise.all([
          PerformanceAssessmentApi.getPerformanceAssessment(row.id, stageId),
          PerformanceAssessmentApi.getPerformanceAssessmentProcessRecordList(row.id, stageId)
        ])
        setAssessment(assessmentResp.data)
        setRecords(recordsResp.data || [])
      } finally {
        setLoading(false)
      }
    }
  }))

  const quotaColumns: ColumnsType<any> = [
    { title: '维度', dataIndex: 'dimensionName', minWidth: 120 },
    { title: '指标', dataIndex: 'name', minWidth: 160 },
    { title: '考核标准', dataIndex: 'standard', minWidth: 200 },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 80,
      align: 'center',
      render: (val) => `${val || 0}%`
    },
    {
      title: '最终得分',
      dataIndex: 'finalScore',
      width: 90,
      align: 'center',
      render: (val) => formatHrmScore(val)
    }
  ]

  const reviewStageColumns: ColumnsType<any> = [
    { title: '评分阶段', dataIndex: 'name', minWidth: 130 },
    { title: '评分人', dataIndex: 'handlerName', minWidth: 120 },
    {
      title: '权重',
      dataIndex: 'weight',
      width: 80,
      align: 'center',
      render: (val) => `${val || 0}%`
    },
    {
      title: '阶段得分',
      dataIndex: 'score',
      width: 90,
      align: 'center',
      render: (val) => formatHrmScore(val)
    },
    { title: '评语', dataIndex: 'comment', minWidth: 160 }
  ]

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 1] || '附件'
  }

  const detailContent = (
    <div>
      {assessment && (
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="考核名称" span={2}>
            {assessment.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="开始日期">
            {formatHrmDate(assessment.startTime)}
          </Descriptions.Item>
          <Descriptions.Item label="结束日期">
            {formatHrmDate(assessment.endTime)}
          </Descriptions.Item>
          <Descriptions.Item label="当前阶段">
            {assessment.stageType !== undefined ? (
              <Tag color={PERFORMANCE_STAGE_STATUS[assessment.stageType]?.color}>
                {PERFORMANCE_STAGE_STATUS[assessment.stageType]?.label ||
                  assessment.currentStage?.name ||
                  '-'}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="绩效得分">{formatHrmScore(assessment.score)}</Descriptions.Item>
          <Descriptions.Item label="绩效等级">{assessment.resultLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label="绩效系数">{assessment.coefficient ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="归档时间" span={2}>
            {formatHrmDateTime(assessment.archiveTime)}
          </Descriptions.Item>
          <Descriptions.Item label="指标确认人">
            {assessment.targetConfirmationEmployeeName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="指标确认结果">
            {assessment.targetConfirmationResult === 1 ? (
              <Tag color="success">已通过</Tag>
            ) : assessment.targetConfirmationResult === 0 ? (
              <Tag color="error">已退回</Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="自评说明" span={2}>
            {assessment.selfComment || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="评分说明" span={2}>
            {assessment.reviewerComment || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="结果说明" span={2}>
            {assessment.resultComment || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="结果确认时间" span={2}>
            {formatHrmDateTime(assessment.resultConfirmationTime)}
          </Descriptions.Item>
          <Descriptions.Item label="指标确认意见" span={2}>
            {assessment.targetConfirmationComment || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="申诉状态">
            {assessment.appealStatus !== undefined ? (
              <Tag color={PERFORMANCE_APPEAL_STATUS[assessment.appealStatus]?.color}>
                {PERFORMANCE_APPEAL_STATUS[assessment.appealStatus]?.label || '-'}
              </Tag>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="申诉提交时间">
            {formatHrmDateTime(assessment.appealSubmitTime)}
          </Descriptions.Item>
          <Descriptions.Item label="申诉完成时间">
            {formatHrmDateTime(assessment.appealTime)}
          </Descriptions.Item>
          <Descriptions.Item label="申诉原因" span={2}>
            {assessment.appealReason || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="申诉附件" span={2}>
            {assessment.appealFileUrls && assessment.appealFileUrls.length > 0 ? (
              <Space direction="vertical">
                {assessment.appealFileUrls.map((url: string) => (
                  <Link key={url} href={url} target="_blank" rel="noopener noreferrer">
                    <PaperClipOutlined /> {getFileNameFromUrl(url)}
                  </Link>
                ))}
              </Space>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="申诉审批意见" span={2}>
            {assessment.appealComment || '-'}
          </Descriptions.Item>
        </Descriptions>
      )}

      {assessment?.quotas && assessment.quotas.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#262626',
              marginBottom: 10
            }}
          >
            绩效指标
          </div>
          <Table
            rowKey="id"
            dataSource={assessment.quotas}
            columns={quotaColumns}
            pagination={false}
            bordered
            size="small"
          />
        </div>
      )}

      {assessment?.reviewStages && assessment.reviewStages.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#262626',
              marginBottom: 10
            }}
          >
            评分流程
          </div>
          <Table
            rowKey="id"
            dataSource={assessment.reviewStages}
            columns={reviewStageColumns}
            pagination={false}
            bordered
            size="small"
          />
        </div>
      )}
    </div>
  )

  const timelineContent = (
    <div style={{ padding: '12px 8px' }}>
      {records.length > 0 ? (
        <Timeline
          items={records.map((record, index) => ({
            key: `${record.operateTime || ''}-${index}`,
            children: (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{record.title || '-'}</span>
                  {record.operatorName && (
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {record.operatorName}
                    </Text>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
                  {formatHrmDateTime(record.operateTime)}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    whiteSpace: 'pre-wrap',
                    color: '#595959',
                    lineHeight: 1.6
                  }}
                >
                  {record.content || '-'}
                </div>
                {record.fileUrls && record.fileUrls.length > 0 && (
                  <Space wrap style={{ marginTop: 6 }}>
                    {record.fileUrls.map((url) => (
                      <Link
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 13 }}
                      >
                        <PaperClipOutlined /> {getFileNameFromUrl(url)}
                      </Link>
                    ))}
                  </Space>
                )}
              </div>
            )
          }))}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无流程记录" />
      )}
    </div>
  )

  return (
    <Drawer title="绩效详情" width={760} open={open} onClose={() => setOpen(false)} destroyOnClose>
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'detail', label: '绩效详情', children: detailContent },
            { key: 'record', label: '流程记录', children: timelineContent }
          ]}
        />
      </Spin>
    </Drawer>
  )
})

export default PerformanceAssessmentDetail
