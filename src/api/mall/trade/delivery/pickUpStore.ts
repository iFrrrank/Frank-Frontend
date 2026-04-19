import { request } from '@umijs/max'

// 绑定自提店员 POST /trade/delivery/pick-up-store/bind
export async function bindDeliveryPickUpStore(
  body: API.DeliveryPickUpBindReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/pick-up-store/bind', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 创建自提门店 POST /trade/delivery/pick-up-store/create
export async function createDeliveryPickUpStore(
  body: API.DeliveryPickUpStoreCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/trade/delivery/pick-up-store/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除自提门店 DELETE /trade/delivery/pick-up-store/delete
export async function deleteDeliveryPickUpStore(
  params: API.deleteDeliveryPickUpStoreParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/pick-up-store/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取自提门店 GET /trade/delivery/pick-up-store/get
export async function getDeliveryPickUpStore(
  params: API.getDeliveryPickUpStoreParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultDeliveryPickUpStoreRespVO>('/trade/delivery/pick-up-store/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取自提门店列表 GET /trade/delivery/pick-up-store/list
export async function getDeliveryPickUpStoreList(
  params: API.getDeliveryPickUpStoreListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListDeliveryPickUpStoreRespVO>(
    '/trade/delivery/pick-up-store/list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取自提门店分页列表 GET /trade/delivery/pick-up-store/page
export async function getDeliveryPickUpStorePage(
  params: API.getDeliveryPickUpStorePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultDeliveryPickUpStoreRespVO>(
    '/trade/delivery/pick-up-store/page',
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

// 获取自提门店精简信息列表 GET /trade/delivery/pick-up-store/simple-list
export async function getSimpleDeliveryPickUpStoreList(options?: { [key: string]: any }) {
  return request<API.CommonResultListDeliveryPickUpStoreSimpleRespVO>(
    '/trade/delivery/pick-up-store/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 更新自提门店 PUT /trade/delivery/pick-up-store/update
export async function updateDeliveryPickUpStore(
  body: API.DeliveryPickUpStoreUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/delivery/pick-up-store/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

