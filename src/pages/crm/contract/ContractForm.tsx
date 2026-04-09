import React, { useState, useEffect } from 'react'
import { message, Form, Col, Select, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import { createContract, updateContract, getContract } from '@/api/crm/contract'
import { getCustomerSimpleList } from '@/api/crm/customer'
import { getSimpleUserList } from '@/api/system/user'
import { getProductSimpleList } from '@/api/crm/product'
import { request } from '@umijs/max'
import { textConst } from '@/locales/zh-CN'
import { emptyTextStyle } from '@/styles/common.style'

interface ContractFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

interface ProductItem {
  key: string
  productId: number | undefined
  productName: string
  barCode: string
  unit: string
  price: number
  salePrice: number
  quantity: number
}

// 缓存
let customerOptionsCache: any[] | null = null
let userOptionsCache: any[] | null = null
let productOptionsCache: any[] | null = null

const ContractForm: React.FC<ContractFormProps> = ({ visible, setVisible, onSuccess, id }) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [productOptions, setProductOptions] = useState<any[]>([])

  useEffect(() => {
    const fetchProductOptions = async () => {
      if (productOptionsCache) {
        setProductOptions(productOptionsCache)
        return
      }
      try {
        const res = await getProductSimpleList()
        if (res.data) {
          const options = res.data.map((item: any) => ({
            label: item.name,
            value: item.id,
            item
          }))
          productOptionsCache = options
          setProductOptions(options)
        }
      } catch (e) {
        console.error('Failed to fetch products', e)
      }
    }
    if (visible) {
      fetchProductOptions()
    }
  }, [visible])

  // 计算金额
  const totalAmount = products.reduce(
    (sum, item) => sum + (item.salePrice || 0) * (item.quantity || 0),
    0
  )
  const discountAmount = totalAmount * (1 - (discount || 0) / 100)

  useEffect(() => {
    form.setFieldsValue({
      totalPrice: totalAmount.toFixed(2),
      discountPrice: discountAmount.toFixed(2)
    })
  }, [totalAmount, discountAmount, form])

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  const productColumns: ProColumns<ProductItem>[] = [
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
      align: 'center',
      formItemProps: { rules: [{ required: true, message: '产品不能为空' }], style: { margin: 0 } },
      renderFormItem: (_, { record }, formInstance) => (
        <Select
          showSearch
          placeholder="请选择产品"
          style={{ width: '100%', textAlign: 'left' }}
          optionFilterProp="label"
          options={productOptions}
          onChange={(value: number, option: any) => {
            const selectedProduct = option?.item
            if (selectedProduct && record?.key) {
              formInstance.setFieldsValue({
                [record.key]: {
                  ...formInstance.getFieldValue(record.key as string),
                  productId: selectedProduct.id,
                  productName: selectedProduct.name,
                  barCode: selectedProduct.barCode || '',
                  unit: selectedProduct.unit || '',
                  price: selectedProduct.price || 0,
                  salePrice: selectedProduct.price || 0,
                  quantity: 1
                }
              })
            }
          }}
        />
      ),
      render: (_, record) => record.productName
    },
    { title: '条码', dataIndex: 'barCode', width: 100, align: 'center', readonly: true },
    { title: '单位', dataIndex: 'unit', width: 60, align: 'center', readonly: true },
    {
      title: '价格（元）',
      dataIndex: 'price',
      width: 100,
      align: 'center',
      readonly: true,
      render: (_, record) => (record.price ? record.price.toFixed(2) : '0.00')
    },
    {
      title: '售价（元）',
      dataIndex: 'salePrice',
      width: 130,
      align: 'center',
      valueType: 'digit',
      fieldProps: { min: 0, precision: 2, controls: true, style: { width: '100%' } },
      formItemProps: { rules: [{ required: true, message: '请输入售价' }], style: { margin: 0 } }
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 130,
      align: 'center',
      valueType: 'digit',
      fieldProps: { min: 0.01, precision: 3, controls: true, style: { width: '100%' } },
      formItemProps: { rules: [{ required: true, message: '请输入数量' }], style: { margin: 0 } }
    },
    {
      title: '合计',
      dataIndex: 'total',
      width: 100,
      align: 'center',
      readonly: true,
      render: (_, record) => ((record.salePrice || 0) * (record.quantity || 0)).toFixed(2)
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      align: 'center',
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.key)}>
          <EditOutlined />
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除吗？"
          onConfirm={() => setProducts(products.filter((item) => item.key !== record.key))}
        >
          <a style={{ color: '#ff4d4f' }}>
            <DeleteOutlined />
          </a>
        </Popconfirm>
      ]
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
          setProducts([])
          setDiscount(0)
          setEditableRowKeys([])
          setVisible(false)
        }
      }}
      layout="horizontal"
      width={1200}
      grid={true}
      rowProps={{ gutter: [16, 0] }}
      colProps={{ span: 8 }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      colon={false}
      labelAlign="right"
      request={async () => {
        if (id !== undefined) {
          const resp = await getContract({ id })
          if (resp.data) {
            setDiscount(resp.data.discountPercent || 0)
            if (resp.data.products && resp.data.products.length > 0) {
              const loadedProducts = resp.data.products.map((p: any, idx: number) => ({
                key: `loaded_${p.productId}_${idx}`,
                productId: p.productId,
                productName: p.productName || '',
                barCode: p.barCode || '',
                unit: p.unit || '',
                price: p.price || 0,
                salePrice: p.price || 0,
                quantity: p.count || 1
              }))
              setProducts(loadedProducts)
            }
          }
          return resp.data as Record<string, any>
        }
        return {}
      }}
      onFinish={async (values) => {
        if (editableKeys.length > 0) {
          message.warning('请先保存正在编辑的产品信息！')
          return false
        }
        try {
          const submitData = {
            ...values,
            products: products.map((p) => ({
              productId: p.productId,
              count: p.quantity,
              price: p.salePrice
            })),
            discountPercent: discount,
            totalPrice: totalAmount,
            discountPrice: discountAmount
          }
          if (isUpdate) {
            await updateContract({ id, ...submitData } as any)
            message.success('更新成功')
          } else {
            await createContract(submitData as any)
            message.success('创建成功')
          }
          onSuccess()
          return true
        } catch (e) {
          message.error('操作失败')
          return false
        }
      }}
    >
      <ProFormText name="no" label="合同编号" placeholder="保存时自动生成" disabled />
      <ProFormText
        name="name"
        label="合同名称"
        rules={[{ required: true, message: '请输入合同名称' }]}
        placeholder="请输入合同名称"
      />
      <ProFormSelect
        name="ownerUserId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
        placeholder="请选择负责人"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          userOptionsCache =
            res.data?.map((item: any) => ({ label: item.nickname, value: item.id })) || []
          return userOptionsCache
        }}
      />
      <ProFormSelect
        name="customerId"
        label="客户"
        rules={[{ required: true, message: '请选择客户' }]}
        placeholder="请选择客户"
        showSearch
        request={async () => {
          if (customerOptionsCache) return customerOptionsCache
          const res = await getCustomerSimpleList()
          customerOptionsCache =
            res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
          return customerOptionsCache
        }}
      />
      <ProFormSelect
        name="businessId"
        label="商机名称"
        placeholder="请选择商机名称"
        showSearch
        request={async () => {
          // TODO: 替换为真实的商机列表 API
          const res = await request<any>('/crm/business/simple-list', { method: 'GET' })
          return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
        }}
      />
      <ProFormDatePicker
        name="orderDate"
        label="下单日期"
        rules={[{ required: true, message: '请选择下单日期' }]}
        fieldProps={{ placeholder: '请选择下单日期', style: { width: '100%' } }}
      />
      <ProFormDatePicker
        name="startTime"
        label="开始时间"
        fieldProps={{ placeholder: '请选择开始时间', style: { width: '100%' } }}
      />
      <ProFormDatePicker
        name="endTime"
        label="结束时间"
        fieldProps={{ placeholder: '请选择结束时间', style: { width: '100%' } }}
      />
      <ProFormSelect
        name="companySignerId"
        label="公司签约人"
        placeholder="请选择公司签约人"
        showSearch
        request={async () => userOptionsCache || []}
      />
      <ProFormSelect
        name="customerSignerId"
        label="客户签约人"
        placeholder="请选择客户签约人"
        showSearch
        request={async () => {
          const res = await request<any>('/crm/contact/simple-list', { method: 'GET' })
          return res.data?.map((item: any) => ({ label: item.name, value: item.id })) || []
        }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        colProps={{ span: 8 }}
        fieldProps={{ rows: 2 }}
        placeholder="请输入备注"
      />

      <Col span={24} style={{ marginTop: -23 }}>
        <EditableProTable<ProductItem>
          className="center-align-table"
          rowKey="key"
          headerTitle="产品清单"
          bordered
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({
              key: `new_${Date.now()}`,
              productId: undefined,
              productName: '',
              barCode: '',
              unit: '',
              price: 0,
              salePrice: 0,
              quantity: 1
            }),
            disabled: editableKeys.length > 0,
            creatorButtonText: editableKeys.length > 0 ? '请先保存当前行' : '添加产品',
            icon: editableKeys.length > 0 ? null : <PlusOutlined />
          }}
          columns={productColumns}
          value={products}
          onChange={(value) => setProducts(value as ProductItem[])}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys
          }}
          locale={{
            emptyText: <div style={emptyTextStyle}>暂无数据</div>
          }}
        />
      </Col>
      <ProFormText
        name="totalPrice"
        label="产品总金额"
        colProps={{ span: 8 }}
        disabled
        fieldProps={{ prefix: '￥' }}
      />
      <ProFormDigit
        name="discount"
        label="整单折扣(%)"
        colProps={{ span: 8 }}
        initialValue={0}
        fieldProps={{
          min: 0,
          max: 100,
          precision: 2,
          controls: true,
          onChange: (v: number | null) => setDiscount(v || 0)
        }}
      />
      <ProFormText
        name="discountPrice"
        label="折扣后金额"
        colProps={{ span: 8 }}
        disabled
        fieldProps={{ prefix: '￥' }}
      />
    </ModalForm>
  )
}

export default ContractForm
