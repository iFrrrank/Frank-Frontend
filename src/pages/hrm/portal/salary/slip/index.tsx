import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { SalarySlipOptionVO, SalarySlipVO } from '@/api/hrm/portal/salary'
import { getSalarySlipList, markSalarySlipRead } from '@/api/hrm/portal/salary'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import { checkHrmPortalAccess } from '../../utils'

const { RangePicker } = DatePicker

const SORT_OPTIONS = [
  { label: '最新发放优先', value: 1, orderType: 1, order: 2 },
  { label: '最早发放优先', value: 2, orderType: 1, order: 1 },
  { label: '实发金额从低到高', value: 3, orderType: 2, order: 1 },
  { label: '实发金额从高到低', value: 4, orderType: 2, order: 2 }
]

const HrmPortalSalarySlipPage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [slips, setSlips] = useState<SalarySlipVO[]>([])
  const [monthRange, setMonthRange] = useState<[string, string] | null>(null)
  const [sortValue, setSortValue] = useState<number>(1)

  const hasFilter = monthRange !== null || sortValue !== 1

  const loadSlips = async () => {
    setLoading(true)
    try {
      const selectedSort = SORT_OPTIONS.find((s) => s.value === sortValue)
      const params: any = {
        orderType: selectedSort?.orderType,
        order: selectedSort?.order
      }
      if (monthRange && monthRange.length === 2) {
        params.startMonth = monthRange[0]
        params.endMonth = monthRange[1]
      }

      const resp = await getSalarySlipList(params)
      const data = resp.data || []
      setSlips(data)

      const unreadIds = data.filter((s) => s.readStatus === 0).map((s) => s.id)
      if (unreadIds.length > 0) {
        markSalarySlipRead(unreadIds)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHrmPortalAccess().then((canAccess) => {
      setAccessible(canAccess)
      if (canAccess) {
        loadSlips()
      }
    })
  }, [sortValue, monthRange])

  if (!accessible) return null

  // 获取末级项目
  const getLeafOptions = (options: SalarySlipOptionVO[]): SalarySlipOptionVO[] => {
    const list: SalarySlipOptionVO[] = []
    options.forEach((opt) => {
      if (opt.children?.length) {
        list.push(...getLeafOptions(opt.children))
      } else {
        list.push(opt)
      }
    })
    return list
  }

  // 构建单行数据
  const buildSlipRow = (slip: SalarySlipVO) => {
    const row: Record<string, any> = {
      id: slip.id,
      monthTitle: `${slip.year}-${String(slip.month).padStart(2, '0')}`
    }
    getLeafOptions(slip.options || []).forEach((opt) => {
      row[`opt_${opt.code ?? opt.name}`] = opt.value || 0
    })
    return row
  }

  // 递归生成表头列
  const buildColumns = (options: SalarySlipOptionVO[]) => {
    const columns: any[] = [
      {
        title: '所属月份',
        dataIndex: 'monthTitle',
        key: 'monthTitle',
        fixed: 'left',
        width: 120
      }
    ]

    const mapOptionToColumn = (opt: SalarySlipOptionVO): any => {
      const title = (
        <span>
          {opt.name}
          {opt.remark && (
            <Tooltip title={opt.remark}>
              <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c' }} />
            </Tooltip>
          )}
        </span>
      )

      if (opt.children?.length) {
        return {
          title,
          key: `group_${opt.code ?? opt.name}`,
          children: opt.children.map(mapOptionToColumn)
        }
      }

      return {
        title,
        dataIndex: `opt_${opt.code ?? opt.name}`,
        key: `col_${opt.code ?? opt.name}`,
        align: 'right',
        minWidth: 120,
        render: (val: any) => `¥ ${formatHrmMoney(val)}`
      }
    }

    options.forEach((opt) => {
      columns.push(mapOptionToColumn(opt))
    })

    return columns
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 顶部工具栏 */}
      <Card bodyStyle={{ padding: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            我的工资条
          </Typography.Title>

          <Space wrap>
            <RangePicker
              picker="month"
              value={monthRange ? [dayjs(monthRange[0]), dayjs(monthRange[1])] : undefined}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setMonthRange([dates[0].format('YYYY-MM'), dates[1].format('YYYY-MM')])
                } else {
                  setMonthRange(null)
                }
              }}
              placeholder={['开始月份', '结束月份']}
              style={{ width: 240 }}
            />

            <Select
              value={sortValue}
              onChange={setSortValue}
              style={{ width: 170 }}
              options={SORT_OPTIONS.map((s) => ({
                label: s.label,
                value: s.value
              }))}
            />

            {hasFilter && (
              <Button
                type="link"
                onClick={() => {
                  setMonthRange(null)
                  setSortValue(1)
                }}
              >
                清除筛选
              </Button>
            )}
          </Space>
        </div>
      </Card>

      {/* 工资条卡片列表 */}
      {slips.length > 0 ? (
        slips.map((slip) => (
          <Card
            key={slip.id}
            loading={loading}
            bodyStyle={{ padding: 16 }}
            title={
              <Space>
                <span>
                  {slip.year} 年 {slip.month} 月工资条
                </span>
                {slip.readStatus === 0 && <Tag color="error">新工资条</Tag>}
              </Space>
            }
          >
            <Table
              columns={buildColumns(slip.options || [])}
              dataSource={[buildSlipRow(slip)]}
              rowKey="id"
              pagination={false}
              bordered
              size="small"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        ))
      ) : (
        <Card>
          <Empty description="暂无工资条" />
        </Card>
      )}
    </div>
  )
}

export default HrmPortalSalarySlipPage
