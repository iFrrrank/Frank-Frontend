import React, { useRef, useState } from 'react'
import { Button, Card, DatePicker, Form, Modal, Select, Space, message } from 'antd'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { deleteAttendanceHoliday, getAttendanceHolidayPage } from '@/api/hrm/attendance/holiday'
import { ATTENDANCE_HOLIDAY_TYPE, ATTENDANCE_HOLIDAY_TYPE_OPTIONS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { formatDateText, formatDateTime, getDateRangeFromArray } from '../../utils'
import AttendanceHolidayForm from './AttendanceHolidayForm'

const { confirm } = Modal
const { RangePicker } = DatePicker

// 考勤节假日列表
const AttendanceHolidayPage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const [form] = Form.useForm()
  // 查询条件；_t 用于相同条件重复点击“搜索”时也能强制刷新
  const [query, setQuery] = useState<Record<string, any>>({ _t: 0 })
  const [formVisible, setFormVisible] = useState(false)
  const [currentId, setCurrentId] = useState<number | undefined>(undefined)

  const reload = () => actionRef.current?.reload()

  const handleSearch = () => {
    const values = form.getFieldsValue()
    setQuery({
      type: values.type,
      date: values.date?.map((item: Dayjs) => item.format('YYYY-MM-DD')),
      _t: Date.now()
    })
  }

  const handleReset = () => {
    form.resetFields()
    setQuery({ _t: Date.now() })
  }

  const handleOpenForm = (id?: number) => {
    setCurrentId(id)
    setFormVisible(true)
  }

  const handleDelete = (record: API.HrmAttendanceHolidayRespVO) => {
    if (record.id === undefined) return
    confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: textConst.msg.delOneMsg,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteAttendanceHoliday({ id: record.id as number })
          message.success(textConst.msg.delSuccess)
          reload()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  const columns: ProColumns<API.HrmAttendanceHolidayRespVO>[] = [
    { title: '编号', dataIndex: 'id', align: 'center', width: 100 },
    {
      title: '日期',
      dataIndex: 'date',
      align: 'center',
      width: 180,
      render: (_, record) => formatDateText(record.date)
    },
    {
      title: '日期类型',
      dataIndex: 'type',
      align: 'center',
      width: 140,
      valueEnum: ATTENDANCE_HOLIDAY_TYPE
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
      render: (_, record) => formatDateTime(record.createTime)
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => handleOpenForm(record.id)}>
            编辑
          </a>
          <a key="delete" style={deleteTextStyle} onClick={() => handleDelete(record)}>
            删除
          </a>
        </div>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card variant="borderless" styles={{ body: { paddingBottom: 0 } }}>
        <Form form={form} layout="inline" colon={false} onFinish={handleSearch}>
          <Form.Item name="date" label="日期" style={{ marginBottom: 24 }}>
            <RangePicker
              style={{ width: 360 }}
              placeholder={['开始日期', '结束日期']}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item name="type" label="日期类型" style={{ marginBottom: 24 }}>
            <Select
              allowClear
              style={{ width: 240 }}
              placeholder="请选择日期类型"
              options={ATTENDANCE_HOLIDAY_TYPE_OPTIONS}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 24 }}>
            <Space>
              <Button icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              <Button
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={() => handleOpenForm(undefined)}
              >
                新增
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card variant="borderless">
        <ProTable<API.HrmAttendanceHolidayRespVO>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={false}
          options={false}
          scroll={{ x: 'max-content' }}
          pagination={{ align: 'center', showSizeChanger: true }}
          params={query}
          request={async (params) => {
            const { current, pageSize, _t, date, ...rest } = params
            try {
              const resp = await getAttendanceHolidayPage({
                pageReqVO: {
                  pageNo: current || 1,
                  pageSize: pageSize || 10,
                  ...rest,
                  date: getDateRangeFromArray(date)
                }
              } as API.getAttendanceHolidayPageParams)
              return {
                data: resp.data?.list || [],
                success: resp.code === 0,
                total: resp.data?.total || 0
              }
            } catch {
              return { data: [], success: false, total: 0 }
            }
          }}
        />
      </Card>

      <AttendanceHolidayForm
        visible={formVisible}
        setVisible={setFormVisible}
        id={currentId}
        onSuccess={() => {
          setFormVisible(false)
          reload()
        }}
      />
    </div>
  )
}

export default AttendanceHolidayPage
