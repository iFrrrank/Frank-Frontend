import React, { useEffect, useState } from 'react'
import { Button, Card, DatePicker, Form, Input, Select, Space, Table, Tag, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import dayjs, { type Dayjs } from 'dayjs'
import download from '@/utils/download'
import * as AttendanceLeaveApi from '@/api/hrm/attendance/leave'
import { formatHrmDateTime } from '@/pages/hrm/utils/format'
import {
  BPM_STATUS_MAP,
  BPM_STATUS_OPTIONS,
  getLeaveTypeOptions,
  getMonthRange,
  type LeaveTypeOption
} from '@/pages/hrm/attendance/utils'
import DeptTreeSelect from '@/pages/hrm/attendance/components/DeptTreeSelect'

const HrmAttendanceLeavePage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [list, setList] = useState<API.HrmAttendanceLeaveRespVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs())
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeOption[]>([])
  const [sortField, setSortField] = useState<string>()
  const [sortOrder, setSortOrder] = useState<string>()
  const [form] = Form.useForm()

  useEffect(() => {
    getLeaveTypeOptions().then((opts) => setLeaveTypes(opts || []))
  }, [])

  const getLeaveTypeLabel = (val?: string) => {
    if (!val) return '-'
    const match = leaveTypes.find((item) => item.value === String(val))
    return match ? match.label : String(val)
  }

  const getQueryParams = (page = pageNo, size = pageSize, field = sortField, order = sortOrder) => {
    const values = form.getFieldsValue()
    const [start, end] = getMonthRange(selectedMonth)
    const sortingFields =
      field && order ? [{ field, order: order === 'ascend' ? 'asc' : 'desc' }] : undefined

    return {
      pageNo: page,
      pageSize: size,
      startTime: [start, end],
      employeeKeyword: values.employeeKeyword?.trim() || undefined,
      deptIds: values.deptIds && values.deptIds.length > 0 ? values.deptIds : undefined,
      types: values.types && values.types.length > 0 ? values.types : undefined,
      approvalStatus: values.approvalStatus !== undefined ? values.approvalStatus : undefined,
      sortingFields
    }
  }

  const getList = async (page = pageNo, size = pageSize, field = sortField, order = sortOrder) => {
    setLoading(true)
    try {
      const resp = await AttendanceLeaveApi.getAttendanceLeavePage(
        getQueryParams(page, size, field, order) as any
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
    setSortField(undefined)
    setSortOrder(undefined)
    setPageNo(1)
    getList(1, pageSize, undefined, undefined)
  }

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: Record<string, FilterValue | null>,
    sorter:
      | SorterResult<API.HrmAttendanceLeaveRespVO>
      | SorterResult<API.HrmAttendanceLeaveRespVO>[]
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter
    const nextField = (singleSorter?.field as string) || undefined
    const nextOrder = singleSorter?.order || undefined

    const nextPage = pagination.current || 1
    const nextSize = pagination.pageSize || 10

    setPageNo(nextPage)
    setPageSize(nextSize)
    setSortField(nextField)
    setSortOrder(nextOrder)

    getList(nextPage, nextSize, nextField, nextOrder)
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const data: any = await AttendanceLeaveApi.exportAttendanceLeave(
        getQueryParams(pageNo, pageSize) as any
      )
      download.excel(data, '请假记录.xls')
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

  const columns: ColumnsType<API.HrmAttendanceLeaveRespVO> = [
    {
      title: '姓名',
      dataIndex: 'employeeName',
      align: 'center',
      minWidth: 110,
      ellipsis: true
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      align: 'center',
      minWidth: 110,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      align: 'center',
      minWidth: 120,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
      minWidth: 120,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '请假类型',
      dataIndex: 'type',
      align: 'center',
      width: 110,
      render: (val) => <Tag color="blue">{getLeaveTypeLabel(val)}</Tag>
    },
    {
      title: '请假开始时间',
      dataIndex: 'startTime',
      align: 'center',
      width: 170,
      sorter: true,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '请假结束时间',
      dataIndex: 'endTime',
      align: 'center',
      width: 170,
      sorter: true,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '请假天数',
      dataIndex: 'day',
      align: 'center',
      width: 100,
      sorter: true,
      render: (val) => `${val || 0} 天`
    },
    {
      title: '请假事由',
      dataIndex: 'reason',
      align: 'center',
      minWidth: 160,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      minWidth: 140,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      align: 'center',
      width: 110,
      render: (val?: number) => {
        if (val === undefined || val === null) return '-'
        const statusConfig = BPM_STATUS_MAP[val]
        return <Tag color={statusConfig?.color || 'default'}>{statusConfig?.text || val}</Tag>
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (_, record) =>
        record.processInstanceId ? (
          <Button
            type="link"
            size="small"
            onClick={() =>
              history.push(`/bpm/process-instance/detail?id=${record.processInstanceId}`)
            }
          >
            审批进度
          </Button>
        ) : (
          '-'
        )
    }
  ]

  return (
    <PageContainer header={{ title: '请假记录管理' }}>
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
          <Form.Item name="employeeKeyword" label="员工">
            <Input
              placeholder="请输入员工姓名或工号"
              style={{ width: 170 }}
              allowClear
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item name="deptIds" label="部门">
            <DeptTreeSelect style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="types" label="请假类型">
            <Select
              mode="multiple"
              maxTagCount="responsive"
              placeholder="请选择请假类型"
              options={leaveTypes}
              allowClear
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item name="approvalStatus" label="审批状态">
            <Select
              placeholder="请选择审批状态"
              options={BPM_STATUS_OPTIONS}
              allowClear
              style={{ width: 140 }}
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
          rowKey="id"
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
            showQuickJumper: true
          }}
          onChange={handleTableChange}
        />
      </Card>
    </PageContainer>
  )
}

export default HrmAttendanceLeavePage
