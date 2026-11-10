import { getEmployeeSimplePage } from '@/api/hrm/employee'

export interface Option {
  label: string
  value: number
}

let employeeOptionsCache: Option[] | null = null

// 招聘负责人、面试官等员工下拉选项（带缓存）
export const getEmployeeOptions = async (): Promise<Option[]> => {
  if (employeeOptionsCache) {
    return employeeOptionsCache
  }
  const resp = await getEmployeeSimplePage({
    pageReqVO: { pageNo: 1, pageSize: 100 }
  } as API.getEmployeeSimplePageParams)
  employeeOptionsCache =
    resp.data?.list?.map((item) => ({
      label: item.name,
      value: item.id
    })) || []
  return employeeOptionsCache
}

export const clearEmployeeOptionsCache = () => {
  employeeOptionsCache = null
}
