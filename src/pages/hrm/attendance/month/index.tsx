import React, { useEffect, useState } from 'react'
import { Button, Card, DatePicker, Form, Input, Select, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import dayjs, { type Dayjs } from 'dayjs'
import download from '@/utils/download'
import * as AttendanceStatisticsApi from '@/api/hrm/attendance/statistics'
import { formatHrmDays, formatHrmMoney } from '@/pages/hrm/utils/format'
import DeptTreeSelect from '@/pages/hrm/attendance/components/DeptTreeSelect'

const HrmAttendanceMonthPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.HrmAttendanceMonthRecordRespVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs())
  const [form] = Form.useForm()

  const getQueryParams = (page = pageNo, size = pageSize) => {
    const values = form.getFieldsValue()
    return {
      pageNo: page,
      pageSize: size,
      year: selectedMonth.year(),
      month: selectedMonth.month() + 1,
      search: values.search?.trim() || undefined,
      deptIds: values.deptIds && values.deptIds.length > 0 ? values.deptIds : undefined,
      fullAttendance: values.fullAttendance !== undefined ? values.fullAttendance : undefined
    }
  }

  const getList = async (page = pageNo, size = pageSize) => {
    setLoading(true)
    try {
      const resp = await AttendanceStatisticsApi.getAttendanceMonthRecordPage(
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
      const data: any = await AttendanceStatisticsApi.exportAttendanceMonthRecord(
        getQueryParams(pageNo, pageSize) as any
      )
      download.excel(data, '员工月度考勤汇总.xls')
      message.success('导出成功')
    } catch (err: any) {
      message.error(err?.message || '导出失败')
    } finally {
      setExportLoading(false)
    }
  }

  const openDetail = (row: API.HrmAttendanceMonthRecordRespVO) => {
    history.push(
      `/hrm/attendance/month/detail?employeeId=${row.employeeId}&year=${row.year}&month=${row.month}`
    )
  }

  useEffect(() => {
    getList(1, pageSize)
  }, [selectedMonth])

  const columns: ColumnsType<API.HrmAttendanceMonthRecordRespVO> = [
    {
      title: '员工',
      dataIndex: 'employeeName',
      fixed: 'left',
      minWidth: 120,
      ellipsis: true,
      render: (val, record) => (
        <Button type="link" size="small" style={{ padding: 0 }} onClick={() => openDetail(record)}>
          {val}
        </Button>
      )
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      minWidth: 110,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      minWidth: 120,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      minWidth: 120,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '应出勤天数',
      dataIndex: 'attendDays',
      width: 110,
      align: 'center'
    },
    {
      title: '实际出勤天数',
      dataIndex: 'actualDays',
      width: 120,
      align: 'center',
      render: (val) => formatHrmDays(val)
    },
    {
      title: '迟到时长（分钟）',
      dataIndex: 'lateMinute',
      width: 140,
      align: 'center'
    },
    {
      title: '迟到次数',
      dataIndex: 'lateCount',
      width: 100,
      align: 'center'
    },
    {
      title: '早退时长（分钟）',
      dataIndex: 'earlyMinute',
      width: 140,
      align: 'center'
    },
    {
      title: '早退次数',
      dataIndex: 'earlyCount',
      width: 100,
      align: 'center'
    },
    {
      title: '旷工天数',
      dataIndex: 'absenteeismDays',
      width: 100,
      align: 'center',
      render: (val) => formatHrmDays(val)
    },
    {
      title: '缺卡次数',
      dataIndex: 'misscardCount',
      width: 100,
      align: 'center'
    },
    {
      title: '请假天数',
      dataIndex: 'leaveDays',
      width: 100,
      align: 'center',
      render: (val) => formatHrmDays(val)
    },
    {
      title: '考勤扣款',
      dataIndex: 'attendanceDeductAmount',
      width: 110,
      align: 'center',
      render: (val) => `${formatHrmMoney(val)} 元`
    }
  ]

  return (
    <PageContainer header={{ title: '月度考勤管理' }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item label="月份">
            <DatePicker
              picker="month"
              format="YYYY-MM"
              allowClear={false}
              value={selectedMonth}
              onChange={(date) => date && setSelectedMonth(date)}
              style={{ width: 160 }}
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
          <Form.Item name="fullAttendance" label="是否全勤">
            <Select
              placeholder="请选择"
              allowClear
              options={[
                { label: '是', value: true },
                { label: '否', value: false }
              ]}
              style={{ width: 120 }}
            />
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
    </PageContainer>
  )
}

export default HrmAttendanceMonthPage
