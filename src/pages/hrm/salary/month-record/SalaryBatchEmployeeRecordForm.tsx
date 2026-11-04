import React, { useEffect, useState } from 'react'
import { Button, InputNumber, Modal, Space, Table, message } from 'antd'
import {
  getMonthEmployeeRecordList,
  updateMonthEmployeeRecordList
} from '@/api/hrm/salary/monthEmployeeRecord'
import { textConst } from '@/locales/zh-CN'
import { HRM_SALARY_COMPUTED_OPTION_CODES } from '../constants'

interface SalaryBatchEmployeeRecordFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  record?: API.HrmSalaryMonthRecordRespVO
  queryParams?: {
    employeeChangeType?: number
    employeeName?: string
    jobNumber?: string
    deptId?: number
  }
  onSuccess: () => void
}

const SalaryBatchEmployeeRecordForm: React.FC<SalaryBatchEmployeeRecordFormProps> = ({
  visible,
  setVisible,
  record,
  queryParams,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [list, setList] = useState<API.HrmSalaryMonthEmployeeRecordRespVO[]>([])
  const [editedEmployeeIdSet, setEditedEmployeeIdSet] = useState<Set<number>>(new Set())
  const [editableOptions, setEditableOptions] = useState<API.HrmSalaryOptionRespVO[]>([])

  // 获取明细叶子薪资项
  const getLeafOptions = (options?: API.HrmSalaryOptionRespVO[]): API.HrmSalaryOptionRespVO[] => {
    return (options || []).flatMap((cat) => (cat as any).children || [])
  }

  useEffect(() => {
    if (!visible || !record?.id) {
      setList([])
      setEditedEmployeeIdSet(new Set())
      return
    }

    setLoading(true)
    const leaves = getLeafOptions(record.optionHeaders).filter(
      (opt) => opt.code && !HRM_SALARY_COMPUTED_OPTION_CODES.has(opt.code)
    )
    setEditableOptions(leaves)

    getMonthEmployeeRecordList({
      monthRecordId: record.id,
      employeeChangeType: queryParams?.employeeChangeType,
      employeeName: queryParams?.employeeName,
      jobNumber: queryParams?.jobNumber,
      deptId: queryParams?.deptId
    } as any)
      .then((resp) => {
        setList(resp.data || [])
        setEditedEmployeeIdSet(new Set())
      })
      .finally(() => setLoading(false))
  }, [visible, record, queryParams])

  // 读取员工薪资项金额
  const getSalaryOptionValue = (
    empRecord: API.HrmSalaryMonthEmployeeRecordRespVO,
    optionCode?: number
  ): number => {
    if (!optionCode) return 0
    const item = empRecord.optionValues?.find((opt) => opt.code === optionCode)
    return Number(item?.value || 0)
  }

  // 修改员工薪资项金额
  const handleOptionValueChange = (empRecordId: number, optionCode: number, val: number | null) => {
    const num = Number(val || 0)
    setList((prev) =>
      prev.map((item) => {
        if (item.id !== empRecordId) return item

        const values = item.optionValues || []
        const exists = values.some((v) => v.code === optionCode)
        const nextValues = exists
          ? values.map((v) => (v.code === optionCode ? { ...v, value: num } : v))
          : [...values, { code: optionCode, value: num }]

        return { ...item, optionValues: nextValues }
      })
    )

    setEditedEmployeeIdSet((prev) => {
      const next = new Set(prev)
      next.add(empRecordId)
      return next
    })
  }

  // 关闭确认
  const handleCancel = () => {
    if (editedEmployeeIdSet.size > 0) {
      Modal.confirm({
        title: '放弃修改',
        content: '当前修改尚未保存，确定放弃编辑吗？',
        onOk: () => {
          setEditedEmployeeIdSet(new Set())
          setVisible(false)
        }
      })
    } else {
      setVisible(false)
    }
  }

  // 保存修改
  const handleSave = async () => {
    if (editedEmployeeIdSet.size === 0) {
      setVisible(false)
      return
    }

    setSaving(true)
    try {
      const payload: API.HrmSalaryMonthEmployeeRecordUpdateReqVO[] = list
        .filter((item) => item.id && editedEmployeeIdSet.has(item.id))
        .map((item) => ({
          id: item.id!,
          optionValues: (item.optionValues || []).map((opt) => ({
            code: opt.code,
            value: opt.value
          }))
        }))

      await updateMonthEmployeeRecordList(payload)
      message.success(textConst.msg.updateSuccess)
      setEditedEmployeeIdSet(new Set())
      setVisible(false)
      onSuccess()
    } finally {
      setSaving(false)
    }
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
      fixed: 'left' as const,
      width: 130
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      key: 'postName',
      fixed: 'left' as const,
      width: 130
    },
    ...editableOptions.map((opt) => ({
      title: opt.name,
      dataIndex: `opt_${opt.code}`,
      key: `opt_${opt.code}`,
      width: 140,
      align: 'right' as const,
      render: (_: any, row: API.HrmSalaryMonthEmployeeRecordRespVO) => (
        <InputNumber
          value={getSalaryOptionValue(row, opt.code)}
          precision={2}
          min={0}
          max={100000000}
          controls={false}
          style={{ width: '100%' }}
          onChange={(val) => row.id && opt.code && handleOptionValueChange(row.id, opt.code, val)}
        />
      )
    }))
  ]

  return (
    <Modal
      title="在线编辑工资"
      open={visible}
      onCancel={handleCancel}
      width="calc(100vw - 48px)"
      style={{ top: 20 }}
      destroyOnClose
      footer={
        <Space>
          <Button onClick={handleCancel}>放弃编辑</Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={saving}
            disabled={editedEmployeeIdSet.size === 0}
          >
            保 存
          </Button>
        </Space>
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
        pagination={false}
        size="small"
        bordered
        scroll={{ x: 'max-content', y: 'calc(100vh - 280px)' }}
      />
    </Modal>
  )
}

export default SalaryBatchEmployeeRecordForm
