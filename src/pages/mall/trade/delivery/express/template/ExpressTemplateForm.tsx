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
  const [dataSource, setDataSource] = useState<any[]>([])

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
      request: async () => [] // TODO
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
          {/* TODO：删除没有效果 */}
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => setDataSource(dataSource.filter((i) => i.id !== record.id))}
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
      request: async () => [] // TODO
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
          {/* TODO：删除没有效果 */}
          <a
            key="delete"
            style={deleteTextStyle}
            onClick={() => setDataSource(dataSource.filter((i) => i.id !== record.id))}
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

          if (data.charges) {
            data.charges = data.charges.map((item: any, idx: number) => ({
              ...item,
              id: `charge_${idx}`
            }))
            setEditableRowKeysCharges(data.charges.map((item: any) => item.id))
          }
          if (data.frees) {
            data.frees = data.frees.map((item: any, idx: number) => ({
              ...item,
              id: `free_${idx}`
            }))
            setEditableRowKeysFrees(data.frees.map((item: any) => item.id))
          }

          return data
        }
        return { chargeMode: 1, sort: 0 }
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateDeliveryExpressTemplate({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDeliveryExpressTemplate(values as any)
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
          value={dataSource}
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
          columns={freeColumns}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: `charge_new_${Date.now()}` }),
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
