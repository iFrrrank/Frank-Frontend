import { request } from '@umijs/max'

/** 创建邮件模版 POST /system/mail-template/create */
export async function createMailTemplate(
  body: API.SystemMailTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/mail-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除邮件模版 DELETE /system/mail-template/delete */
export async function deleteMailTemplate(
  params: API.deleteMailTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/mail-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取邮件模版 GET /system/mail-template/get */
export async function getMailTemplate(
  params: API.getMailTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemMailTemplateRespVO>('/system/mail-template/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取邮件模版精简列表 GET /system/mail-template/list-all-simple */
export async function getSimpleTemplateList(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMailTemplateSimpleRespVO>(
    '/system/mail-template/list-all-simple',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

/** 获取邮件模版分页列表 GET /system/mail-template/page */
export async function getMailTemplatePage(
  params: API.getMailTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemMailTemplateRespVO>('/system/mail-template/page', {
    method: 'GET',
    params: {
      ...params,
      pageReqVO: undefined,
      ...params['pageReqVO']
    },
    ...(options || {})
  })
}

/** 发送邮件 POST /system/mail-template/send-mail */
export async function sendMail(
  body: API.SystemMailTemplateSendReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/mail-template/send-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 获取邮件模版精简列表 GET /system/mail-template/simple-list */
export async function getSimpleTemplateList1(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemMailTemplateSimpleRespVO>(
    '/system/mail-template/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

/** 修改邮件模版 PUT /system/mail-template/update */
export async function updateMailTemplate(
  body: API.SystemMailTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/mail-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
