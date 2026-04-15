import React, { useState } from 'react'
import { message, Form, Button, Table, Image } from 'antd'
import {
  ModalForm,
  ProFormText,
  ProFormDateTimePicker,
  ProFormTextArea,
  ProForm
} from '@ant-design/pro-components'
import {
  createDiscountActivity,
  updateDiscountActivity,
  getDiscountActivity
} from '@/api/mall/promotion/discountActivity'
import ProductSelectModal from '@/pages/mall/promotion/coupon/list/ProductSelectModal'
import { textConst } from '@/locales/zh-CN'

interface DiscountActivityFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSuccess: () => void
  id?: number
}

const DiscountActivityForm: React.FC<DiscountActivityFormProps> = ({
  visible,
  setVisible,
  onSuccess,
  id
}) => {
  const isUpdate = id !== undefined
  const [form] = Form.useForm()
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  return (
    <ModalForm
      title={isUpdate ? textConst.action.update : textConst.action.create}
      open={visible}
      onOpenChange={(val) => {
        setVisible(val)
        if (!val) {
          form.resetFields()
          setSelectedProduct(null)
        }
      }}
      form={form}
      colon={false}
      layout="horizontal"
      grid={true}
      rowProps={{ gutter: 24 }}
      labelAlign="right"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      width={800}
      request={async () => {
        if (id !== undefined) {
          const resp = await getDiscountActivity({ id } as any)
          const data = resp.data as Record<string, any>
          if (data.spuInfo) {
            setSelectedProduct(data.spuInfo)
          }
          return data
        }
        return {}
      }}
      onFinish={async (values) => {
        try {
          if (isUpdate) {
            await updateDiscountActivity({ id, ...values } as any)
            message.success(textConst.msg.updateSuccess)
          } else {
            await createDiscountActivity(values as any)
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
        label="活动名称"
        rules={[{ required: true, message: '请输入活动名称' }]}
        placeholder="请输入活动名称"
        colProps={{ span: 12 }}
      />
      <ProForm.Item
        name="spuId"
        label="活动商品"
        rules={[{ required: true, message: '请选择商品' }]}
        className="ant-col-12"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Button type="default" onClick={() => setProductModalVisible(true)}>
          选择商品
        </Button>
        {selectedProduct && <span>已选: {selectedProduct.name}</span>}

        <ProductSelectModal
          visible={productModalVisible}
          setVisible={setProductModalVisible}
          multiple={false}
          onSelect={(rows) => {
            const product = rows[0]
            setSelectedProduct(product)
            form.setFieldValue('spuId', product.id)
            message.success(`成功关联商品: ${product.name}`)
          }}
        />
      </ProForm.Item>
      <ProFormDateTimePicker
        name="startTime"
        label="开始时间"
        rules={[{ required: true, message: '请选择活动开始时间' }]}
        placeholder="请选择活动开始时间"
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormDateTimePicker
        name="endTime"
        label="结束时间"
        rules={[{ required: true, message: '请选择活动结束时间' }]}
        placeholder="请选择活动结束时间"
        colProps={{ span: 12 }}
        fieldProps={{ style: { width: '100%' } }}
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
    </ModalForm>
  )
}

export default DiscountActivityForm
