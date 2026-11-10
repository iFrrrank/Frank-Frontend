import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Checkbox, Input, Modal, Radio, Tooltip, message } from 'antd'
import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { getEmployeeList, getEmployeeSimplePage } from '@/api/hrm/employee'
import { EMPLOYEE_ENTRY_STATUS } from '@/utils/constantsValue'
import { textConst } from '@/locales/zh-CN'
import DeptSelect from './DeptSelect'

type EmployeeSelectItem = API.HrmEmployeeRespVO & { id: number }

interface HrmEmployeeSelectProps {
  // 选中员工编号；多选时为数组
  value?: number | number[]
  onChange?: (value: number | number[] | undefined) => void
  multiple?: boolean
  disabled?: boolean
  // 禁选员工编号（例如不能选择自己作为直属上级）
  disabledIds?: number[]
  // 仅允许选择指定入职状态的员工
  entryStatus?: number
  clearable?: boolean
  placeholder?: string
  // 自定义是否可选的校验函数
  selectable?: (employee: API.HrmEmployeeRespVO) => boolean
  title?: string
  style?: React.CSSProperties
}

// 将选中值统一转换为员工编号数组
const normalizeIds = (value: number | number[] | undefined): number[] => {
  if (Array.isArray(value)) {
    return value
  }
  return value == null ? [] : [value]
}

// 员工选择器（对应 Vue 的 hrm/employee/components/HrmEmployeeSelect + HrmEmployeeSelectDialog）
// 只读输入框点击后弹出员工列表弹窗，支持单选 / 多选
const HrmEmployeeSelect: React.FC<HrmEmployeeSelectProps> = ({
  value,
  onChange,
  multiple = false,
  disabled = false,
  disabledIds = [],
  entryStatus,
  clearable = true,
  placeholder = '请选择员工',
  selectable,
  title = '选择员工',
  style
}) => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  // 回显已选员工，用于输入框展示姓名
  const [selectedItems, setSelectedItems] = useState<EmployeeSelectItem[]>([])
  // 弹窗中选中状态：多选为 id 集合，单选为 id
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const [checkedRadioId, setCheckedRadioId] = useState<number | undefined>(undefined)
  // 弹窗中当前页数据（确认时按选中 id 取完整行）
  const [tableRows, setTableRows] = useState<EmployeeSelectItem[]>([])

  const displayLabel = selectedItems.map((item) => item.name).join('、')

  // 值变化时回显员工姓名
  useEffect(() => {
    const ids = normalizeIds(value)
    if (!ids.length) {
      setSelectedItems([])
      return
    }
    // 已回显的数据与当前值一致时无需重复请求
    if (
      selectedItems.length === ids.length &&
      selectedItems.every((item, index) => item.id === ids[index])
    ) {
      return
    }
    getEmployeeList({ ids })
      .then((resp) => {
        const itemMap = new Map((resp.data || []).map((item) => [item.id, item]))
        setSelectedItems(
          ids.map((id) => itemMap.get(id)).filter((item): item is EmployeeSelectItem => !!item?.id)
        )
      })
      .catch(() => setSelectedItems([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  /** 员工是否禁选 */
  const isRowDisabled = useCallback(
    (row: API.HrmEmployeeRespVO): boolean => {
      if (row.id == null) {
        return true
      }
      return (
        disabledIds.includes(row.id) ||
        (entryStatus != null && row.entryStatus !== entryStatus) ||
        (selectable ? !selectable(row) : false)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabledIds.join(','), entryStatus]
  )

  /** 打开弹窗 */
  const openDialog = () => {
    if (disabled) {
      return
    }
    const ids = normalizeIds(value)
    setCheckedRadioId(multiple ? undefined : ids[0])
    setCheckedIds(multiple ? ids : [])
    setDialogVisible(true)
  }

  /** 清除已选员工 */
  const clearValue = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedItems([])
    onChange?.(multiple ? [] : undefined)
  }

  /** 确认选择 */
  const confirmSelect = (rows?: EmployeeSelectItem[]) => {
    const selectedRows =
      rows ||
      tableRows.filter((row) => (multiple ? checkedIds.includes(row.id) : checkedRadioId === row.id))
    if (!selectedRows.length) {
      message.warning('请选择员工')
      return
    }
    setSelectedItems(selectedRows)
    onChange?.(multiple ? selectedRows.map((row) => row.id) : selectedRows[0].id)
    setDialogVisible(false)
  }

  // 弹窗表格列：单选展示 radio 列，多选展示 checkbox
  const columns = useMemo<ProColumns<API.HrmEmployeeRespVO>[]>(() => {
    const selectColumn: ProColumns<API.HrmEmployeeRespVO> = multiple
      ? {
          title: '',
          dataIndex: 'select',
          width: 50,
          align: 'center',
          hideInSearch: true,
          render: (_, row) => {
            const item = row as EmployeeSelectItem
            return (
              <Checkbox
                disabled={isRowDisabled(row)}
                checked={item.id != null && checkedIds.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCheckedIds((prev) => [...prev, item.id])
                  } else {
                    setCheckedIds((prev) => prev.filter((id) => id !== item.id))
                  }
                }}
              />
            )
          }
        }
      : {
          title: '',
          dataIndex: 'select',
          width: 50,
          align: 'center',
          hideInSearch: true,
          render: (_, row) => {
            const item = row as EmployeeSelectItem
            return (
              <Radio
                disabled={isRowDisabled(row)}
                checked={checkedRadioId === item.id}
                onChange={() => setCheckedRadioId(item.id)}
              />
            )
          }
        }
    return [
      selectColumn,
      {
        title: '员工姓名',
        dataIndex: 'name',
        align: 'center',
        width: 120,
        fieldProps: { placeholder: '请输入员工姓名' }
      },
      {
        title: '工号',
        dataIndex: 'jobNumber',
        align: 'center',
        width: 110,
        fieldProps: { placeholder: '请输入工号' }
      },
      {
        title: '部门',
        dataIndex: 'deptId',
        align: 'center',
        width: 120,
        render: (_, row) => row.deptName || '-',
        renderFormItem: () => <DeptSelect placeholder="请选择部门" />
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        align: 'center',
        width: 130,
        hideInSearch: true
      },
      {
        title: '入职状态',
        dataIndex: 'entryStatus',
        align: 'center',
        width: 100,
        valueType: 'select',
        valueEnum: EMPLOYEE_ENTRY_STATUS,
        hideInSearch: true
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, checkedIds, checkedRadioId, isRowDisabled])

  return (
    <>
      {/* 只读输入框，点击打开选择弹窗；悬浮时可清除 */}
      <Tooltip title={displayLabel} placement="top">
        <Input
          readOnly
          value={displayLabel}
          placeholder={placeholder}
          disabled={disabled}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
          suffix={
            clearable && !disabled && displayLabel ? (
              <CloseCircleFilled onClick={clearValue} style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
            ) : (
              <SearchOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
            )
          }
          onClick={openDialog}
        />
      </Tooltip>

      {/* 员工选择弹窗 */}
      <Modal
        title={title}
        open={dialogVisible}
        width={960}
        onOk={() => confirmSelect()}
        onCancel={() => setDialogVisible(false)}
        okText={textConst.common.ok}
        cancelText={textConst.common.cancel}
        destroyOnHidden
      >
        <ProTable<API.HrmEmployeeRespVO>
          rowKey="id"
          columns={columns}
          cardBordered
          search={{ labelWidth: 'auto', defaultCollapsed: false }}
          options={false}
          pagination={{ pageSize: 10, align: 'center' }}
          tableAlertRender={false}
          onRow={(record) => ({
            onDoubleClick: () => {
              const item = record as EmployeeSelectItem
              if (item.id == null || isRowDisabled(record)) {
                return
              }
              if (multiple) {
                // 多选双击切换勾选状态
                setCheckedIds((prev) =>
                  prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                )
              } else {
                // 单选双击直接确认
                setCheckedRadioId(item.id)
                confirmSelect([item])
              }
            }
          })}
          request={async (params) => {
            const { current, pageSize, name, jobNumber, deptId } = params
            try {
              const resp = await getEmployeeSimplePage({
                pageReqVO: {
                  pageNo: current || 1,
                  pageSize: pageSize || 10,
                  ...(name ? { name } : {}),
                  ...(jobNumber ? { jobNumber } : {}),
                  ...(deptId ? { deptId: Number(deptId) } : {}),
                  ...(entryStatus != null ? { entryStatus } : {})
                }
              })
              const rows = (resp.data?.list || []) as EmployeeSelectItem[]
              setTableRows(rows)
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
      </Modal>
    </>
  )
}

export default HrmEmployeeSelect
