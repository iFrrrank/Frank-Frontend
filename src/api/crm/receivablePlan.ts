import { request } from '@umijs/max'

/** 创建回款计划 POST /crm/receivable-plan/create */
export async function createReceivablePlan(
  body: API.CrmReceivablePlanSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/receivable-plan/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除回款计划 DELETE /crm/receivable-plan/delete */
export async function deleteReceivablePlan(
  params: API.deleteReceivablePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/receivable-plan/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 导出回款计划 Excel GET /crm/receivable-plan/export-excel */
export async function exportReceivablePlanExcel(
  params: API.exportReceivablePlanExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/receivable-plan/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

/** 获取回款计划 GET /crm/receivable-plan/get */
export async function getReceivablePlan(
  params: API.getReceivablePlanParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmReceivablePlanRespVO>('/crm/receivable-plan/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取回款计划分页列表 GET /crm/receivable-plan/page */
export async function getReceivablePlanPage(
  params: API.getReceivablePlanPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmReceivablePlanRespVO>('/crm/receivable-plan/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 基于指定客户获取回款计划分页列表 GET /crm/receivable-plan/page-by-customer */
export async function getReceivablePlanPageByCustomer(
  params: API.getReceivablePlanPageByCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmReceivablePlanRespVO>(
    '/crm/receivable-plan/page-by-customer',
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

/** 获取待回款提醒数量 GET /crm/receivable-plan/remind-count */
export async function getReceivablePlanRemindCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/receivable-plan/remind-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取回款计划精简列表 获取回款计划精简列表，主要用于前端的下拉选项 GET /crm/receivable-plan/simple-list */
export async function getReceivablePlanSimpleList(
  params: API.getReceivablePlanSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmReceivablePlanRespVO>('/crm/receivable-plan/simple-list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 更新回款计划 PUT /crm/receivable-plan/update */
export async function updateReceivablePlan(
  body: API.CrmReceivablePlanSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/receivable-plan/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
