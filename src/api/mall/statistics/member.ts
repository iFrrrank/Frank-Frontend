import { request } from '@umijs/max'

// 查询会员统计 GET /statistics/member/summary
export async function getMemberSummary(options?: { [key: string]: any }) {
  return request<API.CommonResultMemberSummaryRespVO>('/statistics/member/summary', {
    method: 'GET',
    ...(options || {})
  })
}

// 查询会员分析数据 GET /statistics/member/analyse
export async function getMemberAnalyse(
  params: API.StatisticsTimesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultMemberAnalyseRespVO>('/statistics/member/analyse', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {})
  })
}

// 按照省份查询会员统计列表 GET /statistics/member/area-statistics-list
export async function getMemberAreaStatisticsList(options?: { [key: string]: any }) {
  return request<API.CommonResultListMemberAreaStatisticsRespVO>(
    '/statistics/member/area-statistics-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 按照性别查询会员统计列表 GET /statistics/member/sex-statistics-list
export async function getMemberSexStatisticsList(options?: { [key: string]: any }) {
  return request<API.CommonResultListMemberSexStatisticsRespVO>(
    '/statistics/member/sex-statistics-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 按照终端查询会员统计列表 GET /statistics/member/terminal-statistics-list
export async function getMemberTerminalStatisticsList(options?: { [key: string]: any }) {
  return request<API.CommonResultListMemberTerminalStatisticsRespVO>(
    '/statistics/member/terminal-statistics-list',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获得用户数量对照 GET /statistics/member/user-count-comparison
export async function getUserCountComparison(options?: { [key: string]: any }) {
  return request<API.CommonResultMemberCountComparisonRespVO>(
    '/statistics/member/user-count-comparison',
    {
      method: 'GET',
      ...(options || {})
    }
  )
}

// 获得会员注册数量列表 GET /statistics/member/register-count-list
export async function getMemberRegisterCountList(
  params: API.StatisticsTimesParams,
  options?: { [key: string]: any }
) {
  return request<API.CommonResultListMemberRegisterCountRespVO>(
    '/statistics/member/register-count-list',
    {
      method: 'GET',
      params: {
        ...params
      },
      ...(options || {})
    }
  )
}
