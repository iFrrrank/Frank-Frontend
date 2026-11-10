import { request } from '@umijs/max'

// 创建账套 POST /fms/config/account-set/create
export async function fmsAccountSetCreateAccountSet(body: API.FmsAccountSetSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/account-set/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取账套 GET /fms/config/account-set/get
export async function fmsAccountSetGetAccountSet(
  params: API.FmsAccountSetGetAccountSetParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsAccountSetRespVO>('/fms/config/account-set/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 初始化账套 PUT /fms/config/account-set/initialize
export async function fmsAccountSetInitializeAccountSet(body: API.FmsAccountSetInitializeReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/account-set/initialize', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取当前用户账套列表 GET /fms/config/account-set/list
export async function fmsAccountSetGetAccountSetList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsAccountSetRespVO>('/fms/config/account-set/list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 更新账套 PUT /fms/config/account-set/update
export async function fmsAccountSetUpdateAccountSet(body: API.FmsAccountSetSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/account-set/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
