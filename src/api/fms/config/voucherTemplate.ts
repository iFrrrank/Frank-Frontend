import { request } from '@umijs/max'

// 创建凭证模板 POST /fms/config/voucher-template/create
export async function fmsVoucherTemplateCreateVoucherTemplate(body: API.FmsVoucherTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/voucher-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除凭证模板 DELETE /fms/config/voucher-template/delete
export async function fmsVoucherTemplateDeleteVoucherTemplate(
  params: API.FmsVoucherTemplateDeleteVoucherTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/voucher-template/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证模板列表 GET /fms/config/voucher-template/list
export async function fmsVoucherTemplateGetVoucherTemplateList(
  params: API.FmsVoucherTemplateGetVoucherTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherTemplateRespVO>('/fms/config/voucher-template/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证模板精简列表 主要用于录凭证时套用凭证模板 GET /fms/config/voucher-template/simple-list
export async function fmsVoucherTemplateGetVoucherTemplateSimpleList(
  params: API.FmsVoucherTemplateGetVoucherTemplateSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherTemplateRespVO>('/fms/config/voucher-template/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改凭证模板 PUT /fms/config/voucher-template/update
export async function fmsVoucherTemplateUpdateVoucherTemplate(body: API.FmsVoucherTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/voucher-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
