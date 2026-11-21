import React, { useState } from 'react'
import { Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  EditableProTable,
  ModalForm,
  ProColumns,
  ProFormText
} from '@ant-design/pro-components'
import {
  createPerformanceResultTemplate,
  getPerformanceResultTemplate,
  updatePerformanceResultTemplate
} from '@/api/hrm/performance/resultTemplate'
import { textConst } from '@/locales/zh-CN'

interface PerformanceResultTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

interface ResultLevel {
  id: string
  name?: string
  minScore?: number
  maxScore?: number
  coefficient?: number
}

// 绩效结果模板表单：名称 + 等级列表（等级名称、分数区间、绩效系数）
const PerformanceResultTemplateForm: React.FC<PerformanceResultTemplateFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [levels, setLevels] = useState<ResultLevel[]>([])
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([])

  const columns: ProColumns<ResultLevel>[] = [
    {
      title: '等级名称',
      dataIndex: 'name',
      width: 140,
      formItemProps: { rules: [{ required: true, message: '请输入等级名称' }] }
    },
    {
      title: '最低分数',
      dataIndex: 'minScore',
      valueType: 'digit',
      width: 120,
      fieldProps: { precision: 2, min: 0 }
    },
    {
      title: '最高分数',
      dataIndex: 'maxScore',
      valueType: 'digit',
      width: 120,
      fieldProps: { precision: 2, min: 0 }
    },
    {
      title: '绩效系数',
      dataIndex: 'coefficient',
      valueType: 'digit',
      width: 120,
      fieldProps: { precision: 2, min: 0 }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (_text, record, _index, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
        <a
          key="delete"
          style={{ color: '#ff4d4f' }}
          onClick={() => setLevels(levels.filter((item) => item.id !== record.id))}
        >
          删除
        </a>
      ]
    }
  ]

  return (
    <ModalForm
      title={isUpdate ? '编辑结果模板' : '新增结果模板'}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          setLevels([])
          setEditableKeys([])
        }
      }}
      width={720}
      modalProps={{ destroyOnHidden: true }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getPerformanceResultTemplate({ id } as any)
          const data = resp.data as any
          if (data) {
            setLevels(
              (data.levels || []).map((level: any, index: number) => ({
                ...level,
                id: `level_${index}`
              }))
            )
            return { name: data.name }
          }
        }
        setLevels([])
        return {}
      }}
      onFinish={async (values) => {
        if (editableKeys.length > 0) {
          message.warning('请先保存正在编辑的等级行')
          return false
        }
        if (levels.length === 0) {
          message.warning('请至少添加一个结果等级')
          return false
        }
        const submitLevels = levels.map(({ id: _rowId, ...rest }) => rest)
        try {
          if (isUpdate) {
            await updatePerformanceResultTemplate({ id, name: values.name, levels: submitLevels } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createPerformanceResultTemplate({ name: values.name, levels: submitLevels } as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProFormText
        name="name"
        label="模板名称"
        rules={[{ required: true, message: '请输入模板名称' }]}
        placeholder="请输入模板名称"
      />
      <EditableProTable<ResultLevel>
        rowKey="id"
        headerTitle="结果等级"
        value={levels}
        onChange={(value) => setLevels([...value])}
        columns={columns}
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel]
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              const rowId = `level_new_${Date.now()}`
              setLevels([...levels, { id: rowId }])
              setEditableKeys([...editableKeys, rowId])
            }}
          >
            添加等级
          </Button>
        ]}
      />
    </ModalForm>
  )
}

export default PerformanceResultTemplateForm
