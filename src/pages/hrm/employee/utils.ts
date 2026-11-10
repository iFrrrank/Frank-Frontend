import { getSimpleDictDataList } from '@/api/system/dictData'

export interface DictOption {
  label: string
  value: number
}

const EDUCATION_DICT = 'hrm_employee_education'
let educationPromise: Promise<DictOption[]> | undefined

/** 获取最高学历字典（hrm_employee_education），结果缓存，失败时清缓存以便重试 */
export const getEducationOptions = (): Promise<DictOption[]> => {
  if (!educationPromise) {
    educationPromise = getSimpleDictDataList()
      .then((resp) =>
        (resp.data || [])
          .filter((item) => item.dictType === EDUCATION_DICT)
          .map((item) => ({
            label: item.label,
            value: Number(item.value)
          }))
      )
      .catch(() => {
        educationPromise = undefined
        return []
      })
  }
  return educationPromise
}

/** 性别选项：1 男 / 2 女 */
export const SEX_OPTIONS: DictOption[] = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

export const SEX_LABELS: Record<number, string> = {
  1: '男',
  2: '女'
}
