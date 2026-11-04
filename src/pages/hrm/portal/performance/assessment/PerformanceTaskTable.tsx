import React from 'react'
import { Button, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { PortalPerformanceAssessmentVO } from '@/api/hrm/portal/performance'
import {
  HrmPerformanceAppealStatus,
  HrmPerformanceAssessmentStageStatus,
  HrmPerformanceStageType
} from '@/pages/hrm/performance/constants'
import { formatHrmDate, formatHrmScore } from '@/pages/hrm/utils/format'

export interface PerformanceTaskTableProps {
  activeTab: number
  activeStatus: number
  loading: boolean
  list: PortalPerformanceAssessmentVO[]
  onDetail: (row: PortalPerformanceAssessmentVO) => void
  onQuota: (id?: number) => void
  onResultConfirm: (id?: number) => void
  onAppeal: (id?: number) => void
  onTargetConfirm: (assessmentId?: number, stageId?: number) => void
  onReview: (assessmentId?: number, stageId?: number) => void
  onResultAudit: (assessmentId?: number, stageId?: number) => void
  onAppealHandle: (assessmentId?: number, stageId?: number) => void
}

const PerformanceTaskTable: React.FC<PerformanceTaskTableProps> = ({
  activeTab,
  activeStatus,
  loading,
  list,
  onDetail,
  onQuota,
  onResultConfirm,
  onAppeal,
  onTargetConfirm,
  onReview,
  onResultAudit,
  onAppealHandle
}) => {
  const isSelfTask =
    activeTab === HrmPerformanceStageType.FILL_QUOTA ||
    activeTab === HrmPerformanceStageType.RESULT_CONFIRM

  const selfColumns: ColumnsType<PortalPerformanceAssessmentVO> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '考核名称',
      dataIndex: 'name',
      minWidth: 220,
      ellipsis: true
    },
    {
      title: '考核周期',
      minWidth: 210,
      render: (_, record) =>
        `${formatHrmDate(record.startTime)} 至 ${formatHrmDate(record.endTime)}`
    },
    {
      title: '当前阶段',
      width: 130,
      align: 'center',
      render: (_, record) => record.currentStage?.name || '-'
    },
    {
      title: '绩效得分',
      dataIndex: 'score',
      width: 110,
      align: 'center',
      render: (val) => formatHrmScore(val)
    },
    {
      title: '绩效等级',
      dataIndex: 'resultLevel',
      width: 110,
      align: 'center',
      render: (val) =>
        val ? (
          <Tag color="success" bordered={false}>
            {val}
          </Tag>
        ) : (
          '-'
        )
    },
    {
      title: '绩效系数',
      dataIndex: 'coefficient',
      width: 100,
      align: 'center',
      render: (val) => val ?? '-'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 240,
      align: 'center',
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" size="small" onClick={() => onDetail(record)}>
            详情
          </Button>
          {activeTab === HrmPerformanceStageType.FILL_QUOTA &&
            activeStatus === HrmPerformanceAssessmentStageStatus.PENDING &&
            record.stageType === HrmPerformanceStageType.FILL_QUOTA && (
              <Button type="link" size="small" onClick={() => onQuota(record.id)}>
                制定指标
              </Button>
            )}
          {activeTab === HrmPerformanceStageType.RESULT_CONFIRM &&
            activeStatus === HrmPerformanceAssessmentStageStatus.PENDING && (
              <Button
                type="link"
                size="small"
                style={{ color: '#52c41a' }}
                onClick={() => onResultConfirm(record.id)}
              >
                确认结果
              </Button>
            )}
          {activeTab === HrmPerformanceStageType.RESULT_CONFIRM &&
            activeStatus === HrmPerformanceAssessmentStageStatus.PENDING &&
            record.appealStatus !== HrmPerformanceAppealStatus.PENDING && (
              <Button
                type="link"
                size="small"
                style={{ color: '#faad14' }}
                onClick={() => onAppeal(record.id)}
              >
                提交申诉
              </Button>
            )}
        </Space>
      )
    }
  ]

  const otherColumns: ColumnsType<PortalPerformanceAssessmentVO> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '考核名称',
      dataIndex: 'name',
      minWidth: 220,
      ellipsis: true
    },
    {
      title: '被考核人',
      minWidth: 160,
      render: (_, record) => (
        <span>
          {record.employeeName || '-'}
          {record.jobNumber && (
            <span style={{ marginLeft: 6, fontSize: 12, color: '#8c8c8c' }}>
              ({record.jobNumber})
            </span>
          )}
        </span>
      )
    },
    {
      title: '当前阶段',
      width: 140,
      align: 'center',
      render: (_, record) => {
        if (activeTab === HrmPerformanceStageType.OTHER_SCORE) {
          return record.currentReviewStage?.name || '待评分'
        }
        if (
          activeTab === HrmPerformanceStageType.RESULT_AUDIT ||
          activeTab === HrmPerformanceStageType.APPEAL_CONFIRM
        ) {
          return record.currentStage?.name || '待处理'
        }
        return '-'
      }
    },
    ...(activeTab === HrmPerformanceStageType.TARGET_CONFIRM
      ? [
          {
            title: '指标数',
            width: 100,
            align: 'center' as const,
            render: (_: any, record: PortalPerformanceAssessmentVO) => record.quotas?.length || 0
          }
        ]
      : activeTab === HrmPerformanceStageType.OTHER_SCORE
        ? [
            {
              title: '评分权重',
              width: 100,
              align: 'center' as const,
              render: (_: any, record: PortalPerformanceAssessmentVO) =>
                `${record.currentReviewStage?.weight || 0}%`
            }
          ]
        : [
            {
              title: '绩效得分',
              dataIndex: 'score',
              width: 100,
              align: 'center' as const,
              render: (val: any) => formatHrmScore(val)
            }
          ]),
    {
      title: '操作',
      fixed: 'right',
      width: 110,
      align: 'center',
      render: (_, record) => {
        if (
          activeTab === HrmPerformanceStageType.TARGET_CONFIRM &&
          activeStatus === HrmPerformanceAssessmentStageStatus.PENDING
        ) {
          return (
            <Button
              type="link"
              size="small"
              onClick={() => onTargetConfirm(record.id, record.currentStage?.id)}
            >
              去确认
            </Button>
          )
        }
        if (
          activeTab === HrmPerformanceStageType.OTHER_SCORE &&
          activeStatus === HrmPerformanceAssessmentStageStatus.PENDING
        ) {
          return (
            <Button
              type="link"
              size="small"
              onClick={() => onReview(record.id, record.currentReviewStage?.id)}
            >
              去评分
            </Button>
          )
        }
        if (
          activeTab === HrmPerformanceStageType.RESULT_AUDIT &&
          activeStatus === HrmPerformanceAssessmentStageStatus.PENDING
        ) {
          return (
            <Button
              type="link"
              size="small"
              onClick={() => onResultAudit(record.id, record.currentStage?.id)}
            >
              去审核
            </Button>
          )
        }
        if (
          activeTab === HrmPerformanceStageType.APPEAL_CONFIRM &&
          activeStatus === HrmPerformanceAssessmentStageStatus.PENDING
        ) {
          return (
            <Button
              type="link"
              size="small"
              onClick={() => onAppealHandle(record.id, record.currentStage?.id)}
            >
              去确认
            </Button>
          )
        }
        return (
          <Button type="link" size="small" onClick={() => onDetail(record)}>
            查看
          </Button>
        )
      }
    }
  ]

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={list}
      columns={isSelfTask ? selfColumns : otherColumns}
      pagination={false}
      bordered
      size="small"
      scroll={{ x: 'max-content' }}
    />
  )
}

export default PerformanceTaskTable
