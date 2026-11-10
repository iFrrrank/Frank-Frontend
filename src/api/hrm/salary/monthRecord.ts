import { request } from '@umijs/max'

// 核算工资表 POST /hrm/salary/month-record/compute
export async function computeMonthRecord(
  params: API.computeMonthRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/month-record/compute', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 带导入文件核算工资表 POST /hrm/salary/month-record/compute-import
export async function computeMonthRecordWithImport(
  params: API.computeMonthRecordWithImportParams,
  body: {},
  attendanceFile?: File,
  additionalDeductionFile?: File,
  cumulativeTaxFile?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (attendanceFile) {
    formData.append('attendanceFile', attendanceFile)
  }

  if (additionalDeductionFile) {
    formData.append('additionalDeductionFile', additionalDeductionFile)
  }

  if (cumulativeTaxFile) {
    formData.append('cumulativeTaxFile', cumulativeTaxFile)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]
    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, new Blob([JSON.stringify(item)], { type: 'application/json' }))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.CommonResultBoolean>('/hrm/salary/month-record/compute-import', {
    method: 'POST',
    params: {
      // syncInsuranceData has a default value: true
      syncInsuranceData: 'true',
      ...params
    },
    data: formData,
    requestType: 'form',
    ...(options || {})
  })
}

// 创建下月工资表 POST /hrm/salary/month-record/create-next
export async function createNextMonthRecord(options?: { [key: string]: any }) {
  return request<API.CommonResultLong>('/hrm/salary/month-record/create-next', {
    method: 'POST',
    ...(options || {})
  })
}

// 删除月度工资表 DELETE /hrm/salary/month-record/delete
export async function deleteMonthRecord(
  params: API.deleteMonthRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/hrm/salary/month-record/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取月度工资表 GET /hrm/salary/month-record/get
export async function getMonthRecord(
  params: API.getMonthRecordParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryMonthRecordRespVO>('/hrm/salary/month-record/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取工资表专项附加扣除导入模板 GET /hrm/salary/month-record/get-additional-deduction-import-template
export async function getAdditionalDeductionImportTemplate(
  params: API.getAdditionalDeductionImportTemplateParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/salary/month-record/get-additional-deduction-import-template', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取工资表考勤导入模板 GET /hrm/salary/month-record/get-attendance-import-template
export async function getAttendanceImportTemplate(
  params: API.getAttendanceImportTemplateParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/salary/month-record/get-attendance-import-template', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取工资表上月个税累计导入模板 GET /hrm/salary/month-record/get-cumulative-tax-import-template
export async function getCumulativeTaxImportTemplate(
  params: API.getCumulativeTaxImportTemplateParams,
  options?: { [key: string]: any }
) {
  return request<any>('/hrm/salary/month-record/get-cumulative-tax-import-template', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取最近月度工资表 GET /hrm/salary/month-record/last
export async function getLastMonthRecord(options?: { [key: string]: any }) {
  return request<API.CommonResultHrmSalaryMonthRecordRespVO>('/hrm/salary/month-record/last', {
    method: 'GET',
    ...(options || {})
  })
}

// 获取工资项汇总 GET /hrm/salary/month-record/option-summary
export async function getMonthOptionSummary(
  params: API.getMonthOptionSummaryParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListHrmSalaryOptionValueVO>(
    '/hrm/salary/month-record/option-summary',
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

// 获取月度工资表分页列表 GET /hrm/salary/month-record/page
export async function getMonthRecordPage(
  params: API.getMonthRecordPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultHrmSalaryMonthRecordRespVO>(
    '/hrm/salary/month-record/page',
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

// 获取工资核算准备情况 GET /hrm/salary/month-record/payroll-readiness
export async function getPayrollReadiness(
  params: API.getPayrollReadinessParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultHrmSalaryPayrollReadinessRespVO>(
    '/hrm/salary/month-record/payroll-readiness',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}
