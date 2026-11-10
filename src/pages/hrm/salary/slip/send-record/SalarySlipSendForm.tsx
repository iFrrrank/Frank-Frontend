import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  message
} from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { getSalarySlipSendEmployeePage, sendSalarySlip } from '@/api/hrm/salary/slipSendRecord'
import {
  createSalarySlipTemplate,
  deleteSalarySlipTemplate,
  getSalarySlipTemplateList
} from '@/api/hrm/salary/slipTemplate'
import { textConst } from '@/locales/zh-CN'
import { formatHrmMoney } from '@/pages/hrm/utils/format'
import DeptSelect from '@/pages/hrm/employee/components/DeptSelect'
import SalarySlipTemplateOptionEditor, {
  SlipTemplateOption
} from '../template/SalarySlipTemplateOptionEditor'
import SalarySlipTemplateForm from '../template/SalarySlipTemplateForm'
import {
  HrmSalaryOptionCategoryCode,
  HrmSalaryOptionCode,
  HrmSalarySlipTemplateOptionType
} from '../../constants'

interface SalarySlipSendFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  monthRecordId?: number
  onSuccess?: () => void
}

const SalarySlipSendForm: React.FC<SalarySlipSendFormProps> = ({
  visible,
  setVisible,
  monthRecordId,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  // 模板相关
  const [templateLoading, setTemplateLoading] = useState(false)
  const [templateList, setTemplateList] = useState<API.HrmSalarySlipTemplateRespVO[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>()
  const [sendTemplate, setSendTemplate] = useState<API.HrmSalarySlipTemplateRespVO>()

  // 模板表单弹窗
  const [templateFormVisible, setTemplateFormVisible] = useState(false)
  const [editTemplateId, setEditTemplateId] = useState<number>()

  // 另存为模板弹窗
  const [saveAsVisible, setSaveAsVisible] = useState(false)
  const [saveAsName, setSaveAsName] = useState('')
  const [saveAsLoading, setSaveAsLoading] = useState(false)

  // 待发员工相关
  const [employeeLoading, setEmployeeLoading] = useState(false)
  const [employeeList, setEmployeeList] = useState<API.HrmSalarySlipSendEmployeeRespVO[]>([])
  const [employeeTotal, setEmployeeTotal] = useState(0)
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([])

  // 员工筛选
  const [filterSearch, setFilterSearch] = useState<string>()
  const [filterDeptId, setFilterDeptId] = useState<number>()
  const [filterSent, setFilterSent] = useState<boolean | undefined>(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [sendLoading, setSendLoading] = useState(false)

  const selectedTemplate = templateList.find((t) => t.id === selectedTemplateId)

  // 加载模板列表
  const loadTemplates = async (preferredId?: number) => {
    setTemplateLoading(true)
    try {
      const resp = await getSalarySlipTemplateList()
      const list = resp.data || []
      setTemplateList(list)

      const targetId =
        preferredId || selectedTemplateId || list.find((t) => t.defaultStatus)?.id || list[0]?.id

      setSelectedTemplateId(targetId)
      handleTemplateSelectChange(targetId, list)
    } finally {
      setTemplateLoading(false)
    }
  }

  const handleTemplateSelectChange = (id?: number, list = templateList) => {
    setSelectedTemplateId(id)
    const target = list.find((item) => item.id === id)
    if (target) {
      setSendTemplate({
        ...target,
        options: (target.options || []).map((item) => ({
          ...item,
          parentCode:
            item.parentCode === HrmSalaryOptionCategoryCode.ROOT ? undefined : item.parentCode
        }))
      })
    } else {
      setSendTemplate(undefined)
    }
  }

  // 加载员工数据
  const loadEmployees = async (page = pageNo, size = pageSize) => {
    if (!monthRecordId) return
    setEmployeeLoading(true)
    try {
      const resp = await getSalarySlipSendEmployeePage({
        monthRecordId,
        pageNo: page,
        pageSize: size,
        search: filterSearch,
        deptId: filterDeptId,
        sent: filterSent
      } as any)
      setEmployeeList(resp.data?.list || [])
      setEmployeeTotal(resp.data?.total || 0)
    } finally {
      setEmployeeLoading(false)
    }
  }

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0)
      setSelectedEmployeeIds([])
      return
    }
    loadTemplates()
    setPageNo(1)
    setFilterSearch(undefined)
    setFilterDeptId(undefined)
    setFilterSent(false)
  }, [visible, monthRecordId])

  // 第一步到第二步
  const handleNextStep = () => {
    if (!sendTemplate || !sendTemplate.options?.length) {
      message.warning('请先配置工资条明细')
      return
    }
    const emptyName = sendTemplate.options.find((item) => !item.name?.trim())
    if (emptyName) {
      message.warning('工资条明细项名称不能为空')
      return
    }
    const hasRealPay = sendTemplate.options.some(
      (item) =>
        item.type === HrmSalarySlipTemplateOptionType.ITEM &&
        item.code === HrmSalaryOptionCode.REAL_PAY
    )
    if (!hasRealPay) {
      message.warning('工资条必须包含【实发工资】项')
      return
    }

    setCurrentStep(1)
    loadEmployees(1, pageSize)
  }

  // 格式化本次模板明细
  const getNormalizedOptions = (): API.HrmSalarySlipTemplateOptionVO[] => {
    return (sendTemplate?.options || []).map((item, index) => ({
      ...item,
      sort: index + 1,
      parentCode:
        item.type === HrmSalarySlipTemplateOptionType.CATEGORY
          ? HrmSalaryOptionCategoryCode.ROOT
          : item.parentCode || HrmSalaryOptionCategoryCode.ROOT
    }))
  }

  // 发放工资条
  const handleSubmitSend = async (all: boolean) => {
    if (!monthRecordId || !sendTemplate) return
    if (!all && selectedEmployeeIds.length === 0) {
      message.warning('请选择发放员工')
      return
    }

    setSendLoading(true)
    try {
      await sendSalarySlip({
        monthRecordId,
        hideEmpty: Boolean(sendTemplate.hideEmpty),
        options: getNormalizedOptions(),
        all,
        employeeIds: all ? undefined : selectedEmployeeIds,
        search: all ? filterSearch : undefined,
        deptId: all ? filterDeptId : undefined,
        sent: all ? filterSent : undefined
      })
      message.success(textConst.msg.createSuccess)
      setVisible(false)
      onSuccess?.()
    } finally {
      setSendLoading(false)
    }
  }

  // 另存为模板
  const handleSaveAsTemplate = async () => {
    if (!saveAsName.trim()) {
      message.warning('请输入新模板名称')
      return
    }
    if (saveAsName.length > 64) {
      message.warning('模板名称不能超过 64 个字符')
      return
    }

    setSaveAsLoading(true)
    try {
      const resp = await createSalarySlipTemplate({
        name: saveAsName.trim(),
        hideEmpty: Boolean(sendTemplate?.hideEmpty),
        options: getNormalizedOptions() as any
      })
      message.success(textConst.msg.createSuccess)
      setSaveAsVisible(false)
      setSaveAsName('')
      await loadTemplates(resp.data)
    } finally {
      setSaveAsLoading(false)
    }
  }

  // 删除模板
  const handleDeleteTemplate = (id?: number) => {
    if (!id) return
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该工资条模板吗？',
      onOk: async () => {
        await deleteSalarySlipTemplate({ id })
        message.success(textConst.msg.delSuccess)
        loadTemplates()
      }
    })
  }

  const employeeColumns = [
    {
      title: '员工姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 120
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width: 100
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 120
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      key: 'postName',
      width: 120
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 120
    },
    {
      title: '发送状态',
      dataIndex: 'sent',
      key: 'sent',
      align: 'center' as const,
      width: 100,
      render: (sent: boolean) => (sent ? <Tag color="success">已发送</Tag> : <Tag>未发送</Tag>)
    },
    {
      title: '应发工资',
      dataIndex: 'expectedPaySalary',
      key: 'expectedPaySalary',
      align: 'right' as const,
      width: 110,
      render: (val: any) => formatHrmMoney(val)
    },
    {
      title: '实发工资',
      dataIndex: 'realPaySalary',
      key: 'realPaySalary',
      align: 'right' as const,
      width: 110,
      render: (val: any) => formatHrmMoney(val)
    }
  ]

  return (
    <>
      <Modal
        title="发送工资条"
        open={visible}
        onCancel={() => setVisible(false)}
        width={1100}
        destroyOnClose
        footer={
          currentStep === 0 ? (
            <Space>
              <Button onClick={() => setVisible(false)}>取 消</Button>
              <Button type="primary" onClick={handleNextStep} disabled={templateLoading}>
                下一步
              </Button>
            </Space>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ color: '#888' }}>
                已选 {selectedEmployeeIds.length} 人 / 共 {employeeTotal} 人
              </span>
              <Space>
                <Button onClick={() => setCurrentStep(0)} disabled={sendLoading}>
                  上一步
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSubmitSend(false)}
                  loading={sendLoading}
                  disabled={selectedEmployeeIds.length === 0}
                >
                  发放已选员工
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSubmitSend(true)}
                  loading={sendLoading}
                  disabled={employeeTotal === 0}
                >
                  全部发放
                </Button>
                <Button onClick={() => setVisible(false)}>取 消</Button>
              </Space>
            </div>
          )
        }
      >
        <Steps
          current={currentStep}
          style={{ maxWidth: 500, margin: '0 auto 24px' }}
          items={[{ title: '设置工资条模板' }, { title: '选择发放员工' }]}
        />

        {currentStep === 0 ? (
          <div style={{ minHeight: 400 }}>
            <Form layout="horizontal" labelCol={{ span: 3 }}>
              <Form.Item label="工资条模板" required>
                <Space style={{ width: '100%' }} wrap>
                  <Select
                    style={{ width: 260 }}
                    value={selectedTemplateId}
                    onChange={(val) => handleTemplateSelectChange(val)}
                    placeholder="请选择工资条模板"
                    options={templateList.map((t) => ({
                      label: t.name,
                      value: t.id
                    }))}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditTemplateId(undefined)
                      setTemplateFormVisible(true)
                    }}
                  >
                    新增模板
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    disabled={!selectedTemplate || selectedTemplate.defaultStatus}
                    onClick={() => {
                      setEditTemplateId(selectedTemplateId)
                      setTemplateFormVisible(true)
                    }}
                  >
                    编辑模板
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    disabled={!selectedTemplate || selectedTemplate.defaultStatus}
                    onClick={() => handleDeleteTemplate(selectedTemplateId)}
                  >
                    删除模板
                  </Button>
                </Space>
              </Form.Item>

              {!sendTemplate ? (
                <Empty description="暂无工资条模板，请先新增模板" />
              ) : (
                <>
                  <Form.Item label="隐藏空项">
                    <Switch
                      checked={sendTemplate.hideEmpty}
                      checkedChildren="隐藏金额为空的项"
                      unCheckedChildren="保留全部工资项"
                      onChange={(checked) =>
                        setSendTemplate((prev) =>
                          prev ? { ...prev, hideEmpty: checked } : undefined
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item label="模板明细">
                    <SalarySlipTemplateOptionEditor
                      value={(sendTemplate.options || []) as SlipTemplateOption[]}
                      onChange={(newOptions) =>
                        setSendTemplate((prev) =>
                          prev
                            ? {
                                ...prev,
                                options: newOptions as API.HrmSalarySlipTemplateOptionVO[]
                              }
                            : undefined
                        )
                      }
                      maxHeight={320}
                      extraActions={
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => {
                            setSaveAsName('')
                            setSaveAsVisible(true)
                          }}
                        >
                          另存为模板
                        </Button>
                      }
                    />
                  </Form.Item>
                </>
              )}
            </Form>
          </div>
        ) : (
          <div style={{ minHeight: 400 }}>
            {/* 筛选工作栏 */}
            <Space style={{ marginBottom: 16 }} wrap>
              <Input
                style={{ width: 180 }}
                placeholder="请输入员工姓名"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                allowClear
              />
              <div style={{ width: 180 }}>
                <DeptSelect
                  value={filterDeptId}
                  onChange={(val) => setFilterDeptId(val)}
                  placeholder="选择部门"
                />
              </div>
              <Select
                style={{ width: 120 }}
                value={filterSent}
                onChange={(val) => setFilterSent(val)}
                options={[
                  { label: '全部状态', value: undefined },
                  { label: '未发送', value: false },
                  { label: '已发送', value: true }
                ]}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setPageNo(1)
                  loadEmployees(1, pageSize)
                }}
              >
                搜索
              </Button>
              <Button
                onClick={() => {
                  setFilterSearch(undefined)
                  setFilterDeptId(undefined)
                  setFilterSent(false)
                  setPageNo(1)
                  loadEmployees(1, pageSize)
                }}
              >
                重置
              </Button>
            </Space>

            <Table
              loading={employeeLoading}
              columns={employeeColumns}
              dataSource={employeeList}
              rowKey="employeeId"
              pagination={false}
              size="small"
              bordered
              scroll={{ y: 320 }}
              rowSelection={{
                selectedRowKeys: selectedEmployeeIds,
                onChange: (keys) => setSelectedEmployeeIds(keys.map(Number))
              }}
            />

            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <Pagination
                current={pageNo}
                pageSize={pageSize}
                total={employeeTotal}
                size="small"
                showSizeChanger
                onChange={(p, s) => {
                  setPageNo(p)
                  setPageSize(s)
                  loadEmployees(p, s)
                }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 工资条模板表单 */}
      <SalarySlipTemplateForm
        visible={templateFormVisible}
        setVisible={setTemplateFormVisible}
        id={editTemplateId}
        onSuccess={(newId) => loadTemplates(newId)}
      />

      {/* 另存为模板弹窗 */}
      <Modal
        title="另存为模板"
        open={saveAsVisible}
        onOk={handleSaveAsTemplate}
        onCancel={() => setSaveAsVisible(false)}
        confirmLoading={saveAsLoading}
        destroyOnClose
      >
        <div style={{ marginBottom: 12 }}>请输入新模板名称：</div>
        <Input
          placeholder="请输入模板名称"
          maxLength={64}
          value={saveAsName}
          onChange={(e) => setSaveAsName(e.target.value)}
        />
      </Modal>
    </>
  )
}

export default SalarySlipSendForm
