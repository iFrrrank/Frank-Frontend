import React, { useState } from 'react'
import { message, Form, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import {
  createDeliveryExpressTemplate,
  updateDeliveryExpressTemplate,
  getDeliveryExpressTemplate
} from '@/api/mall/trade/delivery/expressTemplate'
import { CHARGE_MODE_OPTIONS } from '@/utils/constantsValue'
import { getAreaTree } from '@/api/system/area'

// 地区树转换为 TreeSelect 数据（title/value/children）
const toAreaTreeData = (nodes: any[]): any[] =>
  (nodes || []).map((node) => ({
    title: node.name,
    value: node.id,
    children: node.children ? toAreaTreeData(node.children) : undefined
  }))

const loadAreaTreeData = async () => {
  const resp = await getAreaTree()
  return toAreaTreeData((resp.data as any[]) || [])
}
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'

interface DeliveryExpressTemplateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const ExpressTemplateForm: React.FC<DeliveryExpressTemplateFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [editableKeysCharges, setEditableRowKeysCharges] = useState<React.Key[]>([])
  const [editableKeysFrees, setEditableRowKeysFrees] = useState<React.Key[]>([])
  const chargeMode = Form.useWatch('chargeMode', form) || 1
  const [chargeDataSource, setChargeDataSource] = useState<any[]>([])
  const [freeDataSource, setFreeDataSource] = useState<any[]>([])

  const getDynamicTitle = (type: 'start' | 'extra' | 'free') => {
    const unitMap: Record<number, string> = { 1: '件', 2: '件重量(Kg)', 3: '件体积(m³)' }
    const unit = unitMap[chargeMode]
    if (type === 'start') return `首${unit}`
    if (type === 'extra') return `续${unit}`
    if (type === 'free') return `包邮${unit}`
    return ''
  }

  const chargeColumns: ProColumns<any>[] = [
    {
      title: '区域',
      dataIndex: 'areaIds',
      valueType: 'treeSelect',
      align: 'center',
      width: 150,
      fieldProps: {
        treeCheckable: true,
        showCheckedStrategy: 'SHOW_CHILD',
        placeholder: '请选择区域',
        maxTagCount: 2,
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '请选择区域' }] },
      request: loadAreaTreeData
    },
    {
      title: getDynamicTitle('start'),
      dataIndex: 'startCount',
      valueType: 'digit',
      align: 'center',
      width: 150,
      fieldProps: {
        min: 0.01,
        placeholder: '请输入数量',
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '该项为必填项！' }] }
    },
    {
      title: '运费(元)',
      dataIndex: 'startPrice',
      valueType: 'digit',
      align: 'center',
      width: 150,
      fieldProps: {
        min: 0,
        precision: 2,
        placeholder: '请输入金额',
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '请输入运费' }] }
    },
    {
      title: getDynamicTitle('extra'),
      dataIndex: 'extraCount',
      valueType: 'digit',
      align: 'center',
      width: 150,
      fieldProps: {
        min: 0.01,
        placeholder: '请输入数量',
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '该项为必填项！' }] }
    },
    {
      title: '续费(元)',
      dataIndex: 'extraPrice',
      valueType: 'digit',
      align: 'center',
      width: 150,
      fieldProps: {
        min: 0,
        precision: 2,
        placeholder: '请输入金额',
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '请输入续费金额' }] }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 130,
      align: 'center',
      render: (text, record, _, action) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => action?.startEditable?.(record.id)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => setChargeDataSource(chargeDataSource.filter((i) => i.id !== record.id))}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  const freeColumns: ProColumns<any>[] = [
    {
      title: '区域',
      dataIndex: 'areaIds',
      valueType: 'treeSelect',
      align: 'center',
      width: 150,
      fieldProps: {
        treeCheckable: true,
        showCheckedStrategy: 'SHOW_CHILD',
        placeholder: '请选择区域',
        maxTagCount: 2,
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '请选择区域' }] },
      request: loadAreaTreeData
    },
    {
      title: getDynamicTitle('free'),
      dataIndex: 'freeCount',
      valueType: 'digit',
      align: 'center',
      width: 150,
      fieldProps: {
        min: 1,
        placeholder: '请输入数量',
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '该项为必填项！' }] }
    },
    {
      title: '包邮金额(元)',
      dataIndex: 'freePrice',
      valueType: 'digit',
      align: 'center',
      width: 150,
      fieldProps: {
        min: 0,
        precision: 2,
        placeholder: '请输入金额',
        style: { width: '100%', textAlign: 'left' }
      },
      formItemProps: { rules: [{ required: true, message: '请输入包邮金额' }] }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 130,
      align: 'center',
      render: (text, record, _, action) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => action?.startEditable?.(record.id)}>
            {textConst.action.update}
          </a>
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => setChargeDataSource(chargeDataSource.filter((i) => i.id !== record.id))}
          >
            {textConst.action.delete}
          </a>
        </div>
      )
    }
  ]

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
          setEditableRowKeysCharges([])
          setEditableRowKeysFrees([])
          setChargeDataSource([])
          setFreeDataSource([])
        }
      }}
      colon={false}
      form={form}
      layout="horizontal"
      labelAlign="right"
      rowProps={{ gutter: 24 }}
      colProps={{ span: 8 }}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 22 }}
      width={1000}
      request={async () => {
        if (id !== undefined) {
          const resp = await getDeliveryExpressTemplate({ id } as any)
          const data = resp.data as Record<string, any>

          // 运费/包邮两张明细表的数据灌入各自的状态（表格为受控组件）
          const charges = (data.charges || []).map((item: any, idx: number) => ({
            ...item,
            id: `charge_${idx}`
          }))
          const frees = (data.frees || []).map((item: any, idx: number) => ({
            ...item,
            id: `free_${idx}`
          }))
          setChargeDataSource(charges)
          setFreeDataSource(frees)
          const { charges: _c, frees: _f, ...baseData } = data
          return baseData
        }
        return { chargeMode: 1, sort: 0 }
      }}
      onFinish={async (values) => {
        if (editableKeysCharges.length > 0 || editableKeysFrees.length > 0) {
          message.warning('请先保存表格中正在编辑的行！')
          return false
        }
        // 提交前剥掉前端临时行 id，后端按明细内容新建
        const stripRowId = (rows: any[]) =>
          rows.map((row) => {
            const { id: _rowId, ...rest } = row
            return rest
          })
        const submitData = {
          ...values,
          charges: stripRowId(chargeDataSource),
          frees: stripRowId(freeDataSource)
        }
        try {
          if (isUpdate) {
            await updateDeliveryExpressTemplate({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDeliveryExpressTemplate(submitData as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch (e) {
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
        colProps={{ span: 8 }}
      />
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        fieldProps={{ precision: 0 }}
        colProps={{ span: 8 }}
      />
      <ProFormRadio.Group
        name="chargeMode"
        label="计费方式"
        rules={[{ required: true, message: '请选择计费方式' }]}
        options={CHARGE_MODE_OPTIONS}
        colProps={{ span: 8 }}
      />
      <Col span={24} style={{ marginTop: -25 }}>
        <EditableProTable
          headerTitle="运费"
          rowKey="id"
          size="small"
          bordered
          value={chargeDataSource}
          onChange={(val) => setChargeDataSource(val as any[])}
          columns={chargeColumns}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: `charge_new_${Date.now()}` }),
            disabled: editableKeysCharges.length > 0,
            creatorButtonText: editableKeysCharges.length > 0 ? '请先保存当前行' : '添加运费规则',
            icon: <PlusOutlined />
          }}
          editable={{
            type: 'multiple',
            editableKeys: editableKeysCharges,
            onChange: setEditableRowKeysCharges
          }}
          locale={{
            emptyText: <div style={emptyTextStyle}>暂无数据</div>
          }}
        />
        <EditableProTable
          style={{ marginTop: -25 }}
          headerTitle="包邮区域"
          rowKey="id"
          size="small"
          bordered
          value={freeDataSource}
          onChange={(val) => setFreeDataSource(val as any[])}
          columns={freeColumns}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: `free_new_${Date.now()}` }),
            disabled: editableKeysFrees.length > 0,
            creatorButtonText: editableKeysFrees.length > 0 ? '请先保存当前行' : '添加包邮区域',
            icon: <PlusOutlined />
          }}
          editable={{
            type: 'multiple',
            editableKeys: editableKeysFrees,
            onChange: setEditableRowKeysFrees
          }}
          locale={{
            emptyText: <div style={emptyTextStyle}>暂无数据</div>
          }}
        />
      </Col>
    </ModalForm>
  )
}

export default ExpressTemplateForm
