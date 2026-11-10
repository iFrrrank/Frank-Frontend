import { request } from '@umijs/max'

// 检查利润表 GET /fms/report/income-statement/check
export async function fmsIncomeStatementCheckIncomeStatement(
  params: API.FmsIncomeStatementCheckIncomeStatementParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsIncomeStatementCheckRespVO>('/fms/report/income-statement/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出利润表 GET /fms/report/income-statement/export-excel
export async function fmsIncomeStatementExportIncomeStatement(
  params: API.FmsIncomeStatementExportIncomeStatementParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/report/income-statement/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取利润表 GET /fms/report/income-statement/get
export async function fmsIncomeStatementGetIncomeStatement(
  params: API.FmsIncomeStatementGetIncomeStatementParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsReportItemRespVO>('/fms/report/income-statement/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新利润表公式 PUT /fms/report/income-statement/update
export async function fmsIncomeStatementUpdateIncomeStatementFormula(body: API.FmsReportFormulaUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/report/income-statement/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
