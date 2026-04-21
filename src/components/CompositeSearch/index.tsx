import React from 'react'
import { Space, Input, Select } from 'antd'

import { COMPOSITE_SEARCH_TYPE } from '@/utils/constantsValue'

interface CompositeSearchValue {
  type?: string
  keyword?: string
}

export const CompositeSearch: React.FC<{
  value?: CompositeSearchValue
  onChange?: (value: CompositeSearchValue) => void
}> = ({ value = {}, onChange }) => {
  const currentType = value.type || 'orderNo'

  return (
    <Space.Compact style={{ display: 'flex', width: '100%' }}>
      <Select
        value={value.type || ''}
        onChange={(t) => onChange?.({ ...value, type: t })}
        style={{ width: 100 }}
        options={COMPOSITE_SEARCH_TYPE}
      />
      <Input
        value={value.keyword || ''}
        onChange={(e) => onChange?.({ type: currentType, keyword: e.target.value })}
        placeholder="请输入关键字"
        style={{ flex: 1 }}
      />
    </Space.Compact>
  )
}
