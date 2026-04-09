import { request } from '@umijs/max'

/** 获取待审核回款数量 GET /crm/receivable/audit-count */
export async function getAuditReceivableCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/receivable/audit-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 创建回款 POST /crm/receivable/create */
export async function createReceivable(
  body: API.CrmReceivableSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/receivable/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除回款 DELETE /crm/receivable/delete */
export async function deleteReceivable(
  params: API.deleteReceivableParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/receivable/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 导出回款 Excel GET /crm/receivable/export-excel */
export async function exportReceivableExcel(
  params: API.exportReceivableExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/receivable/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

/** 获取回款 GET /crm/receivable/get */
export async function getReceivable(
  params: API.getReceivableParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmReceivableRespVO>('/crm/receivable/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取回款分页列表 GET /crm/receivable/page */
export async function getReceivablePage(
  params: API.getReceivablePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmReceivableRespVO>('/crm/receivable/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 基于指定客户获取回款分页列表 GET /crm/receivable/page-by-customer */
export async function getReceivablePageByCustomer(
  params: API.getReceivablePageByCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmReceivableRespVO>(
    '/crm/receivable/page-by-customer',
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

/** 提交回款审批 PUT /crm/receivable/submit */
export async function submitContract(
  params: API.submitContractParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/receivable/submit', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 更新回款 PUT /crm/receivable/update */
export async function updateReceivable(
  body: API.CrmReceivableSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/receivable/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
