import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { fmsVoucherTemplateCategoryGetTemplateCategorySimpleList } from '@/api/fms/config/voucherTemplateCategory'
import { useFmsStore } from '../../../store/fms'

export interface FmsVoucherTemplateCategorySelectProps
  extends Omit<SelectProps<number>, 'options' | 'onChange'> {
  value?: number
  onChange?: (value?: number, option?: API.FmsVoucherTemplateCategoryRespVO) => void
  onLoaded?: (list: API.FmsVoucherTemplateCategoryRespVO[]) => void
  options?: API.FmsVoucherTemplateCategoryRespVO[]
}

/**
 * 凭证模板类别下拉选择器组件
 */
const FmsVoucherTemplateCategorySelect: React.FC<
  FmsVoucherTemplateCategorySelectProps
> = ({
  value,
  onChange,
  onLoaded,
  options,
  placeholder = '请选择模板类别',
  allowClear = false,
  ...restProps
}) => {
  const fmsStore = useFmsStore()
  const [innerCategories, setInnerCategories] = useState<
    API.FmsVoucherTemplateCategoryRespVO[]
  >([])

  useEffect(() => {
    if (options !== undefined) {
      onLoaded?.(options)
      return
    }
    if (!fmsStore.accountSetId) {
      setInnerCategories([])
      onLoaded?.([])
      return
    }
    fmsVoucherTemplateCategoryGetTemplateCategorySimpleList({
      accountSetId: fmsStore.accountSetId
    }).then((resp) => {
      if (resp.code === 0) {
        const list = resp.data || []
        setInnerCategories(list)
        onLoaded?.(list)
      }
    })
  }, [options, fmsStore.accountSetId])

  const categoryList = useMemo(
    () => options ?? innerCategories,
    [options, innerCategories]
  )

  const selectOptions = useMemo(
    () =>
      categoryList.map((item) => ({
        label: item.name,
        value: item.id
      })),
    [categoryList]
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
        const selected = categoryList.find((item) => item.id === nextVal)
        onChange(nextVal, selected)
      }}
      {...restProps}
    />
  )
}

export default FmsVoucherTemplateCategorySelect

