import { request } from '@umijs/max'

// 创建跟进记录 POST /crm/follow-up-record/create
export async function createFollowUpRecord(
  body: API.CrmFollowUpRecordSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/follow-up-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除跟进记录 DELETE /crm/follow-up-record/delete
export async function deleteFollowUpRecord(
  params: API.deleteFollowUpRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/follow-up-record/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取跟进记录 GET /crm/follow-up-record/get
export async function getFollowUpRecord(
  params: API.getFollowUpRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmFollowUpRecordRespVO>('/crm/follow-up-record/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取跟进记录分页列表 GET /crm/follow-up-record/page
export async function getFollowUpRecordPage(
  params: API.getFollowUpRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmFollowUpRecordRespVO>('/crm/follow-up-record/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}
