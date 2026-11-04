import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { getSchemeSimpleList } from '@/api/hrm/insurance/scheme'

export interface InsuranceSchemeSelectProps {
  value?: number
  /** 选中变化，第二个参数为选中的参保方案（清空时为 undefined） */
  onChange?: (value?: number, scheme?: API.HrmInsuranceSchemeRespVO) => void
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  placeholder?: string
  style?: React.CSSProperties
}

/** 参保方案选择器 */
const InsuranceSchemeSelect: React.FC<InsuranceSchemeSelectProps> = ({
  value,
  onChange,
  disabled = false,
  clearable = true,
  filterable = true,
  placeholder = '请选择参保方案',
  style
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [schemeList, setSchemeList] = useState<API.HrmInsuranceSchemeRespVO[]>([])

  useEffect(() => {
    setLoading(true)
    getSchemeSimpleList()
      .then((resp) => setSchemeList((resp.data || []).filter((scheme) => scheme.id !== undefined)))
      .catch(() => setSchemeList([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Select
      style={{ width: '100%', ...style }}
      value={value}
      loading={loading}
      disabled={disabled}
      allowClear={clearable}
      showSearch={filterable}
      optionFilterProp="label"
      placeholder={placeholder}
      options={schemeList.map((scheme) => ({ label: scheme.name, value: scheme.id }))}
      onChange={(next) =>
        onChange?.(
          next,
          schemeList.find((scheme) => scheme.id === next)
        )
      }
    />
  )
}

export default InsuranceSchemeSelect
