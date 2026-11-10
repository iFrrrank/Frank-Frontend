import React, { useEffect, useRef, useState } from 'react'
import { Card, Dropdown, Modal, Tabs, Tag, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { history, useLocation } from '@umijs/max'
import {
  deleteEmployee,
  deleteEmployeeList,
  exportEmployee,
  getEmployeePage,
  getEmployeeStatusCount,
  sendEmployeeProfileFillMessage
} from '@/api/hrm/employee'
import { HrmEmployeeEntryStatusEnum, HrmEmployeeStatusEnum } from '@/utils/constants'
import {
  EMPLOYEE_ENTRY_STATUS,
  EMPLOYEE_STATUS,
  EMPLOYEE_STATUS_TABS,
  EMPLOYEE_TYPE
} from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { handleExport } from '@/components/Export'
import { formatHrmDateTime } from '@/pages/hrm/utils/format'
import {
  HrmEmployeeStatusTab,
  HrmEmployeeSurveyType,
  HrmEmployeeTodoType,
  HRM_HOME_ROUTES
} from '@/pages/hrm/home/constants'
import EmployeeSearchForm, { type EmployeeSearchValues } from './EmployeeSearchForm'
import EmployeeForm, { type EmployeeFormType } from './EmployeeForm'
import EmployeeCreateFromUserForm from './EmployeeCreateFromUserForm'
import EmployeeImportForm from './EmployeeImportForm'
import EmployeeRegularForm from './EmployeeRegularForm'
import EmployeeTransferForm from './EmployeeTransferForm'
import EmployeePromoteForm from './EmployeePromoteForm'
import EmployeeDemoteForm from './EmployeeDemoteForm'
import EmployeeFullTimeForm from './EmployeeFullTimeForm'
import EmployeeQuitForm from './EmployeeQuitForm'
import EmployeeCancelQuitForm from './EmployeeCancelQuitForm'
import EmployeeInsuranceSchemeForm from './EmployeeInsuranceSchemeForm'
import { SEX_LABELS } from './utils'

// 员工状态页签选中值（surveyType=ENTRY 时额外展示「本月入职」页签）
const ENTRY_TAB_KEY = 'entry'

const EmployeePage: React.FC = () => {
  const actionRef = useRef<ActionType>(undefined)
  const location = useLocation()

  // ========== 搜索与状态页签 ==========
  // 搜索表单值（不含状态筛选）
  const searchValuesRef = useRef<EmployeeSearchValues>({})
  // 状态页签筛选条件（statusCategory / surveyType / todoType / leaderEmployeeId）
  const statusFilterRef = useRef<{
    statusCategory?: number
    surveyType?: number
    todoType?: number
    leaderEmployeeId?: number
  }>({ statusCategory: HrmEmployeeStatusTab.FULL_TIME })
  const [activeStatus, setActiveStatus] = useState<string>(String(HrmEmployeeStatusTab.FULL_TIME))
  // 各状态页签数量统计
  const [statusCounts, setStatusCounts] = useState<Record<number, number>>({})

  // ========== 表格选中 ==========
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<API.HrmEmployeeRespVO[]>([])

  // ========== 表单弹窗状态 ==========
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [formType, setFormType] = useState<EmployeeFormType>('create')
  const [formId, setFormId] = useState<number | undefined>(undefined)
  const [createFromUserVisible, setCreateFromUserVisible] = useState<boolean>(false)
  const [importVisible, setImportVisible] = useState<boolean>(false)
  const [regularVisible, setRegularVisible] = useState<boolean>(false)
  const [transferVisible, setTransferVisible] = useState<boolean>(false)
  const [promoteVisible, setPromoteVisible] = useState<boolean>(false)
  const [demoteVisible, setDemoteVisible] = useState<boolean>(false)
  const [fullTimeVisible, setFullTimeVisible] = useState<boolean>(false)
  const [quitVisible, setQuitVisible] = useState<boolean>(false)
  const [cancelQuitVisible, setCancelQuitVisible] = useState<boolean>(false)
  const [insuranceVisible, setInsuranceVisible] = useState<boolean>(false)
  const [insuranceEmployeeIds, setInsuranceEmployeeIds] = useState<number[]>([])
  // 当前操作的员工（更多操作使用）
  const [currentEmployee, setCurrentEmployee] = useState<API.HrmEmployeeRespVO | undefined>(
    undefined
  )
  const [exportLoading, setExportLoading] = useState<boolean>(false)

  const reload = () => actionRef.current?.reload()

  /** 应用首页跳转携带的员工筛选条件（statusCategory / surveyType / todoType / leaderEmployeeId） */
  const applyHomeFilter = () => {
    const params = new URLSearchParams(location.search)
    const surveyType = Number(params.get('surveyType'))
    const surveyTypeValues: number[] = Object.values(HrmEmployeeSurveyType)
    const todoType = Number(params.get('todoType'))
    const todoTypeValues: number[] = Object.values(HrmEmployeeTodoType)
    const leaderEmployeeId = Number(params.get('leaderEmployeeId'))

    const filter: typeof statusFilterRef.current = {
      statusCategory: HrmEmployeeStatusTab.FULL_TIME
    }
    let nextActiveStatus = String(HrmEmployeeStatusTab.FULL_TIME)
    // 首页跳转：先读取状态页签，再叠加 surveyType / todoType
    const statusCategory = Number(params.get('statusCategory'))
    if ((Object.values(HrmEmployeeStatusTab) as number[]).includes(statusCategory)) {
      filter.statusCategory = statusCategory
      nextActiveStatus = String(statusCategory)
    }
    if (surveyTypeValues.includes(surveyType)) {
      filter.surveyType = surveyType
      // 概况类型决定页签选中：入职 → 本月入职；离职/待离职/待入职 → 对应状态页签
      if (surveyType === HrmEmployeeSurveyType.ENTRY) {
        nextActiveStatus = ENTRY_TAB_KEY
        filter.statusCategory = undefined
      } else if (surveyType === HrmEmployeeSurveyType.LEAVE) {
        filter.statusCategory = HrmEmployeeStatusTab.LEFT
        nextActiveStatus = String(HrmEmployeeStatusTab.LEFT)
      } else if (surveyType === HrmEmployeeSurveyType.PENDING_ENTRY) {
        filter.statusCategory = HrmEmployeeStatusTab.PENDING_ENTRY
        nextActiveStatus = String(HrmEmployeeStatusTab.PENDING_ENTRY)
      } else if (surveyType === HrmEmployeeSurveyType.PENDING_LEAVE) {
        filter.statusCategory = HrmEmployeeStatusTab.PENDING_LEAVE
        nextActiveStatus = String(HrmEmployeeStatusTab.PENDING_LEAVE)
      }
    }
    if (todoTypeValues.includes(todoType)) {
      filter.todoType = todoType
    }
    if (Number.isInteger(leaderEmployeeId) && leaderEmployeeId > 0) {
      filter.leaderEmployeeId = leaderEmployeeId
    }
    statusFilterRef.current = filter
    setActiveStatus(nextActiveStatus)
  }

  // 首页跳转进入时应用筛选条件
  useEffect(() => {
    applyHomeFilter()
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  /** 员工是否允许配置参保方案：正式 / 试用且未离职 */
  const isEmployeeInsuranceEligible = (employee: API.HrmEmployeeRespVO) =>
    (employee.status === HrmEmployeeStatusEnum.REGULAR.status ||
      employee.status === HrmEmployeeStatusEnum.PROBATION.status) &&
    employee.entryStatus !== HrmEmployeeEntryStatusEnum.LEFT.entryStatus

  /** 获得员工的更多操作菜单项（对应 Vue 的 getEmployeeMoreActions） */
  const getEmployeeMoreActions = (employee: API.HrmEmployeeRespVO) => {
    const actions: { key: string; label: string }[] = []
    if (isEmployeeInsuranceEligible(employee)) {
      actions.push({ key: 'insurance-scheme', label: '设置参保方案' })
    }
    if (employee.entryStatus === HrmEmployeeEntryStatusEnum.PENDING_ENTRY.entryStatus) {
      actions.push({ key: 'confirm-entry', label: '确认入职' })
    } else if (employee.entryStatus === HrmEmployeeEntryStatusEnum.LEFT.entryStatus) {
      actions.push({ key: 'rehire', label: '办理再入职' }, { key: 'quit', label: '修改离职信息' })
    } else if (
      employee.entryStatus === HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus ||
      employee.entryStatus === HrmEmployeeEntryStatusEnum.PENDING_LEAVE.entryStatus
    ) {
      if (employee.status === HrmEmployeeStatusEnum.PROBATION.status) {
        actions.push({ key: 'regular', label: '办理转正' })
      }
      actions.push(
        { key: 'transfer', label: '调整部门/岗位' },
        { key: 'promotion', label: '晋升' },
        { key: 'demotion', label: '降级' }
      )
      if (
        employee.status === HrmEmployeeStatusEnum.INTERN.status ||
        employee.status === HrmEmployeeStatusEnum.PART_TIME.status
      ) {
        actions.push({ key: 'full-time', label: '转为全职' })
      }
      if (employee.entryStatus === HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus) {
        actions.push({ key: 'quit', label: '办理离职' })
      } else {
        actions.push({ key: 'cancel-quit', label: '取消离职' })
      }
    }
    actions.push({ key: 'delete', label: '删除' })
    return actions
  }

  /** 打开员工详情页（Vue 版路由跳转 HrmEmployeeDetail） */
  const openDetail = (id: number) => {
    history.push(`${HRM_HOME_ROUTES.EMPLOYEE_DETAIL}?id=${id}`)
  }

  /** 打开新增 / 修改员工表单 */
  const openForm = (type: EmployeeFormType, id?: number) => {
    setFormType(type)
    setFormId(id)
    setFormVisible(true)
  }

  /** 删除单个员工 */
  const handleDelete = (record: API.HrmEmployeeRespVO) => {
    Modal.confirm({
      title: textConst.msg.confirmTitle,
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确定删除员工“${record.name}”吗？已绑定的后台账号及历史业务记录将保留。`,
      okText: textConst.common.ok,
      cancelText: textConst.common.cancel,
      onOk: async () => {
        try {
          await deleteEmployee({ id: record.id })
          message.success(textConst.msg.delSuccess)
          refreshAll()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  /** 批量删除员工 */
  const handleBatchDelete = () => {
    const ids = selectedRows.map((row) => row.id)
    Modal.confirm({
      title: '批量删除员工',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
      content: `确定删除选中的 ${ids.length} 份员工档案吗？已绑定的后台账号及历史业务记录将保留。`,
      okText: '确 定',
      cancelText: '取 消',
      onOk: async () => {
        try {
          await deleteEmployeeList({ ids })
          message.success(textConst.msg.delSuccess)
          refreshAll()
        } catch {
          message.error(textConst.msg.delError)
        }
      }
    })
  }

  /** 发送填写员工档案通知 */
  const handleSendArchiveFillMessage = () => {
    const ids = selectedRows.map((row) => row.id)
    Modal.confirm({
      title: '发送填写档案通知',
      icon: <ExclamationCircleOutlined style={{ color: '#1677ff' }} />,
      content: `确定向选中的 ${ids.length} 名员工发送填写档案通知吗？`,
      okText: '发送',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await sendEmployeeProfileFillMessage({ ids })
          const data = result.data || {}
          message.success(
            `通知发送完成：成功 ${data.successCount ?? 0} 人，跳过 ${data.skippedCount ?? 0} 人，失败 ${data.failureCount ?? 0} 人`
          )
        } catch {
          message.error('发送失败')
        }
      }
    })
  }

  /** 批量操作命令分发 */
  const handleBatchCommand = (command: string) => {
    if (command === 'insurance-scheme') {
      // 只能为正式或试用且未离职的员工设置参保方案
      const eligibleEmployees = selectedRows.filter(isEmployeeInsuranceEligible)
      if (eligibleEmployees.length !== selectedRows.length) {
        message.warning('只能为正式或试用且未离职的员工设置参保方案')
        return
      }
      setInsuranceEmployeeIds(eligibleEmployees.map((employee) => employee.id))
      setInsuranceVisible(true)
      return
    }
    if (command === 'delete') {
      handleBatchDelete()
      return
    }
    if (command === 'send-profile-fill-message') {
      handleSendArchiveFillMessage()
    }
  }

  /** 员工更多操作命令分发（对应 Vue 的 handleMoreCommand） */
  const handleMoreCommand = (command: string, employee: API.HrmEmployeeRespVO) => {
    setCurrentEmployee(employee)
    switch (command) {
      case 'insurance-scheme':
        setInsuranceEmployeeIds([employee.id])
        setInsuranceVisible(true)
        return
      case 'regular':
        setRegularVisible(true)
        return
      case 'transfer':
        setTransferVisible(true)
        return
      case 'promotion':
        setPromoteVisible(true)
        return
      case 'demotion':
        setDemoteVisible(true)
        return
      case 'full-time':
        setFullTimeVisible(true)
        return
      case 'confirm-entry':
        openForm('confirm', employee.id)
        return
      case 'rehire':
        openForm('rehire', employee.id)
        return
      case 'quit':
        setQuitVisible(true)
        return
      case 'cancel-quit':
        setCancelQuitVisible(true)
        return
      case 'delete':
        handleDelete(employee)
        return
      default:
        return
    }
  }

  /** 员工数据变化后刷新列表与状态统计 */
  const refreshAll = () => {
    setSelectedRowKeys([])
    setSelectedRows([])
    reload()
  }

  /** 导出员工档案 */
  const handleExportEmployee = () => {
    const { entryTime, regularTime, ...rest } = searchValuesRef.current
    // 时间范围转换为字符串数组
    const exportReqVO = {
      ...rest,
      ...statusFilterRef.current,
      ...(entryTime && entryTime.length === 2
        ? {
            entryTime: [
              entryTime[0].format('YYYY-MM-DD HH:mm:ss'),
              entryTime[1].format('YYYY-MM-DD HH:mm:ss')
            ]
          }
        : {}),
      ...(regularTime && regularTime.length === 2
        ? {
            regularTime: [
              regularTime[0].format('YYYY-MM-DD HH:mm:ss'),
              regularTime[1].format('YYYY-MM-DD HH:mm:ss')
            ]
          }
        : {})
    }
    setExportLoading(true)
    handleExport({
      exportApi: exportEmployee,
      exportParams: { exportReqVO } as API.exportEmployeeParams,
      fileName: '员工档案.xlsx'
    })
    setExportLoading(false)
  }

  // 状态页签（5 个员工状态 + surveyType=ENTRY 时前置「本月入职」）
  const statusTabItems = [
    ...(statusFilterRef.current.surveyType === HrmEmployeeSurveyType.ENTRY
      ? [{ key: ENTRY_TAB_KEY, label: `本月入职（${statusCounts[ENTRY_TAB_KEY as any] ?? 0}）` }]
      : []),
    ...EMPLOYEE_STATUS_TABS.map((tab) => ({
      key: String(tab.value),
      label: `${tab.label}（${statusCounts[tab.value] || 0}）`
    }))
  ]

  /** 状态页签切换：清除概况 / 待办筛选，仅保留状态分类 */
  const handleTabChange = (key: string) => {
    if (key === ENTRY_TAB_KEY) {
      return
    }
    setActiveStatus(key)
    statusFilterRef.current = {
      statusCategory: Number(key),
      surveyType: undefined,
      todoType: undefined,
      leaderEmployeeId: statusFilterRef.current.leaderEmployeeId
    }
    setSelectedRowKeys([])
    setSelectedRows([])
    reload()
  }

  const columns: ProColumns<API.HrmEmployeeRespVO>[] = [
    {
      title: '员工姓名',
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      minWidth: 120,
      hideInSearch: true,
      render: (_, record) => <a onClick={() => openDetail(record.id)}>{record.name}</a>
    },
    { title: '手机号', dataIndex: 'mobile', align: 'center', minWidth: 130, hideInSearch: true },
    {
      title: '招聘渠道',
      dataIndex: 'channelName',
      align: 'center',
      minWidth: 120,
      hideInSearch: true,
      render: (_, record) => record.channelName || '-'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 80,
      hideInSearch: true,
      render: (_, record) =>
        record.sex != null ? <span>{SEX_LABELS[record.sex] ?? '-'}</span> : '-'
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => formatHrmDateTime(record.entryTime)
    },
    { title: '部门', dataIndex: 'deptName', align: 'center', minWidth: 120, hideInSearch: true },
    { title: '工号', dataIndex: 'jobNumber', align: 'center', minWidth: 120, hideInSearch: true },
    { title: '岗位', dataIndex: 'postName', align: 'center', minWidth: 130, hideInSearch: true },
    {
      title: '直属上级',
      dataIndex: 'leaderEmployeeName',
      align: 'center',
      minWidth: 120,
      hideInSearch: true,
      render: (_, record) => record.leaderEmployeeName || '-'
    },
    {
      title: '聘用形式',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: EMPLOYEE_TYPE,
      render: (_, record) =>
        record.type != null ? <Tag>{EMPLOYEE_TYPE[record.type]?.text ?? '-'}</Tag> : '-'
    },
    {
      title: '员工状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: EMPLOYEE_STATUS,
      render: (_, record) =>
        record.status != null ? <Tag>{EMPLOYEE_STATUS[record.status]?.text ?? '-'}</Tag> : '-'
    },
    {
      title: '入职状态',
      dataIndex: 'entryStatus',
      align: 'center',
      width: 100,
      hideInSearch: true,
      valueEnum: EMPLOYEE_ENTRY_STATUS,
      render: (_, record) =>
        record.entryStatus != null ? (
          <Tag>{EMPLOYEE_ENTRY_STATUS[record.entryStatus]?.text ?? '-'}</Tag>
        ) : (
          '-'
        )
    },
    {
      title: '转正时间',
      dataIndex: 'regularTime',
      align: 'center',
      width: 180,
      hideInSearch: true,
      render: (_, record) => formatHrmDateTime(record.regularTime)
    },
    {
      title: '工作地点',
      dataIndex: 'workAddress',
      align: 'center',
      minWidth: 140,
      hideInSearch: true
    },
    {
      title: '银行卡号',
      dataIndex: 'salaryCardNumber',
      align: 'center',
      minWidth: 170,
      hideInSearch: true,
      render: (_, record) => record.salaryCardNumber || '-'
    },
    {
      title: '开户地区',
      dataIndex: 'salaryCardAreaName',
      align: 'center',
      minWidth: 180,
      hideInSearch: true,
      render: (_, record) => record.salaryCardAreaName || '-'
    },
    {
      title: '银行名称',
      dataIndex: 'salaryCardBankName',
      align: 'center',
      minWidth: 140,
      hideInSearch: true,
      render: (_, record) => record.salaryCardBankName || '-'
    },
    {
      title: '开户支行',
      dataIndex: 'salaryCardBankBranchName',
      align: 'center',
      minWidth: 160,
      hideInSearch: true,
      render: (_, record) => record.salaryCardBankBranchName || '-'
    },
    {
      title: '个人社保账号',
      dataIndex: 'socialSecurityNumber',
      align: 'center',
      minWidth: 150,
      hideInSearch: true,
      render: (_, record) => record.socialSecurityNumber || '-'
    },
    {
      title: '个人公积金账号',
      dataIndex: 'accumulationFundNumber',
      align: 'center',
      minWidth: 160,
      hideInSearch: true,
      render: (_, record) => record.accumulationFundNumber || '-'
    },
    {
      title: textConst.table.action,
      valueType: 'option',
      align: 'center',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a key="edit" onClick={() => openForm('update', record.id)}>
            {textConst.action.update}
          </a>
          <Dropdown
            key="more"
            menu={{
              items: getEmployeeMoreActions(record).flatMap((action, index) => {
                if (index > 0 && action.key === 'delete') {
                  return [{ type: 'divider' as const, key: 'divider-delete' }, action]
                }
                return [action]
              }),
              onClick: ({ key }) => handleMoreCommand(key, record)
            }}
          >
            <a style={{ marginLeft: 12 }}>更多</a>
          </Dropdown>
        </div>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card variant="borderless" styles={{ body: { paddingBottom: 16 } }}>
        <EmployeeSearchForm
          onSearch={(values) => {
            searchValuesRef.current = values
            setSelectedRowKeys([])
            setSelectedRows([])
            reload()
          }}
          onReset={() => {
            searchValuesRef.current = {}
            statusFilterRef.current = {
              statusCategory: HrmEmployeeStatusTab.ACTIVE,
              surveyType: undefined,
              todoType: undefined,
              leaderEmployeeId: undefined
            }
            setActiveStatus(String(HrmEmployeeStatusTab.ACTIVE))
            reload()
          }}
          onCreate={() => openForm('create')}
          onCreateFromUser={() => setCreateFromUserVisible(true)}
          onImport={() => setImportVisible(true)}
          onExport={handleExportEmployee}
          exportLoading={exportLoading}
          batchDisabled={selectedRowKeys.length === 0}
          batchMenuItems={[
            { key: 'insurance-scheme', label: '设置参保方案' },
            { key: 'delete', label: '批量删除' },
            { key: 'send-profile-fill-message', label: '发送填写档案通知' }
          ]}
          onBatchCommand={handleBatchCommand}
        />
      </Card>

      <Card variant="borderless" styles={{ body: { paddingTop: 0 } }}>
        <Tabs activeKey={activeStatus} onChange={handleTabChange} items={statusTabItems} />
        <ProTable<API.HrmEmployeeRespVO>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={false}
          options={false}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              setSelectedRowKeys(keys)
              setSelectedRows(rows)
            }
          }}
          pagination={{ align: 'center', showSizeChanger: true }}
          request={async (params) => {
            const { current, pageSize } = params
            const { entryTime, regularTime, ...rest } = searchValuesRef.current
            const pageReqVO: API.HrmEmployeePageReqVO = {
              pageNo: current || 1,
              pageSize: pageSize || 10,
              ...rest,
              ...statusFilterRef.current,
              ...(entryTime && entryTime.length === 2
                ? {
                    entryTime: [
                      entryTime[0].format('YYYY-MM-DD HH:mm:ss'),
                      entryTime[1].format('YYYY-MM-DD HH:mm:ss')
                    ]
                  }
                : {}),
              ...(regularTime && regularTime.length === 2
                ? {
                    regularTime: [
                      regularTime[0].format('YYYY-MM-DD HH:mm:ss'),
                      regularTime[1].format('YYYY-MM-DD HH:mm:ss')
                    ]
                  }
                : {})
            }
            try {
              // 列表与状态统计并行请求
              const [pageResp, countResp] = await Promise.all([
                getEmployeePage({ pageReqVO } as API.getEmployeePageParams),
                getEmployeeStatusCount({
                  pageReqVO: { ...pageReqVO, pageNo: 1, pageSize: 1 }
                } as API.getEmployeeStatusCountParams)
              ])
              const countMap: Record<number, number> = {}
              for (const item of countResp.data || []) {
                countMap[item.status] = item.count
              }
              setStatusCounts(countMap)
              return {
                data: pageResp.data?.list || [],
                success: pageResp.code === 0,
                total: pageResp.data?.total || 0
              }
            } catch {
              return { data: [], success: false, total: 0 }
            }
          }}
        />
      </Card>

      {/* 新增 / 修改 / 确认入职 / 再入职 */}
      <EmployeeForm
        visible={formVisible}
        setVisible={setFormVisible}
        formType={formType}
        id={formId}
        onSuccess={() => {
          setFormVisible(false)
          refreshAll()
        }}
      />
      {/* 从后台用户批量建档 */}
      <EmployeeCreateFromUserForm
        visible={createFromUserVisible}
        setVisible={setCreateFromUserVisible}
        onSuccess={refreshAll}
      />
      {/* 导入 */}
      <EmployeeImportForm
        visible={importVisible}
        setVisible={setImportVisible}
        onSuccess={refreshAll}
      />
      {/* 办理转正 */}
      <EmployeeRegularForm
        visible={regularVisible}
        setVisible={setRegularVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setRegularVisible(false)
          refreshAll()
        }}
      />
      {/* 调整部门 / 岗位 */}
      <EmployeeTransferForm
        visible={transferVisible}
        setVisible={setTransferVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setTransferVisible(false)
          refreshAll()
        }}
      />
      {/* 晋升 */}
      <EmployeePromoteForm
        visible={promoteVisible}
        setVisible={setPromoteVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setPromoteVisible(false)
          refreshAll()
        }}
      />
      {/* 降级 */}
      <EmployeeDemoteForm
        visible={demoteVisible}
        setVisible={setDemoteVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setDemoteVisible(false)
          refreshAll()
        }}
      />
      {/* 转为全职 */}
      <EmployeeFullTimeForm
        visible={fullTimeVisible}
        setVisible={setFullTimeVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setFullTimeVisible(false)
          refreshAll()
        }}
      />
      {/* 办理离职 / 修改离职信息 */}
      <EmployeeQuitForm
        visible={quitVisible}
        setVisible={setQuitVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setQuitVisible(false)
          refreshAll()
        }}
      />
      {/* 取消离职 */}
      <EmployeeCancelQuitForm
        visible={cancelQuitVisible}
        setVisible={setCancelQuitVisible}
        employee={currentEmployee}
        onSuccess={() => {
          setCancelQuitVisible(false)
          refreshAll()
        }}
      />
      {/* 设置参保方案（单个 / 批量） */}
      <EmployeeInsuranceSchemeForm
        visible={insuranceVisible}
        setVisible={setInsuranceVisible}
        employeeIds={insuranceEmployeeIds}
        onSuccess={() => {
          setInsuranceVisible(false)
          refreshAll()
        }}
      />
    </div>
  )
}

export default EmployeePage
