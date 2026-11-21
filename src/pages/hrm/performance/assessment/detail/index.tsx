import React, { useEffect, useState } from 'react'
import { Card, Descriptions, Table, Tag, Timeline } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import {
  getPerformanceAssessment,
  getPerformanceAssessmentArchive,
  getPerformanceAssessmentArchiveProcessRecordList,
  getPerformanceAssessmentProcessRecordList
} from '@/api/hrm/performance/assessment'
import {
  HrmPerformanceCycleTypeOptions,
  PERFORMANCE_APPEAL_STATUS,
  PERFORMANCE_ASSESSMENT_STAGE_STATUS,
  PERFORMANCE_STAGE_STATUS
} from '../../constants'
import dayjs from 'dayjs'

const fmtTime = (value?: string | number) =>
  value ? dayjs(value as any).format('YYYY-MM-DD HH:mm:ss') : '-'

// 绩效考核详情：基本信息 + 指标得分 + 阶段进度 + 流程记录
const PerformanceAssessmentDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const assessmentId = Number(searchParams.get('id'))
  const isArchive = searchParams.get('archive') === '1'
  const [assessment, setAssessment] = useState<any>()
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    if (!assessmentId) return
    const loadDetail = isArchive ? getPerformanceAssessmentArchive : getPerformanceAssessment
    loadDetail({ id: assessmentId } as any).then((resp) => {
      if (resp.code === 0) setAssessment(resp.data)
    })
    const loadRecords = isArchive
      ? getPerformanceAssessmentArchiveProcessRecordList
      : getPerformanceAssessmentProcessRecordList
    loadRecords({ assessmentId } as any).then((resp) => {
      if (resp.code === 0) setRecords(resp.data || [])
    })
  }, [assessmentId, isArchive])

  const stageItem = assessment ? PERFORMANCE_STAGE_STATUS[assessment.stageType] : undefined
  const appealItem = assessment ? PERFORMANCE_APPEAL_STATUS[assessment.appealStatus ?? 0] : undefined

  return (
    <PageContainer title="绩效考核详情" onBack={() => history.back()}>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={4} title={assessment?.name}>
          <Descriptions.Item label="员工">{assessment?.employeeName || '-'}</Descriptions.Item>
          <Descriptions.Item label="工号">{assessment?.jobNumber || '-'}</Descriptions.Item>
          <Descriptions.Item label="部门">{assessment?.deptName || '-'}</Descriptions.Item>
          <Descriptions.Item label="岗位">{assessment?.postName || '-'}</Descriptions.Item>
          <Descriptions.Item label="周期类型">
            {HrmPerformanceCycleTypeOptions.find((o) => o.value === assessment?.cycleType)
              ?.label || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="考核周期">{assessment?.cycle || '-'}</Descriptions.Item>
          <Descriptions.Item label="起止日期">
            {assessment?.startTime ? dayjs(assessment.startTime).format('YYYY-MM-DD') : '-'} ~{' '}
            {assessment?.endTime ? dayjs(assessment.endTime).format('YYYY-MM-DD') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="当前阶段">
            {stageItem ? <Tag color={stageItem.color}>{stageItem.label}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="当前处理人">
            {assessment?.currentHandlerName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="得分">{assessment?.score ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="结果等级">{assessment?.resultLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label="绩效系数">{assessment?.coefficient ?? '-'}</Descriptions.Item>
          <Descriptions.Item label="申诉状态">
            {appealItem ? <Tag color={appealItem.color}>{appealItem.label}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="归档时间">{fmtTime(assessment?.archiveTime)}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="指标得分" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={assessment?.quotas || []}
          columns={[
            { title: '维度', dataIndex: 'dimensionName', width: 140 },
            { title: '指标', dataIndex: 'name', width: 180 },
            { title: '目标值', dataIndex: 'targetValue', width: 110 },
            { title: '实际值', dataIndex: 'actualValue', width: 110 },
            {
              title: '权重(%)',
              dataIndex: 'weight',
              align: 'center',
              width: 90,
              render: (v) => v ?? '-'
            },
            {
              title: '自评分',
              dataIndex: 'selfScore',
              align: 'center',
              width: 90,
              render: (v) => v ?? '-'
            },
            {
              title: '评分人得分',
              dataIndex: 'reviewerScore',
              align: 'center',
              width: 110,
              render: (v) => v ?? '-'
            },
            {
              title: '最终得分',
              dataIndex: 'finalScore',
              align: 'center',
              width: 100,
              render: (v) => v ?? '-'
            },
            { title: '说明', dataIndex: 'comment', ellipsis: true }
          ]}
        />
      </Card>

      <Card title="阶段进度" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={assessment?.stages || assessment?.reviewStages || []}
          columns={[
            { title: '阶段', dataIndex: 'name', width: 160 },
            { title: '处理人', dataIndex: 'handlerName', width: 120 },
            {
              title: '状态',
              align: 'center',
              width: 100,
              render: (_, record) => {
                const item = PERFORMANCE_ASSESSMENT_STAGE_STATUS[record.status]
                return item ? <Tag color={item.color}>{item.label}</Tag> : '-'
              }
            },
            {
              title: '得分',
              dataIndex: 'score',
              align: 'center',
              width: 90,
              render: (v) => v ?? '-'
            },
            { title: '说明', dataIndex: 'comment', ellipsis: true },
            {
              title: '提交时间',
              dataIndex: 'submitTime',
              width: 170,
              render: (v) => fmtTime(v)
            }
          ]}
        />
      </Card>

      <Card title="流程记录">
        <Timeline
          items={records.map((record) => ({
            children: (
              <div>
                <div>
                  <strong>{record.title || '-'}</strong>
                  <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
                    {record.operatorName || ''} · {fmtTime(record.operateTime)}
                  </span>
                </div>
                {record.content && <div>{record.content}</div>}
              </div>
            )
          }))}
        />
      </Card>
    </PageContainer>
  )
}

export default PerformanceAssessmentDetail
