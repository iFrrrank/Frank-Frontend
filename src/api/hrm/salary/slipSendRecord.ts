import { request } from '@umijs/max'

// 发放工资条 POST /hrm/salary/slip-send-record/create
export async function sendSalarySlip(
  body: API.HrmSalarySlipSendReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/slip-send-record/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除工资条发放记录 DELETE /hrm/salary/slip-send-record/delete
export async function deleteSalarySlipSendRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSalarySlipSendRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/slip-send-record/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取工资条待发员工分页列表 GET /hrm/salary/slip-send-record/employee-page
export async function getSalarySlipSendEmployeePage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSalarySlipSendEmployeePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalarySlipSendEmployeeRespVO>(
    '/hrm/salary/slip-send-record/employee-page',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}

// 获取工资条发放记录 GET /hrm/salary/slip-send-record/get
export async function getSalarySlipSendRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSalarySlipSendRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalarySlipSendRecordRespVO>(
    '/hrm/salary/slip-send-record/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取工资条发放记录分页列表 GET /hrm/salary/slip-send-record/page
export async function getSalarySlipSendRecordPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSalarySlipSendRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalarySlipSendRecordRespVO>(
    '/hrm/salary/slip-send-record/page',
    {
      method: 'GET',
      params: {
        ...params,
        reqVO: undefined,
        ...params['reqVO']
      },
      ...(options || {})
    }
  )
}
