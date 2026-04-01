import React, { useState, useEffect } from 'react'
import { Tabs, Radio, InputNumber, Select, Space, Typography } from 'antd'

const { Text } = Typography

export interface CronExpressionGeneratorProps {
  value?: string
  onChange?: (value: string) => void
}

const defaultValues = ['*', '*', '*', '*', '*', '?', '']

const weekDays = [
  { label: '周日', value: 1 },
  { label: '周一', value: 2 },
  { label: '周二', value: 3 },
  { label: '周三', value: 4 },
  { label: '周四', value: 5 },
  { label: '周五', value: 6 },
  { label: '周六', value: 7 }
]

const getType = (val: string, label: string) => {
  if (val === '') return 'ignore'
  if (val === '?') return 'unspecified'
  if (val === '*') return 'any'
  if (val === 'L') return 'last'
  if (label === '周' && val.includes('#')) return 'interval'
  if (val.includes('-')) return 'range'
  if (val.includes('/')) return 'interval'
  if (val.includes(',') || !isNaN(Number(val))) return 'specify'
  return 'any'
}

interface CronTabPaneProps {
  value?: string
  onChange: (value: string) => void
  min: number
  max: number
  label: string
  hasQuestion?: boolean
}

const CronTabPane: React.FC<CronTabPaneProps> = ({
  value = '*',
  onChange,
  min,
  max,
  label,
  hasQuestion
}) => {
  const [type, setType] = useState<string>(getType(value, label))
  const [range, setRange] = useState<[number, number]>([
    label === '周' ? 2 : min,
    label === '周' ? 3 : min + 1
  ])
  const [interval, setInterval] = useState<[number, number]>([label === '周' ? 2 : min, 1])
  const [specifics, setSpecifics] = useState<number[]>([])

  useEffect(() => {
    const newType = getType(value, label)
    setType(newType)
    if (newType === 'range') {
      const [start, end] = value.split('-')
      setRange([Number(start) || min, Number(end) || min + 1])
    } else if (newType === 'interval') {
      if (label === '周' && value.includes('#')) {
        const [start, step] = value.split('#')
        setInterval([Number(start) || 2, Number(step) || 1])
      } else {
        const [start, step] = value.split('/')
        setInterval([start === '*' || start === '' ? min : Number(start), Number(step) || 1])
      }
    } else if (newType === 'specify') {
      setSpecifics(
        value
          .split(',')
          .filter((v) => v !== '')
          .map(Number)
      )
    }
  }, [value, min, label])

  const triggerChange = (t: string, r: [number, number], i: [number, number], s: number[]) => {
    if (t === 'ignore') {
      onChange('')
    } else if (t === 'any') {
      onChange('*')
    } else if (t === 'unspecified') {
      onChange('?')
    } else if (t === 'last') {
      onChange('L')
    } else if (t === 'range') {
      onChange(`${r[0]}-${r[1]}`)
    } else if (t === 'interval') {
      if (label === '周') {
        onChange(`${i[0]}#${i[1]}`)
      } else {
        onChange(`${i[0]}/${i[1]}`)
      }
    } else if (t === 'specify') {
      if (s.length > 0) {
        onChange(s.sort((a, b) => a - b).join(','))
      } else {
        const defaultSpec = label === '周' ? 2 : min
        onChange(defaultSpec.toString())
      }
    }
  }

  const handleTypeChange = (e: any) => {
    const newType = e.target.value
    setType(newType)
    if (newType === 'specify' && specifics.length === 0) {
      const defaultSpec = label === '周' ? 2 : min
      setSpecifics([defaultSpec])
      triggerChange(newType, range, interval, [defaultSpec])
    } else {
      triggerChange(newType, range, interval, specifics)
    }
  }

  const handleRangeChange = (index: 0 | 1, val: number | null) => {
    if (val === null) return
    const newRange: [number, number] = [...range] as [number, number]
    newRange[index] = val
    if (label === '周' && val === 7) {
      // 7 is Saturday, 1 is Sunday
    }
    setRange(newRange)
    triggerChange(type, newRange, interval, specifics)
  }

  const handleIntervalChange = (index: 0 | 1, val: number | null) => {
    if (val === null) return
    const newInterval: [number, number] = [...interval] as [number, number]
    newInterval[index] = val
    setInterval(newInterval)
    triggerChange(type, range, newInterval, specifics)
  }

  const handleSpecificsChange = (val: number[]) => {
    setSpecifics(val)
    triggerChange(type, range, interval, val)
  }

  const specifyOptions =
    label === '周'
      ? weekDays
      : Array.from({ length: max - min + 1 }, (_, i) => ({
          label: (min + i).toString(),
          value: min + i
        }))

  return (
    <div style={{ padding: '8px 0' }}>
      <Space align="center" style={{ marginBottom: 24, display: 'flex' }}>
        <Text style={{ width: 60 }}>类型</Text>
        <Radio.Group
          value={type}
          onChange={handleTypeChange}
          optionType="button"
          buttonStyle="solid"
        >
          {label === '年' && <Radio.Button value="ignore">忽略</Radio.Button>}
          <Radio.Button value="any">任意值</Radio.Button>
          <Radio.Button value="range">范围</Radio.Button>
          <Radio.Button value="interval">间隔</Radio.Button>
          <Radio.Button value="specify">指定</Radio.Button>
          {label === '日' && <Radio.Button value="last">本月最后一天</Radio.Button>}
          {label === '周' && <Radio.Button value="last">本月最后一周</Radio.Button>}
          {hasQuestion && <Radio.Button value="unspecified">不指定</Radio.Button>}
        </Radio.Group>
      </Space>

      {type === 'range' && (
        <Space align="center" style={{ display: 'flex' }}>
          <Text style={{ width: 60 }}>范围</Text>
          {label === '周' ? (
            <Space>
              <Select
                value={range[0]}
                onChange={(val) => handleRangeChange(0, val)}
                options={weekDays}
                style={{ width: 100 }}
              />
              <Text> - </Text>
              <Select
                value={range[1]}
                onChange={(val) => handleRangeChange(1, val)}
                options={weekDays}
                style={{ width: 100 }}
              />
            </Space>
          ) : (
            <Space>
              <InputNumber
                min={min}
                max={max}
                value={range[0]}
                onChange={(val) => handleRangeChange(0, val)}
              />
              <Text> - </Text>
              <InputNumber
                min={min}
                max={max}
                value={range[1]}
                onChange={(val) => handleRangeChange(1, val)}
              />
            </Space>
          )}
        </Space>
      )}

      {type === 'interval' && (
        <Space align="center" style={{ display: 'flex' }}>
          <Text style={{ width: 60 }}>间隔</Text>
          {label === '周' ? (
            <Space>
              <Text>第</Text>
              <InputNumber
                min={1}
                max={4}
                value={interval[1]}
                onChange={(val) => handleIntervalChange(1, val)}
              />
              <Text>周的</Text>
              <Select
                value={interval[0]}
                onChange={(val) => handleIntervalChange(0, val)}
                options={weekDays}
                style={{ width: 100 }}
              />
              <Text>执行一次</Text>
            </Space>
          ) : (
            <Space>
              <InputNumber
                min={min}
                max={max}
                value={interval[0]}
                onChange={(val) => handleIntervalChange(0, val)}
              />
              <Text> {`${label}开始，每 `}</Text>
              <InputNumber
                min={1}
                max={max}
                value={interval[1]}
                onChange={(val) => handleIntervalChange(1, val)}
              />
              <Text> {`${label}执行一次`}</Text>
            </Space>
          )}
        </Space>
      )}

      {type === 'specify' && (
        <Space align="start" style={{ display: 'flex' }}>
          <Text style={{ width: 60, lineHeight: '32px' }}>指定</Text>
          <Select
            mode="multiple"
            style={{ minWidth: 200, maxWidth: 400 }}
            value={specifics}
            onChange={handleSpecificsChange}
            options={specifyOptions}
            placeholder="请选择"
            allowClear
          />
        </Space>
      )}
    </div>
  )
}

const CronExpressionGenerator: React.FC<CronExpressionGeneratorProps> = ({ value, onChange }) => {
  const [values, setValues] = useState<string[]>([...defaultValues])
  const [activeTab, setActiveTab] = useState('0')

  useEffect(() => {
    if (value) {
      const parts = value.split(/\s+/)
      const newValues = [...defaultValues]
      for (let i = 0; i < parts.length; i++) {
        if (i < 7) {
          newValues[i] = parts[i]
        }
      }
      if (parts.length < 7) {
        newValues[6] = '' // clear year if not present
      }
      setValues(newValues)
    }
  }, [value])

  const updateValue = (index: number, val: string) => {
    const newValues = [...values]
    newValues[index] = val

    // Cross-check mutual exclusivity between Day (3) and Week (5)
    if (index === 3 && val !== '?' && newValues[5] !== '?') {
      newValues[5] = '?' // If Day is specified, force Week to ?
    }
    if (index === 5 && val !== '?' && newValues[3] !== '?') {
      newValues[3] = '?' // If Week is specified, force Day to ?
    }

    // Avoid having both as ? (although rare, Quartz might complain)
    if (index === 3 && val === '?' && newValues[5] === '?') {
      newValues[5] = '*'
    }
    if (index === 5 && val === '?' && newValues[3] === '?') {
      newValues[3] = '*'
    }

    setValues(newValues)
    const result = newValues.join(' ').trim()
    if (onChange) {
      onChange(result)
    }
  }

  const tabsConfig = [
    { label: '秒', key: '0', min: 0, max: 59 },
    { label: '分钟', key: '1', min: 0, max: 59 },
    { label: '小时', key: '2', min: 0, max: 23 },
    { label: '日', key: '3', min: 1, max: 31, hasQuestion: true },
    { label: '月', key: '4', min: 1, max: 12 },
    { label: '周', key: '5', min: 1, max: 7, hasQuestion: true },
    { label: '年', key: '6', min: new Date().getFullYear(), max: 2099, isOptional: true }
  ]

  const items = tabsConfig.map((tab, index) => {
    const isActive = activeTab === tab.key
    const val = values[index]
    return {
      key: tab.key,
      label: (
        <div style={{ textAlign: 'center', minWidth: 40 }}>
          <div style={{ marginBottom: 8, color: '#8c8c8c' }}>{tab.label}</div>
          <div
            style={{
              background: isActive ? '#1677ff' : '#f0f5ff',
              color: isActive ? '#fff' : '#1677ff',
              padding: '4px 8px',
              borderRadius: 6,
              fontWeight: 500,
              height: 32,
              lineHeight: '24px',
              border: isActive ? 'none' : '1px solid #d9e8ff'
            }}
          >
            {val || ' '}
          </div>
        </div>
      ),
      children: (
        <CronTabPane
          value={val}
          onChange={(v) => updateValue(index, v)}
          min={tab.min}
          max={tab.max}
          label={tab.label}
          hasQuestion={tab.hasQuestion}
        />
      )
    }
  })

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        tabBarGutter={16}
        animated={false}
      />
    </div>
  )
}

export default CronExpressionGenerator
