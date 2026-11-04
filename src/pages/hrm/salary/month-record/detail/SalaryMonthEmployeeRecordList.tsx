import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Pagination, Space, Table } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { getMonthRecordPage, getMonthOptionSummary } from '@/api/hrm/salary/monthRecord'
import { getMonthEmployeeRecordPage } from '@/api/hrm/salary/monthEmployeeRecord'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'

interface SalaryMonthEmployeeRecordListProps {
  record: API.HrmSalaryMonthRecordRespVO
}

const SalaryMonthEmployeeRecordList: React.FC<SalaryMonthEmployeeRecordListProps> = ({
  record
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<API.HrmSalaryMonthEmployeeRecordRespVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [summaryMap, setSummaryMap] = useState<Record<number, number>>({})

  // 展开所有底层薪资项
  const leafOptions = (record.optionHeaders || []).flatMap((cat) => (cat as any).children || [])

  const loadData = async (page = pageNo, size = pageSize) => {
    if (!record.id) return
    setLoading(true)
    try {
      const formValues = form.getFieldsValue()
      const params = {
        monthRecordId: record.id,
        pageNo: page,
        pageSize: size,
        ...formValues
      }

      const [pageResp, summaryResp] = await Promise.all([
        getMonthEmployeeRecordPage(params as any),
        getMonthOptionSummary({
          monthRecordId: record.id,
          ...formValues
        } as any)
      ])

      setList(pageResp.data?.list || [])
      setTotal(pageResp.data?.total || 0)

      const summaries = summaryResp.data || []
      const map: Record<number, number> = {}
      summaries.forEach((item: API.HrmSalaryOptionValueVO) => {
        if (item.code !== undefined) {
          map[item.code] = Number(item.value || 0)
        }
      })
      setSummaryMap(map)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(1, pageSize)
  }, [record.id])

  const handleSearch = () => {
    setPageNo(1)
    loadData(1, pageSize)
  }

  const handleReset = () => {
    form.resetFields()
    setPageNo(1)
    loadData(1, pageSize)
  }

  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      fixed: 'left' as const,
      width: 120
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      fixed: 'left' as const,
      width: 110
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 130
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      key: 'postName',
      width: 130
    },
    ...leafOptions.map((opt: API.HrmSalaryOptionRespVO) => ({
      title: opt.name,
      dataIndex: `opt_${opt.code}`,
      key: `opt_${opt.code}`,
      align: 'right' as const,
      width: 130,
      render: (_: any, row: API.HrmSalaryMonthEmployeeRecordRespVO) => {
        const val = row.optionValues?.find((v) => v.code === opt.code)?.value
        return formatHrmMoney(val)
      }
    }))
  ]

  return (
    <Card bodyStyle={{ padding: 16 }}>
      {/* 搜索工作栏 */}
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="employeeName" label="员工姓名">
          <Input placeholder="请输入员工姓名" allowClear />
        </Form.Item>
        <Form.Item name="jobNumber" label="工号">
          <Input placeholder="请输入工号" allowClear />
        </Form.Item>
        <Form.Item name="deptId" label="部门">
          <div style={{ width: 180 }}>
            <DeptSelect placeholder="请选择部门" />
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* 员工工资列表 */}
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
        scroll={{ x: 'max-content' }}
        summary={() => {
          if (!list.length) return null
          return (
            <Table.Summary fixed>
              <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 600 }}>
                <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                {leafOptions.map((opt: API.HrmSalaryOptionRespVO, i: number) => (
                  <Table.Summary.Cell index={4 + i} key={opt.code} align="right">
                    {opt.code !== undefined ? formatHrmMoney(summaryMap[opt.code]) : '-'}
                  </Table.Summary.Cell>
                ))}
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={pageNo}
          pageSize={pageSize}
          total={total}
          size="small"
          showSizeChanger
          onChange={(p, s) => {
            setPageNo(p)
            setPageSize(s)
            loadData(p, s)
          }}
        />
      </div>
    </Card>
  )
}

export default SalaryMonthEmployeeRecordList
