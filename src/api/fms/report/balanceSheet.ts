import { request } from '@umijs/max'

// 检查资产负债表 GET /fms/report/balance-sheet/check
export async function fmsBalanceSheetCheckBalanceSheet(
  params: API.FmsBalanceSheetCheckBalanceSheetParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsBalanceSheetCheckRespVO>('/fms/report/balance-sheet/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出资产负债表 GET /fms/report/balance-sheet/export-excel
export async function fmsBalanceSheetExportBalanceSheet(
  params: API.FmsBalanceSheetExportBalanceSheetParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/report/balance-sheet/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取资产负债表 GET /fms/report/balance-sheet/get
export async function fmsBalanceSheetGetBalanceSheet(
  params: API.FmsBalanceSheetGetBalanceSheetParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsBalanceSheetRowRespVO>('/fms/report/balance-sheet/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新资产负债表公式 PUT /fms/report/balance-sheet/update
export async function fmsBalanceSheetUpdateBalanceSheetFormula(body: API.FmsReportFormulaUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/report/balance-sheet/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
