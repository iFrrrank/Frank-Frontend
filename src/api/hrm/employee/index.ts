import { request } from '@umijs/max'

// 获取已经建立员工档案的后台用户 Ids GET /hrm/employee/bound-user-id-list
export async function getBoundUserIdList(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListLong>('/hrm/employee/bound-user-id-list', {
    method: 'GET',
    ...(options || {}),
  });
}

// 取消员工离职 PUT /hrm/employee/cancel-quit
export async function cancelEmployeeQuit(body: API.HrmEmployeeCancelQuitReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/cancel-quit', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 确认员工入职 PUT /hrm/employee/confirm-entry
export async function confirmEmployeeEntry(body: API.HrmEmployeeConfirmEntryReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/confirm-entry', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 办理员工转为全职 POST /hrm/employee/convert-to-full-time
export async function convertEmployeeToFullTime(body: API.HrmEmployeeConvertToFullTimeReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/convert-to-full-time', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 创建员工档案 POST /hrm/employee/create
export async function createEmployee(body: API.HrmEmployeeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/hrm/employee/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 从未建档后台用户批量创建员工档案 POST /hrm/employee/create-list
export async function createEmployeeList(body: API.HrmEmployeeCreateFromUserReqVO[],
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListLong>('/hrm/employee/create-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除员工档案 DELETE /hrm/employee/delete
export async function deleteEmployee(
  params: API.deleteEmployeeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 批量删除员工档案 DELETE /hrm/employee/delete-list
export async function deleteEmployeeList(
  params: API.deleteEmployeeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/delete-list', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 办理员工降级 POST /hrm/employee/demote
export async function demoteEmployee(body: API.HrmEmployeeDemoteReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/demote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取员工部门统计 GET /hrm/employee/dept-statistics
export async function getEmployeeDeptStatistics(
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeDeptStatisticsRespVO>('/hrm/employee/dept-statistics', {
    method: 'GET',
    ...(options || {}),
  });
}

// 导出员工档案 GET /hrm/employee/export-excel
export async function exportEmployee(
  params: API.exportEmployeeParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/employee/export-excel', {
    method: 'GET',
    params: {
      ...params,
      'exportReqVO': undefined,
      ...params['exportReqVO'],
    },
    ...(options || {}),
  });
}

// 获取员工档案 GET /hrm/employee/get
export async function getEmployee(
  params: API.getEmployeeParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmEmployeeRespVO>('/hrm/employee/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工档案导入模板 GET /hrm/employee/get-import-template
export async function importTemplate(
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/employee/get-import-template', {
    method: 'GET',
    ...(options || {}),
  });
}

// 导入员工档案 POST /hrm/employee/import
export async function importExcel(
  params: API.importExcelParams,
  body: {
  },
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmEmployeeImportRespVO>('/hrm/employee/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      // duplicateStrategy has a default value: 3
      'duplicateStrategy': '3',
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

// 获取员工列表 用于表单回显已选员工 GET /hrm/employee/list
export async function getEmployeeList(
  params: API.getEmployeeListParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeRespVO>('/hrm/employee/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工档案分页列表 GET /hrm/employee/page
export async function getEmployeePage(
  params: API.getEmployeePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmEmployeeRespVO>('/hrm/employee/page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 办理员工晋升 POST /hrm/employee/promote
export async function promoteEmployee(body: API.HrmEmployeePromoteReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/promote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 办理员工离职 POST /hrm/employee/quit
export async function quitEmployee(body: API.HrmEmployeeQuitReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/quit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 办理员工转正 POST /hrm/employee/regular
export async function regularEmployee(body: API.HrmEmployeeRegularReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/regular', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 办理离职员工再入职 POST /hrm/employee/rehire
export async function rehireEmployee(body: API.HrmEmployeeRehireReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/rehire', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 发送填写员工档案通知 POST /hrm/employee/send-profile-fill-message
export async function sendEmployeeProfileFillMessage(
  params: API.sendEmployeeProfileFillMessageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmEmployeeNotifyRespVO>('/hrm/employee/send-profile-fill-message', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取员工精简分页列表 只返回员工选择器需要的非敏感字段 GET /hrm/employee/simple-page
export async function getEmployeeSimplePage(
  params: API.getEmployeeSimplePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmEmployeeRespVO>('/hrm/employee/simple-page', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 获取员工状态统计 GET /hrm/employee/status-count
export async function getEmployeeStatusCount(
  params: API.getEmployeeStatusCountParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmEmployeeStatusCountRespVO>('/hrm/employee/status-count', {
    method: 'GET',
    params: {
      ...params,
      'pageReqVO': undefined,
      ...params['pageReqVO'],
    },
    ...(options || {}),
  });
}

// 办理员工调岗 POST /hrm/employee/transfer
export async function transferEmployee(body: API.HrmEmployeeTransferReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新员工档案 PUT /hrm/employee/update
export async function updateEmployee(body: API.HrmEmployeeSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/employee/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
