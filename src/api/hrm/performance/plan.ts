import { request } from '@umijs/max'

// 归档绩效计划 POST /hrm/performance/plan/archive
export async function archivePerformancePlan(
  params: API.archivePerformancePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/archive', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建绩效计划 POST /hrm/performance/plan/create
export async function createPerformancePlan(
  body: API.HrmPerformancePlanSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/performance/plan/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除绩效计划 DELETE /hrm/performance/plan/delete
export async function deletePerformancePlan(
  params: API.deletePerformancePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取绩效计划 GET /hrm/performance/plan/get
export async function getPerformancePlan(
  params: API.getPerformancePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmPerformancePlanRespVO>('/hrm/performance/plan/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取绩效结果等级统计 GET /hrm/performance/plan/level-count
export async function getPerformancePlanLevelCount(
  params: API.getPerformancePlanLevelCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmPerformancePlanResultLevelCountRespVO>(
    '/hrm/performance/plan/level-count',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 开启绩效评分 POST /hrm/performance/plan/open-scoring
export async function openPerformancePlanScoring(
  params: API.openPerformancePlanScoringParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/open-scoring', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取绩效计划分页列表 GET /hrm/performance/plan/page
export async function getPerformancePlanPage(
  params: API.getPerformancePlanPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmPerformancePlanRespVO>('/hrm/performance/plan/page', {
    method: 'GET',
    params: {
      ...params,
      reqVO: undefined,
      ...params['reqVO']
    },
    ...(options || {})
  })
}

// 获取绩效计划阶段统计 GET /hrm/performance/plan/stage-count
export async function getPerformancePlanStageCount(
  params: API.getPerformancePlanStageCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmPerformancePlanStageCountRespVO>(
    '/hrm/performance/plan/stage-count',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 启动绩效计划 POST /hrm/performance/plan/start
export async function startPerformancePlan(
  params: API.startPerformancePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/start', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 发起绩效面谈 POST /hrm/performance/plan/start-interview
export async function startPerformancePlanInterview(
  params: API.startPerformancePlanInterviewParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/start-interview', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取绩效计划状态统计 GET /hrm/performance/plan/status-count
export async function getPerformancePlanStatusCount(
  params: API.getPerformancePlanStatusCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultMapIntegerLong>('/hrm/performance/plan/status-count', {
    method: 'GET',
    params: {
      ...params,
      reqVO: undefined,
      ...params['reqVO']
    },
    ...(options || {})
  })
}

// 终止绩效计划 POST /hrm/performance/plan/terminate
export async function terminatePerformancePlan(
  params: API.terminatePerformancePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/terminate', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 更新绩效计划 PUT /hrm/performance/plan/update
export async function updatePerformancePlan(
  body: API.HrmPerformancePlanSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/plan/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
