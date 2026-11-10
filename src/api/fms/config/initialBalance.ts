import { request } from '@umijs/max'

// 导出初始余额 GET /fms/config/initial-balance/export-excel
export async function fmsInitialBalanceExportInitialBalance(
  params: API.FmsInitialBalanceExportInitialBalanceParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/config/initial-balance/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取初始余额导入模板 GET /fms/config/initial-balance/get-import-template
export async function fmsInitialBalanceGetInitialBalanceImportTemplate(
  params: API.FmsInitialBalanceGetInitialBalanceImportTemplateParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/config/initial-balance/get-import-template', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导入初始余额 POST /fms/config/initial-balance/import
export async function fmsInitialBalanceImportInitialBalance(
  params: API.FmsInitialBalanceImportInitialBalanceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultInteger>('/fms/config/initial-balance/import', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取初始余额列表 GET /fms/config/initial-balance/list
export async function fmsInitialBalanceGetInitialBalanceList(
  params: API.FmsInitialBalanceGetInitialBalanceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsInitialBalanceRespVO>('/fms/config/initial-balance/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 保存初始余额 PUT /fms/config/initial-balance/save
export async function fmsInitialBalanceSaveInitialBalance(body: API.FmsInitialBalanceSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/initial-balance/save', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取试算平衡结果 GET /fms/config/initial-balance/trial-balance
export async function fmsInitialBalanceGetTrialBalance(
  params: API.FmsInitialBalanceGetTrialBalanceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsTrialBalanceRespVO>('/fms/config/initial-balance/trial-balance', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
