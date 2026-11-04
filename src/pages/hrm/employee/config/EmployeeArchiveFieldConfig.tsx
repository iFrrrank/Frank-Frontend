import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { message, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import * as EmployeeConfigApi from '@/api/hrm/employee/config'

export interface EmployeeArchiveFieldConfigRef {
  submitForm: () => Promise<void>
}

const EmployeeArchiveFieldConfig = forwardRef<EmployeeArchiveFieldConfigRef>((_props, ref) => {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<API.HrmEmployeeFieldConfigRespVO[]>([])

  /** 查询列表 */
  const getList = async () => {
    setLoading(true)
    try {
      const resp = await EmployeeConfigApi.getEmployeeArchiveFieldConfigList()
      setList(resp.data || [])
    } finally {
      setLoading(false)
    }
  }

  /** 切换显示状态 */
  const handleVisibleChange = (record: API.HrmEmployeeFieldConfigRespVO, checked: boolean) => {
    setList((prev) =>
      prev.map((item) => {
        if (item.name === record.name) {
          return {
            ...item,
            visible: checked,
            editable: !checked ? false : item.editable
          }
        }
        return item
      })
    )
  }

  /** 切换编辑状态 */
  const handleEditableChange = (record: API.HrmEmployeeFieldConfigRespVO, checked: boolean) => {
    setList((prev) =>
      prev.map((item) => {
        if (item.name === record.name) {
          return {
            ...item,
            editable: checked,
            visible: checked ? true : item.visible
          }
        }
        return item
      })
    )
  }

  /** 保存字段配置 */
  const submitForm = async () => {
    await EmployeeConfigApi.saveEmployeeArchiveFieldConfig({
      fields: list.map((item) => ({
        name: item.name,
        visible: item.visible,
        editable: item.editable
      }))
    })
    message.success('保存成功')
    await getList()
  }

  useImperativeHandle(ref, () => ({
    submitForm
  }))

  useEffect(() => {
    getList()
  }, [])

  const columns: ColumnsType<API.HrmEmployeeFieldConfigRespVO> = [
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
      title: '员工是否可见',
      dataIndex: 'visible',
      align: 'center',
      width: 160,
      render: (_, record) => (
        <Switch
          checked={record.visible}
          disabled={record.visibleLocked}
          onChange={(checked) => handleVisibleChange(record, checked)}
        />
      )
    },
    {
      title: '员工是否可编辑',
      dataIndex: 'editable',
      align: 'center',
      width: 160,
      render: (_, record) => (
        <Switch
          checked={!!record.editable}
          disabled={!record.visible || record.editableLocked}
          onChange={(checked) => handleEditableChange(record, checked)}
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

export default EmployeeArchiveFieldConfig

