import { request } from '@umijs/max'

// 获取招聘淘汰原因列表 GET /hrm/recruit/config/eliminate-reason/list
export async function getRecruitEliminateReasonList(options?: { [key: string]: any }) {
  return request<API.CommonResultListString>('/hrm/recruit/config/eliminate-reason/list', {
    method: 'GET',
    ...(options || {})
  })
}

// 保存招聘淘汰原因 POST /hrm/recruit/config/eliminate-reason/save
export async function saveRecruitEliminateReason(
  body: API.HrmRecruitEliminateReasonSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/recruit/config/eliminate-reason/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
