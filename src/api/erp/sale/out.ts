import { request } from '@umijs/max'

// 创建销售出库 POST /erp/sale-out/create
export async function createSaleOut(
  body: API.ErpSaleOutSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/erp/sale-out/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除销售出库 DELETE /erp/sale-out/delete
export async function deleteSaleOut(
  params: API.deleteSaleOutParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-out/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出销售出库 Excel GET /erp/sale-out/export-excel
export async function exportSaleOutExcel(
  params: API.exportSaleOutExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/erp/sale-out/export-excel', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 获取销售出库 GET /erp/sale-out/get
export async function getSaleOut(params: API.getSaleOutParams, options?: { [key: string]: any }) {
  return request<API.CommonResultErpSaleOutRespVO>('/erp/sale-out/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取销售出库分页列表 GET /erp/sale-out/page
export async function getSaleOutPage(
  params: API.getSaleOutPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultErpSaleOutRespVO>('/erp/sale-out/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

// 更新销售出库 PUT /erp/sale-out/update
export async function updateSaleOut(
  body: API.ErpSaleOutSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-out/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新销售出库状态 PUT /erp/sale-out/update-status
export async function updateSaleOutStatus(
  params: API.updateSaleOutStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/erp/sale-out/update-status', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

