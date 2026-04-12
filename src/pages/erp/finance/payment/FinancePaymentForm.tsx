import React, { useState } from 'react'
import { message, Form, Table, Col, Divider, Button, Space } from 'antd'
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
import {
  createFinancePayment,
  updateFinancePayment,
  getFinancePayment
} from '@/api/erp/finance/payment'
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle, tableActionStyle, deleteTextStyle } from '@/styles/common.style'

interface FinancePaymentFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const FinancePaymentForm: React.FC<FinancePaymentFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()

  const [dataSource, setDataSource] = useState<any[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  // 动态金额计算
  const handleItemChange = (val: readonly any[]) => {
    setDataSource([...val])
    calculateFooterTotal([...val])
  }

  // 底部实际付款金额计算
  const calculateFooterTotal = (items: any[]) => {
    // 合计付款 = 累加明细中的“本次付款”金额
    const sumPayment = items.reduce((sum, item) => sum + Number(item.paymentPrice || 0), 0)
    const discountPrice = form.getFieldValue('discountPrice') || 0

    // 实际付款 = 合计付款 - 优惠金额
    const actualPayment = Number((Math.max(sumPayment, 0) - discountPrice).toFixed(2))

    form.setFieldsValue({
      totalPrice: sumPayment.toFixed(2),
      actualPrice: Math.max(actualPayment, 0).toFixed(2)
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
      title: '采购单据编号',
      dataIndex: 'bizNo',
      width: 160,
      align: 'center',
      fieldProps: {
        placeholder: '请输入单据编号',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      align: 'center',
      fieldProps: {
        placeholder: '请输入备注',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '应付金额',
      dataIndex: 'payablePrice',
      valueType: 'digit',
      width: 100,
      align: 'center',
      readonly: true
    },
    {
      title: '已付金额',
      dataIndex: 'paidPrice',
      valueType: 'digit',
      width: 100,
      align: 'center',
      readonly: true
    },
    {
      title: '本次付款',
      dataIndex: 'paymentPrice',
      valueType: 'digit',
      width: 130,
      align: 'center',
      fieldProps: {
        min: 0,
        precision: 2,
        suffix: '元',
        placeholder: '请输入付款金额',
        style: { width: '100%', textAlign: 'left' }
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
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
          const resp = await getFinancePayment({ id } as any)
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
        if ('discountPrice' in changedValues) {
          handleFooterValueChange()
        }
      }}
      onFinish={async (values) => {
        if (editableKeys.length > 0) return message.warning('请先保存清单中正在编辑的行！')
        if (dataSource.length === 0) return message.warning('请至少添加一条付款单据！')

        try {
          const submitData = { ...values, items: dataSource }
          if (isUpdate) {
            await updateFinancePayment({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createFinancePayment(submitData as any)
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
        label="付款单号"
        placeholder="保存时自动生成"
        disabled
        colProps={{ span: 8 }}
      />
      <ProFormDateTimePicker
        name="paymentTime"
        label="付款时间"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        placeholder="请选择付款时间"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormSelect
        name="supplierId"
        label="供应商"
        rules={[{ required: true }]}
        colProps={{ span: 8 }}
        placeholder="请选择供应商"
        request={async () => []}
      />
      <ProFormSelect
        name="financeId"
        label="财务人员"
        colProps={{ span: 8 }}
        placeholder="请选择财务人员"
        request={async () => []}
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

      <Col span={24} style={{ marginTop: -23 }}>
        <EditableProTable<any>
          rowKey="id"
          size="small"
          headerTitle="采购入库/退货单"
          columns={itemColumns}
          value={dataSource}
          onChange={handleItemChange}
          recordCreatorProps={false}
          toolBarRender={() => [
            <Button
              key="add-in"
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                const newRow = { id: Date.now().toString(), type: 'IN' }
                setDataSource([...dataSource, newRow])
                setEditableRowKeys([...editableKeys, newRow.id])
              }}
            >
              添加采购入库单
            </Button>,
            <Button
              key="add-return"
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                const newRow = { id: Date.now().toString(), type: 'RETURN' }
                setDataSource([...dataSource, newRow])
                setEditableRowKeys([...editableKeys, newRow.id])
              }}
            >
              添加采购退货单
            </Button>
          ]}
          editable={{ type: 'multiple', editableKeys, onChange: setEditableRowKeys }}
          bordered
          locale={{ emptyText: <div style={emptyTextStyle}>暂无数据</div> }}
        />
      </Col>

      <ProFormSelect
        name="accountId"
        label="付款账户"
        colProps={{ span: 8 }}
        fieldProps={{ placeholder: '请选择结算账户' }}
        request={async () => []}
      />
      <ProFormDigit
        name="totalPrice"
        label="合计付款"
        colProps={{ span: 8 }}
        disabled
        fieldProps={{ precision: 2, placeholder: '0.00', suffix: '元' }}
      />
      <ProFormDigit
        name="discountPrice"
        label="优惠金额"
        colProps={{ span: 8 }}
        fieldProps={{
          precision: 2,
          min: 0,
          placeholder: '0.00',
          suffix: '元',
          style: { width: '100%' }
        }}
      />
      <ProFormDigit
        name="actualPrice"
        label="实际付款"
        colProps={{ span: 8 }}
        disabled
        fieldProps={{ precision: 2, placeholder: '0.00', suffix: '元' }}
      />
    </ModalForm>
  )
}

export default FinancePaymentForm
