import { request } from '@umijs/max'

/** 创建商机 POST /crm/business/create */
export async function createBusiness(
  body: API.CrmBusinessSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/business/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除商机 DELETE /crm/business/delete */
export async function deleteBusiness(
  params: API.deleteBusinessParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/business/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 导出商机 Excel GET /crm/business/export-excel */
export async function exportBusinessExcel(
  params: API.exportBusinessExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/business/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    ...(options || {})
  })
}

/** 获取商机详情 GET /crm/business/get */
export async function getBusiness(params: API.getBusinessParams, options?: { [key: string]: any }) {
  return request<API.CommonResultCrmBusinessRespVO>('/crm/business/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取商机分页列表 GET /crm/business/page */
export async function getBusinessPage(
  params: API.getBusinessPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmBusinessRespVO>('/crm/business/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取联系人的商机分页列表 GET /crm/business/page-by-contact */
export async function getBusinessContactPage(
  params: API.getBusinessContactPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmBusinessRespVO>('/crm/business/page-by-contact', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 基于指定客户获取商机分页列表 GET /crm/business/page-by-customer */
export async function getBusinessPageByCustomer(
  params: API.getBusinessPageByCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmBusinessRespVO>('/crm/business/page-by-customer', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 获取商机的精简列表 GET /crm/business/simple-all-list */
export async function getSimpleContactList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListCrmBusinessRespVO>('/crm/business/simple-all-list', {
    method: 'GET',
    ...(options || {})
  })
}

/** 商机转移 PUT /crm/business/transfer */
export async function transferBusiness(
  body: API.CrmBusinessTransferReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/business/transfer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新商机 PUT /crm/business/update */
export async function updateBusiness(
  body: API.CrmBusinessSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/business/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新商机状态 PUT /crm/business/update-status */
export async function updateBusinessStatus(
  body: API.CrmBusinessUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/business/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
