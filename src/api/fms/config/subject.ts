import { request } from '@umijs/max'

// 创建科目 POST /fms/config/subject/create
export async function fmsSubjectCreateSubject(body: API.FmsSubjectSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/fms/config/subject/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除科目 DELETE /fms/config/subject/delete-list
export async function fmsSubjectDeleteSubjectList(body: API.FmsSubjectDeleteReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/subject/delete-list', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 导出科目 GET /fms/config/subject/export-excel
export async function fmsSubjectExportSubject(
  params: API.FmsSubjectExportSubjectParams,
  options?: { [key: string]: any }
) {
  return request<any>('/fms/config/subject/export-excel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取科目 GET /fms/config/subject/get
export async function fmsSubjectGetSubject(
  params: API.FmsSubjectGetSubjectParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsSubjectRespVO>('/fms/config/subject/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取科目导入模板 GET /fms/config/subject/get-import-template
export async function fmsSubjectGetSubjectImportTemplate(
  options?: { [key: string]: any }
) {
  return request<any>('/fms/config/subject/get-import-template', {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取科目使用情况 GET /fms/config/subject/get-usage
export async function fmsSubjectGetSubjectUsage(
  params: API.FmsSubjectGetSubjectUsageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsSubjectUsageRespVO>('/fms/config/subject/get-usage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导入科目 POST /fms/config/subject/import
export async function fmsSubjectImportSubject(
  params: API.FmsSubjectImportSubjectParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultFmsSubjectImportRespVO>('/fms/config/subject/import', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取科目列表 GET /fms/config/subject/list
export async function fmsSubjectGetSubjectList(
  params: API.FmsSubjectGetSubjectListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsSubjectRespVO>('/fms/config/subject/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取科目精简列表 GET /fms/config/subject/simple-list
export async function fmsSubjectGetSubjectSimpleList(
  params: API.FmsSubjectGetSubjectSimpleListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListFmsSubjectRespVO>('/fms/config/subject/simple-list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新科目 PUT /fms/config/subject/update
export async function fmsSubjectUpdateSubject(body: API.FmsSubjectSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/subject/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新科目状态 PUT /fms/config/subject/update-status
export async function fmsSubjectUpdateSubjectStatus(body: API.FmsSubjectStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/fms/config/subject/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
