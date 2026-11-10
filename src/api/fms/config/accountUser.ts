import { request } from '@umijs/max'

// 获取账套用户列表 GET /fms/config/account-user/list
export async function fmsAccountUserGetAccountUserList(
  params: API.FmsAccountUserGetAccountUserListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsAccountUserRespVO>('/fms/config/account-user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新账套用户列表 PUT /fms/config/account-user/update
export async function fmsAccountUserUpdateAccountUserList(body: API.FmsAccountUserUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/account-user/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新默认账套状态 PUT /fms/config/account-user/update-default-status
export async function fmsAccountUserUpdateAccountSetDefaultStatus(
  params: API.FmsAccountUserUpdateAccountSetDefaultStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/account-user/update-default-status', {
    method: 'PUT',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
