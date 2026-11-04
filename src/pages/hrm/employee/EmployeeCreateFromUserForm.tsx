import React, { useEffect, useState } from 'react'
import {
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  DatePicker,
  message,
  Button
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { getBoundUserIdList, createEmployeeList } from '@/api/hrm/employee'
import { getSimpleUserList } from '@/api/system/user'
import {
  HrmEmployeeStatusEnum,
  HrmEmployeeTypeEnum,
  HRM_EMPLOYEE_NO_PROBATION_MONTHS
} from '@/utils/constants'
import { EMPLOYEE_STATUS_OPTIONS, EMPLOYEE_TYPE_OPTIONS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import { HRM_EMPLOYEE_NON_FORMAL_STATUS_VALUES } from './constants'
import DeptSelect from './components/DeptSelect'
import HrmEmployeeSelect from './components/HrmEmployeeSelect'

// 待建档员工行：后台用户信息 + 可编辑的员工档案字段
interface EmployeeRow extends API.HrmEmployeeCreateFromUserReqVO {
  nickname: string
}

interface EmployeeCreateFromUserFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
}

/** 从后台用户批量建档（对应 Vue 的 EmployeeCreateFromUserForm） */
const EmployeeCreateFromUserForm: React.FC<EmployeeCreateFromUserFormProps> = ({
  visible,
  setVisible,
  onSuccess
}) => {
  const [rows, setRows] = useState<EmployeeRow[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  // 已绑定员工档案的用户 Id，不可选择
  const [boundUserIds, setBoundUserIds] = useState<number[]>([])
  const [userOptions, setUserOptions] = useState<{ label: string; value: number }[]>([])
  // 后台用户完整信息（按 Id 映射），建档时回填部门等默认值
  const [userMap, setUserMap] = useState<Map<number, API.SystemUserSimpleRespVO>>(new Map())
  const [loading, setLoading] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  // 打开弹窗时加载：已绑定用户 Id + 可选后台用户
  useEffect(() => {
    if (!visible) {
      return
    }
    setRows([])
    setSelectedUserIds([])
    setLoading(true)
    Promise.all([getBoundUserIdList(), getSimpleUserList()])
      .then(([boundResp, userResp]) => {
        const boundIds = boundResp.data || []
        setBoundUserIds(boundIds)
        const users = userResp.data || []
        // 已绑定员工档案的用户不可选
        setUserOptions(
          users
            .filter((user) => !boundIds.includes(user.id))
            .map((user) => ({ label: user.nickname, value: user.id }))
        )
        setUserMap(new Map(users.map((user) => [user.id, user])))
      })
      .catch(() => {
        setBoundUserIds([])
        setUserOptions([])
        setUserMap(new Map())
      })
      .finally(() => setLoading(false))
  }, [visible])

  /** 更新指定行数据 */
  const updateRow = (userId: number, patch: Partial<EmployeeRow>) => {
    setRows((prev) => prev.map((row) => (row.userId === userId ? { ...row, ...patch } : row)))
  }

  /** 切换聘用形式时清理互斥字段：正式员工填试用期，非正式员工选状态 */
  const handleTypeChange = (row: EmployeeRow, type: number) => {
    if (type === HrmEmployeeTypeEnum.FORMAL.type) {
      updateRow(row.userId, { type, status: undefined, probation: row.probation ?? 0 })
    } else {
      updateRow(row.userId, {
        type,
        probation: undefined,
        status: row.status ?? HrmEmployeeStatusEnum.INTERN.status
      })
    }
  }

  /** 后台用户选择变化：保留已编辑行，追加新选择用户 */
  const handleUserChange = (userIds: number[]) => {
    setSelectedUserIds(userIds)
    const oldRowMap = new Map(rows.map((row) => [row.userId, row]))
    const newRows: EmployeeRow[] = []
    for (const userId of userIds) {
      const oldRow = oldRowMap.get(userId)
      if (oldRow) {
        newRows.push(oldRow)
        continue
      }
      const user = userMap.get(userId)
      newRows.push({
        userId,
        nickname: user?.nickname || '',
        mobile: '',
        jobNumber: '',
        deptId: user?.deptId,
        leaderEmployeeId: undefined,
        type: HrmEmployeeTypeEnum.FORMAL.type,
        probation: HRM_EMPLOYEE_NO_PROBATION_MONTHS,
        entryTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        postName: ''
      })
    }
    setRows(newRows)
  }

  /** 移除待建档用户 */
  const removeRow = (userId: number) => {
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId))
    setRows((prev) => prev.filter((row) => row.userId !== userId))
  }

  /** 提交批量建档 */
  const handleSubmit = async () => {
    if (rows.length === 0) {
      message.warning('请先选择未建档的后台用户')
      return
    }
    // 逐行校验必填字段：手机号、工号、入职时间
    for (const row of rows) {
      if (!row.mobile) {
        message.warning(`请填写员工「${row.nickname}」的手机号`)
        return
      }
      if (!/^1[3-9]\d{9}$/.test(row.mobile)) {
        message.warning(`员工「${row.nickname}」的手机号格式不正确`)
        return
      }
      if (!row.jobNumber) {
        message.warning(`请填写员工「${row.nickname}」的工号`)
        return
      }
      if (!row.entryTime) {
        message.warning(`请选择员工「${row.nickname}」的入职时间`)
        return
      }
    }
    setSubmitLoading(true)
    try {
      const result = await createEmployeeList(rows.map(({ nickname: _nickname, ...rest }) => rest))
      message.success(`已创建 ${result.data?.length ?? 0} 份员工档案，开通通知将在事务提交后发送`)
      setVisible(false)
      onSuccess()
    } catch {
      message.error(textConst.msg.saveError)
    } finally {
      setSubmitLoading(false)
    }
  }

  // 非正式员工可选状态
  const nonFormalStatusOptions = EMPLOYEE_STATUS_OPTIONS.filter((item) =>
    HRM_EMPLOYEE_NON_FORMAL_STATUS_VALUES.includes(item.value as number)
  )

  const columns = [
    {
      title: '后台用户',
      dataIndex: 'nickname',
      width: 170,
      fixed: 'left' as const,
      render: (value: string) => value || '-'
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 170,
      render: (_value: string, row: EmployeeRow) => (
        <Input
          value={row.mobile}
          maxLength={11}
          placeholder="请输入手机号"
          onChange={(e) => updateRow(row.userId, { mobile: e.target.value })}
        />
      )
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      width: 180,
      render: (value: number | undefined, row: EmployeeRow) => (
        <DeptSelect
          value={value}
          onChange={(deptId) => updateRow(row.userId, { deptId })}
          placeholder="请选择部门"
        />
      )
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      width: 150,
      render: (value: string, row: EmployeeRow) => (
        <Input
          value={value}
          maxLength={64}
          placeholder="请输入工号"
          onChange={(e) => updateRow(row.userId, { jobNumber: e.target.value })}
        />
      )
    },
    {
      title: '直属上级',
      dataIndex: 'leaderEmployeeId',
      width: 190,
      render: (value: number | undefined, row: EmployeeRow) => (
        <HrmEmployeeSelect
          value={value}
          onChange={(employeeId) =>
            updateRow(row.userId, {
              leaderEmployeeId: Array.isArray(employeeId) ? employeeId[0] : employeeId
            })
          }
          placeholder="请选择直属上级"
        />
      )
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      width: 170,
      render: (value: string, row: EmployeeRow) => (
        <Input
          value={value}
          maxLength={255}
          placeholder="请输入岗位"
          onChange={(e) => updateRow(row.userId, { postName: e.target.value })}
        />
      )
    },
    {
      title: '入职时间',
      dataIndex: 'entryTime',
      width: 190,
      render: (value: string, row: EmployeeRow) => (
        <DatePicker
          value={value ? dayjs(value) : undefined}
          showTime
          style={{ width: '100%' }}
          placeholder="请选择入职时间"
          onChange={(date: Dayjs | null) =>
            updateRow(row.userId, {
              entryTime: date ? date.format('YYYY-MM-DD HH:mm:ss') : undefined
            })
          }
        />
      )
    },
    {
      title: '聘用形式',
      dataIndex: 'type',
      width: 130,
      render: (value: number, row: EmployeeRow) => (
        <Select
          value={value}
          style={{ width: '100%' }}
          options={EMPLOYEE_TYPE_OPTIONS}
          onChange={(type) => handleTypeChange(row, type)}
        />
      )
    },
    {
      title: '试用期/状态',
      dataIndex: 'probation',
      width: 150,
      render: (_value: number | undefined, row: EmployeeRow) =>
        row.type === HrmEmployeeTypeEnum.FORMAL.type ? (
          // 正式员工：填写试用期月数
          <InputNumber
            value={row.probation}
            min={0}
            max={6}
            precision={0}
            style={{ width: '100%' }}
            placeholder="试用期"
            onChange={(probation) => updateRow(row.userId, { probation: probation ?? undefined })}
          />
        ) : (
          // 非正式员工：选择员工状态
          <Select
            value={row.status}
            style={{ width: '100%' }}
            options={nonFormalStatusOptions}
            placeholder="请选择状态"
            onChange={(status) => updateRow(row.userId, { status })}
          />
        )
    },
    {
      title: '操作',
      width: 70,
      fixed: 'right' as const,
      render: (_value: unknown, row: EmployeeRow) => (
        <Button type="link" danger size="small" onClick={() => removeRow(row.userId)}>
          移除
        </Button>
      )
    }
  ]

  return (
    <Modal
      title="从后台用户批量建档"
      open={visible}
      onCancel={() => setVisible(false)}
      width="96%"
      style={{ top: '4vh', maxWidth: 1280 }}
      footer={[
        <Button key="cancel" onClick={() => setVisible(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={submitLoading} onClick={handleSubmit}>
          确认建档
        </Button>
      ]}
    >
      <Row gutter={12} align="middle" style={{ marginBottom: 16 }}>
        <Col flex="none">
          <span style={{ whiteSpace: 'nowrap' }}>选择未建档用户</span>
        </Col>
        <Col flex="auto" style={{ maxWidth: 520 }}>
          <Select
            mode="multiple"
            value={selectedUserIds}
            loading={loading}
            style={{ width: '100%' }}
            placeholder="请选择后台用户"
            options={userOptions.map((option) => ({
              ...option,
              disabled: boundUserIds.includes(option.value)
            }))}
            optionFilterProp="label"
            showSearch
            onChange={handleUserChange}
          />
        </Col>
        <Col flex="auto">
          <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            已选择 {rows.length} 人，已绑定员工档案的用户不可选
          </span>
        </Col>
      </Row>

      <Table<EmployeeRow>
        rowKey="userId"
        columns={columns}
        dataSource={rows}
        loading={loading}
        pagination={false}
        size="small"
        scroll={{ y: 'calc(100vh - 420px)' }}
      />
    </Modal>
  )
}

export default EmployeeCreateFromUserForm
