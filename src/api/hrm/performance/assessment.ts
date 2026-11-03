import { request } from '@umijs/max'

// 删除绩效归档记录 DELETE /hrm/performance/assessment/archive-delete
export async function deletePerformanceArchiveRecords(
  params: API.deletePerformanceArchiveRecordsParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment/archive-delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 删除员工的全部绩效档案 DELETE /hrm/performance/assessment/archive-employee-delete
export async function deletePerformanceArchiveEmployeeRecords(
  params: API.deletePerformanceArchiveEmployeeRecordsParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment/archive-employee-delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工绩效档案分页列表 GET /hrm/performance/assessment/archive-employee-page
export async function getPerformanceArchiveEmployeePage(
  params: API.getPerformanceArchiveEmployeePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmPerformanceArchiveEmployeeRespVO>('/hrm/performance/assessment/archive-employee-page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取绩效归档详情 GET /hrm/performance/assessment/archive-get
export async function getPerformanceAssessmentArchive(
  params: API.getPerformanceAssessmentArchiveParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmPerformanceAssessmentRespVO>('/hrm/performance/assessment/archive-get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取绩效归档分页列表 GET /hrm/performance/assessment/archive-page
export async function getPerformanceAssessmentArchivePage(
  params: API.getPerformanceAssessmentArchivePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmPerformanceAssessmentRespVO>('/hrm/performance/assessment/archive-page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取绩效归档计划精简列表 GET /hrm/performance/assessment/archive-plan-simple-list
export async function getPerformanceArchivePlanSimpleList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmPerformancePlanRespVO>('/hrm/performance/assessment/archive-plan-simple-list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取绩效归档流程记录列表 GET /hrm/performance/assessment/archive-process-record-list
export async function getPerformanceAssessmentArchiveProcessRecordList(
  params: API.getPerformanceAssessmentArchiveProcessRecordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmPerformanceProcessRecordRespVO>('/hrm/performance/assessment/archive-process-record-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 添加员工绩效考核 POST /hrm/performance/assessment/create-list
export async function addPerformancePlanEmployees(body: API.HrmPerformanceAssessmentBatchReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment/create-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除员工绩效考核 DELETE /hrm/performance/assessment/delete-list
export async function removePerformancePlanEmployees(body: API.HrmPerformanceAssessmentBatchReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment/delete-list', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取员工绩效考核 GET /hrm/performance/assessment/get
export async function getPerformanceAssessment(
  params: API.getPerformanceAssessmentParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmPerformanceAssessmentRespVO>('/hrm/performance/assessment/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工绩效考核分页列表 GET /hrm/performance/assessment/page
export async function getPerformanceAssessmentPage(
  params: API.getPerformanceAssessmentPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmPerformanceAssessmentRespVO>('/hrm/performance/assessment/page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取绩效流程记录列表 GET /hrm/performance/assessment/process-record-list
export async function getPerformanceAssessmentProcessRecordList(
  params: API.getPerformanceAssessmentProcessRecordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmPerformanceProcessRecordRespVO>('/hrm/performance/assessment/process-record-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取未加入指定绩效计划的员工 Ids GET /hrm/performance/assessment/unassigned-employee-id-list
export async function getPerformancePlanUnassignedEmployeeIdList(
  params: API.getPerformancePlanUnassignedEmployeeIdListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListLong>('/hrm/performance/assessment/unassigned-employee-id-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
