import React, { useState } from 'react'
import { Button, Input, Modal, Select, Space, Switch, Table, Tag, message } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

export interface SlipTemplateOption {
  type: number // 1: 分类, 2: 工资项
  code?: number
  parentCode?: number
  name?: string
  sort?: number
  hidden?: boolean
  remark?: string
}

interface SalarySlipTemplateOptionEditorProps {
  value?: SlipTemplateOption[]
  onChange?: (value: SlipTemplateOption[]) => void
  maxHeight?: number
  extraActions?: React.ReactNode
}

const SalarySlipTemplateOptionEditor: React.FC<SalarySlipTemplateOptionEditorProps> = ({
  value = [],
  onChange,
  maxHeight = 420,
  extraActions
}) => {
  // 分类选项
  const categoryOptions = value
    .filter((item) => item.type === 1)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))

  // 整理展示顺序：分类优先排在所属项上方
  const displayOptions: SlipTemplateOption[] = []
  categoryOptions.forEach((cat) => {
    displayOptions.push(cat)
    displayOptions.push(
      ...value
        .filter((item) => item.type === 2 && item.parentCode === cat.code)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    )
  })
  displayOptions.push(
    ...value
      .filter((item) => item.type === 2 && !categoryOptions.some((c) => c.code === item.parentCode))
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
  )

  const handleAddCategory = () => {
    const codes = value.map((i) => i.code || 0).filter((c) => c < 0)
    const minCode = codes.length > 0 ? Math.min(...codes) : 0
    const newCode = minCode - 1
    const nextSort = Math.max(0, ...value.map((i) => i.sort || 0)) + 1

    const nextList = [
      ...value,
      {
        name: '新分类',
        type: 1,
        code: newCode,
        hidden: false,
        sort: nextSort
      }
    ]
    onChange?.(nextList)
  }

  const handleRemoveOption = (option: SlipTemplateOption) => {
    const nextList = value
      .filter((item) => item !== option)
      .map((item) =>
        option.type === 1 && item.parentCode === option.code
          ? { ...item, parentCode: undefined }
          : item
      )
    onChange?.(nextList)
  }

  const handleNameChange = (option: SlipTemplateOption, name: string) => {
    const nextList = value.map((item) => (item === option ? { ...item, name } : item))
    onChange?.(nextList)
  }

  const handleParentCodeChange = (option: SlipTemplateOption, parentCode?: number) => {
    const nextList = value.map((item) => (item === option ? { ...item, parentCode } : item))
    onChange?.(nextList)
  }

  const handleVisibleChange = (option: SlipTemplateOption, checked: boolean) => {
    const nextList = value.map((item) => (item === option ? { ...item, hidden: !checked } : item))
    onChange?.(nextList)
  }

  const handleRemarkChange = (option: SlipTemplateOption, remark: string) => {
    const nextList = value.map((item) => (item === option ? { ...item, remark } : item))
    onChange?.(nextList)
  }

  // 同级排序移动
  const getSiblings = (option: SlipTemplateOption) => {
    return value
      .filter((item) =>
        option.type === 1
          ? item.type === 1
          : item.type === 2 && item.parentCode === option.parentCode
      )
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
  }

  const moveOption = (option: SlipTemplateOption, offset: number) => {
    const siblings = getSiblings(option)
    const index = siblings.indexOf(option)
    const target = siblings[index + offset]
    if (!target) return

    const optSort = option.sort || 0
    const targetSort = target.sort || 0

    const nextList = value.map((item) => {
      if (item === option) return { ...item, sort: targetSort }
      if (item === target) return { ...item, sort: optSort }
      return item
    })
    onChange?.(nextList)
  }

  const columns = [
    {
      title: '类型',
      key: 'type',
      width: 90,
      align: 'center' as const,
      render: (_: any, record: SlipTemplateOption) =>
        record.type === 1 ? <Tag color="blue">分类</Tag> : <Tag>工资项</Tag>
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 160,
      render: (_: any, record: SlipTemplateOption) => (
        <Input
          value={record.name}
          maxLength={64}
          placeholder="请输入名称"
          onChange={(e) => handleNameChange(record, e.target.value)}
        />
      )
    },
    {
      title: '所属分类',
      key: 'parentCode',
      minWidth: 150,
      render: (_: any, record: SlipTemplateOption) => {
        if (record.type === 1) return '-'
        return (
          <Select
            value={record.parentCode}
            placeholder="不分类"
            allowClear
            style={{ width: '100%' }}
            onChange={(val) => handleParentCodeChange(record, val)}
            options={categoryOptions.map((c) => ({ label: c.name, value: c.code }))}
          />
        )
      }
    },
    {
      title: '显示',
      key: 'hidden',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: SlipTemplateOption) => (
        <Switch
          checked={!record.hidden}
          disabled={record.code === 240101} // 实发工资不可隐藏
          onChange={(checked) => handleVisibleChange(record, checked)}
        />
      )
    },
    {
      title: '备注',
      key: 'remark',
      minWidth: 180,
      render: (_: any, record: SlipTemplateOption) => (
        <Input
          value={record.remark}
          maxLength={255}
          placeholder="展示在工资条提示中"
          onChange={(e) => handleRemarkChange(record, e.target.value)}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      align: 'center' as const,
      render: (_: any, record: SlipTemplateOption) => {
        const siblings = getSiblings(record)
        const isFirst = siblings[0] === record
        const isLast = siblings[siblings.length - 1] === record

        return (
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<ArrowUpOutlined />}
              disabled={isFirst}
              onClick={() => moveOption(record, -1)}
            />
            <Button
              type="text"
              size="small"
              icon={<ArrowDownOutlined />}
              disabled={isLast}
              onClick={() => moveOption(record, 1)}
            />
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.code === 240101}
              onClick={() => handleRemoveOption(record)}
            />
          </Space>
        )
      }
    }
  ]

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddCategory}>
          新增分类
        </Button>
        {extraActions}
      </div>
      <Table
        columns={columns}
        dataSource={displayOptions}
        rowKey={(record, idx) => `${record.type}-${record.code ?? idx}`}
        pagination={false}
        size="small"
        scroll={{ y: maxHeight }}
        bordered
      />
    </div>
  )
}

export default SalarySlipTemplateOptionEditor
