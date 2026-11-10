import { request } from '@umijs/max'

// 获取凭证辅助核算组合余额 GET /fms/voucher/auxiliary-balance
export async function fmsVoucherGetVoucherAuxiliaryBalance(
  params: API.FmsVoucherGetVoucherAuxiliaryBalanceParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsVoucherSubjectBalanceRespVO>('/fms/voucher/auxiliary-balance', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 创建凭证 POST /fms/voucher/create
export async function fmsVoucherCreateVoucher(body: API.FmsVoucherSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/voucher/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除凭证 DELETE /fms/voucher/delete-list
export async function fmsVoucherDeleteVoucherList(
  params: API.FmsVoucherDeleteVoucherListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/voucher/delete-list', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出凭证 GET /fms/voucher/export-excel
export async function fmsVoucherExportVoucherExcel(
  params: API.FmsVoucherExportVoucherExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/voucher/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证详情 GET /fms/voucher/get
export async function fmsVoucherGetVoucher(
  params: API.FmsVoucherGetVoucherParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsVoucherRespVO>('/fms/voucher/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证导入模板 GET /fms/voucher/get-import-template
export async function fmsVoucherGetVoucherImportTemplate(
  params: API.FmsVoucherGetVoucherImportTemplateParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/voucher/get-import-template', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导入凭证 POST /fms/voucher/import
export async function fmsVoucherImportVoucher(
  params: API.FmsVoucherImportVoucherParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsVoucherImportRespVO>('/fms/voucher/import', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 移动凭证 PUT /fms/voucher/move
export async function fmsVoucherMoveVoucher(body: API.FmsVoucherMoveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/voucher/move', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取下一凭证号 GET /fms/voucher/next-number
export async function fmsVoucherGetNextVoucherNumber(
  params: API.FmsVoucherGetNextVoucherNumberParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultInteger>('/fms/voucher/next-number', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证分页 GET /fms/voucher/page
export async function fmsVoucherGetVoucherPage(
  params: API.FmsVoucherGetVoucherPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultFmsVoucherRespVO>('/fms/voucher/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取待打印凭证列表 GET /fms/voucher/print-list
export async function fmsVoucherGetVoucherPrintList(
  params: API.FmsVoucherGetVoucherPrintListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherRespVO>('/fms/voucher/print-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出凭证汇总 GET /fms/voucher/statistics/export-excel
export async function fmsVoucherExportVoucherStatisticsExcel(
  params: API.FmsVoucherExportVoucherStatisticsExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/voucher/statistics/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证汇总 GET /fms/voucher/statistics/list
export async function fmsVoucherGetVoucherStatisticsList(
  params: API.FmsVoucherGetVoucherStatisticsListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherStatisticsRespVO>('/fms/voucher/statistics/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证科目余额列表 GET /fms/voucher/subject-balance-list
export async function fmsVoucherGetVoucherSubjectBalanceList(
  params: API.FmsVoucherGetVoucherSubjectBalanceListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherSubjectBalanceRespVO>('/fms/voucher/subject-balance-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 整理凭证 PUT /fms/voucher/tidy
export async function fmsVoucherTidyVoucher(body: API.FmsVoucherTidyReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/voucher/tidy', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新凭证 PUT /fms/voucher/update
export async function fmsVoucherUpdateVoucher(body: API.FmsVoucherSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/voucher/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新凭证附件 PUT /fms/voucher/update-attachments
export async function fmsVoucherUpdateVoucherAttachments(body: API.FmsVoucherAttachmentUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/voucher/update-attachments', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 审核或反审核凭证 PUT /fms/voucher/update-review-status
export async function fmsVoucherUpdateVoucherReviewStatus(body: API.FmsVoucherReviewReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/voucher/update-review-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
