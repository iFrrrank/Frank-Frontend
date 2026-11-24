import React, { useEffect, useState } from 'react'
import { Button, Card, message, Space } from 'antd'
import {
  EditableProTable,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { history, useSearchParams } from '@umijs/max'
import { getCodegenTable, updateCodegenTable } from '@/api/infra/codegen'
import { getMenuList } from '@/api/system/menu'
import { textConst } from '@/locales/zh-CN'

// 模板类型（字典 infra_codegen_template_type）
const TEMPLATE_TYPE_OPTIONS = [
  { label: '单表（增删改查）', value: 1 },
  { label: '树表（增删改查）', value: 2 },
  { label: '主子表（普通）', value: 3 },
  { label: '主子表（ERP）', value: 4 },
  { label: '主子表（内嵌）', value: 5 }
]

// 生成场景（字典 infra_codegen_scene）
const SCENE_OPTIONS = [
  { label: '管理后台', value: 1 },
  { label: '用户 APP', value: 2 }
]

// 前端类型（字典 infra_codegen_front_type）
const FRONT_TYPE_OPTIONS = [
  { label: 'Vue3 Element Plus', value: 20 },
  { label: 'Vue2 Element UI', value: 10 },
  { label: 'Vue3 Vben Ant Design', value: 30 }
]

const JAVA_TYPE_OPTIONS = [
  'Long',
  'String',
  'Integer',
  'Double',
  'BigDecimal',
  'LocalDateTime',
  'Boolean',
  'Date'
].map((value) => ({ label: value, value }))

const HTML_TYPE_OPTIONS = [
  { label: '文本框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期控件', value: 'datetime' },
  { label: '图片上传', value: 'imageUpload' },
  { label: '文件上传', value: 'fileUpload' },
  { label: '富文本控件', value: 'editor' }
]

const CONDITION_OPTIONS = ['=', '!=', '>', '>=', '<', '<=', 'LIKE', 'BETWEEN'].map((value) => ({
  label: value,
  value
}))

interface ColumnRow extends API.InfraCodegenColumnVO {
  rowId: string
}

// 代码生成表编辑：基本信息 + 生成信息 + 字段配置（可编辑表格）
const EditTable: React.FC = () => {
  const [searchParams] = useSearchParams()
  const tableId = Number(searchParams.get('id'))
  const [form] = ProForm.useForm()
  const [table, setTable] = useState<API.InfraCodegenTableSaveReqVO>()
  const [columns, setColumns] = useState<ColumnRow[]>([])
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!tableId) return
    getCodegenTable({ tableId }).then((resp) => {
      const data = resp.data as any
      if (data) {
        setTable(data.table)
        form.setFieldsValue(data.table)
        setColumns(
          (data.columns || []).map((column: any, index: number) => ({
            ...column,
            rowId: column.id ? String(column.id) : `col_${index}`
          }))
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId])

  const handleSave = async () => {
    if (editableKeys.length > 0) {
      message.warning('请先保存正在编辑的字段行')
      return
    }
    const values = await form.validateFields()
    setSaving(true)
    try {
      await updateCodegenTable({
        table: { ...table, ...values, id: table?.id },
        columns: columns.map(({ rowId: _rowId, ...rest }) => rest)
      } as any)
      message.success(textConst.msg.updateSuccess)
      history.push('/infra/codegen')
    } catch {
      message.error(textConst.error.operationFail)
    } finally {
      setSaving(false)
    }
  }

  const columnColumns: ProColumns<ColumnRow>[] = [
    { title: '字段列名', dataIndex: 'columnName', width: 140, readonly: true },
    { title: '字段描述', dataIndex: 'columnComment', width: 130 },
    { title: '物理类型', dataIndex: 'dataType', width: 110, readonly: true },
    {
      title: 'Java 类型',
      dataIndex: 'javaType',
      width: 130,
      valueType: 'select',
      fieldProps: { options: JAVA_TYPE_OPTIONS }
    },
    { title: 'Java 属性', dataIndex: 'javaField', width: 120 },
    { title: '字典类型', dataIndex: 'dictType', width: 120 },
    { title: '示例', dataIndex: 'example', width: 100 },
    {
      title: '可为空',
      dataIndex: 'nullable',
      width: 70,
      align: 'center',
      valueType: 'switch',
      render: (_, record) => <span>{record.nullable ? '是' : '否'}</span>
    },
    {
      title: '主键',
      dataIndex: 'primaryKey',
      width: 70,
      align: 'center',
      valueType: 'switch',
      render: (_, record) => <span>{record.primaryKey ? '是' : '否'}</span>
    },
    {
      title: '插入',
      dataIndex: 'createOperation',
      width: 70,
      align: 'center',
      valueType: 'switch',
      render: (_, record) => <span>{record.createOperation ? '是' : '否'}</span>
    },
    {
      title: '编辑',
      dataIndex: 'updateOperation',
      width: 70,
      align: 'center',
      valueType: 'switch',
      render: (_, record) => <span>{record.updateOperation ? '是' : '否'}</span>
    },
    {
      title: '列表',
      dataIndex: 'listOperation',
      width: 70,
      align: 'center',
      valueType: 'switch',
      render: (_, record) => <span>{record.listOperation ? '是' : '否'}</span>
    },
    {
      title: '查询条件',
      dataIndex: 'listOperationCondition',
      width: 110,
      valueType: 'select',
      fieldProps: { options: CONDITION_OPTIONS }
    },
    {
      title: '显示列表',
      dataIndex: 'listOperationResult',
      width: 80,
      align: 'center',
      valueType: 'switch',
      render: (_, record) => <span>{record.listOperationResult ? '是' : '否'}</span>
    },
    {
      title: '显示类型',
      dataIndex: 'htmlType',
      width: 120,
      valueType: 'select',
      fieldProps: { options: HTML_TYPE_OPTIONS }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 80,
      render: (_text, record, _index, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.rowId)}>
          编辑
        </a>
      ]
    }
  ]

  return (
    <PageContainer title="编辑代码生成配置" onBack={() => history.push('/infra/codegen')}>
      <ProForm form={form} submitter={false} layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <ProFormText name="tableName" label="表名称" disabled />
          <ProFormText name="tableComment" label="表描述" rules={[{ required: true }]} />
          <ProFormText name="className" label="实体类名称" rules={[{ required: true }]} />
          <ProFormText name="classComment" label="类描述" rules={[{ required: true }]} />
          <ProFormText name="author" label="作者" rules={[{ required: true }]} />
          <ProFormTextArea name="remark" label="备注" fieldProps={{ rows: 2 }} />
        </Card>

        <Card title="生成信息" style={{ marginBottom: 16 }}>
          <ProFormSelect
            name="templateType"
            label="模板类型"
            options={TEMPLATE_TYPE_OPTIONS}
            rules={[{ required: true }]}
          />
          <ProFormSelect name="scene" label="生成场景" options={SCENE_OPTIONS} rules={[{ required: true }]} />
          <ProFormSelect name="frontType" label="前端类型" options={FRONT_TYPE_OPTIONS} />
          <ProFormText name="moduleName" label="模块名称" rules={[{ required: true }]} />
          <ProFormText name="businessName" label="业务名称" rules={[{ required: true }]} />
          <ProFormSelect
            name="genType"
            label="生成方式"
            options={[
              { label: 'ZIP 压缩包', value: '0' },
              { label: '自定义路径', value: '1' }
            ]}
          />
          <ProFormDependency name={['genType']}>
            {({ genType }) =>
              genType === '1' ? <ProFormText name="genPath" label="生成路径" /> : null
            }
          </ProFormDependency>
          <ProFormTreeSelect
            name="parentMenuId"
            label="上级菜单"
            fieldProps={{ style: { width: '100%' } }}
            request={async () => {
              const resp = await getMenuList()
              const list = ((resp as any).data || []) as any[]
              const map = new Map<number, any>()
              list.forEach((item) =>
                map.set(item.id, { title: item.name, value: item.id, children: [] })
              )
              const roots: any[] = []
              list.forEach((item) => {
                const node = map.get(item.id)
                if (item.parentId && map.has(item.parentId)) {
                  map.get(item.parentId).children.push(node)
                } else {
                  roots.push(node)
                }
              })
              const prune = (nodes: any[]) =>
                nodes.forEach((node) => {
                  if (node.children.length === 0) delete node.children
                  else prune(node.children)
                })
              prune(roots)
              return roots
            }}
          />
          <ProFormDependency name={['templateType']}>
            {({ templateType }) =>
              templateType === 2 ? (
                <>
                  <ProFormSelect
                    name="treeParentColumnId"
                    label="树父字段"
                    options={columns.map((c) => ({ label: c.columnName, value: c.id }))}
                  />
                  <ProFormSelect
                    name="treeNameColumnId"
                    label="树名称字段"
                    options={columns.map((c) => ({ label: c.columnName, value: c.id }))}
                  />
                </>
              ) : templateType && templateType >= 3 ? (
                <>
                  <ProFormDigit name="masterTableId" label="主表编号" fieldProps={{ style: { width: '100%' } }} />
                  <ProFormSelect
                    name="subJoinColumnId"
                    label="子表关联字段"
                    options={columns.map((c) => ({ label: c.columnName, value: c.id }))}
                  />
                  <ProFormSwitch name="subJoinMany" label="关联多条" />
                </>
              ) : null
            }
          </ProFormDependency>
        </Card>
      </ProForm>

      <Card title="字段配置">
        <EditableProTable<ColumnRow>
          rowKey="rowId"
          value={columns}
          onChange={(value) => setColumns([...value])}
          columns={columnColumns}
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableKeys,
            actionRender: (row, config, dom) => [dom.save, dom.cancel]
          }}
          scroll={{ x: 'max-content' }}
        />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Space>
            <Button onClick={() => history.push('/infra/codegen')}>返回</Button>
            <Button type="primary" loading={saving} onClick={handleSave}>
              保存
            </Button>
          </Space>
        </div>
      </Card>
    </PageContainer>
  )
}

export default EditTable
