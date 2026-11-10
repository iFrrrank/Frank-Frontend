import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { message, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as EmployeeConfigApi from '@/api/hrm/employee/config'
import { HrmEmployeeEntryStatusEnum } from '@/utils/constants'

export interface EmployeeCreateFieldConfigRef {
  submitForm: () => Promise<void>
}

export interface EmployeeCreateFieldConfigVO extends API.HrmEmployeeFieldConfigRespVO {
  activeVisible: boolean
  activeVisibleLocked: boolean
  pendingEntryVisible: boolean
  pendingEntryVisibleLocked: boolean
}

const EmployeeCreateFieldConfig = forwardRef<EmployeeCreateFieldConfigRef>((_props, ref) => {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<EmployeeCreateFieldConfigVO[]>([])

  /** 查询列表 */
  const getList = async () => {
    setLoading(true)
    try {
      const [activeResp, pendingEntryResp] = await Promise.all([
        EmployeeConfigApi.getEmployeeCreateFieldConfigList({
          entryStatus: HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus
        }),
        EmployeeConfigApi.getEmployeeCreateFieldConfigList({
          entryStatus: HrmEmployeeEntryStatusEnum.PENDING_ENTRY.entryStatus
        })
      ])
      const activeFields = activeResp.data || []
      const pendingEntryFields = pendingEntryResp.data || []
      const pendingEntryFieldMap = new Map(pendingEntryFields.map((field) => [field.name, field]))

      const mergedList: EmployeeCreateFieldConfigVO[] = activeFields.map((field) => {
        const pendingEntryField = pendingEntryFieldMap.get(field.name)
        return {
          ...field,
          activeVisible: field.visible,
          activeVisibleLocked: field.visibleLocked,
          pendingEntryVisible: pendingEntryField ? pendingEntryField.visible : false,
          pendingEntryVisibleLocked: pendingEntryField ? pendingEntryField.visibleLocked : false
        }
      })
      setList(mergedList)
    } finally {
      setLoading(false)
    }
  }

  /** 获取要保存的字段显示列表 */
  const getVisibleFields = (fieldKey: 'activeVisible' | 'pendingEntryVisible') => {
    return list.map((item) => ({
      name: item.name,
      visible: item[fieldKey]
    }))
  }

  /** 保存字段配置 */
  const submitForm = async () => {
    await Promise.all([
      EmployeeConfigApi.saveEmployeeCreateFieldConfig({
        entryStatus: HrmEmployeeEntryStatusEnum.ACTIVE.entryStatus,
        fields: getVisibleFields('activeVisible')
      }),
      EmployeeConfigApi.saveEmployeeCreateFieldConfig({
        entryStatus: HrmEmployeeEntryStatusEnum.PENDING_ENTRY.entryStatus,
        fields: getVisibleFields('pendingEntryVisible')
      })
    ])
    message.success('保存成功')
    await getList()
  }

  useImperativeHandle(ref, () => ({
    submitForm
  }))

  useEffect(() => {
    getList()
  }, [])

  const handleActiveVisibleChange = (name: string, checked: boolean) => {
    setList((prev) =>
      prev.map((item) => (item.name === name ? { ...item, activeVisible: checked } : item))
    )
  }

  const handlePendingEntryVisibleChange = (name: string, checked: boolean) => {
    setList((prev) =>
      prev.map((item) => (item.name === name ? { ...item, pendingEntryVisible: checked } : item))
    )
  }

  const columns: ColumnsType<EmployeeCreateFieldConfigVO> = [
    {
      title: '字段分组',
      dataIndex: 'groupName',
      width: 180
    },
    {
      title: '字段名称',
      dataIndex: 'title',
      minWidth: 220
    },
    {
      title: '新建在职员工',
      dataIndex: 'activeVisible',
      align: 'center',
      width: 180,
      render: (_, record) => (
        <Switch
          checked={record.activeVisible}
          disabled={record.activeVisibleLocked}
          onChange={(checked) => handleActiveVisibleChange(record.name, checked)}
        />
      )
    },
    {
      title: '新建待入职员工',
      dataIndex: 'pendingEntryVisible',
      align: 'center',
      width: 180,
      render: (_, record) => (
        <Switch
          checked={record.pendingEntryVisible}
          disabled={record.pendingEntryVisibleLocked}
          onChange={(checked) => handlePendingEntryVisibleChange(record.name, checked)}
        />
      )
    }
  ]

  return (
    <Table
      loading={loading}
      dataSource={list}
      columns={columns}
      rowKey="name"
      bordered
      pagination={false}
      size="middle"
    />
  )
})

export default EmployeeCreateFieldConfig

