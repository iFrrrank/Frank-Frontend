import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
  Tabs,
  Typography,
  message
} from 'antd'
import {
  CalculatorOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SendOutlined
} from '@ant-design/icons'
import {
  createNextMonthRecord,
  deleteMonthRecord,
  getLastMonthRecord,
  getMonthOptionSummary
} from '@/api/hrm/salary/monthRecord'
import {
  getMonthEmployeeChangeCount,
  getMonthEmployeeRecordPage
} from '@/api/hrm/salary/monthEmployeeRecord'
import { textConst } from '@/locales/zh-CN'
import { formatHrmDateRange, formatHrmDays, formatHrmMoney } from '@/pages/hrm/utils/format'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import { HrmSalaryEmployeeChangeType, HrmSalaryMonthStatus } from '../constants'
import SalaryPayrollReadinessAlert, {
  SalaryPayrollReadinessAlertRef
} from './SalaryPayrollReadinessAlert'
import SalaryMonthComputeForm from './SalaryMonthComputeForm'
import SalaryBatchEmployeeRecordForm from './SalaryBatchEmployeeRecordForm'
import SalarySlipSendForm from '../slip/send-record/SalarySlipSendForm'

const SalaryMonthRecordPage: React.FC = () => {
  const [form] = Form.useForm()
  const readinessAlertRef = useRef<SalaryPayrollReadinessAlertRef>(null)

  const [pageLoading, setPageLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [record, setRecord] = useState<API.HrmSalaryMonthRecordRespVO>()

  // 异动分类及分页
  const [activeTab, setActiveTab] = useState<number>(HrmSalaryEmployeeChangeType.ALL)
  const [changeCounts, setChangeCounts] = useState<Record<number, number>>({})
  const [employeeList, setEmployeeList] = useState<API.HrmSalaryMonthEmployeeRecordRespVO[]>([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [summaryMap, setSummaryMap] = useState<Record<number, number>>({})

  // 弹窗状态
  const [computeModalVisible, setComputeModalVisible] = useState(false)
  const [batchEditVisible, setBatchEditVisible] = useState(false)
  const [slipSendVisible, setSlipSendVisible] = useState(false)
  const [createNextLoading, setCreateNextLoading] = useState(false)

  const isArchived = record?.status === HrmSalaryMonthStatus.HISTORY
  const isComputed = record?.status === HrmSalaryMonthStatus.COMPUTED
  const isWritable = !isArchived && !!record?.id

  // 获取明细叶子薪资项
  const leafOptions = (record?.optionHeaders || []).flatMap((cat) => (cat as any).children || [])

  // 加载主记录
  const loadRecord = async (): Promise<API.HrmSalaryMonthRecordRespVO | undefined> => {
    setPageLoading(true)
    try {
      const resp = await getLastMonthRecord()
      const data = resp.data
      setRecord(data)
      return data
    } finally {
      setPageLoading(false)
    }
  }

  // 加载异动人数
  const loadChangeCounts = async (recordId: number) => {
    const filter = form.getFieldsValue()
    try {
      const resp = await getMonthEmployeeChangeCount({
        monthRecordId: recordId,
        ...filter
      } as any)
      setChangeCounts(resp.data || {})
    } catch {
      setChangeCounts({})
    }
  }

  // 加载表格与汇总数据
  const loadTableData = async (
    recordId: number,
    tab = activeTab,
    page = pageNo,
    size = pageSize
  ) => {
    setTableLoading(true)
    try {
      const filter = form.getFieldsValue()
      const params = {
        monthRecordId: recordId,
        employeeChangeType: tab,
        pageNo: page,
        pageSize: size,
        ...filter
      }

      const [pageResp, summaryResp] = await Promise.all([
        getMonthEmployeeRecordPage(params as any),
        getMonthOptionSummary({
          monthRecordId: recordId,
          employeeChangeType: tab,
          ...filter
        } as any)
      ])

      setEmployeeList(pageResp.data?.list || [])
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
      setTableLoading(false)
    }
  }

  // 刷新全量数据
  const refreshAll = async () => {
    const curRecord = await loadRecord()
    if (curRecord?.id) {
      setPageNo(1)
      await Promise.all([
        loadChangeCounts(curRecord.id),
        loadTableData(curRecord.id, activeTab, 1, pageSize),
        readinessAlertRef.current?.refresh()
      ])
    }
  }

  useEffect(() => {
    refreshAll()
  }, [])

  // 切换异动标签
  const handleTabChange = (key: string) => {
    const tab = Number(key)
    setActiveTab(tab)
    setPageNo(1)
    if (record?.id) {
      loadTableData(record.id, tab, 1, pageSize)
    }
  }

  // 搜索
  const handleSearch = () => {
    setPageNo(1)
    if (record?.id) {
      loadChangeCounts(record.id)
      loadTableData(record.id, activeTab, 1, pageSize)
    }
  }

  // 重置
  const handleReset = () => {
    form.resetFields()
    setPageNo(1)
    if (record?.id) {
      loadChangeCounts(record.id)
      loadTableData(record.id, activeTab, 1, pageSize)
    }
  }

  // 初始化工资表
  const handleInitRecord = async () => {
    setCreateNextLoading(true)
    try {
      await createNextMonthRecord()
      message.success('初始化成功')
      await refreshAll()
    } finally {
      setCreateNextLoading(false)
    }
  }

  // 创建下月工资表
  const handleCreateNext = () => {
    Modal.confirm({
      title: '确认创建下月工资表',
      content: '新建下月工资表后，当前工资表将归入历史工资且不可修改。请确认要新建下月工资表吗？',
      onOk: async () => {
        await createNextMonthRecord()
        message.success('创建成功')
        await refreshAll()
      }
    })
  }

  // 删除当前工资表
  const handleDeleteRecord = () => {
    if (!record?.id) return
    Modal.confirm({
      title: '确认删除工资表',
      content:
        '删除当前工资表后，上月工资表将恢复为当前工资表且支持修改。请确认要删除当前工资表吗？',
      onOk: async () => {
        await deleteMonthRecord({ id: record.id! })
        message.success(textConst.msg.delSuccess)
        await refreshAll()
      }
    })
  }

  const changeTabs = [
    {
      key: String(HrmSalaryEmployeeChangeType.ALL),
      label: `计薪人数 (${changeCounts[HrmSalaryEmployeeChangeType.ALL] || 0})`
    },
    {
      key: String(HrmSalaryEmployeeChangeType.ENTRY),
      label: `新入职 (${changeCounts[HrmSalaryEmployeeChangeType.ENTRY] || 0})`
    },
    {
      key: String(HrmSalaryEmployeeChangeType.LEAVE),
      label: `离职 (${changeCounts[HrmSalaryEmployeeChangeType.LEAVE] || 0})`
    },
    {
      key: String(HrmSalaryEmployeeChangeType.REGULAR),
      label: `转正 (${changeCounts[HrmSalaryEmployeeChangeType.REGULAR] || 0})`
    },
    {
      key: String(HrmSalaryEmployeeChangeType.TRANSFER),
      label: `调岗 (${changeCounts[HrmSalaryEmployeeChangeType.TRANSFER] || 0})`
    }
  ]

  const columns = [
    {
      title: '姓名',
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
    {
      title: '计薪天数',
      dataIndex: 'needWorkDay',
      key: 'needWorkDay',
      align: 'right' as const,
      width: 110,
      render: (val: any) => formatHrmDays(val)
    },
    {
      title: '实际计薪天数',
      dataIndex: 'actualWorkDay',
      key: 'actualWorkDay',
      align: 'right' as const,
      width: 120,
      render: (val: any) => formatHrmDays(val)
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

  if (!record?.id && !pageLoading) {
    return (
      <Card>
        <Empty description="暂无月度工资表">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={createNextLoading}
            onClick={handleInitRecord}
          >
            初始化月度工资表
          </Button>
        </Empty>
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card loading={pageLoading} bodyStyle={{ padding: 16 }}>
        {/* 顶部标题与计薪周期 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            月度工资表
          </Typography.Title>
          <span style={{ marginLeft: 12, color: '#8c8c8c', fontSize: 14 }}>
            （计薪周期：{formatHrmDateRange(record?.startTime, record?.endTime)}）
          </span>
        </div>

        {/* 搜索工作栏与功能按钮组 */}
        <Form form={form} layout="inline">
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
            <Space wrap>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
              {isWritable && (
                <Button icon={<EditOutlined />} onClick={() => setBatchEditVisible(true)}>
                  在线编辑
                </Button>
              )}
              {isWritable && (
                <Button
                  type="primary"
                  icon={<CalculatorOutlined />}
                  onClick={() => setComputeModalVisible(true)}
                >
                  核算工资
                </Button>
              )}
              {isComputed && (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => setSlipSendVisible(true)}
                >
                  发送工资条
                </Button>
              )}
              <Button icon={<PlusOutlined />} onClick={handleCreateNext}>
                创建下月工资表
              </Button>
              {isWritable && (
                <Button danger icon={<DeleteOutlined />} onClick={handleDeleteRecord}>
                  删除工资表
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>

        {isArchived && (
          <Alert
            message="当前工资表已归档，仅可查询。"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        )}

        {/* 准备状态提示 */}
        <SalaryPayrollReadinessAlert ref={readinessAlertRef} monthRecordId={record?.id} />
      </Card>

      <Card bodyStyle={{ padding: 16 }}>
        {/* 异动分类标签页 */}
        <Tabs activeKey={String(activeTab)} items={changeTabs} onChange={handleTabChange} />

        {/* 员工工资列表 */}
        <Table
          loading={tableLoading}
          columns={columns}
          dataSource={employeeList}
          rowKey="id"
          pagination={false}
          size="small"
          bordered
          scroll={{ x: 'max-content' }}
          summary={() => {
            if (!employeeList.length) return null
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 600 }}>
                  <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                  {leafOptions.map((opt: API.HrmSalaryOptionRespVO, i: number) => (
                    <Table.Summary.Cell index={6 + i} key={opt.code} align="right">
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
              if (record?.id) {
                loadTableData(record.id, activeTab, p, s)
              }
            }}
          />
        </div>
      </Card>

      {/* 在线编辑弹窗 */}
      <SalaryBatchEmployeeRecordForm
        visible={batchEditVisible}
        setVisible={setBatchEditVisible}
        record={record}
        queryParams={{
          employeeChangeType: activeTab,
          ...form.getFieldsValue()
        }}
        onSuccess={refreshAll}
      />

      {/* 核算工资表弹窗 */}
      <SalaryMonthComputeForm
        visible={computeModalVisible}
        setVisible={setComputeModalVisible}
        record={record}
        onSuccess={refreshAll}
      />

      {/* 发送工资条弹窗 */}
      <SalarySlipSendForm
        visible={slipSendVisible}
        setVisible={setSlipSendVisible}
        monthRecordId={record?.id}
        onSuccess={refreshAll}
      />
    </div>
  )
}

export default SalaryMonthRecordPage
