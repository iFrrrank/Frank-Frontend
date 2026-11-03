import { request } from '@umijs/max'

// 获取员工薪资信息 GET /hrm/salary/employee-info/get
export async function getSalaryEmployeeInfo(
  params: API.getSalaryEmployeeInfoParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryEmployeeInfoRespVO>('/hrm/salary/employee-info/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取最早调薪生效日期 GET /hrm/salary/employee-info/get-adjustment-min-effect-date
export async function getSalaryAdjustmentMinEffectDate(options?: { [key: string]: any }) {
  return request<API.CommonResultLocalDate>(
    '/hrm/salary/employee-info/get-adjustment-min-effect-date',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取薪资档案调薪导入模板 GET /hrm/salary/employee-info/get-change-import-template
export async function getChangeImportTemplate(options?: { [key: string]: any }) {
  return request<any>('/hrm/salary/employee-info/get-change-import-template', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取薪资档案定薪导入模板 GET /hrm/salary/employee-info/get-fix-import-template
export async function getFixImportTemplate(options?: { [key: string]: any }) {
  return request<any>('/hrm/salary/employee-info/get-fix-import-template', {
    method: 'GET',
    ...(options || {})
  })
}

// 导入薪资档案调薪 POST /hrm/salary/employee-info/import-change
export async function importChangeExcel(
  params: API.importChangeExcelParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryEmployeeInfoImportRespVO>(
    '/hrm/salary/employee-info/import-change',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        ...params
      },
      data: body,
      ...(options || {})
    }
  )
}

// 导入薪资档案定薪 POST /hrm/salary/employee-info/import-fix
export async function importFixExcel(
  params: API.importFixExcelParams,
  body: {},
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryEmployeeInfoImportRespVO>(
    '/hrm/salary/employee-info/import-fix',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        ...params
      },
      data: body,
      ...(options || {})
    }
  )
}

// 获取员工薪资信息分页列表 GET /hrm/salary/employee-info/page
export async function getSalaryEmployeeInfoPage(
  params: API.getSalaryEmployeeInfoPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalaryEmployeeInfoRespVO>(
    '/hrm/salary/employee-info/page',
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

// 获取员工薪资信息状态数量 GET /hrm/salary/employee-info/status-count
export async function getSalaryEmployeeInfoStatusCount(
  params: API.getSalaryEmployeeInfoStatusCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeStatusCountRespVO>(
    '/hrm/salary/employee-info/status-count',
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

// 修改员工薪资信息 PUT /hrm/salary/employee-info/update
export async function updateSalaryEmployeeInfo(
  body: API.HrmSalaryEmployeeInfoUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/salary/employee-info/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 批量调薪 PUT /hrm/salary/employee-info/update-list
export async function updateSalaryEmployeeInfoList(
  body: API.HrmSalaryEmployeeInfoUpdateListReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryEmployeeInfoUpdateListRespVO>(
    '/hrm/salary/employee-info/update-list',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
      ...(options || {})
    }
  )
}
