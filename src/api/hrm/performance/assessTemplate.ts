import { request } from '@umijs/max'

// 创建绩效考核模板 POST /hrm/performance/assessment-template/create
export async function createPerformanceAssessmentTemplate(
  body: API.HrmPerformanceAssessmentTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/performance/assessment-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除绩效考核模板 DELETE /hrm/performance/assessment-template/delete
export async function deletePerformanceAssessmentTemplate(
  params: API.deletePerformanceAssessmentTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 批量删除绩效考核模板 DELETE /hrm/performance/assessment-template/delete-list
export async function deletePerformanceAssessmentTemplateList(
  params: API.deletePerformanceAssessmentTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment-template/delete-list', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取绩效考核模板 GET /hrm/performance/assessment-template/get
export async function getPerformanceAssessmentTemplate(
  params: API.getPerformanceAssessmentTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmPerformanceAssessmentTemplateRespVO>(
    '/hrm/performance/assessment-template/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取绩效考核模板分页列表 GET /hrm/performance/assessment-template/page
export async function getPerformanceAssessmentTemplatePage(
  params: API.getPerformanceAssessmentTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmPerformanceAssessmentTemplateRespVO>(
    '/hrm/performance/assessment-template/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageReqVO: undefined,
        ...params['pageReqVO']
      },
      ...(options || {})
    }
  )
}

// 获取绩效考核模板精简列表 GET /hrm/performance/assessment-template/simple-list
export async function getPerformanceAssessmentTemplateSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListHrmPerformanceAssessmentTemplateRespVO>(
    '/hrm/performance/assessment-template/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 更新绩效考核模板 PUT /hrm/performance/assessment-template/update
export async function updatePerformanceAssessmentTemplate(
  body: API.HrmPerformanceAssessmentTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/assessment-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
