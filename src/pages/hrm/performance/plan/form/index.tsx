import React, { useEffect, useState } from 'react'
import { Button, Card, List, message, Select, Space, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  PageContainer,
  ProForm,
  ProFormDependency,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  StepsForm
} from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import {
  createPerformancePlan,
  getPerformancePlan,
  updatePerformancePlan
} from '@/api/hrm/performance/plan'
import {
  getPerformanceAssessmentTemplate,
  getPerformanceAssessmentTemplateSimpleList
} from '@/api/hrm/performance/assessTemplate'
import {
  getPerformanceResultTemplate,
  getPerformanceResultTemplateSimpleList
} from '@/api/hrm/performance/resultTemplate'
import PerformanceAssessmentConfigEditor, {
  type AssessmentDimension
} from '../../config/assessment-template/components/PerformanceAssessmentConfigEditor'
import DeptTreeSelect from '../../../attendance/components/DeptTreeSelect'
import HrmEmployeeSelect from '../../../employee/components/HrmEmployeeSelect'
import {
  HrmPerformanceCycleTypeOptions,
  HrmPerformanceHandlerTypeOptions,
  HRM_EMPLOYEE_FORMAL_STATUS_OPTIONS,
  HRM_EMPLOYEE_NON_FORMAL_STATUS_OPTIONS
} from '../../constants'
import { textConst } from '@/locales/zh-CN'
import dayjs from 'dayjs'

// 流程处理人节点
interface HandlerStage {
  type: number
  level?: number
  employeeId?: number
}

// 评分环节
interface ReviewStage {
  name: string
  rater: HandlerStage
  weight?: number
  scoringType: number
  visibleContent: number
  requiredSetting: boolean
  rejectAuthority: boolean
}

// 考评范围
interface PlanScope {
  type: number
  deptIds?: number[]
  employeeIds?: number[]
  employeeType?: number
  employeeStatuses?: number[]
}

const handlerText = (stage?: HandlerStage) => {
  if (!stage) return '-'
  const base = HrmPerformanceHandlerTypeOptions.find((o) => o.value === stage.type)?.label || '-'
  if (stage.type === 1 && stage.level) return `${base}（第 ${stage.level} 级）`
  return base
}

// 处理人节点编辑器：单节点或多节点列表
const HandlerStageEditor: React.FC<{
  value: HandlerStage[]
  onChange: (value: HandlerStage[]) => void
  single?: boolean
}> = ({ value, onChange, single }) => {
  const [formVisible, setFormVisible] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number>()

  return (
    <>
      <List
        size="small"
        bordered
        dataSource={value}
        locale={{ emptyText: '暂无处理人' }}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingIndex(index)
                  setFormVisible(true)
                }}
              />,
              <Button
                key="del"
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              />
            ]}
          >
            {handlerText(item)}
          </List.Item>
        )}
        footer={
          (!single || value.length === 0) && (
            <Button
              type="dashed"
              block
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingIndex(undefined)
                setFormVisible(true)
              }}
            >
              添加处理人
            </Button>
          )
        }
      />
      <ModalForm
        title="处理人"
        open={formVisible}
        onOpenChange={setFormVisible}
        width={440}
        modalProps={{ destroyOnHidden: true, zIndex: 1100 }}
        initialValues={
          editingIndex !== undefined ? value[editingIndex] : { type: 1, level: 1 }
        }
        onFinish={async (values) => {
          const stage: HandlerStage = {
            type: values.type,
            level: values.type === 1 ? values.level : undefined,
            employeeId: values.type === 3 ? values.employeeId : undefined
          }
          if (editingIndex !== undefined) {
            onChange(value.map((item, i) => (i === editingIndex ? stage : item)))
          } else if (single) {
            onChange([stage])
          } else {
            onChange([...value, stage])
          }
          return true
        }}
      >
        <ProFormSelect
          name="type"
          label="处理人类型"
          options={HrmPerformanceHandlerTypeOptions}
          rules={[{ required: true, message: '请选择处理人类型' }]}
        />
        <ProFormDependency name={['type']}>
          {({ type }) =>
            type === 1 ? (
              <ProFormDigit
                name="level"
                label="上级层级"
                fieldProps={{ precision: 0, min: 1, max: 10, style: { width: '100%' } }}
              />
            ) : type === 3 ? (
              <ProForm.Item name="employeeId" label="指定员工" rules={[{ required: true }]}>
                <HrmEmployeeSelect />
              </ProForm.Item>
            ) : null
          }
        </ProFormDependency>
      </ModalForm>
    </>
  )
}

// 绩效计划表单：基本信息 → 考评范围 → 考核指标 → 考核流程 → 结果设置
const PerformancePlanForm: React.FC = () => {
  const [searchParams] = useSearchParams()
  const planId = searchParams.get('id') ? Number(searchParams.get('id')) : undefined
  const isUpdate = planId !== undefined

  const [planData, setPlanData] = useState<any>()
  const [scopes, setScopes] = useState<PlanScope[]>([{ type: 1, deptIds: [], employeeIds: [] }])
  const [dimensions, setDimensions] = useState<AssessmentDimension[]>([])
  const [targetConfirmationStage, setTargetConfirmationStage] = useState<HandlerStage[]>([])
  const [reviewStages, setReviewStages] = useState<ReviewStage[]>([])
  const [resultAuditStages, setResultAuditStages] = useState<HandlerStage[]>([])
  const [appealStages, setAppealStages] = useState<HandlerStage[]>([])
  const [resultLevels, setResultLevels] = useState<any[]>([])
  const [resultTemplateName, setResultTemplateName] = useState<string>()

  const [reviewFormVisible, setReviewFormVisible] = useState(false)
  const [editingReviewIndex, setEditingReviewIndex] = useState<number>()

  useEffect(() => {
    if (planId === undefined) return
    getPerformancePlan({ id: planId } as any).then((resp) => {
      const data = resp.data as any
      if (!data) return
      setPlanData(data)
      setScopes(data.scopes || [])
      setDimensions(data.assessmentConfig?.dimensions || [])
      setTargetConfirmationStage(
        data.targetConfirmationStage ? [data.targetConfirmationStage] : []
      )
      setReviewStages(data.reviewStages || [])
      setResultAuditStages(data.resultAuditStages || [])
      setAppealStages(data.appealStages || [])
      setResultLevels(data.resultConfig?.levels || [])
      setResultTemplateName(data.resultConfig?.name)
    })
  }, [planId])

  // 选择考核模板后带出其维度配置（可继续调整，存入计划自己的 assessmentConfig）
  const handleTemplateChange = async (templateId?: number) => {
    if (!templateId) return {}
    const resp = await getPerformanceAssessmentTemplate({ id: templateId } as any)
    const data = resp.data as any
    if (data) {
      setDimensions(data.dimensions || [])
      return {
        scoreCalculation: data.scoreCalculation,
        upperLimitType: data.upperLimitType,
        upperLimitScore: data.upperLimitScore
      }
    }
    return {}
  }

  // 选择结果模板后带出等级配置（存入计划自己的 resultConfig）
  const handleResultTemplateChange = async (templateId?: number) => {
    if (!templateId) return
    const resp = await getPerformanceResultTemplate({ id: templateId } as any)
    const data = resp.data as any
    if (data) {
      setResultLevels(data.levels || [])
      setResultTemplateName(data.name)
    }
  }

  const onFinish = async (values: Record<string, any>) => {
    if (scopes.length === 0) {
      message.warning('请至少设置一条考评范围')
      return false
    }
    if (dimensions.length === 0) {
      message.warning('请选择考核模板或添加考核维度')
      return false
    }
    if (reviewStages.length === 0) {
      message.warning('请至少添加一个评分环节')
      return false
    }
    const body = {
      id: planId,
      name: values.name,
      cycleType: values.cycleType,
      cycle: values.cycle,
      quarter: values.cycleType === 2 ? values.quarter : undefined,
      startTime: values.startTime
        ? dayjs(values.startTime).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: values.endTime ? dayjs(values.endTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
      description: values.description,
      scopes,
      assessmentTemplateId: values.assessmentTemplateId,
      assessmentConfig: {
        name: values.name,
        scoreCalculation: values.scoreCalculation ?? 1,
        upperLimitType: values.upperLimitType ?? 1,
        upperLimitScore: values.upperLimitScore ?? 100,
        dimensions
      },
      quotaSettingType: values.quotaSettingType ?? 1,
      targetConfirmation: !!values.targetConfirmation,
      targetConfirmationStage:
        values.targetConfirmation && targetConfirmationStage.length > 0
          ? targetConfirmationStage[0]
          : undefined,
      reviewStages,
      resultAudit: !!values.resultAudit,
      resultAuditStages: values.resultAudit ? resultAuditStages : undefined,
      resultConfirmation: !!values.resultConfirmation,
      appealStages,
      appealTimeoutDays: values.appealTimeoutDays ?? 3,
      appealTimeoutAction: values.appealTimeoutAction ?? 1,
      resultTemplateId: values.resultTemplateId,
      resultConfig: { name: resultTemplateName || '', levels: resultLevels },
      syncToSalary: !!values.syncToSalary,
      paidForMonth:
        values.syncToSalary && values.paidForMonth
          ? dayjs(values.paidForMonth).format('YYYY-MM')
          : undefined
    }
    try {
      if (isUpdate) {
        await updatePerformancePlan(body as any)
        message.success(textConst.msg.updateSuccess)
      } else {
        await createPerformancePlan(body as any)
        message.success(textConst.msg.createSuccess)
      }
      history.push('/hrm/performance/plan')
      return true
    } catch {
      message.error(textConst.error.operationFail)
      return false
    }
  }

  return (
    <PageContainer title={isUpdate ? '编辑绩效计划' : '新建绩效计划'} onBack={() => history.back()}>
      <Card>
        <StepsForm onFinish={onFinish} submitter={{ render: undefined }}>
          {/* 第一步：基本信息 */}
          <StepsForm.StepForm
            name="basic"
            title="基本信息"
            initialValues={
              planData
                ? {
                    ...planData,
                    startTime: planData.startTime ? dayjs(planData.startTime) : undefined,
                    endTime: planData.endTime ? dayjs(planData.endTime) : undefined
                  }
                : { cycleType: 1 }
            }
          >
            <ProFormText
              name="name"
              label="考核计划名称"
              rules={[{ required: true, message: '请输入考核计划名称' }]}
              width="lg"
            />
            <ProFormSelect
              name="cycleType"
              label="周期类型"
              options={HrmPerformanceCycleTypeOptions}
              rules={[{ required: true, message: '请选择周期类型' }]}
              width="md"
            />
            <ProFormDependency name={['cycleType']}>
              {({ cycleType }) =>
                cycleType === 2 ? (
                  <ProFormDigit
                    name="quarter"
                    label="季度"
                    fieldProps={{ precision: 0, min: 1, max: 4, style: { width: 200 } }}
                  />
                ) : null
              }
            </ProFormDependency>
            <ProFormText
              name="cycle"
              label="考核周期"
              placeholder="如 2026-01 或 2026 年第一季度"
              width="lg"
            />
            <ProFormDatePicker
              name="startTime"
              label="开始日期"
              fieldProps={{ style: { width: 200 } }}
            />
            <ProFormDatePicker name="endTime" label="结束日期" fieldProps={{ style: { width: 200 } }} />
            <ProFormTextArea name="description" label="考核说明" fieldProps={{ rows: 3 }} width="lg" />
          </StepsForm.StepForm>

          {/* 第二步：考评范围 */}
          <StepsForm.StepForm name="scope" title="考评范围">
            {scopes.map((scope, index) => (
              <Card
                key={index}
                size="small"
                style={{ marginBottom: 12, maxWidth: 720 }}
                title={`范围 ${index + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => setScopes(scopes.filter((_, i) => i !== index))}
                  >
                    删除
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <span>
                    范围类型：
                    <Select
                      style={{ width: 160 }}
                      options={[
                        { label: '员工部门', value: 1 },
                        { label: '聘用形式', value: 2 }
                      ]}
                      value={scope.type}
                      onChange={(type) =>
                        setScopes(
                          scopes.map((item, i) =>
                            i === index ? ({ type } as PlanScope) : item
                          )
                        )
                      }
                    />
                  </span>
                  {scope.type === 1 ? (
                    <>
                      <div>
                        <div style={{ marginBottom: 4 }}>参与部门</div>
                        <DeptTreeSelect
                          value={scope.deptIds || []}
                          onChange={(deptIds) =>
                            setScopes(
                              scopes.map((item, i) => (i === index ? { ...item, deptIds } : item))
                            )
                          }
                        />
                      </div>
                      <div>
                        <div style={{ marginBottom: 4 }}>额外参与员工</div>
                        <HrmEmployeeSelect
                          multiple
                          value={scope.employeeIds || []}
                          onChange={(employeeIds) =>
                            setScopes(
                              scopes.map((item, i) =>
                                i === index
                                  ? { ...item, employeeIds: employeeIds as number[] }
                                  : item
                              )
                            )
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <span>
                        聘用形式：
                        <Select
                          style={{ width: 160 }}
                          options={[
                            { label: '正式', value: 1 },
                            { label: '非正式', value: 2 }
                          ]}
                          value={scope.employeeType}
                          onChange={(employeeType) =>
                            setScopes(
                              scopes.map((item, i) =>
                                i === index ? { ...item, employeeType, employeeStatuses: [] } : item
                              )
                            )
                          }
                        />
                      </span>
                      <span>
                        员工状态：
                        <Select
                          style={{ width: 320 }}
                          mode="multiple"
                          options={
                            scope.employeeType === 2
                              ? HRM_EMPLOYEE_NON_FORMAL_STATUS_OPTIONS
                              : HRM_EMPLOYEE_FORMAL_STATUS_OPTIONS
                          }
                          value={scope.employeeStatuses || []}
                          onChange={(employeeStatuses) =>
                            setScopes(
                              scopes.map((item, i) =>
                                i === index ? { ...item, employeeStatuses } : item
                              )
                            )
                          }
                        />
                      </span>
                    </>
                  )}
                </Space>
              </Card>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              style={{ maxWidth: 720, width: '100%' }}
              onClick={() => setScopes([...scopes, { type: 1, deptIds: [], employeeIds: [] }])}
            >
              添加考评范围
            </Button>
          </StepsForm.StepForm>

          {/* 第三步：考核指标 */}
          <StepsForm.StepForm
            name="indicator"
            title="考核指标"
            initialValues={
              planData
                ? {
                    assessmentTemplateId: planData.assessmentTemplateId,
                    quotaSettingType: planData.quotaSettingType,
                    scoreCalculation: planData.assessmentConfig?.scoreCalculation,
                    upperLimitType: planData.assessmentConfig?.upperLimitType,
                    upperLimitScore: planData.assessmentConfig?.upperLimitScore
                  }
                : { quotaSettingType: 1, scoreCalculation: 1, upperLimitType: 1, upperLimitScore: 100 }
            }
          >
            <ProFormSelect
              name="assessmentTemplateId"
              label="考核模板"
              rules={[{ required: true, message: '请选择考核模板' }]}
              width="lg"
              request={async () => {
                const resp = await getPerformanceAssessmentTemplateSimpleList()
                return (resp.data || []).map((item: any) => ({
                  label: item.name,
                  value: item.id
                }))
              }}
              fieldProps={{
                // 选中模板后带出其维度配置到下方编辑器，分数上限可在下方字段中调整
                onChange: async (value: number) => {
                  await handleTemplateChange(value)
                }
              }}
            />
            <ProFormRadio.Group
              name="quotaSettingType"
              label="指标制定方式"
              options={[
                { label: '系统制定（按模板）', value: 1 },
                { label: '员工制定（员工填写后确认）', value: 2 }
              ]}
            />
            <ProFormDigit
              name="upperLimitScore"
              label="分数上限"
              fieldProps={{ precision: 0, min: 0, style: { width: 200 } }}
            />
            <ProForm.Item label="维度与指标">
              <div style={{ maxWidth: 860 }}>
                <PerformanceAssessmentConfigEditor
                  dimensions={dimensions}
                  onChange={setDimensions}
                />
              </div>
            </ProForm.Item>
          </StepsForm.StepForm>

          {/* 第四步：考核流程 */}
          <StepsForm.StepForm
            name="process"
            title="考核流程"
            initialValues={
              planData
                ? {
                    targetConfirmation: planData.targetConfirmation,
                    resultAudit: planData.resultAudit,
                    resultConfirmation: planData.resultConfirmation,
                    appealTimeoutDays: planData.appealTimeoutDays,
                    appealTimeoutAction: planData.appealTimeoutAction
                  }
                : { appealTimeoutDays: 3, appealTimeoutAction: 1 }
            }
          >
            <ProFormSwitch name="targetConfirmation" label="需要目标确认" />
            <ProFormDependency name={['targetConfirmation']}>
              {({ targetConfirmation }) =>
                targetConfirmation ? (
                  <ProForm.Item label="目标确认处理人">
                    <div style={{ maxWidth: 560 }}>
                      <HandlerStageEditor
                        single
                        value={targetConfirmationStage}
                        onChange={setTargetConfirmationStage}
                      />
                    </div>
                  </ProForm.Item>
                ) : null
              }
            </ProFormDependency>

            <ProForm.Item label="评分环节" required>
              <div style={{ maxWidth: 720 }}>
                <List
                  size="small"
                  bordered
                  dataSource={reviewStages}
                  locale={{ emptyText: '暂无评分环节' }}
                  renderItem={(stage, index) => (
                    <List.Item
                      actions={[
                        <Button
                          key="edit"
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingReviewIndex(index)
                            setReviewFormVisible(true)
                          }}
                        />,
                        <Button
                          key="del"
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            setReviewStages(reviewStages.filter((_, i) => i !== index))
                          }
                        />
                      ]}
                    >
                      <Space>
                        <span>{stage.name}</span>
                        <Tag>{handlerText(stage.rater)}</Tag>
                        <span style={{ color: '#8c8c8c' }}>权重 {stage.weight ?? 0}%</span>
                        <Tag>{stage.scoringType === 2 ? '按总分评分' : '按指标评分'}</Tag>
                      </Space>
                    </List.Item>
                  )}
                  footer={
                    <Button
                      type="dashed"
                      block
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setEditingReviewIndex(undefined)
                        setReviewFormVisible(true)
                      }}
                    >
                      添加评分环节
                    </Button>
                  }
                />
              </div>
            </ProForm.Item>

            <ProFormSwitch name="resultAudit" label="需要结果审核" />
            <ProFormDependency name={['resultAudit']}>
              {({ resultAudit }) =>
                resultAudit ? (
                  <ProForm.Item label="结果审核处理人">
                    <div style={{ maxWidth: 560 }}>
                      <HandlerStageEditor
                        value={resultAuditStages}
                        onChange={setResultAuditStages}
                      />
                    </div>
                  </ProForm.Item>
                ) : null
              }
            </ProFormDependency>
            <ProFormSwitch name="resultConfirmation" label="需要结果确认" />
            <ProForm.Item label="申诉处理人">
              <div style={{ maxWidth: 560 }}>
                <HandlerStageEditor value={appealStages} onChange={setAppealStages} />
              </div>
            </ProForm.Item>
            <ProFormDigit
              name="appealTimeoutDays"
              label="申诉超期天数"
              fieldProps={{ precision: 0, min: 0, style: { width: 200 } }}
            />
            <ProFormRadio.Group
              name="appealTimeoutAction"
              label="申诉超期处理"
              options={[
                { label: '自动拒绝', value: 1 },
                { label: '自动通过', value: 2 }
              ]}
            />
          </StepsForm.StepForm>

          {/* 第五步：结果设置 */}
          <StepsForm.StepForm
            name="result"
            title="结果设置"
            initialValues={
              planData
                ? {
                    resultTemplateId: planData.resultTemplateId,
                    syncToSalary: planData.syncToSalary,
                    paidForMonth: planData.paidForMonth ? dayjs(planData.paidForMonth) : undefined
                  }
                : {}
            }
          >
            <ProFormSelect
              name="resultTemplateId"
              label="结果模板"
              rules={[{ required: true, message: '请选择结果模板' }]}
              width="lg"
              request={async () => {
                const resp = await getPerformanceResultTemplateSimpleList()
                return (resp.data || []).map((item: any) => ({
                  label: item.name,
                  value: item.id
                }))
              }}
              fieldProps={{ onChange: (value: number) => handleResultTemplateChange(value) }}
            />
            {resultLevels.length > 0 && (
              <ProForm.Item label="等级配置">
                <Space wrap>
                  {resultLevels.map((level, index) => (
                    <Tag key={index}>
                      {level.name}（{level.minScore ?? 0}-{level.maxScore ?? 0}，系数{' '}
                      {level.coefficient ?? 0}）
                    </Tag>
                  ))}
                </Space>
              </ProForm.Item>
            )}
            <ProFormSwitch name="syncToSalary" label="同步到薪资" />
            <ProFormDependency name={['syncToSalary']}>
              {({ syncToSalary }) =>
                syncToSalary ? (
                  <ProFormDatePicker
                    name="paidForMonth"
                    label="计薪月份"
                    fieldProps={{ picker: 'month', style: { width: 200 } }}
                  />
                ) : null
              }
            </ProFormDependency>
          </StepsForm.StepForm>
        </StepsForm>
      </Card>

      {/* 评分环节表单 */}
      <ModalForm
        title={editingReviewIndex !== undefined ? '编辑评分环节' : '添加评分环节'}
        open={reviewFormVisible}
        onOpenChange={setReviewFormVisible}
        width={520}
        modalProps={{ destroyOnHidden: true, zIndex: 1100 }}
        initialValues={
          editingReviewIndex !== undefined
            ? {
                ...reviewStages[editingReviewIndex],
                raterType: reviewStages[editingReviewIndex].rater?.type,
                raterLevel: reviewStages[editingReviewIndex].rater?.level,
                raterEmployeeId: reviewStages[editingReviewIndex].rater?.employeeId
              }
            : { scoringType: 1, visibleContent: 2, requiredSetting: true, rejectAuthority: false, raterType: 1, raterLevel: 1 }
        }
        onFinish={async (values) => {
          const stage: ReviewStage = {
            name: values.name,
            rater: {
              type: values.raterType,
              level: values.raterType === 1 ? values.raterLevel : undefined,
              employeeId: values.raterType === 3 ? values.raterEmployeeId : undefined
            },
            weight: values.weight,
            scoringType: values.scoringType,
            visibleContent: values.visibleContent,
            requiredSetting: !!values.requiredSetting,
            rejectAuthority: !!values.rejectAuthority
          }
          if (editingReviewIndex !== undefined) {
            setReviewStages(reviewStages.map((item, i) => (i === editingReviewIndex ? stage : item)))
          } else {
            setReviewStages([...reviewStages, stage])
          }
          return true
        }}
      >
        <ProFormText
          name="name"
          label="环节名称"
          rules={[{ required: true, message: '请输入环节名称' }]}
        />
        <ProFormSelect
          name="raterType"
          label="评分人类型"
          options={HrmPerformanceHandlerTypeOptions.concat([
            { label: '被考核人（自评）', value: 4 }
          ])}
          rules={[{ required: true, message: '请选择评分人类型' }]}
        />
        <ProFormDependency name={['raterType']}>
          {({ raterType }) =>
            raterType === 1 ? (
              <ProFormDigit
                name="raterLevel"
                label="上级层级"
                fieldProps={{ precision: 0, min: 1, max: 10, style: { width: '100%' } }}
              />
            ) : raterType === 3 ? (
              <ProForm.Item name="raterEmployeeId" label="指定员工" rules={[{ required: true }]}>
                <HrmEmployeeSelect />
              </ProForm.Item>
            ) : null
          }
        </ProFormDependency>
        <ProFormDigit
          name="weight"
          label="权重(%)"
          fieldProps={{ precision: 0, min: 0, max: 100, style: { width: '100%' } }}
        />
        <ProFormRadio.Group
          name="scoringType"
          label="评分方式"
          options={[
            { label: '按指标评分', value: 1 },
            { label: '按总分评分', value: 2 }
          ]}
        />
        <ProFormRadio.Group
          name="visibleContent"
          label="可见内容"
          options={[
            { label: '仅自己', value: 1 },
            { label: '全部评分', value: 2 }
          ]}
        />
        <ProFormSwitch name="requiredSetting" label="必填" />
        <ProFormSwitch name="rejectAuthority" label="允许驳回" />
      </ModalForm>
    </PageContainer>
  )
}

export default PerformancePlanForm
