import React, { useEffect, useState } from 'react'
import { AutoComplete, Select } from 'antd'
import type { CSSProperties } from 'react'
import { getRecruitEliminateReasonList } from '@/api/hrm/recruit/config'

interface RecruitEliminateReasonSelectProps {
  value?: string
  onChange?: (value: string | undefined) => void
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  // 是否允许输入列表之外的自定义原因
  allowCreate?: boolean
  placeholder?: string
  style?: CSSProperties
}

// 招聘淘汰原因选择器（默认允许手动输入新原因）
const RecruitEliminateReasonSelect: React.FC<RecruitEliminateReasonSelectProps> = ({
  value,
  onChange,
  disabled = false,
  clearable = true,
  filterable = true,
  allowCreate = true,
  placeholder = '请选择或输入淘汰原因',
  style
}) => {
  const [reasonList, setReasonList] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getRecruitEliminateReasonList()
      .then((resp) => setReasonList(resp.data || []))
      .catch(() => setReasonList([]))
      .finally(() => setLoading(false))
  }, [])

  const options = reasonList.map((reason) => ({ label: reason, value: reason }))
  const mergedStyle = { width: '100%', ...style }

  // 允许自定义输入时使用 AutoComplete，输入内容即为选中值
  if (allowCreate) {
    return (
      <AutoComplete
        value={value}
        style={mergedStyle}
        disabled={disabled}
        allowClear={clearable}
        placeholder={placeholder}
        options={options}
        filterOption={filterable ? (input, option) => !!option?.value?.includes(input) : false}
        onChange={(val) => onChange?.(val || undefined)}
      />
    )
  }

  return (
    <Select
      value={value}
      style={mergedStyle}
      disabled={disabled}
      loading={loading}
      allowClear={clearable}
      showSearch={filterable}
      optionFilterProp="label"
      placeholder={placeholder}
      options={options}
      onChange={(val) => onChange?.(val)}
    />
  )
}

export default RecruitEliminateReasonSelect
