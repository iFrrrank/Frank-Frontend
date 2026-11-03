import { request } from '@umijs/max'

// 清除推广员 PUT /trade/brokerage-user/clear-bind-user
export async function clearBindUser(
  body: API.BrokerageUserClearBrokerageUserReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/brokerage-user/clear-bind-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 创建分销用户 POST /trade/brokerage-user/create
export async function createBrokerageUser(
  body: API.BrokerageUserCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/trade/brokerage-user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 获取分销用户 GET /trade/brokerage-user/get
export async function getBrokerageUser(
  params: API.getBrokerageUserParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBrokerageUserRespVO>('/trade/brokerage-user/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取分销用户分页列表 GET /trade/brokerage-user/page
export async function getBrokerageUserPage(
  params: API.getBrokerageUserPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultBrokerageUserRespVO>('/trade/brokerage-user/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 修改推广员 PUT /trade/brokerage-user/update-bind-user
export async function updateBindUser(
  body: API.BrokerageUserUpdateBrokerageUserReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/brokerage-user/update-bind-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改推广资格 PUT /trade/brokerage-user/update-brokerage-enable
export async function updateBrokerageEnabled(
  body: API.BrokerageUserUpdateBrokerageEnabledReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/trade/brokerage-user/update-brokerage-enable', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
