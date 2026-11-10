import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { getSalaryOptionSimpleList } from '@/api/hrm/salary/option'

interface SalaryOptionSelectProps {
  value?: number[]
  onChange?: (value: number[]) => void
  disabledCodes?: number[]
  adjustable?: boolean
  disabled?: boolean
  placeholder?: string
  style?: React.CSSProperties
}

/** 薪资项多选选择器 */
const SalaryOptionSelect: React.FC<SalaryOptionSelectProps> = ({
  value = [],
  onChange,
  disabledCodes = [],
  adjustable,
  disabled = false,
  placeholder = '请选择薪资项',
  style
}) => {
  const [loading, setLoading] = useState(false)
  const [optionList, setOptionList] = useState<API.HrmSalaryOptionRespVO[]>([])

  useEffect(() => {
    setLoading(true)
    getSalaryOptionSimpleList(adjustable !== undefined ? { adjustable } : {})
      .then((resp) => {
        // 过滤掉根分类 parentCode === 0
        const items = (resp.data || []).filter((opt) => opt.parentCode !== 0)
        setOptionList(items)
      })
      .catch(() => setOptionList([]))
      .finally(() => setLoading(false))
  }, [adjustable])

  const options: SelectProps['options'] = optionList.map((item) => ({
    label: `${item.name} / ${item.code}`,
    value: item.code as number,
    disabled: item.code !== undefined && disabledCodes.includes(item.code)
  }))

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
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

export default SalaryOptionSelect

