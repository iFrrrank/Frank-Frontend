import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, DatePicker, Form, Input, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import download from '@/utils/download'
import * as AttendanceStatisticsApi from '@/api/hrm/attendance/statistics'
import DeptTreeSelect from '@/pages/hrm/attendance/components/DeptTreeSelect'
import AttendanceClockDailyDetail, {
  type AttendanceClockDailyDetailRef
} from './AttendanceClockDailyDetail'

const AttendanceClockOverview: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.HrmAttendanceMonthDailyOverviewRespVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs())
  const [form] = Form.useForm()

  const dailyDetailRef = useRef<AttendanceClockDailyDetailRef>(null)

  const dayColumnsConfig = useMemo(() => {
    const daysInMonth = selectedMonth.daysInMonth()
    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = selectedMonth.date(index + 1)
      const dateStr = date.format('YYYY-MM-DD')
      const dayStr = date.format('DD')
      const weekStr = `周${'日一二三四五六'[date.day()]}`
      return { date: dateStr, day: dayStr, week: weekStr }
    })
  }, [selectedMonth])

  const getQueryParams = (page = pageNo, size = pageSize) => {
    const values = form.getFieldsValue()
    return {
      pageNo: page,
      pageSize: size,
      year: selectedMonth.year(),
      month: selectedMonth.month() + 1,
      search: values.search?.trim() || undefined,
      deptIds: values.deptIds && values.deptIds.length > 0 ? values.deptIds : undefined
    }
  }

  const getList = async (page = pageNo, size = pageSize) => {
    setLoading(true)
    try {
      const resp = await AttendanceStatisticsApi.getAttendanceMonthDailyOverviewPage(
        getQueryParams(page, size) as any
      )
      setList(resp.data?.list || [])
      setTotal(resp.data?.total || 0)
    } finally {
      setLoading(false)
    }
  }

  const handleQuery = () => {
    setPageNo(1)
    getList(1, pageSize)
  }

  const handleReset = () => {
    form.resetFields()
    setSelectedMonth(dayjs())
    setPageNo(1)
    getList(1, pageSize)
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const data: any = await AttendanceStatisticsApi.exportAttendanceMonthDailyOverview(
        getQueryParams(pageNo, pageSize) as any
      )
      download.excel(data, '员工月度打卡概况.xls')
      message.success('导出成功')
    } catch (err: any) {
      message.error(err?.message || '导出失败')
    } finally {
      setExportLoading(false)
    }
  }

  useEffect(() => {
    getList(1, pageSize)
  }, [selectedMonth])

  const getOverviewTextColor = (value?: string) => {
    if (!value || value === '休息' || value === '未排班') return '#8c8c8c'
    if (value.includes('旷工') || value.includes('缺卡')) return '#ff4d4f'
    if (value.includes('迟到') || value.includes('早退')) return '#faad14'
    if (value.includes('正常')) return '#52c41a'
    return '#1890ff'
  }

  const columns: ColumnsType<API.HrmAttendanceMonthDailyOverviewRespVO> = [
    {
      title: '员工',
      dataIndex: 'employeeName',
      fixed: 'left',
      width: 120,
      ellipsis: true
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      fixed: 'left',
      width: 110,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      fixed: 'left',
      width: 130,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      fixed: 'left',
      width: 130,
      ellipsis: true,
      render: (val) => val || '-'
    },
    ...dayColumnsConfig.map((col) => ({
      title: (
        <div style={{ textAlign: 'center', lineHeight: '18px' }}>
          <div>{col.day}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{col.week}</div>
        </div>
      ),
      dataIndex: ['dailyClockMap', col.date],
      width: 160,
      align: 'center' as const,
      render: (_: any, record: API.HrmAttendanceMonthDailyOverviewRespVO) => {
        const dayOverview = record.dailyClockMap?.[col.date]
        if (!dayOverview) {
          return <span style={{ color: '#bfbfbf' }}>-</span>
        }

        return (
          <div
            onClick={() => dailyDetailRef.current?.open(record.employeeId!, col.date)}
            style={{
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 4,
              fontSize: 12,
              textAlign: 'left'
            }}
          >
            {dayOverview.overviews && dayOverview.overviews.length > 0 ? (
              dayOverview.overviews.map((item: any, idx: number) => {
                if (item.type) {
                  return (
                    <div
                      key={`${item.type}-${idx}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 4,
                        lineHeight: '18px'
                      }}
                    >
                      <span style={{ color: '#8c8c8c' }}>{item.type}</span>
                      <span style={{ color: '#262626' }}>{item.time || '--:--'}</span>
                      <span style={{ color: getOverviewTextColor(item.status) }}>
                        {item.status}
                      </span>
                    </div>
                  )
                }
                return (
                  <div
                    key={`text-${idx}`}
                    style={{
                      textAlign: 'center',
                      color: getOverviewTextColor(item.text),
                      lineHeight: '18px'
                    }}
                  >
                    {item.text}
                  </div>
                )
              })
            ) : (
              <span style={{ color: '#bfbfbf' }}>-</span>
            )}
          </div>
        )
      }
    }))
  ]

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item label="月份">
            <DatePicker
              picker="month"
              format="YYYY-MM"
              allowClear={false}
              value={selectedMonth}
              onChange={(date) => date && setSelectedMonth(date)}
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item name="search" label="员工">
            <Input
              placeholder="请输入员工姓名或工号"
              style={{ width: 180 }}
              allowClear
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item name="deptIds" label="部门">
            <DeptTreeSelect style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button icon={<DownloadOutlined />} loading={exportLoading} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="employeeId"
          loading={loading}
          dataSource={list}
          columns={columns}
          scroll={{ x: 'max-content' }}
          bordered
          size="small"
          pagination={{
            current: pageNo,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setPageNo(page)
              setPageSize(size)
              getList(page, size)
            }
          }}
        />
      </Card>

      <AttendanceClockDailyDetail ref={dailyDetailRef} />
    </div>
  )
}

export default AttendanceClockOverview
