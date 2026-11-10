import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { fmsCurrencyGetCurrencySimpleList } from '@/api/fms/config/currency'
import { useFmsStore } from '../../../store/fms'

export interface FmsCurrencySelectProps
  extends Omit<SelectProps<any>, 'options' | 'onChange'> {
  value?: number | number[]
  onChange?: (
    value: any,
    option?: API.FmsCurrencyRespVO | API.FmsCurrencyRespVO[]
  ) => void
  options?: API.FmsCurrencyRespVO[]
  excludeStandard?: boolean
  showName?: boolean
}

/**
 * 币种下拉选择器组件
 */
const FmsCurrencySelect: React.FC<FmsCurrencySelectProps> = ({
  value,
  onChange,
  options,
  excludeStandard = false,
  showName = false,
  placeholder = '请选择币种',
  allowClear = false,
  ...restProps
}) => {
  const fmsStore = useFmsStore()
  const [innerList, setInnerList] = useState<API.FmsCurrencyRespVO[]>([])

  useEffect(() => {
    if (options !== undefined) return
    if (!fmsStore.accountSetId) {
      setInnerList([])
      return
    }
    fmsCurrencyGetCurrencySimpleList({ accountSetId: fmsStore.accountSetId }).then((resp) => {
      if (resp.code === 0) {
        setInnerList(resp.data || [])
      }
    })
  }, [options, fmsStore.accountSetId])

  const currencyList = useMemo(() => {
    const source = options ?? innerList
    return excludeStandard ? source.filter((item) => !item.standard) : source
  }, [options, innerList, excludeStandard])

  const selectOptions = useMemo(
    () =>
      currencyList.map((item) => ({
        label: showName ? `${item.code} ${item.name}` : item.code,
        value: item.id
      })),
    [currencyList, showName]
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
          const selected = currencyList.filter((item) => nextVal.includes(item.id))
          onChange(nextVal, selected)
        } else {
          const selected = currencyList.find((item) => item.id === nextVal)
          onChange(nextVal, selected)
        }
      }}
      {...restProps}
    />
  )
}

export default FmsCurrencySelect
