import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList } from '@/api/fms/config/auxiliaryType'
import { useFmsStore } from '../../../store/fms'

export interface FmsAuxiliaryTypeSelectProps
  extends Omit<SelectProps<any>, 'options' | 'onChange'> {
  value?: number | number[]
  onChange?: (
    value: any,
    option?: API.FmsAuxiliaryTypeRespVO | API.FmsAuxiliaryTypeRespVO[]
  ) => void
  onLoaded?: (list: API.FmsAuxiliaryTypeRespVO[]) => void
  options?: API.FmsAuxiliaryTypeRespVO[]
}

/**
 * 辅助核算类别选择器组件
 */
const FmsAuxiliaryTypeSelect: React.FC<FmsAuxiliaryTypeSelectProps> = ({
  value,
  onChange,
  onLoaded,
  options,
  placeholder = '请选择辅助核算类别',
  allowClear = false,
  ...restProps
}) => {
  const fmsStore = useFmsStore()
  const [innerTypes, setInnerTypes] = useState<API.FmsAuxiliaryTypeRespVO[]>([])

  useEffect(() => {
    if (options !== undefined) {
      onLoaded?.(options)
      return
    }
    if (!fmsStore.accountSetId) {
      setInnerTypes([])
      onLoaded?.([])
      return
    }
    fmsAuxiliaryTypeGetAuxiliaryTypeSimpleList({ accountSetId: fmsStore.accountSetId }).then(
      (resp) => {
        if (resp.code === 0) {
          const list = resp.data || []
          setInnerTypes(list)
          onLoaded?.(list)
        }
      }
    )
  }, [options, fmsStore.accountSetId])

  const typeList = useMemo(() => options ?? innerTypes, [options, innerTypes])

  const selectOptions = useMemo(
    () =>
      typeList.map((item) => ({
        label: item.name,
        value: item.id
      })),
    [typeList]
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
          const selected = typeList.filter((item) => nextVal.includes(item.id))
          onChange(nextVal, selected)
        } else {
          const selected = typeList.find((item) => item.id === nextVal)
          onChange(nextVal, selected)
        }
      }}
      {...restProps}
    />
  )
}

export default FmsAuxiliaryTypeSelect
