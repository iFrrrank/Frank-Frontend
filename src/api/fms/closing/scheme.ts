import { request } from '@umijs/max'

// 创建结账方案 POST /fms/closing/scheme/create
export async function fmsClosingSchemeCreateClosingScheme(body: API.FmsClosingSchemeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/closing/scheme/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除结账方案 DELETE /fms/closing/scheme/delete
export async function fmsClosingSchemeDeleteClosingScheme(
  params: API.FmsClosingSchemeDeleteClosingSchemeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/scheme/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取结账方案列表 GET /fms/closing/scheme/list
export async function fmsClosingSchemeGetClosingSchemeList(
  params: API.FmsClosingSchemeGetClosingSchemeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsClosingSchemeRespVO>('/fms/closing/scheme/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改结账方案 PUT /fms/closing/scheme/update
export async function fmsClosingSchemeUpdateClosingScheme(body: API.FmsClosingSchemeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/scheme/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 保存结转损益设置 PUT /fms/closing/scheme/update-profit-loss-settings
export async function fmsClosingSchemeSaveProfitLossSettings(body: API.FmsProfitLossSettingsSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/closing/scheme/update-profit-loss-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 保存专用结转设置 PUT /fms/closing/scheme/update-special-settings
export async function fmsClosingSchemeUpdateSpecialClosingSettings(body: API.FmsSpecialClosingSettingsSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/scheme/update-special-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
