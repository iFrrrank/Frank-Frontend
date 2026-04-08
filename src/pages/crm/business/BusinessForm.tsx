import React, { useState, useEffect } from 'react'
import { message, Button, Space, Select, Form, Col, Popconfirm } from 'antd'
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
  EditableProTable,
  ProColumns
} from '@ant-design/pro-components'
import { createBusiness, getBusiness, updateBusiness } from '@/api/crm/business'
import { getCustomerSimpleList } from '@/api/crm/customer'
import { getSimpleUserList } from '@/api/system/user'
import { getBusinessStatusTypeSimpleList } from '@/api/crm/businessStatus'
import { getProductSimpleList } from '@/api/crm/product'
import { textConst } from '@/locales/zh-CN'

interface BusinessFormProps {
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
let statusOptionsCache: any[] | null = null
let productOptionsCache: any[] | null = null

const BusinessForm: React.FC<BusinessFormProps> = ({ visible, setVisible, onSuccess, id }) => {
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
      totalAmountDisplay: totalAmount.toFixed(2),
      discountAmountDisplay: discountAmount.toFixed(2)
    })
  }, [totalAmount, discountAmount, form])

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
      align: 'center',
      dataIndex: 'productId',
      formItemProps: { rules: [{ required: true, message: '请选择产品' }] },
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
      fieldProps: {
        min: 0,
        precision: 2,
        controls: true,
        style: { width: '100%' }
      },
      formItemProps: { rules: [{ required: true, message: '请输入售价' }], style: { margin: 0 } }
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 130,
      align: 'center',
      valueType: 'digit',
      fieldProps: {
        min: 0,
        precision: 2,
        controls: true,
        style: { width: '100%' }
      },
      formItemProps: { rules: [{ required: true, message: '请输入数量' }] }
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
          <EditOutlined /> 编辑
        </a>,
        <Popconfirm
          key="delete"
          title="温馨提示"
          description="确定要删除这条产品信息吗？"
          onConfirm={() => {
            setProducts(products.filter((item) => item.key !== record.key))
          }}
        >
          <a style={{ color: '#ff4d4f' }}>
            <DeleteOutlined /> 删除
          </a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.addNew}
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
      request={async () => {
        if (id !== undefined) {
          const resp = await getBusiness({ id })
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
            discount,
            totalAmount,
            discountAmount
          }
          if (isUpdate) {
            await updateBusiness({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createBusiness(submitData as any)
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
        label="商机名称"
        rules={[{ required: true, message: '请输入商机名称' }]}
        placeholder="请输入"
      />
      <ProFormSelect
        name="ownerUserId"
        label="负责人"
        rules={[{ required: true, message: '请选择负责人' }]}
        placeholder="请选择"
        showSearch
        request={async () => {
          if (userOptionsCache) return userOptionsCache
          const res = await getSimpleUserList()
          if (res.data) {
            userOptionsCache = res.data.map((item: any) => ({
              label: item.nickname,
              value: item.id
            }))
          }
          return userOptionsCache || []
        }}
      />
      <ProFormSelect
        name="customerId"
        label="客户名称"
        rules={[{ required: true, message: '请选择客户' }]}
        placeholder="请选择"
        showSearch
        request={async () => {
          if (customerOptionsCache) return customerOptionsCache
          const res = await getCustomerSimpleList()
          if (res.data) {
            customerOptionsCache = res.data.map((item: any) => ({
              label: item.name,
              value: item.id
            }))
          }
          return customerOptionsCache || []
        }}
      />
      <ProFormSelect
        name="statusId"
        label="商机状态组"
        rules={[{ required: true, message: '请选择状态组' }]}
        placeholder="请选择"
        request={async () => {
          if (statusOptionsCache) return statusOptionsCache
          const res = await getBusinessStatusTypeSimpleList()
          if (res.data) {
            statusOptionsCache = res.data.map((item: any) => ({ label: item.name, value: item.id }))
          }
          return statusOptionsCache || []
        }}
      />
      <ProFormDatePicker
        name="dealTime"
        label="预计成交日期"
        placeholder="请选择"
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormText name="remark" label="备注" placeholder="请输入备注" />

      <Col span={24} style={{ marginBottom: 16 }}>
        <EditableProTable<ProductItem>
          rowKey="key"
          headerTitle="产品清单"
          maxLength={50}
          bordered
          recordCreatorProps={{
            position: 'bottom',
            record: () => ({
              key: `new_${Date.now()}_${Math.random().toString(36).substring(7)}`,
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
          loading={false}
          toolBarRender={() => []}
          columns={productColumns}
          value={products}
          onChange={(value) => setProducts(value as ProductItem[])}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys
          }}
        />
      </Col>

      <ProFormText
        name="totalAmountDisplay"
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
        name="discountAmountDisplay"
        label="折扣后金额"
        colProps={{ span: 8 }}
        disabled
        fieldProps={{ prefix: '￥' }}
      />
    </ModalForm>
  )
}

export default BusinessForm

