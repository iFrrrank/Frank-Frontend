import React, { useEffect, useState } from 'react'
import { Select, Tag } from 'antd'
import type { SelectProps } from 'antd'
import { getSalaryChangeTemplateList } from '@/api/hrm/salary/changeTemplate'

interface SalaryChangeTemplateSelectProps {
  value?: number
  onChange?: (value?: number) => void
  disabled?: boolean
  clearable?: boolean
  placeholder?: string
  style?: React.CSSProperties
}

/** 调薪模板选择器 */
const SalaryChangeTemplateSelect: React.FC<SalaryChangeTemplateSelectProps> = ({
  value,
  onChange,
  disabled = false,
  clearable = true,
  placeholder = '全部薪资项',
  style
}) => {
  const [loading, setLoading] = useState(false)
  const [templateList, setTemplateList] = useState<API.HrmSalaryChangeTemplateRespVO[]>([])

  useEffect(() => {
    setLoading(true)
    getSalaryChangeTemplateList()
      .then((resp) => setTemplateList(resp.data || []))
      .catch(() => setTemplateList([]))
      .finally(() => setLoading(false))
  }, [])

  const options: SelectProps['options'] = templateList.map((tpl) => ({
    label: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{tpl.name}</span>
        {tpl.defaultStatus && (
          <Tag color="success" style={{ marginLeft: 8 }}>
            默认
          </Tag>
        )}
      </div>
    ),
    value: tpl.id as number
  }))

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      loading={loading}
      disabled={disabled}
      allowClear={clearable}
      showSearch
      placeholder={placeholder}
      style={{ width: '100%', ...style }}
    />
  )
}

export default SalaryChangeTemplateSelect

