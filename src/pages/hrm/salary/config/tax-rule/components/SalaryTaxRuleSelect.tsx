import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { getSalaryTaxRuleList } from '@/api/hrm/salary/taxRule'

interface SalaryTaxRuleSelectProps {
  value?: number
  onChange?: (value?: number, taxRule?: API.HrmSalaryTaxRuleRespVO) => void
  disabled?: boolean
  placeholder?: string
  style?: React.CSSProperties
}

/** 计税规则选择器 */
const SalaryTaxRuleSelect: React.FC<SalaryTaxRuleSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = '请选择计税规则',
  style
}) => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.HrmSalaryTaxRuleRespVO[]>([])

  useEffect(() => {
    setLoading(true)
    getSalaryTaxRuleList()
      .then((resp) => setList(resp.data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  const options: SelectProps['options'] = list.map((item) => ({
    label: item.name,
    value: item.id as number
  }))

  return (
    <Select
      value={value}
      onChange={(val) => {
        const item = list.find((rule) => rule.id === val)
        onChange?.(val, item)
      }}
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

export default SalaryTaxRuleSelect

