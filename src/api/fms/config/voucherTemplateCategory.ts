import { request } from '@umijs/max'

// 创建凭证模板分类 POST /fms/config/voucher-template-category/create
export async function fmsVoucherTemplateCategoryCreateTemplateCategory(body: API.FmsVoucherTemplateCategorySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/voucher-template-category/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除凭证模板分类 DELETE /fms/config/voucher-template-category/delete
export async function fmsVoucherTemplateCategoryDeleteTemplateCategory(
  params: API.FmsVoucherTemplateCategoryDeleteTemplateCategoryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/voucher-template-category/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证模板分类列表 GET /fms/config/voucher-template-category/list
export async function fmsVoucherTemplateCategoryGetTemplateCategoryList(
  params: API.FmsVoucherTemplateCategoryGetTemplateCategoryListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherTemplateCategoryRespVO>('/fms/config/voucher-template-category/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取凭证模板分类精简列表 主要用于前端的下拉选项 GET /fms/config/voucher-template-category/simple-list
export async function fmsVoucherTemplateCategoryGetTemplateCategorySimpleList(
  params: API.FmsVoucherTemplateCategoryGetTemplateCategorySimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsVoucherTemplateCategoryRespVO>('/fms/config/voucher-template-category/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 修改凭证模板分类 PUT /fms/config/voucher-template-category/update
export async function fmsVoucherTemplateCategoryUpdateTemplateCategory(body: API.FmsVoucherTemplateCategorySaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/voucher-template-category/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
