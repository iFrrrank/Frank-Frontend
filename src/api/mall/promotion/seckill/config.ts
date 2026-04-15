import { request } from '@umijs/max'

// 创建秒杀时段 POST /promotion/seckill-config/create
export async function createSeckillConfig(
  body: API.PromotionSeckillConfigCreateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultLong>('/promotion/seckill-config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 删除秒杀配置 DELETE /promotion/seckill-config/delete
export async function deleteSeckillConfig(
  params: API.deleteSeckillConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/seckill-config/delete', {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取秒杀配置 GET /promotion/seckill-config/get
export async function getSeckillConfig(
  params: API.getSeckillConfigParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPromotionSeckillConfigRespVO>('/promotion/seckill-config/get', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 获取所有秒杀配置列表 GET /promotion/seckill-config/list
export async function getSeckillConfigList(options?: { [key: string]: any }) {
  return request<API.CommonResultListPromotionSeckillConfigRespVO>(
    '/promotion/seckill-config/list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获取秒杀配置分页列表 GET /promotion/seckill-config/page
export async function getSeckillActivityPage(
  params: API.getSeckillActivityPageParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultPageResultPromotionSeckillConfigRespVO>(
    '/promotion/seckill-config/page',
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

// 获取所有开启状态的秒杀配置精简列表 主要用于前端的下拉选项 GET /promotion/seckill-config/simple-list
export async function getSeckillConfigSimpleList(options?: { [key: string]: any }) {
  return request<API.CommonResultListPromotionSeckillConfigSimpleRespVO>(
    '/promotion/seckill-config/simple-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 更新秒杀配置 PUT /promotion/seckill-config/update
export async function updateSeckillConfig(
  body: API.PromotionSeckillConfigUpdateReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/seckill-config/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

// 修改时段配置状态 PUT /promotion/seckill-config/update-status
export async function updateSeckillConfigStatus(
  body: API.PromotionSeckillConfigUpdateStatusReqVO,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultBoolean>('/promotion/seckill-config/update-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}

