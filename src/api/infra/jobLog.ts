import { request } from '@umijs/max'

export interface JobLogVO {
  id: number
  jobId: number
  handlerName: string
  handlerParam: string
  executeIndex: number
  beginTime: string
  endTime: string
  duration: number
  status: number
  result: string
  createTime: string
}

export interface JobLogPageReqVO {
  pageNo: number
  pageSize: number
  jobId?: number
  handlerName?: string
  beginTime?: string
  endTime?: string
  status?: number
}

// 获得定时任务日志分页
export async function getJobLogPage(params: JobLogPageReqVO) {
  return request('/infra/job-log/page', { method: 'GET', params })
}

// 获得定时任务日志
export async function getJobLog(id: number) {
  return request('/infra/job-log/get', { method: 'GET', params: { id } })
}

// 导出定时任务日志
export async function exportJobLog(params: any) {
  return request('/infra/job-log/export-excel', {
    method: 'GET',
    params,
    responseType: 'blob'
  })
}
