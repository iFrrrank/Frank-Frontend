import { request } from '@umijs/max'

// 导出核算项目余额表 GET /fms/ledger/auxiliary-balance/export-excel
export async function fmsLedgerExportAuxiliaryBalance(
  params: API.FmsLedgerExportAuxiliaryBalanceParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/auxiliary-balance/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取核算项目余额表 GET /fms/ledger/auxiliary-balance/list
export async function fmsLedgerGetAuxiliaryBalanceList(
  params: API.FmsLedgerGetAuxiliaryBalanceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerAuxiliaryBalanceRespVO>('/fms/ledger/auxiliary-balance/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出核算项目明细账 GET /fms/ledger/auxiliary-detail/export-excel
export async function fmsLedgerExportAuxiliaryDetail(
  params: API.FmsLedgerExportAuxiliaryDetailParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/auxiliary-detail/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取核算项目明细账 GET /fms/ledger/auxiliary-detail/list
export async function fmsLedgerGetAuxiliaryDetailList(
  params: API.FmsLedgerGetAuxiliaryDetailListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerAuxiliaryDetailRespVO>('/fms/ledger/auxiliary-detail/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出明细账 GET /fms/ledger/detail/export-excel
export async function fmsLedgerExportDetail(
  params: API.FmsLedgerExportDetailParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/detail/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取明细账 GET /fms/ledger/detail/list
export async function fmsLedgerGetDetailList(
  params: API.FmsLedgerGetDetailListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerDetailRespVO>('/fms/ledger/detail/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取指定期间有发生额的明细账科目 GET /fms/ledger/detail/subject-list
export async function fmsLedgerGetDetailSubjectList(
  params: API.FmsLedgerGetDetailSubjectListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsSubjectRespVO>('/fms/ledger/detail/subject-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出总账 GET /fms/ledger/general/export-excel
export async function fmsLedgerExportGeneral(
  params: API.FmsLedgerExportGeneralParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/general/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取总账 GET /fms/ledger/general/list
export async function fmsLedgerGetGeneralList(
  params: API.FmsLedgerGetGeneralListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerGeneralRespVO>('/fms/ledger/general/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出多栏账 GET /fms/ledger/multi-column/export-excel
export async function fmsLedgerExportMultiColumn(
  params: API.FmsLedgerExportMultiColumnParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/multi-column/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取多栏账 GET /fms/ledger/multi-column/list
export async function fmsLedgerGetMultiColumn(
  params: API.FmsLedgerGetMultiColumnParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsLedgerMultiColumnRespVO>('/fms/ledger/multi-column/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出数量金额明细账 GET /fms/ledger/quantity-detail/export-excel
export async function fmsLedgerExportQuantityDetail(
  params: API.FmsLedgerExportQuantityDetailParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/quantity-detail/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取数量金额明细账 GET /fms/ledger/quantity-detail/list
export async function fmsLedgerGetQuantityDetailList(
  params: API.FmsLedgerGetQuantityDetailListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerQuantityDetailRespVO>('/fms/ledger/quantity-detail/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出数量金额总账 GET /fms/ledger/quantity-general/export-excel
export async function fmsLedgerExportQuantityGeneral(
  params: API.FmsLedgerExportQuantityGeneralParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/quantity-general/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取数量金额总账 GET /fms/ledger/quantity-general/list
export async function fmsLedgerGetQuantityGeneralList(
  params: API.FmsLedgerGetQuantityGeneralListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerQuantityGeneralRespVO>('/fms/ledger/quantity-general/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出科目余额表 GET /fms/ledger/subject-balance/export-excel
export async function fmsLedgerExportSubjectBalance(
  params: API.FmsLedgerExportSubjectBalanceParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/ledger/subject-balance/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取科目余额表 GET /fms/ledger/subject-balance/list
export async function fmsLedgerGetSubjectBalanceList(
  params: API.FmsLedgerGetSubjectBalanceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsLedgerSubjectBalanceRespVO>('/fms/ledger/subject-balance/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
