import { request } from '@umijs/max'

/** 获取 IP 对应的地区名 GET /system/area/get-by-ip */
export async function getAreaByIp(params: API.getAreaByIpParams, options?: { [key: string]: any }) {
  return request<API.CommonResultString>('/system/area/get-by-ip', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

/** 获取地区树 GET /system/area/tree */
export async function getAreaTree(options?: { [key: string]: any }) {
  return request<API.CommonResultListSystemAreaNodeRespVO>('/system/area/tree', {
    method: 'GET',
    ...(options || {})
  })
}
