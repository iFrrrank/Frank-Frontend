import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { fmsAuxiliaryItemGetAuxiliaryItemSimpleList } from '@/api/fms/config/auxiliaryItem'
import { useFmsStore } from '../../../store/fms'

export interface FmsAuxiliaryItemSelectProps
  extends Omit<SelectProps<any>, 'options' | 'onChange'> {
  value?: number | number[]
  onChange?: (
    value?: any,
    option?: API.FmsAuxiliaryItemRespVO | API.FmsAuxiliaryItemRespVO[]
  ) => void
  auxiliaryTypeId?: number
  options?: API.FmsAuxiliaryItemRespVO[]
}

/**
 * 辅助核算项目选择器组件
 */
const FmsAuxiliaryItemSelect: React.FC<FmsAuxiliaryItemSelectProps> = ({
  value,
  onChange,
  auxiliaryTypeId,
  options,
  placeholder = '请选择辅助项目',
  allowClear = false,
  ...restProps
}) => {
  const fmsStore = useFmsStore()
  const [innerItems, setInnerItems] = useState<API.FmsAuxiliaryItemRespVO[]>([])

  useEffect(() => {
    if (options !== undefined) return
    if (!fmsStore.accountSetId || !auxiliaryTypeId) {
      setInnerItems([])
      return
    }
    fmsAuxiliaryItemGetAuxiliaryItemSimpleList({
      accountSetId: fmsStore.accountSetId,
      auxiliaryTypeId
    }).then((resp) => {
      if (resp.code === 0) {
        setInnerItems(resp.data || [])
      }
    })
  }, [options, fmsStore.accountSetId, auxiliaryTypeId])

  const itemList = useMemo(() => options ?? innerItems, [options, innerItems])

  const selectOptions = useMemo(
    () =>
      itemList.map((item) => ({
        label: `${item.code} ${item.name}`,
        value: item.id
      })),
    [itemList]
  )

  return (
    <Select
      value={value}
      allowClear={allowClear}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder}
      options={selectOptions}
      onChange={(nextVal) => {
        if (!onChange) return
        if (Array.isArray(nextVal)) {
          const selected = itemList.filter((item) => nextVal.includes(item.id))
          onChange(nextVal, selected)
        } else {
          const selected = itemList.find((item) => item.id === nextVal)
          onChange(nextVal, selected)
        }
      }}
      {...restProps}
    />
  )
}

export default FmsAuxiliaryItemSelect

