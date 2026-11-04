import type { CommonResult, PageResult } from './types'
import { request } from '@umijs/max'

// 员工端绩效考核摘要 VO
export interface PortalPerformanceAssessmentSummaryVO {
  id: number
  planId: number
  name?: string
  status?: number
  stageType?: number
  score?: number
  resultLevel?: string
  coefficient?: number
  resultAuditStatus?: number
  resultAuditTime?: string | Date
  resultAuditReason?: string
  appealReason?: string
  appealStatus?: number
  appealTime?: string | Date
  appealComment?: string
  startTime?: string
  endTime?: string
  archiveTime?: string | Date
}

// 员工端绩效任务数量 VO
export interface PortalPerformanceTaskCountVO {
  fillPendingCount: number
  fillCompletedCount: number
  targetPendingCount: number
  targetCompletedCount: number
  reviewPendingCount: number
  reviewCompletedCount: number
  resultAuditPendingCount: number
  resultAuditCompletedCount: number
  resultConfirmationPendingCount: number
  resultConfirmationCompletedCount: number
  resultConfirmationAppealedCount: number
  appealPendingCount: number
  appealCompletedCount: number
}

// 员工端员工绩效考核 VO
export interface PortalPerformanceAssessmentVO {
  id: number
  planId?: number
  planName?: string
  employeeId?: number
  employeeName?: string
  deptName?: string
  postName?: string
  status?: number
  stageType?: number
  score?: number
  resultLevel?: string
  coefficient?: number
  stages?: any[]
  quotas?: any[]
  [key: string]: any
}

// 员工端绩效流程记录 VO
export interface PerformanceRecordVO {
  id?: number
  assessmentId?: number
  stageId?: number
  stageName?: string
  stageType?: number
  operatorId?: number
  operatorName?: string
  action?: number
  comment?: string
  createTime?: string
  title?: string
  content?: string
  source?: 'ACTION' | 'BUSINESS' | 'STAGE'
  status?: number
  operateTime?: string | Date | number
  fileUrls?: string[]
}

// 员工端绩效确认 Request VO
export interface PerformanceConfirmReqVO {
  assessmentId: number
  pass: number
  comment?: string
}

// 员工端绩效申诉 Request VO
export interface PerformanceAppealReqVO {
  assessmentId: number
  appealReason: string
  appealFileUrls?: string[]
  reviewStageIds: number[]
}

// 员工端绩效流程响应 VO
export interface PerformanceProcessRespVO {
  id: number
  nextStageId?: number
}

// 员工端绩效运行阶段处理 Request VO
export interface PerformanceHandleStageReqVO {
  assessmentId: number
  stageId: number
  pass: number
  comment?: string
  reviewStageIds?: number[]
}

// 员工端绩效指标保存 Request VO
export interface PerformanceAssessmentQuotaSaveVO {
  id?: number
  dimensionId?: number
  name?: string
  description?: string
  standard?: string
  weight?: number
  scoreType?: number
  targetValue?: string
  actualValue?: string
  selfScore?: number
  reviewerScore?: number
  finalScore?: number
  comment?: string
  sort?: number
}

// 员工端绩效评分 Request VO
export interface PerformanceReviewScoreReqVO {
  assessmentId: number
  reviewStageId: number
  comment?: string
  selfComment?: string
  reviewerComment?: string
  quotas: PerformanceAssessmentQuotaSaveVO[]
}

// 员工端绩效指标填写 Request VO
export interface PerformanceQuotaReqVO {
  assessmentId: number
  quotas: PerformanceAssessmentQuotaSaveVO[]
}

export interface PerformanceScorePreviewVO {
  totalScore?: number
  resultLevel?: string
  coefficient?: number
}

// 获得我的绩效分页 GET /hrm/portal/performance/assessment/page
export async function getPerformanceAssessmentPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentSummaryVO>>>(
    '/hrm/portal/performance/assessment/page',
    {
      method: 'GET',
      params
    }
  )
}

// 获得我的绩效任务数量 GET /hrm/portal/performance/assessment/task-count
export async function getPerformanceAssessmentTaskCount(search?: string) {
  return request<CommonResult<PortalPerformanceTaskCountVO>>(
    '/hrm/portal/performance/assessment/task-count',
    {
      method: 'GET',
      params: { search }
    }
  )
}

// 获得我的绩效参评详情 GET /hrm/portal/performance/assessment/get
export async function getPerformanceAssessment(id: number, stageId?: number) {
  return request<CommonResult<PortalPerformanceAssessmentVO>>(
    '/hrm/portal/performance/assessment/get',
    {
      method: 'GET',
      params: { id, stageId }
    }
  )
}

// 获得我的绩效流程记录列表 GET /hrm/portal/performance/assessment/process-record-list
export async function getPerformanceAssessmentProcessRecordList(id: number, stageId?: number) {
  return request<CommonResult<PerformanceRecordVO[]>>(
    '/hrm/portal/performance/assessment/process-record-list',
    {
      method: 'GET',
      params: { id, stageId }
    }
  )
}

// 获得我的绩效指标填写任务分页 GET /hrm/portal/performance/assessment/fill-quota-task-page
export async function getPerformanceAssessmentFillQuotaTaskPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentVO>>>(
    '/hrm/portal/performance/assessment/fill-quota-task-page',
    {
      method: 'GET',
      params
    }
  )
}

// 获得我的绩效目标确认任务分页 GET /hrm/portal/performance/assessment/target-confirmation-task-page
export async function getPerformanceAssessmentTargetConfirmationTaskPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentVO>>>(
    '/hrm/portal/performance/assessment/target-confirmation-task-page',
    {
      method: 'GET',
      params
    }
  )
}

// 获得我的绩效评分任务分页 GET /hrm/portal/performance/assessment/review-task-page
export async function getPerformanceAssessmentReviewTaskPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentVO>>>(
    '/hrm/portal/performance/assessment/review-task-page',
    {
      method: 'GET',
      params
    }
  )
}

// 获得我的绩效结果审核任务分页 GET /hrm/portal/performance/assessment/result-audit-task-page
export async function getPerformanceAssessmentResultAuditTaskPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentVO>>>(
    '/hrm/portal/performance/assessment/result-audit-task-page',
    {
      method: 'GET',
      params
    }
  )
}

// 获得我的绩效结果确认任务分页 GET /hrm/portal/performance/assessment/result-confirmation-task-page
export async function getPerformanceAssessmentResultConfirmationTaskPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentVO>>>(
    '/hrm/portal/performance/assessment/result-confirmation-task-page',
    {
      method: 'GET',
      params
    }
  )
}

// 获得我的绩效申诉处理任务分页 GET /hrm/portal/performance/assessment/appeal-task-page
export async function getPerformanceAssessmentAppealTaskPage(params: any) {
  return request<CommonResult<PageResult<PortalPerformanceAssessmentVO>>>(
    '/hrm/portal/performance/assessment/appeal-task-page',
    {
      method: 'GET',
      params
    }
  )
}

// 填写绩效指标 PUT /hrm/portal/performance/assessment/fill-quota
export async function fillPerformanceAssessmentQuota(data: PerformanceQuotaReqVO) {
  return request<API.CommonResultBoolean>('/hrm/portal/performance/assessment/fill-quota', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 确认绩效目标 PUT /hrm/portal/performance/assessment/confirm-target
export async function confirmPerformanceAssessmentTarget(data: PerformanceConfirmReqVO) {
  return request<API.CommonResultBoolean>('/hrm/portal/performance/assessment/confirm-target', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 预览绩效评分结果 POST /hrm/portal/performance/assessment/score-preview
export async function previewPerformanceAssessmentScore(data: PerformanceReviewScoreReqVO) {
  return request<CommonResult<PerformanceScorePreviewVO>>(
    '/hrm/portal/performance/assessment/score-preview',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data
    }
  )
}

// 提交绩效评分 PUT /hrm/portal/performance/assessment/score
export async function scorePerformanceAssessment(data: PerformanceReviewScoreReqVO) {
  return request<CommonResult<PerformanceProcessRespVO>>(
    '/hrm/portal/performance/assessment/score',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data
    }
  )
}

// 驳回绩效评分阶段 PUT /hrm/portal/performance/assessment/reject-review-stage
export async function rejectPerformanceAssessmentReviewStage(data: any) {
  return request<API.CommonResultBoolean>(
    '/hrm/portal/performance/assessment/reject-review-stage',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data
    }
  )
}

// 处理绩效结果审核 PUT /hrm/portal/performance/assessment/handle-result-audit
export async function handlePerformanceAssessmentResultAudit(data: PerformanceHandleStageReqVO) {
  return request<API.CommonResultBoolean>(
    '/hrm/portal/performance/assessment/handle-result-audit',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data
    }
  )
}

// 确认绩效结果 PUT /hrm/portal/performance/assessment/confirm-result
export async function confirmPerformanceAssessmentResult(data: PerformanceConfirmReqVO) {
  return request<API.CommonResultBoolean>('/hrm/portal/performance/assessment/confirm-result', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 提交绩效申诉 PUT /hrm/portal/performance/assessment/submit-appeal
export async function submitPerformanceAssessmentAppeal(data: PerformanceAppealReqVO) {
  return request<CommonResult<PerformanceProcessRespVO>>(
    '/hrm/portal/performance/assessment/submit-appeal',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data
    }
  )
}

// 处理绩效申诉 PUT /hrm/portal/performance/assessment/handle-appeal
export async function handlePerformanceAssessmentAppeal(data: PerformanceHandleStageReqVO) {
  return request<API.CommonResultBoolean>('/hrm/portal/performance/assessment/handle-appeal', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data
  })
}
