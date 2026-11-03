import { request } from '@umijs/max'

// 获取标准参保项目列表 GET /hrm/insurance/standard/project-list
export async function getStandardProjectList(
  params: API.getStandardProjectListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmInsuranceStandardProjectRespVO>('/hrm/insurance/standard/project-list', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 获取标准参保类型列表 GET /hrm/insurance/standard/type-list
export async function getStandardTypeList(
  params: API.getStandardTypeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmInsuranceStandardTypeRespVO>('/hrm/insurance/standard/type-list', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  })
}
