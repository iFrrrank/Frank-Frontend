import React, { useEffect, useMemo, useState } from 'react'
import { Select } from 'antd'
import type { CSSProperties } from 'react'
import { getRecruitChannel, getRecruitChannelSimpleList } from '@/api/hrm/recruit/channel'

interface RecruitChannelSelectProps {
  value?: number
  onChange?: (value: number | undefined, channel?: API.HrmRecruitChannelRespVO) => void
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  // 需要排除的渠道编号（例如删除渠道时不能选择自己作为承接渠道）
  excludeIds?: number[]
  placeholder?: string
  style?: CSSProperties
}

// 招聘渠道选择器
const RecruitChannelSelect: React.FC<RecruitChannelSelectProps> = ({
  value,
  onChange,
  disabled = false,
  clearable = true,
  filterable = true,
  excludeIds = [],
  placeholder = '请选择招聘渠道',
  style
}) => {
  const [channelList, setChannelList] = useState<API.HrmRecruitChannelRespVO[]>([])
  const [selectedChannel, setSelectedChannel] = useState<API.HrmRecruitChannelRespVO>()
  const [loading, setLoading] = useState<boolean>(false)

  // 精简列表只包含启用的渠道，已停用渠道的回显需要单独补充
  const options = useMemo(() => {
    const list = channelList.filter((channel) => !excludeIds.includes(channel.id))
    if (
      selectedChannel &&
      !excludeIds.includes(selectedChannel.id) &&
      !list.some((channel) => channel.id === selectedChannel.id)
    ) {
      return [selectedChannel, ...list]
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelList, selectedChannel, excludeIds.join(',')])

  useEffect(() => {
    setLoading(true)
    getRecruitChannelSimpleList()
      .then((resp) => setChannelList(resp.data || []))
      .catch(() => setChannelList([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setSelectedChannel(undefined)
    if (value == null || channelList.some((channel) => channel.id === value)) {
      return
    }
    getRecruitChannel({ id: value })
      .then((resp) => {
        if (resp.data?.id === value) {
          setSelectedChannel(resp.data)
        }
      })
      .catch(() => undefined)
  }, [value, channelList])

  return (
    <Select
      value={value}
      style={{ width: '100%', ...style }}
      disabled={disabled}
      loading={loading}
      allowClear={clearable}
      showSearch={filterable}
      optionFilterProp="label"
      placeholder={placeholder}
      options={options.map((channel) => ({ label: channel.name, value: channel.id }))}
      onChange={(val) =>
        onChange?.(
          val,
          options.find((channel) => channel.id === val)
        )
      }
    />
  )
}

export default RecruitChannelSelect
