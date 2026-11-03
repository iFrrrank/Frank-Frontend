import { request } from '@umijs/max'

// 创建员工证书 POST /hrm/employee/certificate/create
export async function createCertificate(body: API.HrmEmployeeCertificateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/certificate/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除员工证书 DELETE /hrm/employee/certificate/delete
export async function deleteCertificate(
  params: API.deleteCertificateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/certificate/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工证书列表 GET /hrm/employee/certificate/list
export async function getCertificateList(
  params: API.getCertificateListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeCertificateRespVO>('/hrm/employee/certificate/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 更新员工证书 PUT /hrm/employee/certificate/update
export async function updateCertificate(body: API.HrmEmployeeCertificateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/certificate/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
