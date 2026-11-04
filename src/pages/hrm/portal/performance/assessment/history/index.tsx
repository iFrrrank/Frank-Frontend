import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Form, Input, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import * as PerformanceAssessmentApi from '@/api/hrm/portal/performance'
import { formatHrmDate, formatHrmDateTime, formatHrmScore } from '@/pages/hrm/utils/format'
import { checkHrmPortalAccess } from '@/pages/hrm/portal/utils'
import PerformanceAssessmentDetail, { type PerformanceAssessmentDetailRef } from '../detail'

const HrmPortalPerformanceHistoryPage: React.FC = () => {
  const [accessible, setAccessible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<PerformanceAssessmentApi.PortalPerformanceAssessmentSummaryVO[]>(
    []
  )
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [form] = Form.useForm()

  const detailRef = useRef<PerformanceAssessmentDetailRef>(null)

  const getList = async (page = pageNo, size = pageSize) => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      const resp = await PerformanceAssessmentApi.getPerformanceAssessmentPage({
        pageNo: page,
        pageSize: size,
        search: values.search?.trim() || undefined,
        archived: true
      })
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
    setPageNo(1)
    getList(1, pageSize)
  }

  useEffect(() => {
    const init = async () => {
      const ok = await checkHrmPortalAccess()
      if (!ok) return
      setAccessible(true)
      await getList(1, pageSize)
    }
    init()
  }, [])

  if (!accessible) {
    return null
  }

  const columns: ColumnsType<PerformanceAssessmentApi.PortalPerformanceAssessmentSummaryVO> = [
    {
      title: '考核名称',
      dataIndex: 'name',
      minWidth: 220,
      ellipsis: true
    },
    {
      title: '考核周期',
      minWidth: 210,
      render: (_, record) =>
        `${formatHrmDate(record.startTime)} 至 ${formatHrmDate(record.endTime)}`
    },
    {
      title: '绩效得分',
      dataIndex: 'score',
      width: 110,
      align: 'center',
      render: (val) => formatHrmScore(val)
    },
    {
      title: '绩效等级',
      dataIndex: 'resultLevel',
      width: 110,
      align: 'center',
      render: (val) =>
        val ? (
          <Tag color="success" bordered={false}>
            {val}
          </Tag>
        ) : (
          '-'
        )
    },
    {
      title: '绩效系数',
      dataIndex: 'coefficient',
      width: 100,
      align: 'center',
      render: (val) => val ?? '-'
    },
    {
      title: '归档时间',
      dataIndex: 'archiveTime',
      width: 180,
      render: (val) => formatHrmDateTime(val)
    },
    {
      title: '操作',
      fixed: 'right',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => detailRef.current?.open(record)}>
          查看
        </Button>
      )
    }
  ]

  return (
    <PageContainer header={{ title: '绩效档案' }}>
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="search" label="考核名称">
            <Input
              placeholder="请输入考核名称"
              style={{ width: 240 }}
              allowClear
              onPressEnter={handleQuery}
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

      <PerformanceAssessmentDetail ref={detailRef} />
    </PageContainer>
  )
}

export default HrmPortalPerformanceHistoryPage
