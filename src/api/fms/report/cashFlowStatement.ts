import { request } from '@umijs/max'

// 获取现金流量辅助数据列表 GET /fms/report/cash-flow-statement/adjustment/list
export async function fmsCashFlowStatementGetCashFlowAdjustmentList(
  params: API.FmsCashFlowStatementGetCashFlowAdjustmentListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsCashFlowAdjustmentRespVO>('/fms/report/cash-flow-statement/adjustment/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新现金流量辅助数据 PUT /fms/report/cash-flow-statement/adjustment/update
export async function fmsCashFlowStatementUpdateCashFlowAdjustment(body: API.FmsCashFlowAdjustmentUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/report/cash-flow-statement/adjustment/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新现金流量辅助数据公式 PUT /fms/report/cash-flow-statement/adjustment/update-formula
export async function fmsCashFlowStatementUpdateCashFlowAdjustmentFormula(body: API.FmsReportFormulaUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/report/cash-flow-statement/adjustment/update-formula', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 检查现金流量表 GET /fms/report/cash-flow-statement/check
export async function fmsCashFlowStatementCheckCashFlowStatement(
  params: API.FmsCashFlowStatementCheckCashFlowStatementParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsCashFlowCheckRespVO>('/fms/report/cash-flow-statement/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出现金流量表 GET /fms/report/cash-flow-statement/export-excel
export async function fmsCashFlowStatementExportCashFlowStatement(
  params: API.FmsCashFlowStatementExportCashFlowStatementParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/report/cash-flow-statement/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取现金流量表 GET /fms/report/cash-flow-statement/get
export async function fmsCashFlowStatementGetCashFlowStatement(
  params: API.FmsCashFlowStatementGetCashFlowStatementParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsReportItemRespVO>('/fms/report/cash-flow-statement/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新现金流量表 PUT /fms/report/cash-flow-statement/update
export async function fmsCashFlowStatementUpdateCashFlowStatement(body: API.FmsCashFlowStatementUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/report/cash-flow-statement/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
