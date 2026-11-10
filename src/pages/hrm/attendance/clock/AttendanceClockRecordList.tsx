import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import download from '@/utils/download'
import * as AttendanceClockApi from '@/api/hrm/attendance/clock'
import { HrmAttendanceClockSourceEnum } from '@/utils/constants'
import {
  ATTENDANCE_CLOCK_SOURCE,
  ATTENDANCE_CLOCK_SOURCE_OPTIONS,
  ATTENDANCE_CLOCK_STATUS,
  ATTENDANCE_CLOCK_TYPE,
  ATTENDANCE_CLOCK_TYPE_OPTIONS
} from '@/utils/constantsValue'
import { formatHrmDateTime } from '@/pages/hrm/utils/format'
import { getMonthRange } from '@/pages/hrm/attendance/utils'
import DeptTreeSelect from '@/pages/hrm/attendance/components/DeptTreeSelect'
import AttendanceClockForm, { type AttendanceClockFormRef } from './AttendanceClockForm'

const AttendanceClockRecordList: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [batchDeleteLoading, setBatchDeleteLoading] = useState(false)
  const [list, setList] = useState<API.HrmAttendanceClockRespVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs())
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()

  const formRef = useRef<AttendanceClockFormRef>(null)

  const isManualClock = (row: API.HrmAttendanceClockRespVO) => {
    return row.sourceType === HrmAttendanceClockSourceEnum.MANUAL.source
  }

  const getQueryParams = (page = pageNo, size = pageSize) => {
    const values = form.getFieldsValue()
    const [start, end] = getMonthRange(selectedMonth)
    return {
      pageNo: page,
      pageSize: size,
      search: values.search?.trim() || undefined,
      deptIds: values.deptIds && values.deptIds.length > 0 ? values.deptIds : undefined,
      type: values.type !== undefined ? values.type : undefined,
      address: values.address?.trim() || undefined,
      sourceTypes:
        values.sourceTypes && values.sourceTypes.length > 0 ? values.sourceTypes : undefined,
      attendanceTime: [start, end]
    }
  }

  const getList = async (page = pageNo, size = pageSize) => {
    setLoading(true)
    try {
      const resp = await AttendanceClockApi.getAttendanceClockPage(
        getQueryParams(page, size) as any
      )
      setList(resp.data?.list || [])
      setTotal(resp.data?.total || 0)
      setSelectedRowKeys([])
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

  const handleDelete = (id?: number) => {
    if (!id) return
    Modal.confirm({
      title: '确认删除该打卡记录吗？',
      content: '删除后会立即影响日/月考勤统计。',
      onOk: async () => {
        try {
          await AttendanceClockApi.deleteAttendanceClock({ id })
          message.success('删除成功')
          getList(pageNo, pageSize)
        } catch (err: any) {
          message.error(err?.message || '删除失败')
        }
      }
    })
  }

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return
    Modal.confirm({
      title: `确定删除选中的 ${selectedRowKeys.length} 条打卡记录吗？`,
      content: '删除后会立即影响日/月考勤统计。',
      onOk: async () => {
        setBatchDeleteLoading(true)
        try {
          await AttendanceClockApi.deleteAttendanceClockList({
            ids: selectedRowKeys as number[]
          } as any)
          message.success('批量删除成功')
          getList(pageNo, pageSize)
        } catch (err: any) {
          message.error(err?.message || '批量删除失败')
        } finally {
          setBatchDeleteLoading(false)
        }
      }
    })
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const data: any = await AttendanceClockApi.exportAttendanceClock(
        getQueryParams(pageNo, pageSize) as any
      )
      download.excel(data, '打卡记录.xls')
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

  const columns: ColumnsType<API.HrmAttendanceClockRespVO> = [
    {
      title: '员工',
      dataIndex: 'employeeName',
      width: 110,
      ellipsis: true
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      width: 100,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      width: 120,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      width: 120,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '打卡类型',
      dataIndex: 'type',
      width: 100,
      render: (val) => {
        const item = ATTENDANCE_CLOCK_TYPE[val]
        return <Tag color="blue">{item?.text || '-'}</Tag>
      }
    },
    {
      title: '应打卡时间',
      dataIndex: 'attendanceTime',
      width: 170,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '打卡时间',
      dataIndex: 'clockTime',
      width: 170,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (val) => {
        const item = ATTENDANCE_CLOCK_STATUS[val]
        const color = val === 1 ? 'success' : val ? 'error' : 'default'
        return <Tag color={color}>{item?.text || '-'}</Tag>
      }
    },
    {
      title: '打卡来源',
      dataIndex: 'sourceType',
      width: 110,
      render: (val) => {
        const item = ATTENDANCE_CLOCK_SOURCE[val]
        return <Tag color={val === 2 ? 'orange' : 'cyan'}>{item?.text || '-'}</Tag>
      }
    },
    {
      title: '打卡地点',
      dataIndex: 'address',
      width: 140,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      minWidth: 140,
      ellipsis: true,
      render: (val) => val || '-'
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        const manual = isManualClock(record)
        return (
          <Space size={8}>
            <Button
              type="link"
              size="small"
              disabled={!manual}
              onClick={() => formRef.current?.open('update', record.id)}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              size="small"
              disabled={!manual}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    getCheckboxProps: (record: API.HrmAttendanceClockRespVO) => ({
      disabled: !isManualClock(record)
    })
  }

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
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item name="search" label="员工">
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
          <Form.Item name="type" label="打卡类型">
            <Select
              placeholder="请选择打卡类型"
              options={ATTENDANCE_CLOCK_TYPE_OPTIONS}
              allowClear
              style={{ width: 140 }}
            />
          </Form.Item>
          <Form.Item name="address" label="地点">
            <Input
              placeholder="请输入打卡地点"
              style={{ width: 140 }}
              allowClear
              onPressEnter={handleQuery}
            />
          </Form.Item>
          <Form.Item name="sourceTypes" label="打卡来源">
            <Select
              mode="multiple"
              maxTagCount="responsive"
              placeholder="请选择打卡来源"
              options={ATTENDANCE_CLOCK_SOURCE_OPTIONS}
              allowClear
              style={{ width: 160 }}
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
              <Button
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={() => formRef.current?.open('create')}
              >
                新增
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                loading={batchDeleteLoading}
                onClick={handleBatchDelete}
              >
                批量删除
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
          rowSelection={rowSelection}
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

      <AttendanceClockForm ref={formRef} onSuccess={() => getList(pageNo, pageSize)} />
    </div>
  )
}

export default AttendanceClockRecordList
