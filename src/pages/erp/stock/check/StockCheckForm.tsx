import React, { useState } from 'react'
import { message, Form, Col, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormDateTimePicker,
  ProFormUploadButton,
  EditableProTable,
  ProColumns,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createStockCheck, updateStockCheck, getStockCheck } from '@/api/erp/stock/check'
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'

interface StockCheckFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const StockCheckForm: React.FC<StockCheckFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  const [dataSource, setDataSource] = useState<any[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  // 动态计算盈亏数量和金额
  const handleItemChange = (val: readonly any[]) => {
    const newData = val.map((item) => {
      const stock = Number(item.stock || 0)
      const actualCount = Number(item.actualCount || 0)
      const price = Number(item.price || 0)

      // 盈亏数量 = 实际库存 - 账面库存
      const diffCount = actualCount - stock
      // 合计金额：基于实际盘点数量计算，若业务要求基于盈亏计算，可改为 diffCount * price
      const totalPrice = Number((actualCount * price).toFixed(2))

      return { ...item, diffCount, totalPrice }
    })
    setDataSource(newData)
  }

  const itemColumns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      align: 'center',
      readonly: true
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseId',
      width: 100,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择仓库',
        style: { width: '100%', textAlign: 'left' }
      },
      request: async () => []
    },
    {
      title: '产品名称',
      dataIndex: 'productId',
      width: 100,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择产品',
        style: { width: '100%', textAlign: 'left' }
      },
      request: async () => []
    },
    {
      title: '账面库存',
      dataIndex: 'stock',
      valueType: 'digit',
      width: 90,
      align: 'center',
      readonly: true
    },
    {
      title: '实际库存',
      dataIndex: 'actualCount',
      valueType: 'digit',
      width: 130,
      align: 'center',
      fieldProps: {
        min: 0,
        placeholder: '请输入实际库存',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '盈亏数量',
      dataIndex: 'diffCount',
      valueType: 'digit',
      width: 80,
      align: 'center',
      readonly: true,
      render: (_, record: any) => {
        const diff = Number(record.diffCount || 0)
        return (
          <span style={{ color: diff > 0 ? '#52c41a' : diff < 0 ? '#ff4d4f' : 'inherit' }}>
            {diff}
          </span>
        )
      }
    },
    {
      title: '产品单价',
      dataIndex: 'price',
      valueType: 'digit',
      width: 120,
      align: 'center',
      fieldProps: {
        min: 0,
        precision: 2,
        suffix: '元',
        placeholder: '请输入单价',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '合计金额',
      dataIndex: 'totalPrice',
      valueType: 'digit',
      width: 100,
      align: 'center',
      readonly: true,
      fieldProps: {
        precision: 2
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 130,
      fixed: 'right',
      align: 'center',
      render: (text, record, _, action) => (
        <div style={tableActionStyle}>
          <a key="update" onClick={() => action?.startEditable?.(record.id)}>
            {textConst.action.update}
          </a>
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
      onOpenChange={setVisible}
      form={form}
      layout="horizontal"
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          form.resetFields()
          setDataSource([])
        }
      }}
      grid={true}
      colon={false}
      labelAlign="right"
      width={1100}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 8 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getStockCheck({ id } as any)
          if (resp.data) {
            const items = resp.data.items || []
            setDataSource(
              items.map((i: any) => ({ ...i, id: i.id?.toString() || Math.random().toString() }))
            )
          }
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        if (editableKeys.length > 0) return message.warning('请先保存产品清单中正在编辑的行！')
        if (dataSource.length === 0) return message.warning('请至少添加一条盘点产品！')

        try {
          const submitData = { ...values, items: dataSource }
          if (isUpdate) {
            await updateStockCheck({ id, ...submitData } as any)
            message.success('更新成功')
          } else {
            await createStockCheck(submitData as any)
            message.success('新增成功')
          }
          onSuccess()
          return true
        } catch (e) {
          message.error('操作失败')
          return false
        }
      }}
    >
      {/* --- 顶部基础信息 --- */}
      <ProFormText
        name="no"
        label="盘点单号"
        placeholder="保存时自动生成"
        disabled
        colProps={{ span: 8 }}
      />
      <ProFormDateTimePicker
        name="checkTime"
        label="盘点时间"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        placeholder="请选择盘点时间"
        fieldProps={{ style: { width: '100%' } }}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="fileUrl"
        label="附件"
        max={1}
        title="上传附件"
        colProps={{ span: 8 }}
      />
      <ProFormText name="remark" label="备注" placeholder="请输入备注" colProps={{ span: 8 }} />

      <Col span={24}>
        <EditableProTable<any>
          rowKey="id"
          size="small"
          columns={itemColumns}
          value={dataSource}
          onChange={handleItemChange}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: Date.now().toString() }),
            disabled: editableKeys.length > 0,
            creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加盘点产品',
            icon: editableKeys.length > 0 ? null : <PlusOutlined />
          }}
          editable={{ type: 'multiple', editableKeys, onChange: setEditableRowKeys }}
          bordered
          locale={{ emptyText: <div style={emptyTextStyle}>暂无数据</div> }}
        />
      </Col>
    </ModalForm>
  )
}

export default StockCheckForm
