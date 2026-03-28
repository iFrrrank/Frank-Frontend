import { request } from '@umijs/max'

/** 获取 Redis 监控信息 GET /infra/redis/get-monitor-info */
export async function getRedisMonitorInfo(options?: { [key: string]: any }) {
  return request<API.CommonResultInfraRedisMonitorRespVO>('/infra/redis/get-monitor-info', {
    method: 'GET',
    ...(options || {})
  })
}
