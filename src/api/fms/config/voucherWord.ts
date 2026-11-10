import { request } from '@umijs/max'

// 创建凭证字 POST /fms/config/voucher-word/create
export async function fmsVoucherWordCreateVoucherWord(body: API.FmsVoucherWordSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/voucher-word/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除凭证字 DELETE /fms/config/voucher-word/delete
export async function fmsVoucherWordDeleteVoucherWord(
  params: API.FmsVoucherWordDeleteVoucherWordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/voucher-word/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证字管理列表 GET /fms/config/voucher-word/list
export async function fmsVoucherWordGetVoucherWordList(
  params: API.FmsVoucherWordGetVoucherWordListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherWordRespVO>('/fms/config/voucher-word/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证字精简列表 GET /fms/config/voucher-word/simple-list
export async function fmsVoucherWordGetVoucherWordSimpleList(
  params: API.FmsVoucherWordGetVoucherWordSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherWordRespVO>('/fms/config/voucher-word/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改凭证字 PUT /fms/config/voucher-word/update
export async function fmsVoucherWordUpdateVoucherWord(body: API.FmsVoucherWordSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/voucher-word/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
