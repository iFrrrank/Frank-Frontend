import { request } from '@umijs/max'

/** 创建客户 POST /crm/customer/create */
export async function createCustomer(
  body: API.CrmCustomerSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/customer/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除客户 DELETE /crm/customer/delete */
export async function deleteCustomer(
  params: API.deleteCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 分配公海给对应负责人 PUT /crm/customer/distribute */
export async function distributeCustomer(
  body: API.CrmCustomerDistributeReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/distribute', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 导出客户 Excel GET /crm/customer/export-excel */
export async function exportCustomerExcel(
  params: API.exportCustomerExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/customer/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取分配给我、待跟进的线索数量的客户数量 GET /crm/customer/follow-count */
export async function getFollowCustomerCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/customer/follow-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取客户 GET /crm/customer/get */
export async function getCustomer(params: API.getCustomerParams, options?: { [key: string]: any }) {
  return request<API.CommonResultCrmCustomerRespVO>('/crm/customer/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取导入客户模板 GET /crm/customer/get-import-template */
export async function importTemplate(options?: { [key: string]: any }) {
  return request<any>('/crm/customer/get-import-template', {
    method: 'GET',
    ...(options || {})
  })
}

/** 导入客户 POST /crm/customer/import */
export async function importExcel(
  body: API.CrmCustomerImportReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultCrmCustomerImportRespVO>('/crm/customer/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 锁定/解锁客户 PUT /crm/customer/lock */
export async function lockCustomer(
  body: API.CrmCustomerLockReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/lock', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 获取客户分页列表 GET /crm/customer/page */
export async function getCustomerPage(
  params: API.getCustomerPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmCustomerRespVO>('/crm/customer/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 数据放入公海 PUT /crm/customer/put-pool */
export async function putCustomerPool(
  params: API.putCustomerPoolParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/put-pool', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取待进入公海客户数量 GET /crm/customer/put-pool-remind-count */
export async function getPutPoolRemindCustomerCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/customer/put-pool-remind-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取待进入公海客户分页列表 GET /crm/customer/put-pool-remind-page */
export async function getPutPoolRemindCustomerPage(
  params: API.getPutPoolRemindCustomerPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmCustomerRespVO>(
    '/crm/customer/put-pool-remind-page',
    {
      method: 'GET',
      params: {
        ...params,
        pageVO: undefined,
        ...params['pageVO']
      },
      ...(options || {})
    }
  )
}

/** 领取公海客户 PUT /crm/customer/receive */
export async function receiveCustomer(
  params: API.receiveCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/receive', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取客户精简信息列表 只包含有读权限的客户，主要用于前端的下拉选项 GET /crm/customer/simple-list */
export async function getCustomerSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListCrmCustomerRespVO>('/crm/customer/simple-list', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取今日需联系客户数量 GET /crm/customer/today-contact-count */
export async function getTodayContactCustomerCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/customer/today-contact-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 转移客户 PUT /crm/customer/transfer */
export async function transferCustomer(
  body: API.CrmCustomerTransferReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/transfer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新客户 PUT /crm/customer/update */
export async function updateCustomer(
  body: API.CrmCustomerSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新客户的成交状态 PUT /crm/customer/update-deal-status */
export async function updateCustomerDealStatus(
  params: API.updateCustomerDealStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/customer/update-deal-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}
