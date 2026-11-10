import React, { useMemo } from 'react'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useFmsStore } from '@/pages/fms/store/fms'

interface FmsLedgerMonthRangePickerProps {
  value: [string, string]
  onChange?: (value: [string, string]) => void
}

const FmsLedgerMonthRangePicker: React.FC<FmsLedgerMonthRangePickerProps> = ({
  value,
  onChange
}) => {
  const fmsStore = useFmsStore()

  const accountSetStartMonth = useMemo(() => {
    const accountSet = fmsStore.accountSetList.find((item) => item.id === fmsStore.accountSetId)
    return accountSet?.startTime ? dayjs(accountSet.startTime).format('YYYY-MM') : undefined
  }, [fmsStore.accountSetList, fmsStore.accountSetId])

  return (
    <DatePicker.RangePicker
      picker="month"
      allowClear={false}
      style={{ width: 240 }}
      placeholder={['开始月份', '结束月份']}
      value={[dayjs(value[0], 'YYYY-MM'), dayjs(value[1], 'YYYY-MM')]}
      disabledDate={(date) =>
        Boolean(accountSetStartMonth && date.format('YYYY-MM') < accountSetStartMonth)
      }
      onChange={(dates) => {
        if (dates && dates[0] && dates[1]) {
          onChange?.([dates[0].format('YYYY-MM'), dates[1].format('YYYY-MM')])
        }
      }}
    />
  )
}

export default FmsLedgerMonthRangePicker
