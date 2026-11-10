import { request } from '@umijs/max'

// 关闭秒杀活动 PUT /promotion/seckill-activity/close
export async function closeSeckillActivity(
  params: API.closeSeckillActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/seckill-activity/close', {
    method: 'PUT',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 创建秒杀活动 POST /promotion/seckill-activity/create
export async function createSeckillActivity(
  body: API.PromotionSeckillActivityCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/seckill-activity/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除秒杀活动 DELETE /promotion/seckill-activity/delete
export async function deleteSeckillActivity(
  params: API.deleteSeckillActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/seckill-activity/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取秒杀活动 GET /promotion/seckill-activity/get
export async function getSeckillActivity(
  params: API.getSeckillActivityParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionSeckillActivityDetailRespVO>(
    '/promotion/seckill-activity/get',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 通过秒杀活动 Ids 获取秒杀活动列表 GET /promotion/seckill-activity/list-by-ids
export async function getSeckillActivityListByIds(
  params: API.getSeckillActivityListByIdsParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListPromotionSeckillActivityRespVO>(
    '/promotion/seckill-activity/list-by-ids',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}

// 获取秒杀活动分页列表 GET /promotion/seckill-activity/page
export async function getSeckillActivityPage1(
  params: API.getSeckillActivityPage1Params,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionSeckillActivityRespVO>(
    '/promotion/seckill-activity/page',
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

// 更新秒杀活动 PUT /promotion/seckill-activity/update
export async function updateSeckillActivity(
  body: API.PromotionSeckillActivityUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/seckill-activity/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
