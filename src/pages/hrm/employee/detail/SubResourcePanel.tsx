import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProColumns,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { textConst } from '@/locales/zh-CN'
import { handleDelete } from '@/components/Delete'
import dayjs from 'dayjs'

// 子资源表单字段描述：按类型渲染对应 ProForm 组件
export interface SubFormField {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'date' | 'digit' | 'select'
  options?: { label: string; value: any }[]
  required?: boolean
}

interface SubResourcePanelProps {
  employeeId: number
  // 列表加载：返回该员工的子资源数组
  loadList: (employeeId: number) => Promise<any[]>
  createFn: (body: any) => Promise<any>
  updateFn: (body: any) => Promise<any>
  deleteFn: (params: any) => Promise<any>
  columns: ProColumns<any>[]
  formFields: SubFormField[]
  addText: string
}

// 员工详情子资源通用面板：联系人/合同/证书/教育/工作/培训经历共用增删改查结构
const SubResourcePanel: React.FC<SubResourcePanelProps> = ({
  employeeId,
  loadList,
  createFn,
  updateFn,
  deleteFn,
  columns,
  formFields,
  addText
}) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [editing, setEditing] = useState<any>()

  const load = async () => {
    setLoading(true)
    try {
      setData((await loadList(employeeId)) || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId])

  const fullColumns: ProColumns<any>[] = [
    ...columns,
    {
      title: textConst.table.action,
      valueType: 'option',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <div style={tableActionStyle}>
          <a
            onClick={() => {
              setEditing(record)
              setFormVisible(true)
            }}
          >
            {textConst.action.update}
          </a>
          <a style={deleteTextStyle} onClick={() => handleDelete(record, deleteFn, load)}>
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  const renderField = (field: SubFormField) => {
    const common = {
      key: field.name,
      name: field.name,
      label: field.label,
      rules: field.required ? [{ required: true, message: `请填写${field.label}` }] : undefined
    }
    switch (field.type) {
      case 'textarea':
        return <ProFormTextArea {...common} fieldProps={{ rows: 2 }} />
      case 'date':
        return <ProFormDatePicker {...common} fieldProps={{ style: { width: '100%' } }} />
      case 'digit':
        return <ProFormDigit {...common} fieldProps={{ style: { width: '100%' } }} />
      case 'select':
        return <ProFormSelect {...common} options={field.options} />
      default:
        return <ProFormText {...common} />
    }
  }

  return (
    <>
      <ProTable<any>
        rowKey="id"
        columns={fullColumns}
        dataSource={data}
        loading={loading}
        search={false}
        options={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setEditing(undefined)
              setFormVisible(true)
            }}
          >
            <PlusOutlined /> {addText}
          </Button>
        ]}
      />
      <ModalForm
        title={editing ? `编辑${addText.replace('添加', '')}` : addText}
        open={formVisible}
        onOpenChange={setFormVisible}
        width={560}
        modalProps={{ destroyOnHidden: true }}
        initialValues={
          editing
            ? {
                ...editing,
                // 日期字段转 dayjs 供日期选择器回显
                ...Object.fromEntries(
                  formFields
                    .filter((f) => f.type === 'date' && editing[f.name])
                    .map((f) => [f.name, dayjs(editing[f.name])])
                )
              }
            : undefined
        }
        onFinish={async (values) => {
          // 日期字段统一格式化为字符串提交
          const body: Record<string, any> = { ...values, employeeId }
          formFields
            .filter((f) => f.type === 'date')
            .forEach((f) => {
              const v = body[f.name]
              if (v && typeof v !== 'string') {
                body[f.name] = dayjs(v).format('YYYY-MM-DD HH:mm:ss')
              }
            })
          try {
            if (editing?.id) {
              await updateFn({ ...body, id: editing.id })
              message.success(textConst.msg.updateSuccess)
            } else {
              await createFn(body)
              message.success(textConst.msg.createSuccess)
            }
            load()
            return true
          } catch {
            message.error(textConst.error.operationFail)
            return false
          }
        }}
      >
        {formFields.map(renderField)}
      </ModalForm>
    </>
  )
}

export default SubResourcePanel
