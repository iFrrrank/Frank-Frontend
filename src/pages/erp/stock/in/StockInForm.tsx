import React, { useState } from 'react'
import { message, Form, Table, Col, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormUploadButton,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import { createStockIn, updateStockIn, getStockIn } from '@/api/erp/stock/in'
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'
import { text } from 'node:stream/consumers'
import { getProductSimpleList } from '@/api/erp/product/product'
import { getSupplierSimpleList } from '@/api/erp/purchase/supplier'
import { getWarehouseSimpleList } from '@/api/erp/stock/warehouse'

interface StockInFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const StockInForm: React.FC<StockInFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  const [dataSource, setDataSource] = useState<any[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  const handleItemChange = (val: readonly any[]) => {
    const newData = val.map((item) => {
      const count = Number(item.count || 0)
      const price = Number(item.price || 0)

      const totalPrice = Number((count * price).toFixed(2))

      return { ...item, totalPrice }
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
      width: 120,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择仓库',
        style: { width: '100%', textAlign: 'left' }
      },
      request: async () => {
        const res = await getWarehouseSimpleList()
        return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
      }
    },
    {
      title: '产品名称',
      dataIndex: 'productId',
      width: 130,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择产品',
        style: { width: '100%', textAlign: 'left' }
      },
      request: async () => {
        const res = await getProductSimpleList()
        return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
      }
    },
    {
      title: '库存',
      dataIndex: 'stock',
      valueType: 'digit',
      width: 80,
      align: 'center',
      readonly: true
    },
    { title: '条码', dataIndex: 'barCode', width: 80, align: 'center', readonly: true },
    {
      title: '数量',
      dataIndex: 'count',
      valueType: 'digit',
      width: 120,
      align: 'center',
      fieldProps: {
        min: 1,
        placeholder: '请输入数量',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '产品单价',
      dataIndex: 'price',
      valueType: 'digit',
      width: 130,
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
      width: 80,
      align: 'center',
      readonly: true
    },
    {
      title: textConst.table.action,
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
      width={1000}
      rowProps={{ gutter: 24 }}
      colProps={{ span: 8 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getStockIn({ id } as any)
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
        if (dataSource.length === 0) return message.warning('请至少添加一条入库产品！')

        try {
          const submitData = { ...values, items: dataSource }
          if (isUpdate) {
            await updateStockIn({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createStockIn(submitData as any)
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
        name="no"
        label="入库单号"
        placeholder="保存时自动生成"
        disabled
        colProps={{ span: 8 }}
      />
      <ProFormDateTimePicker
        name="inTime"
        label="入库时间"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        placeholder="请选择入库时间"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormSelect
        name="supplierId"
        label="供应商"
        colProps={{ span: 8 }}
        placeholder="请选择供应商"
        request={async () => {
        const res = await getSupplierSimpleList()
        return (res.data || []).map((item: any) => ({ label: item.name, value: item.id }))
      }}
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
            creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加入库产品',
            icon: editableKeys.length > 0 ? null : <PlusOutlined />
          }}
          editable={{ type: 'multiple', editableKeys, onChange: setEditableRowKeys }}
          bordered
          locale={{ emptyText: <div style={emptyTextStyle}>暂无数据</div> }}
          summary={(pageData) => {
            let totalCount = 0,
              totalPrice = 0
            pageData.forEach((item) => {
              totalCount += Number(item.count || 0)
              totalPrice += Number(item.totalPrice || 0)
            })
            return (
              <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={5} align="center">
                  <span style={{ fontWeight: 500 }}>合计</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {totalCount.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} align="center">
                  {totalPrice.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
              </Table.Summary.Row>
            )
          }}
        />
      </Col>
    </ModalForm>
  )
}

export default StockInForm
