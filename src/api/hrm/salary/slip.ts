import { request } from '@umijs/max'

// 获取工资条 GET /hrm/salary/slip/get
export async function getSalarySlip(
  params: API.getSalarySlipParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalarySlipRespVO>('/hrm/salary/slip/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取工资条分页列表 GET /hrm/salary/slip/page
export async function getSalarySlipPage(
  params: API.getSalarySlipPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalarySlipRespVO>('/hrm/salary/slip/page', {
    method: 'GET',
    params: {
      ...params,
      'reqVO': undefined,
      ...params['reqVO'],
    },
    ...(options || {}),
  });
}

// 修改工资条备注 PUT /hrm/salary/slip/remark
export async function updateSalarySlipRemark(body: API.HrmSalarySlipRemarkReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/slip/remark', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
