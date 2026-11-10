import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, InputNumber, Popover, Space } from 'antd'
import {
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import HasPermi from '@/directives/permission/HasPermi'
import { findNode } from '@/utils/tree'
import FmsSubjectSelect from '@/pages/fms/config/subject/components/FmsSubjectSelect'
import { useFmsStore } from '@/pages/fms/store/fms'
import { FMS_SUBJECT_LEVEL_MAX } from '@/pages/fms/utils/constants'
import FmsLedgerMonthRangePicker from './FmsLedgerMonthRangePicker'
import FmsLedgerPrintButton from './FmsLedgerPrintButton'

export interface FmsLedgerSearchQuery {
  startMonth: string
  endMonth: string
  subjectId?: number
  startSubjectId?: number
  endSubjectId?: number
  minLevel?: number
  maxLevel?: number
}

interface FmsLedgerSearchBarProps {
  subjects?: API.FmsSubjectRespVO[]
  showSubject?: boolean
  subjectId?: number
  startMonth?: string
  endMonth?: string
  minLevel?: number
  maxLevel?: number
  printTarget?: string
  printTitle?: string
  beforePrint?: () => void | Promise<void>
  showExport?: boolean
  showPrint?: boolean
  exportLoading?: boolean
  permissionPrefix?: string
  autoQuery?: boolean
  onSearch: (query: FmsLedgerSearchQuery) => void
  onExport?: () => void
  children?: React.ReactNode
}

const FmsLedgerSearchBar: React.FC<FmsLedgerSearchBarProps> = ({
  subjects,
  showSubject = false,
  subjectId: propSubjectId,
  startMonth: propStartMonth,
  endMonth: propEndMonth,
  minLevel: propMinLevel = 1,
  maxLevel: propMaxLevel = 1,
  printTarget = '',
  printTitle = '',
  beforePrint,
  showExport = true,
  showPrint = true,
  exportLoading = false,
  permissionPrefix = 'fms:ledger:general',
  autoQuery = false,
  onSearch,
  onExport,
  children
}) => {
  const fmsStore = useFmsStore()
  const currentMonth = dayjs().format('YYYY-MM')

  const [monthRange, setMonthRange] = useState<[string, string]>([
    propStartMonth || currentMonth,
    propEndMonth || currentMonth
  ])
  const [subjectId, setSubjectId] = useState<number | undefined>(propSubjectId)
  const [startSubjectId, setStartSubjectId] = useState<number | undefined>()
  const [endSubjectId, setEndSubjectId] = useState<number | undefined>()
  const [minLevel, setMinLevel] = useState<number | undefined>(propMinLevel)
  const [maxLevel, setMaxLevel] = useState<number | undefined>(propMaxLevel)
  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => {
    setSubjectId(propSubjectId)
  }, [propSubjectId])

  useEffect(() => {
    if (propStartMonth && propEndMonth) {
      setMonthRange([propStartMonth, propEndMonth])
    }
  }, [propStartMonth, propEndMonth])

  const printCenterText = useMemo(() => {
    const subject = findNode<API.FmsSubjectRespVO>(
      subjects || [],
      (item) => item.id === subjectId
    )
    return subject ? `科目：${subject.code} ${subject.name}` : ''
  }, [subjects, subjectId])

  const triggerSearch = (
    customRange = monthRange,
    customSubjectId = subjectId,
    customStartSubId = startSubjectId,
    customEndSubId = endSubjectId,
    customMinLevel = minLevel,
    customMaxLevel = maxLevel
  ) => {
    onSearch({
      startMonth: customRange[0],
      endMonth: customRange[1],
      subjectId: customSubjectId,
      startSubjectId: customStartSubId,
      endSubjectId: customEndSubId,
      minLevel: customMinLevel,
      maxLevel: customMaxLevel
    })
  }

  const resetAdvanced = () => {
    setStartSubjectId(undefined)
    setEndSubjectId(undefined)
    setMinLevel(propMinLevel)
    setMaxLevel(propMaxLevel)
  }

  const resetQuery = async () => {
    const accountingMonth = (await fmsStore.loadCurrentMonth()) || currentMonth
    const nextRange: [string, string] = [accountingMonth, accountingMonth]
    const nextSubjectId = showSubject ? subjects?.[0]?.id : undefined
    setMonthRange(nextRange)
    setSubjectId(nextSubjectId)
    resetAdvanced()
    triggerSearch(
      nextRange,
      nextSubjectId,
      undefined,
      undefined,
      propMinLevel,
      propMaxLevel
    )
  }

  return (
    <Form layout="inline" style={{ rowGap: 16 }}>
      <Form.Item label="会计期间">
        <FmsLedgerMonthRangePicker
          value={monthRange}
          onChange={(nextRange) => {
            setMonthRange(nextRange)
            if (autoQuery) {
              triggerSearch(nextRange)
            }
          }}
        />
      </Form.Item>
      {showSubject && (
        <Form.Item label="科目">
          <FmsSubjectSelect
            value={subjectId}
            options={subjects}
            placeholder="请选择科目"
            style={{ width: 240 }}
            onChange={(val) => {
              const nextSubId = val as number | undefined
              setSubjectId(nextSubId)
              if (autoQuery) {
                triggerSearch(monthRange, nextSubId)
              }
            }}
          />
        </Form.Item>
      )}
      <Form.Item>
        <Space wrap>
          {!showSubject && (
            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              placement="bottomLeft"
              trigger="click"
              content={
                <div style={{ width: 320 }}>
                  <Form layout="vertical">
                    <Form.Item label="起始科目">
                      <FmsSubjectSelect
                        value={startSubjectId}
                        options={subjects}
                        allowClear
                        style={{ width: '100%' }}
                        onChange={(val) => setStartSubjectId(val as number | undefined)}
                      />
                    </Form.Item>
                    <Form.Item label="结束科目">
                      <FmsSubjectSelect
                        value={endSubjectId}
                        options={subjects}
                        allowClear
                        style={{ width: '100%' }}
                        onChange={(val) => setEndSubjectId(val as number | undefined)}
                      />
                    </Form.Item>
                    <Form.Item label="科目级次">
                      <Space size={8}>
                        <InputNumber
                          value={minLevel}
                          controls={false}
                          min={1}
                          max={FMS_SUBJECT_LEVEL_MAX}
                          style={{ width: 135 }}
                          onChange={(val) => setMinLevel(val ?? undefined)}
                        />
                        <span>至</span>
                        <InputNumber
                          value={maxLevel}
                          controls={false}
                          min={1}
                          max={FMS_SUBJECT_LEVEL_MAX}
                          style={{ width: 135 }}
                          onChange={(val) => setMaxLevel(val ?? undefined)}
                        />
                      </Space>
                    </Form.Item>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 8
                      }}
                    >
                      <Button onClick={resetAdvanced}>重置</Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setPopoverOpen(false)
                          triggerSearch()
                        }}
                      >
                        查询
                      </Button>
                    </div>
                  </Form>
                </div>
              }
            >
              <Button icon={<FilterOutlined />}>更多条件</Button>
            </Popover>
          )}
          <Button icon={<SearchOutlined />} onClick={() => triggerSearch()}>
            搜索
          </Button>
          <Button icon={<ReloadOutlined />} onClick={resetQuery}>
            重置
          </Button>
          {showPrint && printTarget && (
            <FmsLedgerPrintButton
              beforePrint={beforePrint}
              centerText={printCenterText}
              endMonth={monthRange[1]}
              permissionPrefix={permissionPrefix}
              startMonth={monthRange[0]}
              target={printTarget}
              title={printTitle}
            />
          )}
          {showExport && (
            <HasPermi value={`${permissionPrefix}:export`}>
              <Button
                icon={<DownloadOutlined />}
                loading={exportLoading}
                onClick={onExport}
              >
                导出
              </Button>
            </HasPermi>
          )}
          {children}
        </Space>
      </Form.Item>
    </Form>
  )
}

export default FmsLedgerSearchBar
