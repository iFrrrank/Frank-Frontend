import { request } from '@umijs/max'

// 创建结账模板 POST /fms/closing/template/create
export async function fmsClosingTemplateCreateClosingTemplate(body: API.FmsClosingTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/closing/template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除结账模板 DELETE /fms/closing/template/delete
export async function fmsClosingTemplateDeleteClosingTemplate(
  params: API.FmsClosingTemplateDeleteClosingTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/template/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取结账模板列表 GET /fms/closing/template/list
export async function fmsClosingTemplateGetClosingTemplateList(
  params: API.FmsClosingTemplateGetClosingTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsClosingTemplateRespVO>('/fms/closing/template/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新结账模板 PUT /fms/closing/template/update
export async function fmsClosingTemplateUpdateClosingTemplate(body: API.FmsClosingTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/closing/template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
