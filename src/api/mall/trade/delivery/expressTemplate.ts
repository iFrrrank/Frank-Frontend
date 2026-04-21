import { request } from '@umijs/max'

// 创建快递运费模板 POST /trade/delivery/express-template/create
export async function createDeliveryExpressTemplate(
  body: API.DeliveryExpressTemplateCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/trade/delivery/express-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除快递运费模板 DELETE /trade/delivery/express-template/delete
export async function deleteDeliveryExpressTemplate(
  params: API.deleteDeliveryExpressTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/express-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取快递运费模板 GET /trade/delivery/express-template/get
export async function getDeliveryExpressTemplate(
  params: API.getDeliveryExpressTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultDeliveryExpressTemplateDetailRespVO>(
    '/trade/delivery/express-template/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取快递运费模板列表 GET /trade/delivery/express-template/list
export async function getDeliveryExpressTemplateList(
  params: API.getDeliveryExpressTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListDeliveryExpressTemplateRespVO>(
    '/trade/delivery/express-template/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取快递模版精简信息列表 主要用于前端的下拉选项 GET /trade/delivery/express-template/list-all-simple
export async function getSimpleTemplateList(options?: { [key: string]: any }) {
  return request<API.CommonResultListDeliveryExpressTemplateSimpleRespVO>(
    '/trade/delivery/express-template/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取快递运费模板分页列表 GET /trade/delivery/express-template/page
export async function getDeliveryExpressTemplatePage(
  params: API.getDeliveryExpressTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDeliveryExpressTemplateRespVO>(
    '/trade/delivery/express-template/page',
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

// 更新快递运费模板 PUT /trade/delivery/express-template/update
export async function updateDeliveryExpressTemplate(
  body: API.DeliveryExpressTemplateUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/express-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

