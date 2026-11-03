import { request } from '@umijs/max'

// 创建绩效结果模板 POST /hrm/performance/result-template/create
export async function createPerformanceResultTemplate(body: API.HrmPerformanceResultTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/performance/result-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除绩效结果模板 DELETE /hrm/performance/result-template/delete
export async function deletePerformanceResultTemplate(
  params: API.deletePerformanceResultTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/result-template/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 批量删除绩效结果模板 DELETE /hrm/performance/result-template/delete-list
export async function deletePerformanceResultTemplateList(
  params: API.deletePerformanceResultTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/result-template/delete-list', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取绩效结果模板 GET /hrm/performance/result-template/get
export async function getPerformanceResultTemplate(
  params: API.getPerformanceResultTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmPerformanceResultTemplateRespVO>('/hrm/performance/result-template/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取绩效结果模板分页列表 GET /hrm/performance/result-template/page
export async function getPerformanceResultTemplatePage(
  params: API.getPerformanceResultTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmPerformanceResultTemplateRespVO>('/hrm/performance/result-template/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 获取绩效结果模板精简列表 GET /hrm/performance/result-template/simple-list
export async function getPerformanceResultTemplateSimpleList(
  params: API.getPerformanceResultTemplateSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmPerformanceResultTemplateRespVO>('/hrm/performance/result-template/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新绩效结果模板 PUT /hrm/performance/result-template/update
export async function updatePerformanceResultTemplate(body: API.HrmPerformanceResultTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/performance/result-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

