import { request } from '@umijs/max'

/** 获取待审核合同数量 GET /crm/contract/audit-count */
export async function getAuditContractCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/contract/audit-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 创建合同 POST /crm/contract/create */
export async function createContract(
  body: API.CrmContractSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/crm/contract/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除合同 DELETE /crm/contract/delete */
export async function deleteContract(
  params: API.deleteContractParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contract/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 导出合同 Excel GET /crm/contract/export-excel */
export async function exportContractExcel(
  params: API.exportContractExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/crm/contract/export-excel', {
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

/** 获取合同 GET /crm/contract/get */
export async function getContract(params: API.getContractParams, options?: { [key: string]: any }) {
  return request<API.CommonResultCrmContractRespVO>('/crm/contract/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取合同分页列表 GET /crm/contract/page */
export async function getContractPage(
  params: API.getContractPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmContractRespVO>('/crm/contract/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取指定商机的合同分页列表 GET /crm/contract/page-by-business */
export async function getContractPageByBusiness(
  params: API.getContractPageByBusinessParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmContractRespVO>('/crm/contract/page-by-business', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取指定客户的合同分页列表 GET /crm/contract/page-by-customer */
export async function getContractPageByCustomer(
  params: API.getContractPageByCustomerParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultCrmContractRespVO>('/crm/contract/page-by-customer', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

/** 获取即将到期（提醒）的合同数量 GET /crm/contract/remind-count */
export async function getRemindContractCount(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/crm/contract/remind-count', {
    method: 'GET',
    ...(options || {})
  })
}

/** 获取合同精简列表 只包含的合同，主要用于前端的下拉选项 GET /crm/contract/simple-list */
export async function getContractSimpleList(
  params: API.getContractSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListCrmContractRespVO>('/crm/contract/simple-list', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 提交合同审批 PUT /crm/contract/submit */
export async function submitContract1(
  params: API.submitContract1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contract/submit', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 合同转移 PUT /crm/contract/transfer */
export async function transferContract(
  body: API.CrmContractTransferReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contract/transfer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新合同 PUT /crm/contract/update */
export async function updateContract(
  body: API.CrmContractSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/crm/contract/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
