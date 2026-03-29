import { request } from '@umijs/max'

export interface JobVO {
  id: number
  name: string
  status: number
  handlerName: string
  handlerParam: string
  cronExpression: string
  retryCount: number
  retryInterval: number
  monitorTimeout: number
  createTime: string
}

export interface JobPageReqVO {
  pageNo: number
  pageSize: number
  name?: string
  status?: number
  handlerName?: string
}

// 获得定时任务分页
export async function getJobPage(params: JobPageReqVO) {
  return request('/infra/job/page', { method: 'GET', params })
}

// 获得定时任务
export async function getJob(id: number) {
  return request('/infra/job/get', { method: 'GET', params: { id } })
}

// 创建定时任务
export async function createJob(data: Partial<JobVO>) {
  return request('/infra/job/create', { method: 'POST', data })
}

// 更新定时任务
export async function updateJob(data: Partial<JobVO>) {
  return request('/infra/job/update', { method: 'PUT', data })
}

// 更新定时任务状态
export async function updateJobStatus(id: number, status: number) {
  return request('/infra/job/update-status', { method: 'PUT', params: { id, status } })
}

// 触发定时任务
export async function triggerJob(id: number) {
  return request('/infra/job/trigger', { method: 'PUT', params: { id } })
}

// 删除定时任务
export async function deleteJob(id: number) {
  return request('/infra/job/delete', { method: 'DELETE', params: { id } })
}

// 导出定时任务
export async function exportJob(params: any) {
  return request('/infra/job/export-excel', {
    method: 'GET',
    params,
    responseType: 'blob'
  })
}
