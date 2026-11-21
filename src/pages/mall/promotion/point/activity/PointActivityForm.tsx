import React, { useState } from 'react'
import { Button, Form, InputNumber, message, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormTextArea
} from '@ant-design/pro-components'
import {
  createPointActivity,
  getPointActivity,
  updatePointActivity
} from '@/api/mall/promotion/point/activity'
import { getSpuDetail } from '@/api/mall/product/spu'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'
import { textConst } from '@/locales/zh-CN'

interface PointActivityFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

// SKU 规格文案
const skuName = (sku: any) =>
  (sku.properties || []).map((p: any) => p.valueName).join(' ') || '默认规格'

// 积分商城活动表单：选择一个商品后，逐 SKU 配置兑换积分、兑换金额、活动库存与可兑换数量
const PointActivityForm: React.FC<PointActivityFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  // 每个 SKU 一行兑换配置：price 以元录入，提交时换算为分
  const [productRows, setProductRows] = useState<any[]>([])

  // 选中商品后加载其 SKU 列表生成配置行；已有活动配置时按 skuId 回填
  const loadSkuRows = async (spuId: number, existingProducts: any[] = []) => {
    const resp = await getSpuDetail({ id: spuId } as any)
    const skus = ((resp.data as any)?.skus || []) as any[]
    const rows = skus.map((sku) => {
      const existing = existingProducts.find((p) => p.skuId === sku.id)
      return {
        skuId: sku.id,
        skuName: skuName(sku),
        skuPrice: sku.price,
        skuStock: sku.stock,
        point: existing?.point ?? 0,
        priceYuan: existing ? (existing.price || 0) / 100 : 0,
        stock: existing?.stock ?? 0,
        count: existing?.count ?? 0
      }
    })
    setProductRows(rows)
  }

  const updateRow = (skuId: number, field: string, value: number | null) => {
    setProductRows((rows) =>
      rows.map((row) => (row.skuId === skuId ? { ...row, [field]: value ?? 0 } : row))
    )
  }

  const columns: ColumnsType<any> = [
    {
      title: '规格',
      dataIndex: 'skuName',
      width: 140
    },
    {
      title: '原价',
      dataIndex: 'skuPrice',
      width: 90,
      align: 'center',
      render: (_, record) => `￥${((record.skuPrice || 0) / 100).toFixed(2)}`
    },
    {
      title: '商品库存',
      dataIndex: 'skuStock',
      width: 80,
      align: 'center'
    },
    {
      title: '兑换积分',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={0}
          value={record.point}
          onChange={(v) => updateRow(record.skuId, 'point', v)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '兑换金额(元)',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={2}
          value={record.priceYuan}
          onChange={(v) => updateRow(record.skuId, 'priceYuan', v)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '活动库存',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={0}
          value={record.stock}
          onChange={(v) => updateRow(record.skuId, 'stock', v)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '可兑换数量',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={0}
          value={record.count}
          onChange={(v) => updateRow(record.skuId, 'count', v)}
          style={{ width: '100%' }}
        />
      )
    }
  ]

  return (
    <ModalForm
      title={isUpdate ? '编辑积分商城活动' : '新增积分商城活动'}
      open={visible}
      colon={false}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
          setSelectedProduct(null)
          setProductRows([])
        }
      }}
      form={form}
      layout="horizontal"
      grid={true}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      width={980}
      request={async () => {
        if (id !== undefined) {
          const resp = await getPointActivity({ id })
          const data = resp.data as any
          if (data?.spuId) {
            setSelectedProduct({ id: data.spuId, name: data.spuName })
            await loadSkuRows(data.spuId, data.products || [])
          }
          return data || {}
        }
        return {}
      }}
      onFinish={async (values) => {
        if (!values.spuId) {
          message.warning('请选择活动商品')
          return false
        }
        if (productRows.length === 0) {
          message.warning('活动商品缺少 SKU 配置')
          return false
        }
        // 只提交配置了活动库存的 SKU 行
        const products = productRows
          .filter((row) => row.stock > 0)
          .map((row) => ({
            skuId: row.skuId,
            count: row.count,
            point: row.point,
            price: Math.round((row.priceYuan || 0) * 100),
            stock: row.stock
          }))
        if (products.length === 0) {
          message.warning('请至少为一个 SKU 配置活动库存')
          return false
        }
        try {
          const submitData = { ...values, products }
          if (isUpdate) {
            await updatePointActivity({ id, ...submitData } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createPointActivity(submitData as any)
            message.success(textConst.msg.createSuccess)
          }
          onSuccess()
          return true
        } catch {
          message.error(textConst.error.operationFail)
          return false
        }
      }}
    >
      <ProForm.Item
        name="spuId"
        label="活动商品"
        rules={[{ required: true, message: '请选择商品' }]}
        className="ant-col-12"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Button onClick={() => setProductModalVisible(true)}>选择商品</Button>
        {selectedProduct && <span style={{ marginLeft: 8 }}>已选：{selectedProduct.name}</span>}
        <ProductSelectModal
          visible={productModalVisible}
          setVisible={setProductModalVisible}
          multiple={false}
          onSelect={async (rows) => {
            setSelectedProduct(rows[0])
            form.setFieldValue('spuId', rows[0].id)
            await loadSkuRows(rows[0].id)
            message.success(`成功关联商品：${rows[0].name}`)
          }}
        />
      </ProForm.Item>
      <ProFormDigit
        name="sort"
        label="排序"
        rules={[{ required: true, message: '请输入排序' }]}
        placeholder="请输入排序"
        colProps={{ span: 12 }}
        fieldProps={{ precision: 0 }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        colProps={{ span: 24 }}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        fieldProps={{ rows: 2 }}
      />
      {/* SKU 兑换配置表：随所选商品动态生成 */}
      <div className="ant-col-24" style={{ padding: '0 12px' }}>
        <Table
          columns={columns}
          dataSource={productRows}
          rowKey="skuId"
          size="small"
          pagination={false}
          locale={{ emptyText: '请先选择活动商品' }}
        />
      </div>
    </ModalForm>
  )
}

export default PointActivityForm
