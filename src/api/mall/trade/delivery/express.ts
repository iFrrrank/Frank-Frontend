import { request } from '@umijs/max'

// 创建快递公司 POST /trade/delivery/express/create
export async function createDeliveryExpress(
  body: API.DeliveryExpressCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/trade/delivery/express/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除快递公司 DELETE /trade/delivery/express/delete
export async function deleteDeliveryExpress(
  params: API.deleteDeliveryExpressParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/express/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出快递公司 Excel GET /trade/delivery/express/export-excel
export async function exportDeliveryExpressExcel(
  params: API.exportDeliveryExpressExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/trade/delivery/express/export-excel', {
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

// 获取快递公司 GET /trade/delivery/express/get
export async function getDeliveryExpress(
  params: API.getDeliveryExpressParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultDeliveryExpressRespVO>('/trade/delivery/express/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取快递公司精简信息列表 主要用于前端的下拉选项 GET /trade/delivery/express/list-all-simple
export async function getSimpleDeliveryExpressList(options?: { [key: string]: any }) {
  return request<API.CommonResultListDeliveryExpressSimpleRespVO>(
    '/trade/delivery/express/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取快递公司分页列表 GET /trade/delivery/express/page
export async function getDeliveryExpressPage(
  params: API.getDeliveryExpressPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDeliveryExpressRespVO>('/trade/delivery/express/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 更新快递公司 PUT /trade/delivery/express/update
export async function updateDeliveryExpress(
  body: API.DeliveryExpressUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/express/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
