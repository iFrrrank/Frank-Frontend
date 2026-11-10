// HRM 员工端通用 API 响应类型

export interface CommonResult<T = any> {
  code: number
  data: T
  msg?: string
}

export interface PageResult<T = any> {
  list: T[]
  total: number
}

