import { request } from '@umijs/max'

// 阿里云短信回调 参见 https://help.aliyun.com/zh/sms/developer-reference/configure-delivery-receipts-1 文档 POST /system/sms/callback/aliyun
export async function receiveAliyunSmsStatus(options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/sms/callback/aliyun', {
    method: 'POST',
    ...(options || {})
  })
}

// 华为云短信回调 参见 https://support.huaweicloud.com/api-msgsms/sms_05_0003.html 文档 POST /system/sms/callback/huawei
export async function receiveHuaweiSmsStatus(options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/sms/callback/huawei', {
    method: 'POST',
    ...(options || {})
  })
}

// 腾讯云短信回调 参见 https://cloud.tencent.com/document/product/382/59178 文档 POST /system/sms/callback/tencent
export async function receiveTencentSmsStatus(options?: { [key: string]: any }) {
  return request<API.CommonResultBoolean>('/system/sms/callback/tencent', {
    method: 'POST',
    ...(options || {})
  })
}
