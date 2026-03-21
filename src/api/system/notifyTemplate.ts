import { request } from '@umijs/max'

/** 创建站内信模版 POST /system/notify-template/create */
export async function createNotifyTemplate(
  body: API.SystemNotifyTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/notify-template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 删除站内信模版 DELETE /system/notify-template/delete */
export async function deleteNotifyTemplate(
  params: API.deleteNotifyTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/notify-template/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取站内信模版 GET /system/notify-template/get */
export async function getNotifyTemplate(
  params: API.getNotifyTemplateParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultSystemNotifyTemplateRespVO>('/system/notify-template/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取站内信模版分页列表 GET /system/notify-template/page */
export async function getNotifyTemplatePage(
  params: API.getNotifyTemplatePageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultSystemNotifyTemplateRespVO>(
    '/system/notify-template/page',
    {
      method: 'GET',
      params: {
        ...params,
        pageVO: undefined,
        ...params['pageVO']
      },
      ...(options || {})
    }
  )
}

/** 发送站内信 POST /system/notify-template/send-notify */
export async function sendNotify(
  body: API.SystemNotifyTemplateSendReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/system/notify-template/send-notify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

/** 更新站内信模版 PUT /system/notify-template/update */
export async function updateNotifyTemplate(
  body: API.SystemNotifyTemplateSaveReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/system/notify-template/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
