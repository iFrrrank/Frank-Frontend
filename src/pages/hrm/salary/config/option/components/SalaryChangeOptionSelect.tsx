import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { getSalaryOptionSimpleList } from '@/api/hrm/salary/option'

export interface SalaryChangeOptionItem {
  code: number
  name: string
}

interface SalaryChangeOptionSelectProps {
  value?: SalaryChangeOptionItem[]
  onChange?: (value: SalaryChangeOptionItem[]) => void
  disabled?: boolean
  placeholder?: string
  style?: React.CSSProperties
}

/** 调薪项选择器 */
const SalaryChangeOptionSelect: React.FC<SalaryChangeOptionSelectProps> = ({
  value = [],
  onChange,
  disabled = false,
  placeholder = '请选择调薪项',
  style
}) => {
  const [loading, setLoading] = useState(false)
  const [optionList, setOptionList] = useState<API.HrmSalaryOptionRespVO[]>([])

  useEffect(() => {
    setLoading(true)
    getSalaryOptionSimpleList({ adjustable: true })
      .then((resp) => setOptionList(resp.data || []))
      .catch(() => setOptionList([]))
      .finally(() => setLoading(false))
  }, [])

  const selectedCodes = value.map((item) => item.code)

  const options: SelectProps['options'] = optionList.map((item) => ({
    label: `${item.name} / ${item.code}`,
    value: item.code as number
  }))

  const handleChange = (codes: number[]) => {
    const nextList: SalaryChangeOptionItem[] = codes.map((code) => {
      const existing = value.find((v) => v.code === code)
      const opt = optionList.find((item) => item.code === code)
      return {
        code,
        name: opt?.name || existing?.name || ''
      }
    })
    onChange?.(nextList)
  }

  return (
    <Select
      mode="multiple"
      value={selectedCodes}
      onChange={handleChange}
      options={options}
      loading={loading}
      disabled={disabled}
      placeholder={placeholder}
      allowClear
      showSearch
      optionFilterProp="label"
      style={{ width: '100%', ...style }}
    />
  )
}

export default SalaryChangeOptionSelect
