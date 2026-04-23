import { request } from '@umijs/max'

// 创建短信模板 POST /system/sms-template/create
export async function createSmsTemplate(
  body: API.SystemSmsTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/sms-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除短信模板 DELETE /system/sms-template/delete
export async function deleteSmsTemplate(
  params: API.deleteSmsTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/sms-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 导出短信模板 GET /system/sms-template/export-excel
export async function exportSmsTemplateExcel(
  params: API.exportSmsTemplateExcelParams,
  options?: { [key: string]: any }
) {
  return request<any>('/system/sms-template/export-excel', {
    method: 'GET',
    params: {
      ...params,
      exportReqVO: undefined,
      ...params['exportReqVO']
    },
    responseType: 'blob',
    ...(options || {})
  })
}

// 获取短信模板 GET /system/sms-template/get
export async function getSmsTemplate(
  params: API.getSmsTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemSmsTemplateRespVO>('/system/sms-template/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取短信模板分页列表 GET /system/sms-template/page
export async function getSmsTemplatePage(
  params: API.getSmsTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemSmsTemplateRespVO>('/system/sms-template/page', {
    method: 'GET',
    params: {
      ...params,
      pageVO: undefined,
      ...params['pageVO']
    },
    ...(options || {})
  })
}

// 发送短信 POST /system/sms-template/send-sms
export async function sendSms(
  body: API.SystemSmsTemplateSendReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/sms-template/send-sms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 更新短信模板 PUT /system/sms-template/update
export async function updateSmsTemplate(
  body: API.SystemSmsTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/sms-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
