import React, { useState } from 'react'
import { message, Form, Table, Col } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormUploadButton,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import PurchaseOrderSelectModal from './PurchaseOrderSelectModal'
import { createPurchaseIn, getPurchaseIn, updatePurchaseIn } from '@/api/erp/purchase/in'
import { getPurchaseOrder } from '@/api/erp/purchase/order'
import { getSupplierSimpleList } from '@/api/erp/purchase/supplier'
import { getProductSimpleList } from '@/api/erp/product/product'
import { getWarehouseSimpleList } from '@/api/erp/stock/warehouse'
import { getAccountSimpleList } from '@/api/erp/finance/account'
import { textConst } from '@/locales/zh-CN'
import {
  emptyTextStyle,
  tableActionStyle,
  deleteTextStyle,
  correlativeOrder
} from '@/styles/common.style'

interface PurchaseInboundFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const PurchaseInForm: React.FC<PurchaseInboundFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  const [dataSource, setDataSource] = useState<any[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [orderModalVisible, setOrderModalVisible] = useState(false)

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
    const otherPrice = form.getFieldValue('otherPrice') || 0

    const totalDiscounted = Number(
      (sumTaxTotalPrice * (1 - discountPercent / 100) - discountPrice).toFixed(2)
    )

    const payableAmount = Number((Math.max(totalDiscounted, 0) + otherPrice).toFixed(2))

    form.setFieldsValue({
      totalPrice: Math.max(totalDiscounted, 0),
      payableAmount: payableAmount
    })
  }

  const handleFooterValueChange = () => {
    calculateFooterTotal(dataSource)
  }

  const handleOrderSelect = async (record: any) => {
    form.setFieldsValue({
      orderNo: record.no,
      orderId: record.id,
      supplierId: record.supplierId
    })
    // 加载采购订单明细，按“订单数量 - 已入库数量”生成待入库清单
    try {
      const resp = await getPurchaseOrder({ id: record.id } as any)
      const items = ((resp.data as any)?.items || [])
        .map((item: any) => ({
          ...item,
          id: item.id?.toString(),
          orderItemId: item.id,
          count: Number(item.count || 0) - Number(item.inCount || 0)
        }))
        .filter((item: any) => item.count > 0)
      handleItemChange(items)
    } catch {
      // 明细加载失败时不阻断关联订单本身
    }
    message.success(`已关联采购订单：${record.no}`)
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
        return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      }
    },
    {
      title: '产品名称',
      dataIndex: 'productId',
      width: 120,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择产品',
        style: { width: '100%', textAlign: 'left' }
      },
      request: async () => {
        const res = await getProductSimpleList()
        return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
      }
    },
    {
      title: '库存',
      dataIndex: 'stock',
      valueType: 'digit',
      width: 50,
      align: 'center',
      readonly: true
    },
    { title: '条码', dataIndex: 'barCode', width: 50, align: 'center', readonly: true },
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
      width: 120,
      align: 'center',
      fieldProps: {
        min: 0.01,
        precision: 2,
        placeholder: '请输入单价',
        suffix: '元',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      valueType: 'digit',
      align: 'center',
      width: 50,
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
      align: 'center',
      width: 50,
      readonly: true
    },
    {
      title: '税额合计',
      dataIndex: 'taxTotalPrice',
      valueType: 'digit',
      width: 80,
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
    <>
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
        width={1200}
        rowProps={{ gutter: 24 }}
        colProps={{ span: 8 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={(changedValues) => {
          if (
            'discountPercent' in changedValues ||
            'discountPrice' in changedValues ||
            'otherPrice' in changedValues
          ) {
            handleFooterValueChange()
          }
        }}
        request={async () => {
          // 修改时加载入库单详情回填表单与清单
          if (isUpdate && id) {
            const resp = await getPurchaseIn({ id } as any)
            if (resp.data) {
              const items = ((resp.data as any).items || []).map((i: any) => ({
                ...i,
                id: i.id?.toString()
              }))
              setDataSource(items)
              return resp.data as Record<string, any>
            }
          }
          return {}
        }}
        onFinish={async (values) => {
          if (editableKeys.length > 0) {
            message.warning('请先保存清单中正在编辑的行！')
            return false
          }
          if (dataSource.length === 0) {
            message.warning('请至少添加一条入库产品！')
            return false
          }
          try {
            // 清单行提交时去掉前端临时行 id，避免与后端明细编号混淆
            const items = dataSource.map((item) => {
              const { id: _rowId, ...rest } = item
              return { ...rest, id: typeof item.id === 'number' ? item.id : undefined }
            })
            const submitData = { ...values, items }
            if (isUpdate) {
              await updatePurchaseIn({ id, ...submitData } as any)
              message.success(textConst.msg.updateSuccess)
            } else {
              await createPurchaseIn(submitData as any)
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
          placeholder={'请输入入库时间'}
          fieldProps={{ style: { width: '100%' } }}
        />
        <ProFormText
          name="orderNo"
          label="关联订单"
          colProps={{ span: 8 }}
          placeholder="请选择关联订单"
          fieldProps={{
            readOnly: true,
            addonAfter: (
              <div style={correlativeOrder} onClick={() => setOrderModalVisible(true)}>
                <SearchOutlined />
                <span>选择</span>
              </div>
            )
          }}
        />
        <ProFormSelect
          name="supplierId"
          label="供应商"
          rules={[{ required: true }]}
          colProps={{ span: 8 }}
          placeholder="请选择供应商"
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
          title="上传附件"
          colProps={{ span: 8 }}
        />
        <ProFormText name="remark" label="备注" placeholder="请输入备注" colProps={{ span: 8 }} />

        <Col span={24}>
          <EditableProTable<any>
            // headerTitle="入库产品清单"
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
            editable={{ type: 'multiple', editableKeys, onChange: setEditableRowKeys }}
            bordered
            locale={{
              emptyText: <div style={emptyTextStyle}>暂无数据</div>
            }}
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
            placeholder: '请输入优惠率',
            style: { width: '100%' }
          }}
        />
        <ProFormDigit
          name="discountPrice"
          label="付款优惠"
          colProps={{ span: 8 }}
          disabled
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
        <ProFormDigit
          name="otherPrice"
          label="其它费用"
          colProps={{ span: 8 }}
          fieldProps={{ precision: 2, min: 0, suffix: '元', placeholder: '请输入其他费用' }}
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
          name="payableAmount"
          label="应付金额"
          colProps={{ span: 8 }}
          disabled
          fieldProps={{ precision: 2, suffix: '元', placeholder: '0.00' }}
        />
      </ModalForm>

      <PurchaseOrderSelectModal
        visible={orderModalVisible}
        setVisible={setOrderModalVisible}
        onSelect={handleOrderSelect}
      />
    </>
  )
}

export default PurchaseInForm
