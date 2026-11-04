import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { Button, Calendar, Card, Empty, Modal, Spin, Tag, message, theme } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'
import { deletePersonalNote } from '@/api/hrm/employee/personalNote'
import { useHasPermi } from '@/directives/permission/HasPermi'
import { textConst } from '@/locales/zh-CN'
import type { HrmHomeCalendarItemVO, HrmHomeCalendarParams } from '../api'
import { HRM_HOME_PERMISSIONS, HrmHomeCalendarItemType } from '../constants'
import { getHrmLunarDateInfo } from '../utils'
import PersonalNoteForm from './PersonalNoteForm'

export interface HrmHomeCalendarRef {
  refresh: () => Promise<void>
}

interface HrmHomeCalendarProps {
  getCalendarItems: (params: HrmHomeCalendarParams) => Promise<HrmHomeCalendarItemVO[]>
  itemFilter?: (item: HrmHomeCalendarItemVO) => boolean
  isItemClickable?: (item: HrmHomeCalendarItemVO) => boolean
  showItemTime?: (item: HrmHomeCalendarItemVO) => boolean
  onItemClick?: (item: HrmHomeCalendarItemVO) => void
}

const DATE_FORMAT = 'YYYY-MM-DD'
// 当天事项默认最多展示条数
const VISIBLE_LIMIT = 4

/** 日历事项标签颜色 */
function eventTagColor(type: number) {
  switch (type) {
    case HrmHomeCalendarItemType.NOTE:
    case HrmHomeCalendarItemType.RECRUIT:
      return 'blue'
    case HrmHomeCalendarItemType.BIRTHDAY:
      return 'red'
    case HrmHomeCalendarItemType.ENTRY:
    case HrmHomeCalendarItemType.REGULAR:
      return 'green'
    case HrmHomeCalendarItemType.LEAVE:
      return 'orange'
    default:
      return 'default'
  }
}

/** 后端日期可能是 [年, 月, 日] 数组，统一成 YYYY-MM-DD */
function normalizeDate(date: HrmHomeCalendarItemVO['date']): string {
  return Array.isArray(date)
    ? dayjs(new Date(date[0], date[1] - 1, date[2])).format(DATE_FORMAT)
    : date
}

/** 工作台日历：月视图 + 农历 + 当天事项 + 个人备忘 */
const HrmHomeCalendar = forwardRef<HrmHomeCalendarRef, HrmHomeCalendarProps>(
  ({ getCalendarItems, itemFilter, isItemClickable, showItemTime, onItemClick }, ref) => {
    const { token } = theme.useToken()
    const hasPermi = useHasPermi()
    const [loading, setLoading] = useState(false)
    const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs())
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format(DATE_FORMAT))
    const [calendarItems, setCalendarItems] = useState<HrmHomeCalendarItemVO[]>([])
    const [showAllEvents, setShowAllEvents] = useState(false)
    const [noteFormVisible, setNoteFormVisible] = useState(false)
    // 始终使用最新的回调与月份，避免 refresh 因闭包读到旧值
    const latest = useRef({ getCalendarItems, itemFilter, calendarDate })
    latest.current = { getCalendarItems, itemFilter, calendarDate }

    /** 刷新当前月份的日历 */
    const refresh = useCallback(async (month?: Dayjs) => {
      const target = month ?? latest.current.calendarDate
      setLoading(true)
      try {
        const items = await latest.current.getCalendarItems({
          startDate: target.startOf('month').format(DATE_FORMAT),
          endDate: target.endOf('month').format(DATE_FORMAT)
        })
        const normalized = (items || []).map((item) => ({ ...item, date: normalizeDate(item.date) }))
        setCalendarItems(
          latest.current.itemFilter ? normalized.filter(latest.current.itemFilter) : normalized
        )
      } finally {
        setLoading(false)
      }
    }, [])

    useImperativeHandle(ref, () => ({ refresh: () => refresh() }), [refresh])

    // 首次挂载加载当月事项
    useEffect(() => {
      refresh()
    }, [refresh])

    const calendarDateSet = useMemo(
      () => new Set(calendarItems.map((item) => item.date as string)),
      [calendarItems]
    )
    const dayItems = useMemo(
      () => calendarItems.filter((item) => item.date === selectedDate),
      [calendarItems, selectedDate]
    )
    const visibleDayItems = showAllEvents ? dayItems : dayItems.slice(0, VISIBLE_LIMIT)
    const selected = dayjs(selectedDate)

    /** 选择日期；跨月时重新加载事项 */
    const handleDateChange = (date: Dayjs) => {
      const monthChanged = !date.isSame(calendarDate, 'month')
      setSelectedDate(date.format(DATE_FORMAT))
      setShowAllEvents(false)
      setCalendarDate(date)
      if (monthChanged) refresh(date)
    }

    const canOpenItem = (item: HrmHomeCalendarItemVO) => isItemClickable?.(item) === true
    const shouldShowItemTime = (item: HrmHomeCalendarItemVO) =>
      !!item.eventTime && (showItemTime ? showItemTime(item) : true)

    /** 删除个人备忘 */
    const handleDeleteNote = (id: number) => {
      Modal.confirm({
        title: textConst.msg.confirmTitle,
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        content: textConst.msg.delDataMsg,
        okText: textConst.common.ok,
        cancelText: textConst.common.cancel,
        onOk: async () => {
          await deletePersonalNote({ id })

          message.success(textConst.msg.delSuccess)
          await refresh()
        }
      })
    }

    return (
      <Card title="日历" style={{ marginBottom: 16 }}>
        <Spin spinning={loading}>
          <Calendar
            fullscreen={false}
            value={calendarDate}
            onChange={handleDateChange}
            headerRender={({ value, onChange }) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 4px 12px'
                }}
              >
                <span>{value.format('YYYY 年 M 月')}</span>
                <Button.Group>
                  <Button size="small" onClick={() => onChange(value.subtract(1, 'month'))}>
                    上个月
                  </Button>
                  <Button size="small" onClick={() => onChange(dayjs())}>
                    今天
                  </Button>
                  <Button size="small" onClick={() => onChange(value.add(1, 'month'))}>
                    下个月
                  </Button>
                </Button.Group>
              </div>
            )}
            fullCellRender={(date, info) => {
              if (info.type !== 'date') return info.originNode
              const dateText = date.format(DATE_FORMAT)
              const isSelected = dateText === selectedDate
              const isToday = date.isSame(dayjs(), 'day')
              const inMonth = date.isSame(calendarDate, 'month')
              return (
                <div
                  style={{
                    position: 'relative',
                    height: 42,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    cursor: 'pointer',
                    opacity: inMonth ? 1 : 0.4,
                    background: isSelected ? token.colorPrimaryBg : undefined,
                    color: isSelected || isToday ? token.colorPrimary : undefined
                  }}
                >
                  <span style={{ lineHeight: '18px' }}>{date.format('DD')}</span>
                  <span
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: 10,
                      lineHeight: '14px',
                      color: token.colorTextSecondary
                    }}
                  >
                    {getHrmLunarDateInfo(dateText).dayText}
                  </span>
                  {calendarDateSet.has(dateText) && (
                    <i
                      style={{
                        position: 'absolute',
                        bottom: 3,
                        right: 3,
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: token.colorPrimary
                      }}
                    />
                  )}
                </div>
              )
            }}
          />

          <div
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: 4,
              background: token.colorPrimaryBg
            }}
          >
            <div style={{ marginRight: 10, fontSize: 38, fontWeight: 700, lineHeight: 1 }}>
              {selected.format('DD')}
            </div>
            <div>
              <div>{selected.locale('zh-cn').format('dddd')}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: token.colorTextSecondary }}>
                {getHrmLunarDateInfo(selectedDate).monthDayText}
              </div>
            </div>
            {hasPermi(HRM_HOME_PERMISSIONS.PERSONAL_NOTE_CREATE) && (
              <Button
                type="link"
                icon={<PlusOutlined />}
                style={{ marginLeft: 'auto' }}
                onClick={() => setNoteFormVisible(true)}
              >
                添加备忘录
              </Button>
            )}
          </div>

          <div style={{ marginTop: 18, fontWeight: 600 }}>当天事项</div>
          <div style={{ marginTop: 8, minHeight: 132 }}>
            {visibleDayItems.map((item) => (
              <div
                key={`${item.type}-${item.personalNoteId || item.typeId || item.content}`}
                style={{ minHeight: 32, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Tag color={eventTagColor(item.type)} style={{ margin: 0 }}>
                  {item.typeName}
                </Tag>
                {shouldShowItemTime(item) && (
                  <span
                    style={{
                      flex: 'none',
                      fontSize: 12,
                      color: token.colorTextSecondary,
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {dayjs(item.eventTime).format('HH:mm')}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => canOpenItem(item) && onItemClick?.(item)}
                  style={{
                    minWidth: 0,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    border: 0,
                    background: 'transparent',
                    padding: 0,
                    textAlign: 'left',
                    font: 'inherit',
                    cursor: canOpenItem(item) ? 'pointer' : 'default',
                    color: canOpenItem(item) ? token.colorPrimary : token.colorText
                  }}
                >
                  {item.content}
                </button>
                {item.personalNoteId && hasPermi(HRM_HOME_PERMISSIONS.PERSONAL_NOTE_DELETE) && (
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={() => handleDeleteNote(item.personalNoteId as number)}
                  >
                    删除
                  </Button>
                )}
              </div>
            ))}
            {dayItems.length > VISIBLE_LIMIT && !showAllEvents && (
              <Button type="link" onClick={() => setShowAllEvents(true)}>
                查看更多事项
              </Button>
            )}
            {dayItems.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
            )}
          </div>
        </Spin>

        <PersonalNoteForm
          visible={noteFormVisible}
          setVisible={setNoteFormVisible}
          date={selectedDate}
          onSuccess={() => refresh()}
        />
      </Card>
    )
  }
)

export default HrmHomeCalendar
