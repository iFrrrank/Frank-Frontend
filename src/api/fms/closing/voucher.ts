import { request } from '@umijs/max'

// 批量生成结转凭证 POST /fms/closing/voucher/generate-list
export async function fmsClosingVoucherGenerateClosingVoucherList(body: API.FmsClosingVoucherGenerateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListLong>('/fms/closing/voucher/generate-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 生成结转损益凭证 POST /fms/closing/voucher/generate-profit-loss
export async function fmsClosingVoucherGenerateProfitLossVoucher(body: API.FmsProfitLossGenerateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/closing/voucher/generate-profit-loss', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 生成结账方案凭证 POST /fms/closing/voucher/generate-scheme
export async function fmsClosingVoucherGenerateClosingSchemeVoucher(body: API.FmsClosingSchemeGenerateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/closing/voucher/generate-scheme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
