import { request } from '@umijs/max'

// 获取招聘职位类型列表 GET /hrm/recruit/post-type/list
export async function getRecruitPostTypeList(
  params: API.getRecruitPostTypeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmRecruitPostTypeRespVO>('/hrm/recruit/post-type/list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}
