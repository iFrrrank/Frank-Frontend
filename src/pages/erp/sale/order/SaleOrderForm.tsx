import React, { useState } from 'react'
import { message, Form, Table, Col, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormUploadButton,
  EditableProTable,
  ProColumns,
  ProFormTextArea
} from '@ant-design/pro-components'
import { createSaleOrder, updateSaleOrder, getSaleOrder } from '@/api/erp/sale/order'
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'

interface SaleOrderFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const SaleOrderForm: React.FC<SaleOrderFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  const [dataSource, setDataSource] = useState<any[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  const handleItemChange = (val: readonly any[]) => {
    const newData = val.map((item) => {
      const count = Number(item.count || 0)
      const price = Number(item.price || 0)
      const taxPercent = Number(item.taxPercent || 0)

      const totalPrice = Number((count * price).toFixed(2))
      const taxPrice = Number(((totalPrice * taxPercent) / 100).toFixed(2))
      const taxTotalPrice = Number((totalPrice + taxPrice).toFixed(2))

      return { ...item, totalPrice, taxPrice, taxTotalPrice }
    })
    setDataSource(newData)
    calculateFooterTotal(newData)
  }

  const calculateFooterTotal = (items: any[]) => {
    const sumTaxTotalPrice = items.reduce((sum, item) => sum + (item.taxTotalPrice || 0), 0)
    const discountPercent = form.getFieldValue('discountPercent') || 0
    const discountPrice = form.getFieldValue('discountPrice') || 0

    const totalDiscounted = Number(
      (sumTaxTotalPrice * (1 - discountPercent / 100) - discountPrice).toFixed(2)
    )

    form.setFieldsValue({
      totalPrice: Math.max(totalDiscounted, 0)
    })
  }

  const handleFooterValueChange = () => {
    calculateFooterTotal(dataSource)
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
      title: '产品名称',
      dataIndex: 'productId',
      width: 150,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择产品',
        style: { width: '100%', textAlign: 'left' }
      },
      request: async () => []
    },
    {
      title: '数量',
      dataIndex: 'count',
      valueType: 'digit',
      width: 100,
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
      title: '金额',
      dataIndex: 'totalPrice',
      valueType: 'digit',
      width: 100,
      align: 'center',
      readonly: true
    },
    {
      title: '税率',
      dataIndex: 'taxPercent',
      valueType: 'digit',
      width: 120,
      align: 'center',
      fieldProps: {
        precision: 2,
        min: 0,
        max: 100,
        suffix: '%',
        placeholder: '请输入税率',
        style: { width: '100%', textAlign: 'center' }
      }
    },
    {
      title: '税额',
      dataIndex: 'taxPrice',
      valueType: 'digit',
      width: 90,
      align: 'center',
      readonly: true
    },
    {
      title: '税额合计',
      dataIndex: 'taxTotalPrice',
      valueType: 'digit',
      width: 90,
      align: 'center',
      readonly: true
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
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
          const resp = await getSaleOrder({ id } as any)
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
      onValuesChange={(changedValues) => {
        if ('discountPercent' in changedValues || 'discountPrice' in changedValues) {
          handleFooterValueChange()
        }
      }}
      onFinish={async (values) => {
        if (editableKeys.length > 0) return message.warning('请先保存产品清单中正在编辑的行！')
        if (dataSource.length === 0) return message.warning('请至少添加一条销售产品！')

        try {
          const submitData = { ...values, items: dataSource }
          if (isUpdate) {
            await updateSaleOrder({ id, ...submitData } as any)
            message.success('更新成功')
          } else {
            await createSaleOrder(submitData as any)
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
      <ProFormText
        name="no"
        label="订单单号"
        placeholder="保存时自动生成"
        disabled
        colProps={{ span: 8 }}
      />
      <ProFormDateTimePicker
        name="orderTime"
        label="订单时间"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        placeholder="请选择订单时间"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormSelect
        name="customerId"
        label="客户"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        placeholder="请选择客户"
        request={async () => []}
      />

      <ProFormSelect
        name="salesmanId"
        label="销售人员"
        colProps={{ span: 8 }}
        placeholder="请选择销售人员"
        request={async () => []}
      />
      {/* @ts-ignore */}
      <ProFormUploadButton
        name="fileUrl"
        label="附件"
        max={1}
        title="选取文件"
        colProps={{ span: 8 }}
      />
      <ProFormText name="remark" label="备注" colProps={{ span: 8 }} placeholder="请输入备注" />

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
            creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加销售产品',
            icon: editableKeys.length > 0 ? null : <PlusOutlined />
          }}
          editable={{ type: 'multiple', editableKeys, onChange: setEditableRowKeys }}
          bordered
          locale={{ emptyText: <div style={emptyTextStyle}>暂无数据</div> }}
          summary={(pageData) => {
            let totalCount = 0,
              totalPrice = 0,
              taxPrice = 0,
              taxTotalPrice = 0
            pageData.forEach((item) => {
              totalCount += Number(item.count || 0)
              totalPrice += Number(item.totalPrice || 0)
              taxPrice += Number(item.taxPrice || 0)
              taxTotalPrice += Number(item.taxTotalPrice || 0)
            })
            return (
              <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={2} align="center">
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
        fieldProps={{
          precision: 2,
          min: 0,
          max: 100,
          suffix: '%',
          placeholder: '请输入',
          style: { width: '100%' }
        }}
      />
      <ProFormDigit
        name="discountPrice"
        label="收款优惠"
        disabled
        colProps={{ span: 8 }}
        fieldProps={{
          precision: 2,
          min: 0,
          suffix: '元',
          placeholder: '0.00',
          style: { width: '100%' }
        }}
      />
      <ProFormDigit
        name="totalPrice"
        label="优惠后金额"
        colProps={{ span: 8 }}
        disabled
        fieldProps={{ precision: 2, suffix: '元', placeholder: '0.00' }}
      />
      <ProFormSelect
        name="accountId"
        label="结算账户"
        colProps={{ span: 8 }}
        fieldProps={{ placeholder: '请选择结算账户' }}
        request={async () => []}
      />
      <ProFormDigit
        name="depositPrice"
        label="收取订金"
        colProps={{ span: 8 }}
        fieldProps={{
          precision: 2,
          min: 0,
          suffix: '元',
          placeholder: '请输入订金金额',
          style: { width: '100%' }
        }}
      />
    </ModalForm>
  )
}

export default SaleOrderForm
