import React, { useState, useEffect } from 'react'
import { message, Form, Col, Table } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormTextArea,
  ProFormDigit,
  ProFormUploadButton,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import { PlusOutlined } from '@ant-design/icons'
import {
  createPurchaseOrder,
  updatePurchaseOrder,
  getPurchaseOrder
} from '@/api/erp/purchase/order'
import { textConst } from '@/locales/zh-CN'
import { tableActionStyle, deleteTextStyle, emptyTextStyle } from '@/styles/common.style'
import { getSupplierSimpleList } from '@/api/erp/purchase/supplier'
import { getAccountSimpleList } from '@/api/erp/finance/account'
import { getProductSimpleList } from '@/api/erp/product/product'

interface PurchaseOrderFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

type OrderItem = {
  id: string
  productId?: number
  count?: number
  price?: number
  totalPrice?: number
  taxPercent?: number
  taxPrice?: number
  taxTotalPrice?: number
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<OrderItem[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  const handleItemChange = (val: readonly OrderItem[]) => {
    const newData = val.map((item) => {
      const count = item.count || 0
      const price = item.price || 0
      const taxPercent = item.taxPercent || 0
      const totalPrice = Number((count * price).toFixed(2))
      const taxPrice = Number(((totalPrice * taxPercent) / 100).toFixed(2))
      const taxTotalPrice = Number((totalPrice + taxPrice).toFixed(2))

      return { ...item, totalPrice, taxPrice, taxTotalPrice }
    })
    setDataSource(newData)
  }

  const itemColumns: ProColumns<OrderItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
      align: 'center',
      readonly: true
    },
    {
      title: '产品名称',
      dataIndex: 'productId',
      width: 120,
      align: 'center',
      fieldProps: {
        placeholder: '请选择产品',
        style: { width: '100%', textAlign: 'left' }
      },
      valueType: 'select',
      request: async () => {
        const res = await getProductSimpleList()
        return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      },
      formItemProps: { rules: [{ required: true, message: '请选择产品' }] }
    },
    {
      title: '数量',
      dataIndex: 'count',
      align: 'center',
      valueType: 'digit',
      width: 120,
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
        precision: 2,
        min: 0,
        suffix: '元',
        placeholder: '请输入单价',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '金额(元)',
      dataIndex: 'totalPrice',
      align: 'center',
      valueType: 'digit',
      width: 90,
      readonly: true
    },
    {
      title: '税率(%)',
      dataIndex: 'taxPercent',
      valueType: 'digit',
      width: 120,
      align: 'center',
      fieldProps: {
        precision: 2,
        min: 0,
        max: 100,
        placeholder: '请输入税率',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '税额',
      dataIndex: 'taxPrice',
      valueType: 'digit',
      width: 100,
      align: 'center',
      readonly: true
    },
    {
      title: '税额合计',
      dataIndex: 'taxTotalPrice',
      valueType: 'digit',
      align: 'center',
      width: 120,
      readonly: true
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
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
      modalProps={{
        destroyOnHidden: true,
        onCancel: () => {
          form.resetFields()
          setDataSource([])
          setEditableRowKeys([])
          setVisible(false)
        }
      }}
      grid={true}
      rowProps={{ gutter: 24 }}
      layout="horizontal"
      width={1100}
      colon={false}
      labelAlign="right"
      colProps={{ span: 8 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      request={async () => {
        if (id !== undefined) {
          const resp = await getPurchaseOrder({ id })
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
        if (editableKeys.length > 0) {
          message.warning('请先保存产品清单中正在编辑的行！')
          return false
        }
        if (dataSource.length === 0) {
          message.warning('请至少添加一条采购产品！')
          return false
        }
        try {
          const submitData = { ...values, items: dataSource }
          if (isUpdate) {
            await updatePurchaseOrder({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createPurchaseOrder(submitData as any)
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
        label="订单号"
        placeholder="保存时自动生成"
        disabled
        colProps={{ span: 8 }}
      />
      <ProFormDateTimePicker
        name="orderTime"
        label="订单时间"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
      />
      <ProFormSelect
        name="supplierId"
        label="供应商"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        request={async () => {
          const res = await getSupplierSimpleList()
          return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
        }}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="fileUrl"
        label="附件"
        max={1}
        title="选取文件"
        colProps={{ span: 8 }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        colProps={{ span: 16 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        fieldProps={{ rows: 2 }}
      />

      <Col span={24} style={{ marginTop: -20 }}>
        <EditableProTable<OrderItem>
          headerTitle="采购产品清单"
          rowKey="id"
          size="small"
          columns={itemColumns}
          value={dataSource}
          onChange={handleItemChange}
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({ id: Date.now().toString() }),
            disabled: editableKeys.length > 0,
            creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加采购产品',
            icon: editableKeys.length > 0 ? null : <PlusOutlined />
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, config, defaultDoms) => [defaultDoms.save, defaultDoms.cancel]
          }}
          bordered
          locale={{
            emptyText: <div style={emptyTextStyle}>暂无数据</div>
          }}
          summary={(pageData) => {
            let totalCount = 0
            let totalPrice = 0
            let taxPrice = 0
            let taxTotalPrice = 0

            pageData.forEach((item) => {
              totalCount += Number(item.count || 0)
              totalPrice += Number(item.totalPrice || 0)
              taxPrice += Number(item.taxPrice || 0)
              taxTotalPrice += Number(item.taxTotalPrice || 0)
            })

            return (
              <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                {/* 序号和产品名称合并为"合计"列 */}
                <Table.Summary.Cell index={0} colSpan={2} align="center">
                  <span style={{ fontWeight: 500 }}>合计</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="center">
                  {totalCount.toFixed(3)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} align="center">
                  {totalPrice.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} align="center">
                  {taxPrice.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="center">
                  {taxTotalPrice.toFixed(2)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} />
              </Table.Summary.Row>
            )
          }}
        />
      </Col>

      <ProFormDigit
        name="discountPercent"
        label="优惠率"
        colProps={{ span: 8 }}
        fieldProps={{ precision: 2, min: 0, max: 100, placeholder: '请输入优惠率', suffix: '%' }}
      />
      <ProFormDigit
        name="discountPrice"
        label="付款优惠"
        disabled
        placeholder={'0.00'}
        colProps={{ span: 8 }}
        fieldProps={{ precision: 2, min: 0, suffix: '元' }}
      />
      <ProFormDigit
        name="totalPrice"
        label="优惠后金额"
        colProps={{ span: 8 }}
        placeholder={'0.00'}
        disabled
        fieldProps={{ precision: 2, suffix: '元' }}
      />
      <ProFormSelect
        name="accountId"
        label="结算账户"
        colProps={{ span: 8 }}
        fieldProps={{ placeholder: '请选择结算账户' }}
        request={async () => {
          const res = await getAccountSimpleList()
          return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
        }}
      />
      <ProFormDigit
        name="depositPrice"
        label="支付订金"
        colProps={{ span: 8 }}
        fieldProps={{ precision: 2, min: 0, placeholder: '请输入订金金额', suffix: '元' }}
      />
    </ModalForm>
  )
}

export default PurchaseOrderForm
