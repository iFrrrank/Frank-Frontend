import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { fmsVoucherWordGetVoucherWordSimpleList } from '@/api/fms/config/voucherWord'
import { useFmsStore } from '../../../store/fms'

export interface FmsVoucherWordSelectProps
  extends Omit<SelectProps<number>, 'options' | 'onChange'> {
  value?: number
  onChange?: (value?: number, option?: API.FmsVoucherWordRespVO) => void
  options?: API.FmsVoucherWordRespVO[]
}

/**
 * 凭证字下拉选择器组件
 */
const FmsVoucherWordSelect: React.FC<FmsVoucherWordSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '请选择凭证字',
  allowClear = false,
  ...restProps
}) => {
  const fmsStore = useFmsStore()
  const [innerWords, setInnerWords] = useState<API.FmsVoucherWordRespVO[]>([])

  useEffect(() => {
    if (options !== undefined) return
    if (!fmsStore.accountSetId) {
      setInnerWords([])
      return
    }
    fmsVoucherWordGetVoucherWordSimpleList({ accountSetId: fmsStore.accountSetId }).then((resp) => {
      if (resp.code === 0) {
        setInnerWords(resp.data || [])
      }
    })
  }, [options, fmsStore.accountSetId])

  const wordList = useMemo(() => options ?? innerWords, [options, innerWords])

  const selectOptions = useMemo(
    () =>
      wordList.map((item) => ({
        label: item.name,
        value: item.id
      })),
    [wordList]
  )

  return (
    <Select
      value={value}
      allowClear={allowClear}
      placeholder={placeholder}
      options={selectOptions}
      onChange={(nextVal) => {
        if (!onChange) return
        const selected = wordList.find((item) => item.id === nextVal)
        onChange(nextVal, selected)
      }}
      {...restProps}
    />
  )
}

export default FmsVoucherWordSelect

