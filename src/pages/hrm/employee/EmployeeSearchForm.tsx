import React, { useState } from 'react'
import { Button, Col, Dropdown, Form, Input, Row, Select, Space } from 'antd'
import { DatePicker } from 'antd'
import {
  DownOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UpOutlined,
  UserAddOutlined,
  ImportOutlined,
  DownloadOutlined,
  SlidersOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { EMPLOYEE_TYPE_OPTIONS } from '@/utils/constantsValue'
import { SEX_OPTIONS } from './utils'
import DeptSelect from './components/DeptSelect'
import RecruitChannelSelect from '@/pages/hrm/recruit/channel/components/RecruitChannelSelect'

const { RangePicker } = DatePicker

// 员工搜索表单值（时间范围为 dayjs 数组，请求时转换为字符串）
export interface EmployeeSearchValues {
  name?: string
  mobile?: string
  sex?: number
  entryTime?: [Dayjs, Dayjs]
  jobNumber?: string
  deptId?: number
  postName?: string
  regularTime?: [Dayjs, Dayjs]
  workAddress?: string
  channelId?: number
  type?: number
}

interface EmployeeSearchFormProps {
  onSearch: (values: EmployeeSearchValues) => void
  onReset: () => void
  onCreate: () => void
  onCreateFromUser: () => void
  onImport: () => void
  onExport: () => void
  exportLoading?: boolean
  // 批量操作：选中数量为 0 时禁用
  batchDisabled?: boolean
  batchMenuItems: MenuProps['items']
  onBatchCommand: (command: string) => void
}

// 员工列表搜索工具栏（对应 Vue 版 index.vue 的搜索表单与工具按钮区）
const EmployeeSearchForm: React.FC<EmployeeSearchFormProps> = ({
  onSearch,
  onReset,
  onCreate,
  onCreateFromUser,
  onImport,
  onExport,
  exportLoading,
  batchDisabled,
  batchMenuItems,
  onBatchCommand
}) => {
  const [form] = Form.useForm<EmployeeSearchValues>()
  const [expanded, setExpanded] = useState<boolean>(false)

  /** 搜索：重置到第一页并回传表单值 */
  const handleSearch = () => {
    onSearch(form.getFieldsValue())
  }

  /** 重置：清空表单并回传空值 */
  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Form form={form} onFinish={handleSearch}>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="name" label="员工姓名">
            <Input placeholder="请输入员工姓名" allowClear onPressEnter={() => form.submit()} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="mobile" label="手机号">
            <Input placeholder="请输入手机号" allowClear onPressEnter={() => form.submit()} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="sex" label="性别">
            <Select allowClear placeholder="请选择性别" options={SEX_OPTIONS} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="entryTime" label="入职时间">
            <RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
        </Col>
        {expanded && (
          <>
            <Col span={6}>
              <Form.Item name="jobNumber" label="工号">
                <Input placeholder="请输入工号" allowClear onPressEnter={() => form.submit()} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="deptId" label="部门">
                <DeptSelect placeholder="请选择部门" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="postName" label="岗位">
                <Input placeholder="请输入岗位" allowClear onPressEnter={() => form.submit()} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="regularTime" label="转正时间">
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="workAddress" label="工作地点">
                <Input placeholder="请输入工作地点" allowClear onPressEnter={() => form.submit()} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="channelId" label="招聘渠道">
                <RecruitChannelSelect placeholder="请选择招聘渠道" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="聘用形式">
                <Select allowClear placeholder="请选择聘用形式" options={EMPLOYEE_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      <Space size={12} wrap>
        <Button icon={<SearchOutlined />} htmlType="submit">
          搜索
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
        <Button
          type="link"
          style={{ paddingInline: 0 }}
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '收起' : '展开'}
        </Button>
        <Button type="primary" ghost icon={<PlusOutlined />} onClick={onCreate}>
          新增
        </Button>
        <Button type="primary" ghost icon={<UserAddOutlined />} onClick={onCreateFromUser}>
          从后台用户建档
        </Button>
        <Button color="orange" variant="outlined" icon={<ImportOutlined />} onClick={onImport}>
          导入
        </Button>
        <Button
          color="green"
          variant="outlined"
          icon={<DownloadOutlined />}
          loading={exportLoading}
          onClick={onExport}
        >
          导出
        </Button>
        <Dropdown
          disabled={batchDisabled}
          menu={{ items: batchMenuItems, onClick: ({ key }) => onBatchCommand(key) }}
        >
          <Button type="primary" ghost disabled={batchDisabled} icon={<SlidersOutlined />}>
            批量操作
            <DownOutlined />
          </Button>
        </Dropdown>
      </Space>
    </Form>
  )
}

export default EmployeeSearchForm
