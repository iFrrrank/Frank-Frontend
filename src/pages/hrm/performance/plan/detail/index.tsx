import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Descriptions, Space, Statistic, Tag } from 'antd'
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import {
  getPerformancePlan,
  getPerformancePlanLevelCount,
  getPerformancePlanStageCount
} from '@/api/hrm/performance/plan'
import { getPerformanceAssessmentPage } from '@/api/hrm/performance/assessment'
import PerformancePlanAssessmentAddForm from '../PerformancePlanAssessmentAddForm'
import {
  HrmPerformanceCycleTypeOptions,
  PERFORMANCE_PLAN_STATUS,
  PERFORMANCE_STAGE_STATUS
} from '../../constants'
import dayjs from 'dayjs'

// 绩效计划详情：计划信息 + 阶段分布 + 等级分布 + 参评员工考核列表
const PerformancePlanDetail: React.FC = () => {
  const [searchParams] = useSearchParams()
  const planId = Number(searchParams.get('id'))
  const actionRef = useRef<ActionType>(undefined)
  const [plan, setPlan] = useState<any>()
  const [stageCounts, setStageCounts] = useState<any[]>([])
  const [levelCounts, setLevelCounts] = useState<any[]>([])
  const [addFormVisible, setAddFormVisible] = useState(false)

  const load = async () => {
    if (!planId) return
    const [planResp, stageResp, levelResp] = await Promise.all([
      getPerformancePlan({ id: planId } as any),
      getPerformancePlanStageCount({ id: planId } as any),
      getPerformancePlanLevelCount({ id: planId } as any)
    ])
    if (planResp.code === 0) setPlan(planResp.data)
    if (stageResp.code === 0) setStageCounts(stageResp.data || [])
    if (levelResp.code === 0) setLevelCounts(levelResp.data || [])
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId])

  const columns: ProColumns<any>[] = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      width: 130,
      render: (_, record) => (
        <a
          onClick={() =>
            history.push(`/hrm/performance/assessment/detail?id=${record.id}&planId=${planId}`)
          }
        >
          {record.employeeName}
        </a>
      )
    },
    { title: '工号', dataIndex: 'jobNumber', width: 110 },
    { title: '部门', dataIndex: 'deptName', width: 140 },
    { title: '岗位', dataIndex: 'postName', width: 140 },
    { title: '当前处理人', dataIndex: 'currentHandlerName', width: 120 },
    {
      title: '当前阶段',
      align: 'center',
      width: 110,
      render: (_, record) => {
        const item = PERFORMANCE_STAGE_STATUS[record.stageType]
        return item ? <Tag color={item.color}>{item.label}</Tag> : '-'
      }
    },
    {
      title: '得分',
      dataIndex: 'score',
      align: 'center',
      width: 90,
      render: (_, record) => <span>{record.score ?? '-'}</span>
    },
    {
      title: '结果等级',
      dataIndex: 'resultLevel',
      align: 'center',
      width: 100,
      render: (_, record) => <span>{record.resultLevel || '-'}</span>
    },
    {
      title: '绩效系数',
      dataIndex: 'coefficient',
      align: 'center',
      width: 100,
      render: (_, record) => <span>{record.coefficient ?? '-'}</span>
    }
  ]

  const statusItem = plan ? PERFORMANCE_PLAN_STATUS[plan.status] : undefined

  return (
    <PageContainer title="绩效计划详情" onBack={() => history.push('/hrm/performance/plan')}>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={4} title={plan?.name}>
          <Descriptions.Item label="状态">
            {statusItem ? <Tag color={statusItem.color}>{statusItem.label}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="周期类型">
            {HrmPerformanceCycleTypeOptions.find((o) => o.value === plan?.cycleType)?.label || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="考核周期">{plan?.cycle || '-'}</Descriptions.Item>
          <Descriptions.Item label="起止日期">
            {plan?.startTime ? dayjs(plan.startTime).format('YYYY-MM-DD') : '-'} ~{' '}
            {plan?.endTime ? dayjs(plan.endTime).format('YYYY-MM-DD') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="考核模板">
            {plan?.assessmentTemplateName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="结果模板">{plan?.resultTemplateName || '-'}</Descriptions.Item>
          <Descriptions.Item label="参评/完成">
            {plan?.employeeCount ?? 0}/{plan?.finishedCount ?? 0}
          </Descriptions.Item>
          <Descriptions.Item label="考核说明">{plan?.description || '-'}</Descriptions.Item>
        </Descriptions>
        <Space size={24} style={{ marginTop: 8 }} wrap>
          {stageCounts.map((item, index) => {
            const stage = PERFORMANCE_STAGE_STATUS[item.stageType ?? item.type]
            return (
              <Statistic
                key={index}
                title={stage?.label || `阶段 ${item.stageType ?? item.type}`}
                value={item.count ?? item.employeeCount ?? 0}
              />
            )
          })}
          {levelCounts.map((item, index) => (
            <Statistic
              key={`level_${index}`}
              title={`等级 ${item.resultLevel || item.level || '-'}`}
              value={item.count ?? 0}
            />
          ))}
        </Space>
      </Card>

      <ProTable<any>
        headerTitle="参评员工"
        actionRef={actionRef}
        rowKey="id"
        form={{ colon: false }}
        columns={columns}
        search={false}
        request={async (params: Record<string, any>) => {
          const { current, pageSize } = params
          const resp = await getPerformanceAssessmentPage({
            pageNo: current || 1,
            pageSize: pageSize || 10,
            planId
          } as any)
          return {
            data: resp.data?.list || [],
            success: true,
            total: resp.data?.total || 0
          }
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setAddFormVisible(true)}>
            添加员工
          </Button>
        ]}
        pagination={{ align: 'center', showSizeChanger: true }}
      />

      <PerformancePlanAssessmentAddForm
        visible={addFormVisible}
        setVisible={setAddFormVisible}
        onSuccess={() => {
          load()
          actionRef.current?.reload()
        }}
        planId={planId}
      />
    </PageContainer>
  )
}

export default PerformancePlanDetail
