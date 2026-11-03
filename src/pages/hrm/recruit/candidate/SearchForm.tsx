import React, { useEffect, useMemo, useState } from 'react'
import { Button, Col, DatePicker, Dropdown, Form, Input, InputNumber, Row, Select, Space } from 'antd'
import type { MenuProps } from 'antd'
import {
  ClearOutlined,
  DownOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SlidersOutlined,
  UpOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { getRecruitPostSimpleList } from '@/api/hrm/recruit/post'
import { getRecruitChannelSimpleList } from '@/api/hrm/recruit/channel'
import { getSimpleUserList } from '@/api/system/user'
import { RECRUIT_CANDIDATE_EDUCATION_OPTIONS, SEX_OPTIONS } from '@/utils/constantsValue'
import { getEmployeeOptions } from './options'

const { RangePicker } = DatePicker

export type CandidateSearchParams = Record<string, any>

export type BatchCommand = 'status' | 'interview' | 'post' | 'channel' | 'eliminate' | 'delete'

interface CandidateSearchFormProps {
  onSearch: (values: CandidateSearchParams) => void
  onCreate: () => void
  onClean: () => void
  onBatchCommand: (command: BatchCommand) => void
  batchMenuItems: MenuProps['items']
  batchDisabled: boolean
}

const toRange = (value?: any[]) =>
  value && value.length === 2
    ? [dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss'), dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')]
    : undefined

// 组装接口参数：把时间范围转换成后端需要的数组格式，并剔除空值
const buildParams = (values: Record<string, any>): CandidateSearchParams => {
  const params: CandidateSearchParams = {
    ...values,
    interviewTime: toRange(values.interviewTime),
    createTime: toRange(values.createTime)
  }
  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (value === undefined || value === null || value === '') {
      delete params[key]
    }
  })
  return params
}

const CandidateSearchForm: React.FC<CandidateSearchFormProps> = ({
  onSearch,
  onCreate,
  onClean,
  onBatchCommand,
  batchMenuItems,
  batchDisabled
}) => {
  const [form] = Form.useForm()
  const [expanded, setExpanded] = useState<boolean>(false)
  const [postOptions, setPostOptions] = useState<{ label: string; value: number }[]>([])
  const [channelOptions, setChannelOptions] = useState<{ label: string; value: number }[]>([])
  const [employeeOptions, setEmployeeOptions] = useState<{ label: string; value: number }[]>([])
  const [userOptions, setUserOptions] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    getRecruitPostSimpleList()
      .then((resp) =>
        setPostOptions(
          resp.data
            ?.filter((item) => item.id !== undefined)
            .map((item) => ({ label: item.postName || '-', value: item.id as number })) || []
        )
      )
      .catch(() => setPostOptions([]))
    getRecruitChannelSimpleList()
      .then((resp) =>
        setChannelOptions(resp.data?.map((item) => ({ label: item.name, value: item.id })) || [])
      )
      .catch(() => setChannelOptions([]))
    getEmployeeOptions()
      .then(setEmployeeOptions)
      .catch(() => setEmployeeOptions([]))
    getSimpleUserList()
      .then((resp) =>
        setUserOptions(resp.data?.map((item) => ({ label: item.nickname, value: item.id })) || [])
      )
      .catch(() => setUserOptions([]))
  }, [])

  const handleReset = () => {
    form.resetFields()
    onSearch({})
  }

  const rangeItemStyle = useMemo(() => ({ width: '50%' }), [])

  return (
    <Form
      form={form}
      colon={false}
      labelAlign="right"
      onFinish={(values) => onSearch(buildParams(values))}
    >
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name="search" label="候选人">
            <Input placeholder="请输入姓名、手机号或邮箱" allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="postId" label="应聘职位">
            <Select
              placeholder="请选择应聘职位"
              allowClear
              showSearch
              optionFilterProp="label"
              options={postOptions}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="ownerEmployeeId" label="招聘负责人">
            <Select
              placeholder="请选择招聘负责人"
              allowClear
              showSearch
              optionFilterProp="label"
              options={employeeOptions}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="channelId" label="招聘渠道">
            <Select
              placeholder="请选择招聘渠道"
              allowClear
              showSearch
              optionFilterProp="label"
              options={channelOptions}
            />
          </Form.Item>
        </Col>

        {expanded && (
          <>
            <Col span={6}>
              <Form.Item name="sex" label="性别">
                <Select placeholder="请选择性别" allowClear options={SEX_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="年龄">
                <Space.Compact block>
                  <Form.Item name="minAge" noStyle>
                    <InputNumber
                      style={rangeItemStyle}
                      placeholder="最小年龄"
                      min={0}
                      max={99}
                      precision={0}
                    />
                  </Form.Item>
                  <Form.Item name="maxAge" noStyle>
                    <InputNumber
                      style={rangeItemStyle}
                      placeholder="最大年龄"
                      min={0}
                      max={99}
                      precision={0}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="工作年限">
                <Space.Compact block>
                  <Form.Item name="minWorkTime" noStyle>
                    <InputNumber
                      style={rangeItemStyle}
                      placeholder="最小年限"
                      min={0}
                      max={60}
                      precision={0}
                    />
                  </Form.Item>
                  <Form.Item name="maxWorkTime" noStyle>
                    <InputNumber
                      style={rangeItemStyle}
                      placeholder="最大年限"
                      min={0}
                      max={60}
                      precision={0}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="education" label="学历">
                <Select
                  placeholder="请选择学历"
                  allowClear
                  options={RECRUIT_CANDIDATE_EDUCATION_OPTIONS}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="graduateSchool" label="毕业院校">
                <Input placeholder="请输入毕业院校" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="latestWorkPlace" label="最近单位">
                <Input placeholder="请输入最近工作单位" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="interviewEmployeeId" label="面试官">
                <Select
                  placeholder="请选择面试官"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={employeeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="interviewTime" label="面试时间">
                <RangePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="creator" label="创建人">
                <Select
                  placeholder="请选择创建人"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={userOptions}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="createTime" label="创建时间">
                <RangePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      <Space size={12} wrap>
        <Button icon={<SearchOutlined />} onClick={() => form.submit()}>
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
        <Dropdown
          disabled={batchDisabled}
          menu={{ items: batchMenuItems, onClick: ({ key }) => onBatchCommand(key as BatchCommand) }}
        >
          <Button type="primary" ghost disabled={batchDisabled} icon={<SlidersOutlined />}>
            批量操作
            <DownOutlined />
          </Button>
        </Dropdown>
        <Button color="orange" variant="outlined" icon={<ClearOutlined />} onClick={onClean}>
          一键清理
        </Button>
      </Space>
    </Form>
  )
}

export default CandidateSearchForm
