import { request } from '@umijs/max'

/** 此处后端没有提供注释 GET /easyTrans/proxy/${param0}/findById/${param1} */
export async function findById(params: API.findByIdParams, options?: { [key: string]: any }) {
  const { targetClass: param0, id: param1, ...queryParams } = params
  return request<Record<string, any>>(`/easyTrans/proxy/${param0}/findById/${param1}`, {
    method: 'GET',
    params: {
      ...queryParams
    },
    ...(options || {})
  })
}

/** 此处后端没有提供注释 POST /easyTrans/proxy/${param0}/findByIds */
export async function findByIds(
  params: API.findByIdsParams,
  body: API.FindByIdsQueryPayload,
  options?: { [key: string]: any }
) {
  const { targetClass: param0, ...queryParams } = params
  return request<Record<string, any>[]>(`/easyTrans/proxy/${param0}/findByIds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    params: { ...queryParams },
    data: body,
    ...(options || {})
  })
}
