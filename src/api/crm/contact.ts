import { request } from '@umijs/max'

/** 创建联系人 POST /crm/contact/create */
export async function createContact(
  body: API.CrmContactSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/contact/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 创建联系人与商机的关联 POST /crm/contact/create-business-list */
export async function createContactBusinessList(
  body: API.CrmContactBusinessReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/create-business-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 创建联系人与商机的关联 POST /crm/contact/create-business-list2 */
export async function createContactBusinessList2(
  body: API.CrmContactBusiness2ReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/create-business-list2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除联系人 DELETE /crm/contact/delete */
export async function deleteContact(
  params: API.deleteContactParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 删除联系人与联系人的关联 DELETE /crm/contact/delete-business-list */
export async function deleteContactBusinessList(
  body: API.CrmContactBusinessReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/delete-business-list', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除联系人与联系人的关联 DELETE /crm/contact/delete-business-list2 */
export async function deleteContactBusinessList1(
  body: API.CrmContactBusiness2ReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/delete-business-list2', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 导出联系人 Excel GET /crm/contact/export-excel */
export async function exportContactExcel(
  params: API.exportContactExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/contact/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

/** 获取联系人 GET /crm/contact/get */
export async function getContact(params: API.getContactParams, options?: { [key: string]: any }) {
  return request<API.CommonResultCrmContactRespVO>('/crm/contact/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取联系人分页列表 GET /crm/contact/page */
export async function getContactPage(
  params: API.getContactPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmContactRespVO>('/crm/contact/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 通过商机获取联系人分页列表 GET /crm/contact/page-by-business */
export async function getContactPageByBusiness(
  params: API.getContactPageByBusinessParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmContactRespVO>('/crm/contact/page-by-business', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 通过客户获取联系人分页列表 GET /crm/contact/page-by-customer */
export async function getContactPageByCustomer(
  params: API.getContactPageByCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmContactRespVO>('/crm/contact/page-by-customer', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取联系人的精简列表 GET /crm/contact/simple-all-list */
export async function getSimpleContactList(options?: { [key: string]: any }) {
  return request<API.CommonResultListCrmContactRespVO>('/crm/contact/simple-all-list', {
    method: 'GET',
    ...(options || {})
  })
}

/** 联系人转移 PUT /crm/contact/transfer */
export async function transferContact(
  body: API.CrmContactTransferReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/transfer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新联系人 PUT /crm/contact/update */
export async function updateContact(
  body: API.CrmContactSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contact/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
