import { request } from '@umijs/max'

/** 创建线索 POST /crm/clue/create */
export async function createClue(body: API.CrmClueSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/clue/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除线索 DELETE /crm/clue/delete */
export async function deleteClue(params: API.deleteClueParams, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/crm/clue/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 导出线索 Excel GET /crm/clue/export-excel */
export async function exportClueExcel(
  params: API.exportClueExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/clue/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

/** 获取分配给我的、待跟进的线索数量 GET /crm/clue/follow-count */
export async function getFollowClueCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/clue/follow-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取线索 GET /crm/clue/get */
export async function getClue(params: API.getClueParams, options?: { [key: string]: any }) {
  return request<API.CommonResultCrmClueRespVO>('/crm/clue/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取线索分页列表 GET /crm/clue/page */
export async function getCluePage(params: API.getCluePageParams, options?: { [key: string]: any }) {
  return request<API.CommonResultPageResultCrmClueRespVO>('/crm/clue/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 线索转移 PUT /crm/clue/transfer */
export async function transferClue(
  body: API.CrmClueTransferReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/clue/transfer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 线索转化为客户 PUT /crm/clue/transform */
export async function transformClue(
  params: API.transformClueParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/clue/transform', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 更新线索 PUT /crm/clue/update */
export async function updateClue(body: API.CrmClueSaveReqVO, options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/crm/clue/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
